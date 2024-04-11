import { GoalInput } from "@/types"
import dataSeriesDataFieldNames from "@/lib/dataSeriesDataFieldNames.json" with { type: "json" }

export default function parseCsv(csv: ArrayBuffer): string[][] {
  // Windows-1252 (sometimes called ANSI) is the default encoding for CSV files exported from Excel. It's a superset of ISO-8859-1 (Latin-1).
  const decoder = new TextDecoder('windows-1252')
  const decodedCsv = decoder.decode(csv)
  const rows = decodedCsv.split('\n')
  return rows.map(row => row.split(';'))
}

/**
 * Requires headers to be on the first or third row and throws if any of the required headers are missing
 * @param csv A 2D array of strings
 */
export function csvToGoalList(csv: string[][]) {
  // Remove first two rows if the second row is empty (as it should be, with first row containing metadata and third row containing headers)
  if (!csv[1][0]) {
    csv = csv.slice(2)
  }

  /** Header row from the CSV */
  const headers = csv[0]

  /** Format: `ourHeaderName: csvHeaderName` */
  const nonNumericHeaders = {
    "indicatorParameter": "Branch Path",
    "dataUnit": "Units",
    "dataScale": "Scale",
  }
  const numericHeaders = []
  for (const year of dataSeriesDataFieldNames) {
    numericHeaders.push(year.replace("val", ""))
  }

  const headerIndex: { [key: string]: number } = {}
  const output: GoalInput[] = [];

  // Check that all headers are present and get their indices
  for (const i of Object.keys(nonNumericHeaders)) {
    if (!headers.includes(nonNumericHeaders[i as keyof typeof nonNumericHeaders])) {
      throw new Error(`Missing header "${nonNumericHeaders[i as keyof typeof nonNumericHeaders]}"`)
    } else {
      headerIndex[i] = headers.indexOf(nonNumericHeaders[i as keyof typeof nonNumericHeaders])
    }
  }

  for (const i of numericHeaders) {
    if (!headers.includes(i)) {
      throw new Error(`Missing header "${i}"`)
    } else {
      headerIndex[i] = headers.indexOf(i)
    }
  }

  // Create GoalInput objects from the data
  for (let i = 1; i < csv.length; i++) {
    // Skip rows without an indicatorParameter
    if (!csv[i][headerIndex.indicatorParameter]) {
      continue
    }

    const dataSeries: string[] = []
    for (const j of numericHeaders) {
      dataSeries.push(csv[i][headerIndex[j]]?.replaceAll(",", "."))
    }

    output.push({
      indicatorParameter: csv[i][headerIndex.indicatorParameter],
      dataUnit: csv[i][headerIndex.dataUnit],
      dataScale: csv[i][headerIndex.dataScale] || undefined,
      dataSeries,
    })
  }

  return output
}