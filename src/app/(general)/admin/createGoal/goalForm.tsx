'use client'

function handleSubmit(event: any) {
  return
}

export default function CreateGoal() {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="goalName">Namn på målbanan: </label>
        <input type="text" name="goalName" required={true} />
        <br />
        <label htmlFor="goalObject">Den som &quot;äger&quot; målet (t.ex en region eller organisation): </label>
        <input type="text" name="goalObject" required={true} />
        <br />
        <label htmlFor="nationalRoadmapId">Nationell målbana denna är baserad på (om någon): </label>
        {/* TODO: Make this a dropdown with options from the database and proper IDs as values */}
        <input type="select" name="nationalRoadmapId" required={false}>
          <option value="0">Ingen nationell målbana</option>
          <option value="1">Nationell målbana 1</option>
          <option value="2">Nationell målbana 2</option>
          <option value="3">Nationell målbana 3</option>
        </input>
        <br />
        <label htmlFor="indicatorParameter">Enhet för dataserie: </label>
        <input type="text" name="indicatorParameter" required={true} />
        <br />
      </form>
    </>
  )
}