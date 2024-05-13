/**
 * Key-value pairs of external dataset base URLs
 * The base URL points to the base of the API, without a trailing slash, e.g. "https://api.scb.se/ov0104/v2beta/api/v2".
 * The key is the name of the dataset, e.g. "SCB".
 * To fetch any data, an additional path must be appended to the end, for example "/navigation", "/tables" or "/tables/{tableId}/data".
 */
export const externalDatasetBaseUrls = {
  "SCB": "https://api.scb.se/ov0104/v2beta/api/v2",
  // Add more datasets as they implement the PxWeb API v2
  // "SSB": "some url",
  // "stat.fi": "some url",
  // ...
}

export function parsePeriod(period: string) {
  period = period.trim().toUpperCase();
  // If period is a quarter (kvartal)
  if (period.includes("Q") || period.includes("K")) {
    // Return a date based on year and first month of the quarter
    return new Date(Date.UTC(parseInt(period.split(/[QK]/)[0]), (parseInt(period.split(/[QK]/)[1]) - 1) * 3));
  }
  // If period is a month (månad)
  else if (period.includes("M")) {
    // Return a date based on year and month
    return new Date(Date.UTC(parseInt(period.split("M")[0]), parseInt(period.split("M")[1]) - 1));
  }
  // If period is a week (vecka)
  else if (period.includes("W") || period.includes("V")) {
    // Return a date based on year and first day of ISO week
    // Why can't JS natively parse all ISO 8601 strings ;^;
    const year = parseInt(period.split(/[WV]/)[0]);
    const week = parseInt(period.split(/[WV]/)[1]);
    const date = new Date(Date.UTC(year, 0, 1));
    // The first week of the year always contains the 4th of January
    // This allows us to calculate an offset between the first day of the year and the first day of the first week
    const dayOffset = new Date(Date.UTC(year, 0, 4)).getDay() + 3;
    // If Jan 1 is a Sunday, we'll see this returning 1 + 7 - 10 = -2 for week 1, meaning that the first week starts Dec 29 previous year
    // If Jan 1 is a Monday, we'll see this returning 1 + 7 - 4 = 4 for week 1, meaning that the first week starts Jan 4
    date.setDate(1 + (week) * 7 - dayOffset);
    return date;
  }
  // If none of the above match, assume it's a year and try to parse it as such (might return an invalid date)
  else {
    return new Date(Date.UTC(parseInt(period), 0));
  }
}