import { PxWebApiV2TableContent } from "./pxWebApiV2Types";

/**
 * Try to "flatten" the responseJson by filtering out all keys that have the same value for all entries.
 * If the `data` array has only 1 entry, the function will return null since it is not possible to filter out any keys.
 * If any entry in the `data` array doesn't have exactly one value and one key the function will return null.
 */
export default function filterTableContentKeys(responseJson: PxWebApiV2TableContent) {
  // Early return if any data entry does not have exactly one value
  for (const { key, values } of responseJson.data) {
    if (values.length != 1) {
      return null;
    }
  }

  // Early return if there is only one data entry
  if (responseJson.data.length <= 1) {
    return null;
  }

  // Extract all unique values for each key
  const valueAlternatives: string[][] = responseJson.data.reduce((alternatives, { key, values }) => {
    key.forEach((alternative, index) => {
      if (!alternatives[index]) {
        alternatives[index] = [];
      }
      if (!alternatives[index].includes(alternative)) {
        alternatives[index].push(alternative);
      }
    });
    return alternatives;
  }, [] as string[][]);

  const identicalValues = valueAlternatives.map((alternatives, index) => alternatives.length == 1 ? alternatives[index] : null);

  // Filter out all keys that have the same value for all entries
  responseJson.data.forEach((obj, index) => {
    obj.key = obj.key.filter((value, index) => !identicalValues[index]?.includes(value));
  });

  // Return null if any key does not have exactly one value after filtering
  for (const { key, values } of responseJson.data) {
    if (key.length != 1) {
      return null;
    }
  }

  return responseJson;
}