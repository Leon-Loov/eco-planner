import { PxWebApiV2TableDetails, PxWebApiV2TimeVariable } from "@/lib/scb/PxWebApiV2Types";

export async function getTableDetails(tableId: string, language: string = 'sv') {
  const url = new URL(`https://api.scb.se/ov0104/v2beta/api/v2/tables/${tableId}/metadata`);
  url.searchParams.append('language', language);

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

export function extractVariableOptions(tableData: PxWebApiV2TableDetails) {
  const result: { times: { code: string, label: string }[], [variableName: string]: { code: string, label: string }[] } = { times: [] };

  const timeVariable = tableData.variables.find(variable => variable.type === "TimeVariable") as PxWebApiV2TimeVariable;
  if (!timeVariable) {
    throw new Error("No time variable found in table data");
  }

  result["times"] = timeVariable.values;

  tableData.variables.filter(variable => variable.type != "TimeVariable").forEach(variable => {
    result[variable.label] = variable.values;
  });

  return result;
}