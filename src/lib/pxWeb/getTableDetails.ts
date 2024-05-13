import { PxWebApiV2TableDetails } from "./pxWebApiV2Types";

export async function getTableDetails(tableId: string, language: string = 'sv') {
  const url = new URL(`https://api.scb.se/ov0104/v2beta/api/v2/tables/${tableId}/metadata`);
  url.searchParams.append('lang', language);

  let data: PxWebApiV2TableDetails;

  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.ok) {
      data = await response.json();
    } else if (response.status == 429) {
      // Wait 10 seconds and try again
      await new Promise(resolve => setTimeout(resolve, 10000));
      return await getTableDetails(tableId, language);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return data;
}

getTableDetails("TAB5974").then(data => console.log(data));