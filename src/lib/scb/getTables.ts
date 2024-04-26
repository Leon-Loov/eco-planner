import { PxWebApiV2TableArray } from "@/lib/scb/PxWebApiV2Types";

/**
 * Returns a list of tables from SCB's API. Returns null on error.
 * @param tags 
 * @param language Two-letter language code. Default is 'sv'. Currently (2024-04-26) the API will respond with 'en' regardless of the language parameter, but according to the documentation it should work in the future.
 * @param pageSize Initial page size. If the number of tables is larger than this, the function will call itself with the correct page size.
 */
export async function getTables(tags?: string, language: string = 'sv', pageSize: number = 9999) {
  const url = new URL(`https://api.scb.se/ov0104/v2beta/api/v2/tables`);
  if (tags) url.searchParams.append('query', tags);
  if (language) url.searchParams.append('language', language);
  if (pageSize) url.searchParams.append('pageSize', pageSize.toString());

  let data: PxWebApiV2TableArray;

  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.ok) {
      data = await response.json();
      // If we didn't get all tables, try again with the correct page size
      if (data?.page?.totalElements > data?.page?.pageSize) {
        return await getTables(tags, language, data.page.totalElements);
      }
    } else if (response.status == 429) {
      // Wait 10 seconds and try again
      await new Promise(resolve => setTimeout(resolve, 10000));
      return await getTables(tags, language, pageSize);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  const result: { id: string, label: string }[] = [];
  for (const table of data.tables) {
    result.push({ id: table.id, label: table.label });
  }

  return result;
}