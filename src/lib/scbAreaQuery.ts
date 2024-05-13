'use server';

import { unstable_cache } from "next/cache";
import { getTableContent } from "./pxWeb/getTableContent";

/**
 * Queries SCB for area data.
 * @param areaCode The area code of the target area as defined by SCB.
 * @param parentAreaCode The area code of the parent area as defined by SCB. Doesn't have to contain the target area.
 * @returns Object containing the area of the target area and the parent area. Returns null if the query fails.
 */
export default async function scbAreaQuery(areaCode: string, parentAreaCode?: string) {
  return getCachedQuery(areaCode, parentAreaCode);
}

const getCachedQuery = unstable_cache(
  async (areaCode: string, parentAreaCode?: string) => {
    const selection = [
      // Include parent area only if it exists
      { variableCode: "Region", valueCodes: [areaCode, ...(parentAreaCode ? [parentAreaCode] : [])] },
      { variableCode: "ArealTyp", valueCodes: ["01"] },
      { variableCode: "ContentsCode", valueCodes: ["000001O3"] },
      // Use the latest time period
      { variableCode: "Tid", valueCodes: ["TOP(1)"] }
    ];

    const result = await getTableContent("TAB2946", selection, "SCB", "sv")

    if (!result) return null;

    const areaData = result.data;
    const area = areaData.find((data) => data.key[0] == areaCode)?.values[0];
    const parentArea = parentAreaCode && areaData.find((data) => data.key[0] == parentAreaCode)?.values[0];

    return {
      area,
      parentArea
    };
  },
  ['scbAreaQuery'],
);