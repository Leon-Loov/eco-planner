'use client'

import AccessSelector, { getAccessData } from "@/components/accessSelector"

export default function ActionForm({ roadmapId, goalId, userGroups }: { roadmapId: string, goalId: string, userGroups: string[] }) {
  // Submit the form to the API
  function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.target.elements

    const { editUsers, viewUsers, editGroups, viewGroups } = getAccessData(
      form.namedItem("editUsers"),
      form.namedItem("viewUsers"),
      form.namedItem("editGroups"),
      form.namedItem("viewGroups")
    )

    const formJSON = JSON.stringify({
      name: (form.namedItem("actionName") as HTMLInputElement)?.value,
      description: (form.namedItem("actionDescription") as HTMLInputElement)?.value,
      costEfficiency: (form.namedItem("costEfficiency") as HTMLInputElement)?.value,
      expectedOutcome: (form.namedItem("expectedOutcome") as HTMLInputElement)?.value,
      projectManager: (form.namedItem("projectManager") as HTMLInputElement)?.value,
      relevantActors: (form.namedItem("relevantActors") as HTMLInputElement)?.value,
      goalId: goalId,
      editors: editUsers,
      viewers: viewUsers,
      editGroups,
      viewGroups,
    })

    fetch('/api/createAction', {
      method: 'POST',
      body: formJSON,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Action could not be created.')
      }
    }).then(data => {
      window.location.href = `/roadmap/${roadmapId}/goal/${goalId}`
    }).catch((err) => {
      alert('Åtgärd kunde inte skapas.')
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="actionName">Namn på åtgärden: </label>
        <input type="text" name="actionName" required id="actionName" />
        <br />
        <label htmlFor="actionDescription">Beskrivning av åtgärden: </label>
        <input type="text" name="actionDescription" required id="actionDescription" />
        <br />
        <label htmlFor="costEfficiency">Kostnadseffektivitet: </label>
        <input type="text" name="costEfficiency" required id="costEfficiency" />
        <br />
        <label htmlFor="expectedOutcome">Förväntat resultat: </label>
        <input type="text" name="expectedOutcome" required id="expectedOutcome" />
        <br />
        <label htmlFor="projectManager">Projektansvarig: </label>
        <input type="text" name="projectManager" required id="projectManager" />
        <br />
        <label htmlFor="relevantActors">Relevanta aktörer: </label>
        <input type="text" name="relevantActors" required id="relevantActors" />
        <br />
        <AccessSelector groupOptions={userGroups} />
        <br />
        <input type="submit" value="Skapa åtgärd" />
        <br />
      </form>
    </>
  )
}