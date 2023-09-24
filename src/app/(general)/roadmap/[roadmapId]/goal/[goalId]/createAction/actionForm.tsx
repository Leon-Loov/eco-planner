'use client'

import AccessSelector from "@/components/accessSelector"

export default function ActionForm({ roadmapId, goalId, userGroups }: { roadmapId: string, goalId: string, userGroups: string[] }) {
  // Submit the form to the API
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    const form = event.target as HTMLFormElement
    const formJSON = JSON.stringify({
      name: form.actionName.value,
      description: form.actionDescription.value,
      costEfficiency: form.costEfficiency.value,
      expectedOutcome: form.expectedOutcome.value,
      projectManager: form.projectManager.value,
      relevantActors: form.relevantActors.value,
      goalId: goalId,
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
        <input type="text" name="actionName" required={true} id="actionName" />
        <br />
        <label htmlFor="actionDescription">Beskrivning av åtgärden: </label>
        <input type="text" name="actionDescription" required={true} id="actionDescription" />
        <br />
        <label htmlFor="costEfficiency">Kostnadseffektivitet: </label>
        <input type="text" name="costEfficiency" required={true} id="costEfficiency" />
        <br />
        <label htmlFor="expectedOutcome">Förväntat resultat: </label>
        <input type="text" name="expectedOutcome" required={true} id="expectedOutcome" />
        <br />
        <label htmlFor="projectManager">Projektansvarig: </label>
        <input type="text" name="projectManager" required={true} id="projectManager" />
        <br />
        <label htmlFor="relevantActors">Relevanta aktörer: </label>
        <input type="text" name="relevantActors" required={true} id="relevantActors" />
        <br />
        <AccessSelector groupOptions={userGroups} />
        <br />
        <input type="submit" value="Skapa åtgärd" />
        <br />
      </form>
    </>
  )
}