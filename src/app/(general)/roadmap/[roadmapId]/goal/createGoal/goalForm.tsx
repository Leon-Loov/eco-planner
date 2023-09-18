'use client'

export default function CreateGoal({ roadmapId }: { roadmapId: string }) {
  // Submit the form to the API
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    const form = event.target as HTMLFormElement
    const formJSON = JSON.stringify({
      name: form.goalName.value,
      goalObject: form.goalObject.value,
      nationalRoadmapId: form.nationalRoadmapId.value,
      indicatorParameter: form.indicatorParameter.value,
      dataUnit: form.dataUnit.value,
      dataSeries: form.dataSeries.value,
      dataSeriesId: form.dataSeriesId.value,
      roadmapId: roadmapId,
    })
  
    fetch('/api/createGoal', {
      method: 'POST',
      body: formJSON,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Goal could not be created.')
      }
    }).then(data => {
      window.location.href = `/roadmap/${roadmapId}/goal/${data.id}`
    }).catch((err) => {
      alert('Målbana kunde inte skapas.')
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />
        <label htmlFor="goalName">Namn på målbanan: </label>
        <input type="text" name="goalName" required={true} id="goalName" />
        <br />
        <label htmlFor="goalObject">Den som &quot;äger&quot; målet (t.ex en region eller organisation): </label>
        <input type="text" name="goalObject" required={true} />
        <br />
        <label htmlFor="nationalRoadmapId">Nationell målbana denna är baserad på (om någon): </label>
        {/* TODO: Make this a dropdown with options from the database and proper IDs as values */}
        <select name="nationalRoadmapId" required={false} id="nationalRoadmapId">
          <option value={0}>Ingen nationell målbana</option>
          <option value="1">Nationell målbana 1</option>
          <option value="2">Nationell målbana 2</option>
          <option value="3">Nationell målbana 3</option>
        </select>
        <br />
        {/* TODO: Make this a dropdown with actual indicator parameters, plus a 'custom' option that allows typing in a custom parameter */}
        <label htmlFor="indicatorParameter">Indikatorparameter: </label>
        <select name="indicatorParameter" required={true} id="indicatorParameter">
          <option value="Test">Indikatorparameter 1</option>
          <option value="Thing">Indikatorparameter 2</option>
          <option value="A\B">Indikatorparameter 3</option>
        </select>
        <br />
        <label htmlFor="dataUnit">Enhet för dataserie: </label>
        <input type="text" name="dataUnit" required={true} id="dataUnit" />
        <br />
        <label htmlFor="dataSeries">Dataserie: </label>
        {/* TODO: Make this allow .csv files, and do parsing stuff and forced format if text */}
        <input type="text" name="dataSeries" required={false} id="dataSeries" />
        <br />
        <label htmlFor="dataSeriesId">Alternativt, välj en dataserie från listan: </label>
        {/* TODO: Make this a dropdown with options from the database and proper IDs as values */}
        <select name="dataSeriesId" required={false} id="dataSeriesId">
          <option value={0}>Ingen dataserie</option>
          <option value="1">Dataserie 1</option>
          <option value="2">Dataserie 2</option>
          <option value="3">Dataserie 3</option>
        </select>
        <br />
        <p>
          Här ska det finnas möjlighet att välja vilka som kan se och/eller redigera målbana.
        </p>
        {/*
          TODO: Add a way to choose who can see and/or edit, something like
          Public, Internal, Private, Custom (with a list of groups to choose from).
          Also allow adding specific people individually, by email address.
          This should probably be done as a component that is reused
          in all forms that include editing/viewing permissions.
        */}
        <br />
        <input type="submit" value="Skapa målbana" />
      </form>
    </>
  )
}