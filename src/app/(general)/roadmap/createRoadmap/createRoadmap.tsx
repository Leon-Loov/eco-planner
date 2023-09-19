'use client'

import AccessSelector, { getAccessData } from "@/components/accessSelector"
import { Data } from "@/lib/session"

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
    name: (form.namedItem("roadmapName") as HTMLInputElement)?.value,
    // Converts the value to a boolean
    isNational: !!(form.namedItem("isNational") as HTMLInputElement)?.value,
    editors: editUsers,
    viewers: viewUsers,
    editGroups,
    viewGroups,
  })

  fetch('/api/createRoadmap', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    } else {
      throw new Error('Roadmap could not be created.')
    }
  }).then(data => {
    window.location.href = `/roadmap/${data.id}`
  }).catch((err) => {
    alert('Färdplan kunde inte skapas.')
  })
}

export default function CreateRoadmap({ user, userGroups }: { user: Data['user'], userGroups: string[] }) {
  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new entries in AccessSelector (for example, when pressing enter to add someone to the list of editors) */}
        <input type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />
        <label htmlFor="name">Namn på färdplanen: </label>
        <input type="text" name="roadmapName" required={true} id="roadmapName" />
        <br />
        { // This is a toggle to make the roadmap a national roadmap and should only be visible to admins
          user?.isAdmin &&
          <>
            <label htmlFor="isNational">Är färdplanen en nationell färdplan?</label>
            <input type="checkbox" name="isNational" id="isNational" />
          </>
        }
        <br />
        {/* TODO: Remove placeholders */}
        <AccessSelector groupOptions={userGroups} />
        <br />
        <input type="submit" value="Skapa färdplan" />
      </form>
    </>
  )
}