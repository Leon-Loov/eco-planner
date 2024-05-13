import filterTableContentKeys from "./filterTableContentKeys.ts";

export async function getTableContent(tableId: string, language: string = 'sv', selection: Object[]) {
  const url = new URL(`https://api.scb.se/ov0104/v2beta/api/v2/tables/${tableId}/data`);
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
      return await getTableContent(tableId, language, selection);
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

getTableContent("TAB1267", "sv", [
  { variableCode: "ContentsCode", valueCodes: ["BE0101A9"] },
  { variableCode: "Tid", valueCodes: ["FROM(2020)"] },
  { variableCode: "Kon", valueCodes: ["1"] },
]).then(data => filterTableContentKeys(data)).then(data => console.log(data?.data));