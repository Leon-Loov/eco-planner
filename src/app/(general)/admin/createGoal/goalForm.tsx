'use client'

function handleSubmit(event: any) {
  event.preventDefault()

  const form = event.target
  const formJSON = JSON.stringify({
    goalName: form.goalName.value,
    goalObject: form.goalObject.value,
    nationalRoadmapId: form.nationalRoadmapId.value,
    indicatorParameter: form.indicatorParameter.value,
    dataSeries: form.dataSeries.value,
    dataSeriesId: form.dataSeriesId.value,
  })

  fetch('/api/createGoal', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      window.location.href = '/admin'
    } else {
      alert('Målbana kunde inte skapas.')
    }
  }).catch((err) => {
    alert('Målbana kunde inte skapas.')
  })
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
        <select name="nationalRoadmapId" required={false}>
          <option value="0">Ingen nationell målbana</option>
          <option value="1">Nationell målbana 1</option>
          <option value="2">Nationell målbana 2</option>
          <option value="3">Nationell målbana 3</option>
        </select>
        <br />
        <label htmlFor="indicatorParameter">Enhet för dataserie: </label>
        <input type="text" name="indicatorParameter" required={true} />
        <br />
        <label htmlFor="dataSeries">Dataserie: </label>
        {/* TODO: Make this allow .csv files, and do parsing stuff and forced format if text */}
        <input type="text" name="dataSeries" required={false} />
        <br />
        <label htmlFor="dataSeriesId">Alternativt, välj en dataserie från listan: </label>
        {/* TODO: Make this a dropdown with options from the database and proper IDs as values */}
        <select name="dataSeriesId" required={false}>
          <option value="0">Ingen dataserie</option>
          <option value="1">Dataserie 1</option>
          <option value="2">Dataserie 2</option>
          <option value="3">Dataserie 3</option>
        </select>
        <br />
        {/*
          TODO: Add a way to choose who can see and/or edit, something like
          Public, Internal, Private, Custom (with a list of groups to choose from).
          Also allow adding specific people individually, by email address.
          This should probably be done as a component that is reused
          in all forms that include editing/viewing permissions.
        */}
      </form>
    </>
  )
}