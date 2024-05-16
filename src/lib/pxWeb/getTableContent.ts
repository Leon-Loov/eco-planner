// Use server in order to circumvent CORS issues
'use server';

import { PxWebApiV2TableContent } from "./pxWebApiV2Types.ts";
import { externalDatasetBaseUrls } from "./utility.ts";

export async function getTableContent(tableId: string, selection: Object[], externalDataset: string, language: string = 'sv',) {
  // Get the base URL for the external dataset, defaulting to SCB
  const baseUrl = externalDatasetBaseUrls[externalDataset as keyof typeof externalDatasetBaseUrls] ?? externalDatasetBaseUrls.SCB;
  const url = new URL(`${baseUrl}/tables/${tableId}/data`);
  url.searchParams.append('lang', language);
  url.searchParams.append('outputformat', 'json');

  const body = JSON.stringify({ selection: selection, });

  let data: PxWebApiV2TableContent | null = null;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: body,
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      data = await response.json();
    } else if (response.status == 429) {
      // If hit with "429: Too many requests", wait 10 seconds and try again
      await new Promise(resolve => setTimeout(resolve, 10000));
      return await getTableContent(tableId, selection, externalDataset, language);
    } else {
      console.log("bad response", response)
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return data;
}

// getTableContent("TAB2946", [
//   { variableCode: "Region", valueCodes: ["00"] },
//   { variableCode: "ArealTyp", valueCodes: ["01"] },
//   { variableCode: "ContentsCode", valueCodes: ["000001O3"] },
//   { variableCode: "Tid", valueCodes: ["BOTTOM(1)"] }
// ], "SCB", "sv").then(data => console.log(data?.data));