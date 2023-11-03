import RadioImage from "./radioImage";

export default function TableSelector() {
  return (
    <>
      <RadioImage value='listTree' src='/icons/listTree.svg' name='table' />
      <RadioImage value='table' src='/icons/table.svg' name='table'/>
      <RadioImage value='columns' src='/icons/columns.svg' name='table' />
    </>
  )
}