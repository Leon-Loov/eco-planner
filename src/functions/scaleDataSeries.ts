'use server';

import { Data, getSessionData } from "@/lib/session";
import prisma from "@/prismaClient";
import { DataSeriesDataFields, dataSeriesDataFieldNames } from "@/types";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

/**
 * Multiplies the given data series by the scaleFactor.
 * @returns Promise resolving to empty string if successful, or an error message if not
 */
export default async function scaleDataSeries(
  dataSeriesId: string,
  scaleFactor: number,
): Promise<string> {
  const session = await getSessionData(cookies())
  if (!session.user) return "Not logged in";

  // Create an object with the yearly dataSeries fields as keys, and each value is an object with a multiply key and the scaleFactor as the value
  const multiplierObject: { [key in keyof DataSeriesDataFields]: { multiply: number } } = Object.assign({}, ...dataSeriesDataFieldNames.map((key: keyof DataSeriesDataFields) => ({ [key]: { multiply: scaleFactor } })));

  if (session.user?.isAdmin) {
    try {
      await prisma.dataSeries.update({
        where: { id: dataSeriesId },
        data: multiplierObject,
      });
      revalidateTag('dataSeries');
      return "";
    } catch (error: any) {
      return error.message || "Error scaling data series (Admin)";
    }
  } else {
    try {
      await prisma.dataSeries.update({
        where: {
          id: dataSeriesId,
          goal: {
            roadmap: {
              OR: [
                { authorId: session.user.id },
                { editors: { some: { id: session.user.id } } },
                { editGroups: { some: { users: { some: { id: session.user.id } } } } },
              ]
            }
          }
        },
        data: multiplierObject,
      });
      revalidateTag('dataSeries');
      return "";
    } catch (error: any) {
      return error.message || "Error scaling data series";
    }
  }
}