export async function getTableContent(tableId: string, language: string = 'sv', selection: Object[]) {
  const url = new URL(`https://api.scb.se/ov0104/v2beta/api/v2/tables/${tableId}/data`);
  url.searchParams.append('lang', language);
  // url.searchParams.append('outputFormat', 'json');

  const body = JSON.stringify(selection);

  let data: any;

  try {
    const response = await fetch(url, { method: 'POST', body: body });
    if (response.ok) {
      data = await response.json();
    } else if (response.status == 429) {
      // Wait 10 seconds and try again
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

getTableContent("TAB5974", "sv", [
  { variableCode: "ContentsCode", valueCodes: ["000005NO"] },
  { variableCode: "Tid", valueCodes: ["2024"] }
]).then(data => console.log(data));