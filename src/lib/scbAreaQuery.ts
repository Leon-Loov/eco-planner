'use server';

import { unstable_cache } from "next/cache";

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
    const url = `https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/MI0802/Areal2012NN`;

    // Get the latest time period, or default to 2023 (latest available as of 2024-02-01)
    const time = await fetch(url).then((res) => { if (!res.ok) throw new Error; return res.json() }).then((data) => (data.variables[3].values as string[]).reverse()[0]).catch(() => { return null; }) ?? "2023";

    // See https://www.scb.se/contentassets/79c32c72783a4f67b202ad3189f921b9/api_beskrivning.pdf for more info (in Swedish) on the query format
    // At https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/ you can find a UI for building basic queries in Swedish
    // Also available in English at https://www.statistikdatabasen.scb.se/pxweb/en/ssd/
    const query = {
      "query": [
        {
          "code": "Region",
          "selection": {
            "filter": "item",
            "values": [
              areaCode,
              ...(parentAreaCode ? [parentAreaCode] : [])
            ]
          }
        },
        {
          // Land area; total area including water is "04"
          "code": "ArealTyp",
          "selection": {
            "filter": "item",
            "values": [
              "01"
            ]
          }
        },
        {
          // Square kilometers (as opposed to hectares, "000001O4")
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": [
              "000001O3"
            ]
          }
        },
        {
          "code": "Tid",
          "selection": {
            "filter": "item",
            "values": [
              time
            ]
          }
        }
      ],
      "response": {
        "format": "json"
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(query)
    }).catch((error) => {
      console.log(error);
      return;
    });

    // If the query fails, return null
    if (!response || !response.ok) return null;

    const data: {
      columns: { code: string, text: string, type?: string, comment?: string }[],
      comments?: { variable: string, value: string, comment?: string }[],
      data: { key: string[], values: string[], comment?: string }[],
      metadata: { infofile: string, updated: string, label: string, source: string, comment?: string }[],
    } = await response.json();

    const areaData = data.data;
    const area = areaData.find((data) => data.key[0] == areaCode)?.values[0];
    const parentArea = parentAreaCode && areaData.find((data) => data.key[0] == parentAreaCode)?.values[0];

    return {
      area,
      parentArea
    };
  },
  ['scbAreaQuery'],
);