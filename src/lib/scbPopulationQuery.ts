'use server';

import { unstable_cache } from "next/cache";

/**
 * Queries SCB for population data.
 * @param areaCode The area code of the target area as defined by SCB.
 * @param parentAreaCode The area code of the parent area as defined by SCB. Doesn't have to contain the target area.
 * @returns Object containing the population of the target area and the parent area. Returns null if the query fails.
 */
export default async function scbPopulationQuery(areaCode: string, parentAreaCode?: string) {
  return getCachedQuery(areaCode, parentAreaCode);
}

const getCachedQuery = unstable_cache(
  async (areaCode: string, parentAreaCode?: string) => {
    const url = `https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkManad`;

    // Get the latest time period, or default to 2023M11 (latest available as of 2024-02-01)
    const time = await fetch(url).then((res) => { if (!res.ok) throw new Error; return res.json() }).then((data) => (data.variables[4].values as string[]).reverse()[0]).catch(() => { return null; }) ?? "2023M11";

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

    const populationData = data.data;
    const population = populationData.find((data) => data.key[0] == areaCode)?.values[0];
    const parentPopulation = parentAreaCode && populationData.find((data) => data.key[0] == parentAreaCode)?.values[0];

    return {
      population,
      parentPopulation
    };
  },
  ["scbPopulationQuery"],
);