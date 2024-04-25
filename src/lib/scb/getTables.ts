export type PxWebApiV2TableArray = {
  language: string; // Two-letter language code
  tables: [
    {
      type: "Table";
      id: string;
      label: string;
      description: string;
      updated: string; // ISO 8601 date string (YYYY-MM-DD)
      firstPeriod: string; // Year as string
      lastPeriod: string; // Year as string
      category: string;
      variableNames: string[];
      links: [
        {
          rel: string;
          hreflang: string;
          href: string;
        }
      ];
    }
  ];
  page: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    links: [
      {
        rel: string;
        hreflang: string;
        href: string;
      }
    ];
  };
  links: [
    {
      rel: string;
      hreflang: string;
      href: string;
    }
  ];
}

export async function getTables(tags?: string, language: string = 'sv') {
  const url = new URL(`https://api.scb.se/ov0104/v2beta/api/v2/tables/?pagesize=9999`);
  if (tags) url.searchParams.append('query', tags);
  if (language) url.searchParams.append('language', language);

  let data: PxWebApiV2TableArray;

  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.ok) {
      data = await response.json();
    } else if (response.status == 429) {
      // TODO: Wait 10 seconds and try again
      return []
    } else {
      return []
    }
  } catch (error) {
    console.log(error);
    return []
  }

  const result: { id: string, label: string }[] = [];
  for (const table of data.tables) {
    result.push({ id: table.id, label: table.label });
  }

  return result;
}