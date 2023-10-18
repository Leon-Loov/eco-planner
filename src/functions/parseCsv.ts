export default function parseCsv(csv: ArrayBuffer): string[][] {
  // ISO-8859-1 is latin1, which is used for Swedish characters
  const decoder = new TextDecoder('ISO-8859-1')
  const decodedCsv = decoder.decode(csv)
  const rows = decodedCsv.split('\n')
  return rows.map(row => row.split(';'))
}