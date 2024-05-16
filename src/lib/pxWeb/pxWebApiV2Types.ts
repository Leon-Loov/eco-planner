// This file contains a number of types outlining the structure of the PxWeb API v2 responses.
// Based on actual responses from SCB's implementation of PxWeb API v2 at https://api.scb.se/ov0104/v2beta/api/v2/navigation,
// and the documentation at https://github.com/PxTools/PxApiSpecs/blob/master/specs.md and https://github.com/PxTools/PxApiSpecs/blob/master/PxAPI-2.yml.

export type PxWebApiV2Note = {
  mandatory?: boolean;
  text: string;
  conditions?: [{ variable: string; value: string; }];
};

export type PxWebApiV2Link = {
  rel: string;
  hreflang: string;
  href: string;
};

export type PxWebApiV2VariableBase = {
  id: string;
  label: string;
  notes?: PxWebApiV2Note[];
  links?: PxWebApiV2Link[];
};

export type PxWebApiV2TimeVariable = PxWebApiV2VariableBase & {
  type: "TimeVariable";
  elimination: undefined;
  timeUnit?: "Annual" | "HalfYear" | "Quarterly" | "Monthly" | "Weekly" | "Other";
  /** Possible format examples: 2024 | 2024K2 | 2024M5 | 2025W18 (And possibly another for HalfYear?) */
  firstPeriod?: string;
  /** Possible format examples: 2024 | 2024K2 | 2024M5 | 2025W18 (And possibly another for HalfYear?) */
  lastPeriod?: string;
  values: [
    {
      code: string;
      label: string;
      notes?: PxWebApiV2Note[];
      links?: PxWebApiV2Link[];
    }
  ];
};

export type PxWebApiV2ContentsVariable = PxWebApiV2VariableBase & {
  type: "ContentsVariable";
  elimination: undefined;
  values: [
    {
      code: string;
      label: string;
      unit: string;
      baseperiod?: string | null;
      adjustment?: "None" | "SesOnly" | "WorkOnly" | "WorkAndSes";
      measuringType?: "Stock" | "Flow" | "Average" | "Other";
      referencePeriod?: string;
      preferedNumberOfDecimals: number;
      priceType?: "Undefined" | "Current" | "Fixed";
      notes?: PxWebApiV2Note[];
      links?: PxWebApiV2Link[];
    }
  ];
};

export type PxWebApiV2RegularVariable = PxWebApiV2VariableBase & {
  type: "RegularVariable";
  elimination?: boolean;
  eliminationValueCode?: string;
  values: [
    {
      code: string;
      label: string;
      notes?: PxWebApiV2Note[];
      links?: PxWebApiV2Link[];
    }
  ];
  codeLists?: [
    {
      id: string;
      label: string;
      type: "Aggregation" | "Valueset";
      links: PxWebApiV2Link[];
    }
  ];
};

export type PxWebApiV2GeographicalVariable = PxWebApiV2VariableBase & {
  type: "GeographicalVariable";
  elimination?: boolean;
  eliminationValueCode?: string;
  map?: string;
  values: [
    {
      code: string;
      label: string;
      notes?: PxWebApiV2Note[];
      links?: PxWebApiV2Link[];
    }
  ];
  codeLists?: [
    {
      id: string;
      label: string;
      type: "Aggregation" | "Valueset";
      links: PxWebApiV2Link[];
    }
  ];
};

export type PxWebApiV2TableContent = {
  columns: {
    code: string;
    text: string;
    type: "c" | "t" | "d";
  }[];
  comments: any[];
  data: {
    key: string[];
    values: string[];
  }[];
  metadata: {
    infofile: string;
    updated: string; // ISO 8601 date string
    label: string;
    source: string;
  }[];
};

export type PxWebApiV2TableDetails = {
  language: string; // Language code (ISO 639)
  id: string;
  label: string;
  description?: string;
  aggregationAllowed?: boolean;
  officialStatistics?: boolean;
  subjectCode?: string;
  subjectLabel?: string;
  source?: string;
  license?: string;
  tags?: string[];
  updated?: string | null; // ISO 8601 date string
  discontinued?: boolean | null;
  variables: (PxWebApiV2RegularVariable | PxWebApiV2ContentsVariable | PxWebApiV2GeographicalVariable | PxWebApiV2TimeVariable)[];
  contacts?: [
    {
      name: string;
      phone: string;
      mail: string;
      raw: string;
    }
  ];
  links: PxWebApiV2Link[];
  notes?: PxWebApiV2Note[];
};

export type PxWebApiV2TableArray = {
  language: string; // Two-letter language code
  tables: [
    {
      type: "Table";
      id: string;
      label: string;
      description?: string | null;
      sortCode?: string;
      tags?: string[];
      updated: string | null; // ISO 8601 date string
      // Year as string, possibly followed by month or quarter; e.g. "2024", "2024M01", "2024K1" respectively
      firstPeriod: string | null;
      // Year as string, possibly followed by month or quarter; e.g. "2024", "2024M01", "2024K1" respectively
      lastPeriod: string | null;
      category?: "internal" | "public" | "private" | "section";
      variableNames: string[];
      discontinued?: boolean | null;
      links: PxWebApiV2Link[] | null;
    }
  ];
  page: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    links?: PxWebApiV2Link[];
  };
  links?: PxWebApiV2Link[];
};