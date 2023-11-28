export default function Search({ searchList }: { searchList: Array<string> }) {
  return (
    <>
      <label>
        Sök Bland ...
        <input type="search" />
      </label>
    </>
  )
}