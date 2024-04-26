// This file contains a number of types outlining the structure of the PxWeb API v2 responses.
// Based on actual responses from SCB's implementation of PxWeb API v2 at https://api.scb.se/ov0104/v2beta/api/v2/navigation, and the documentation at https://github.com/PxTools/PxApiSpecs/blob/master/specs.md

export type PxWebApiV2Note = {
  mandatory: boolean;
  text: string;
  conditions?: [{ variableCode: string; valueCode: string; }];
};

export type PxWebApiV2Link = {
  rel: string;
  hreflang: string;
  href: string;
};

export type PxWebApiV2TimeVariable = {
  id: string;
  label: string;
  type: "TimeVariable";
  timeUnit: string;
  firstPeriod: string;
  lastPeriod: string;
  values: [
    {
      code: string;
      label: string;
      notes?: PxWebApiV2Note[];
    }
  ];
  notes?: PxWebApiV2Note[];
};

export type PxWebApiV2ContentsVariable = {
  id: string;
  label: string;
  type: "ContentsVariable";
  values: [
    {
      code: string;
      label: string;
      // Documentation specifies `measuringAttribute: string`, but the current (2024-04-26) response has `measuringType: string`
      measuringType: string;
      unit: string;
      referencePeriod?: string;
      PreferedNumberOfDecimals: number;
      notes?: PxWebApiV2Note[];
      // Additional attributes are present in some responses, but not clearly documented
      [key: string]: unknown;
    }
  ];
  notes?: PxWebApiV2Note[];
};

export type PxWebApiV2RegularVariable = {
  id: string;
  label: string;
  type: "RegularVariable";
  elimination?: boolean;
  eliminationValueCode?: string;
  values: [
    {
      code: string;
      label: string;
      notes?: PxWebApiV2Note[];
    }
  ];
  codeLists?: [
    {
      id: string;
      label: string;
      type: string;
      links: PxWebApiV2Link[];
    }
  ];
  notes?: PxWebApiV2Note[];
};

export type PxWebApiV2GeographicalVariable = {
  id: string;
  label: string;
  type: "GeographicalVariable";
  elimination?: boolean;
  eliminationValueCode?: string;
  values: [
    {
      code: string;
      label: string;
      notes?: PxWebApiV2Note[];
    }
  ];
  codeLists?: [
    {
      id: string;
      label: string;
      type: string;
      links: PxWebApiV2Link[];
    }
  ];
  notes?: PxWebApiV2Note[];
};

export type PxWebApiV2TableDetails = {
  language: string; // Two-letter language code
  id: string;
  label: string;
  description?: string;
  aggregationAllowed: boolean;
  officialStatistics: boolean;
  subjectCode: string;
  subjectLabel: string;
  source: string;
  license: string;
  tags: string[];
  updated: string; // ISO 8601 date string
  discontinued?: boolean;
  variables: (PxWebApiV2RegularVariable | PxWebApiV2ContentsVariable | PxWebApiV2GeographicalVariable | PxWebApiV2TimeVariable)[];
  contacts: [
    {
      name: string;
      phone: string;
      mail: string;
      // `raw` is not documented, but present in the response
      raw?: string;
    }
  ];
  links: PxWebApiV2Link[];
  notes?: PxWebApiV2Note[];
};

export type PxWebApiV2TableArray = {
  language: string; // Two-letter language code
  tables: [
    {
      // Documentation specifies `objectType: "table"`, but the current (2024-04-26) response has `type: "Table"`
      type: "Table";
      id: string;
      label: string;
      description: string;
      // Tags are mentioned in documentation but not present in the current (2024-04-26) response
      tags?: string[];
      // ISO 8601 date string
      updated: string;
      // Year as string, possibly followed by month or quarter; e.g. "2024", "2024M01", "2024K1" respectively
      firstPeriod: string;
      // Year as string, possibly followed by month or quarter; e.g. "2024", "2024M01", "2024K1" respectively
      lastPeriod: string;
      category: string;
      // Nothing has been marked as discontinued or included `discontinued: false` yet (2024-04-26)
      discontinued?: boolean;
      variableNames: string[];
      links: PxWebApiV2Link[];
    }
  ];
  page: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    links: PxWebApiV2Link[];
  };
  links: PxWebApiV2Link[];
};