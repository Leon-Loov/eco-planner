'use client'

function handleSubmit(event: any) {
  event.preventDefault()

  const form = event.target
  const formJSON = JSON.stringify({
    goalName: form.goalName.value,
    goalObject: form.goalObject.value,
    nationalRoadmapId: form.nationalRoadmapId.value,
    indicatorParameter: form.indicatorParameter.value,
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