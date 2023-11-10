'use client'

import AccessSelector, { getAccessData } from "@/components/accessSelector"
import { Data } from "@/lib/session"
import { AccessControlled } from "@/types"
import { Action } from "@prisma/client"

export default function ActionForm({
  roadmapId,
  goalId,
  user,
  currentAction
}: {
  roadmapId: string,
  goalId: string,
  user: Data['user'],
  currentAction?: Action & AccessControlled,
}) {
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
      startYear: (form.namedItem("startYear") as HTMLInputElement)?.value ? parseInt((form.namedItem("startYear") as HTMLInputElement)?.value) : undefined,
      endYear: (form.namedItem("endYear") as HTMLInputElement)?.value ? parseInt((form.namedItem("endYear") as HTMLInputElement)?.value) : undefined,
      projectManager: (form.namedItem("projectManager") as HTMLInputElement)?.value,
      relevantActors: (form.namedItem("relevantActors") as HTMLInputElement)?.value,
      goalId: goalId,
      actionId: currentAction?.id || null,
      editors: editUsers,
      viewers: viewUsers,
      editGroups,
      viewGroups,
      timestamp,
    })

    fetch('/api/createAction', {
      // PUT if editing, POST if creating
      method: currentAction ? 'PUT' : 'POST',
      body: formJSON,
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        res.json().then((data) => {
          throw new Error(data.message)
        })
      }
    }).then(data => {
      window.location.href = `/roadmap/${roadmapId}/goal/${goalId}`
    }).catch((err) => {
      alert(`Åtgärd kunde inte skapas.\nAnledning: ${err.message}`)
    })
  }

  const timestamp = Date.now();

  let currentAccess: AccessControlled | undefined = undefined;
  if (currentAction) {
    currentAccess = {
      author: currentAction.author,
      editors: currentAction.editors,
      viewers: currentAction.viewers,
      editGroups: currentAction.editGroups,
      viewGroups: currentAction.viewGroups,
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="action-form">
        <div className="grid-auto-rows">
          <div>
            <label htmlFor="actionName">Namn på åtgärden: </label>
            <input type="text" name="actionName" required id="actionName" defaultValue={currentAction?.name} />
          </div>
          <div>
            <label htmlFor="actionDescription">Beskrivning av åtgärden: </label>
            <input type="text" name="actionDescription" id="actionDescription" defaultValue={currentAction?.description ?? undefined} />
          </div>
        </div>
        <br />
        <label htmlFor="costEfficiency">Kostnadseffektivitet: </label>
        <input type="text" name="costEfficiency" id="costEfficiency" defaultValue={currentAction?.costEfficiency ?? undefined} />
        <br />
        <label htmlFor="expectedOutcome">Förväntat resultat: </label>
        <input type="text" name="expectedOutcome" id="expectedOutcome" defaultValue={currentAction?.expectedOutcome ?? undefined} />
        <br />
        <div className="grid-auto-rows">
          <div>
            <label htmlFor="startYear">Planerat startår: </label>
            <input type="number" name="startYear" id="startYear" defaultValue={currentAction?.startYear ?? undefined} min={2000} />
          </div>
          <div>
            <label htmlFor="endYear">Planerat slutår: </label>
            <input type="number" name="endYear" id="endYear" defaultValue={currentAction?.endYear ?? undefined} min={2000} />
          </div>
          <br />
        </div>
        <label htmlFor="projectManager">Projektansvarig: </label>
        <input type="text" name="projectManager" id="projectManager" defaultValue={currentAction?.projectManager ?? undefined} />
        <br />
        <label htmlFor="relevantActors">Relevanta aktörer: </label>
        <input type="text" name="relevantActors" id="relevantActors" defaultValue={currentAction?.relevantActors ?? undefined} />
        <br />
        { // Only show the access selector if a new action is being created, the useris an admin, or the user is the author of the action
          (!currentAction || user?.isAdmin || user?.id === currentAction.authorId) &&
          <>
            <AccessSelector groupOptions={user?.userGroups || []} currentAccess={currentAccess} />
            <br />
          </>
        }
        <input type="submit" value={currentAction ? "Spara" : "Skapa åtgärd"} className="call-to-action-primary" />
        <br />
      </form>
    </>
  )
}