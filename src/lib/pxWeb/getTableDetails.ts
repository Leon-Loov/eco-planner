import { PxWebApiV2TableDetails } from "./pxWebApiV2Types";
import { externalDatasetBaseUrls } from "./utility";

export async function getTableDetails(tableId: string, externalDataset: string, language: string = 'sv') {
  const baseUrl = externalDatasetBaseUrls[externalDataset as keyof typeof externalDatasetBaseUrls] ?? externalDatasetBaseUrls.SCB;
  const url = new URL(`${baseUrl}/tables/${tableId}/metadata`);
  url.searchParams.append('lang', language);

  let data: PxWebApiV2TableDetails;

  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.ok) {
      data = await response.json();
    } else if (response.status == 429) {
      // Wait 10 seconds and try again
      await new Promise(resolve => setTimeout(resolve, 10000));
      return await getTableDetails(tableId, externalDataset, language);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return data;
}

// getTableDetails("TAB5974", "SCB").then(data => console.log(data));