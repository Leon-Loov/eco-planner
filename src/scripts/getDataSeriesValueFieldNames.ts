import fs from 'fs';
import prisma from '../prismaClient.ts';
import { DataSeries } from '@prisma/client';
import { DataSeriesDataFields } from '@/types.ts';

/**
 * This script generates a json file containing the names of the numeric data fields of data series.
 * The resulting file is used to allow the data series object in the database to change without having
 * to update the code, for example if we want to cover a longer time period.
 */
async function getDataSeriesValueFieldNames() {
  // Get a data series. From it we can extract the names of the numeric data fields.
  let exampleSeries = await prisma.dataSeries.findFirst().catch((e) => null)

  // If there are no data series, for example because the database is empty, don't do anything.
  if (!exampleSeries) {
    console.log("No data series found; data series value field names not touched.")
    return
  }

  // If there are data series, extract the names of the numeric data fields.
  /** A regex that matches the names of the numeric data fields of data series. Works until the year 9999, which seems future-proof enough. */
  const valueFieldRegex = /^val\d{4}$/;
  let dataFields: (keyof DataSeriesDataFields)[] = (Object.keys(exampleSeries) as (keyof DataSeries)[]).filter(
    key => valueFieldRegex.test(key)
  ) as (keyof DataSeriesDataFields)[];

  // Write to file
  fs.writeFile('src/lib/dataSeriesDataFieldNames.json', JSON.stringify(dataFields), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

getDataSeriesValueFieldNames();