import filterTableContentKeys from "./filterTableContentKeys.ts";
import { externalDatasetBaseUrls } from "./utility.ts";

export async function getTableContent(tableId: string, selection: Object[], externalDataset: string, language: string = 'sv',) {
  // Get the base URL for the external dataset, defaulting to SCB
  const baseUrl = externalDatasetBaseUrls[externalDataset as keyof typeof externalDatasetBaseUrls] ?? externalDatasetBaseUrls.SCB;
  const url = new URL(`${baseUrl}/tables/${tableId}/data`);
  url.searchParams.append('lang', language);
  url.searchParams.append('outputformat', 'json');

  const body = JSON.stringify({ selection: selection, });

  let data: any;

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

// getTableContent("TAB1267", [
//   { variableCode: "ContentsCode", valueCodes: ["BE0101A9"] },
//   { variableCode: "Tid", valueCodes: ["FROM(2020)"] },
//   { variableCode: "Kon", valueCodes: ["1"] },
// ], "SCB", "sv").then(data => filterTableContentKeys(data)).then(data => console.log(data?.data));