'use client'

import AccessSelector, { getAccessData } from "@/components/accessSelector"
import parseCsv from "@/functions/parseCsv"
import { countiesAndMunicipalities } from "@/lib/countiesAndMunicipalities"
import { Data } from "@/lib/session"
import Tooltip from "@/lib/tooltipWrapper"
import { AccessControlled } from "@/types"
import { Roadmap } from "@prisma/client"
import { useEffect, useState } from "react"

export default function RoadmapForm({
  user,
  userGroups,
  currentRoadmap,
}: {
  user: Data['user'],
  userGroups: string[],
  currentRoadmap?: Roadmap & AccessControlled,
}) {
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
      county: (form.namedItem("county") as HTMLInputElement)?.value == "National" ? undefined : (form.namedItem("county") as HTMLInputElement)?.value || undefined,
      municipality: (form.namedItem("municipality") as HTMLInputElement)?.value == "Regional" ? undefined : (form.namedItem("municipality") as HTMLInputElement)?.value || undefined,
      isNational: (form.namedItem("county") as HTMLInputElement)?.value == "National",
      editors: editUsers,
      viewers: viewUsers,
      editGroups,
      viewGroups,
    })

    fetch('/api/createRoadmap', {
      // If a roadmap is being edited, use PUT instead of POST
      method: currentRoadmap ? 'PUT' : 'POST',
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

  const [selectedCounty, setSelectedCounty] = useState<string | null>(currentRoadmap?.county || null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  let currentAccess: AccessControlled | undefined = undefined;
  if (currentRoadmap) {
    currentAccess = {
      author: currentRoadmap.author,
      editors: currentRoadmap.editors,
      viewers: currentRoadmap.viewers,
      editGroups: currentRoadmap.editGroups,
      viewGroups: currentRoadmap.viewGroups,
    }
  }

  useEffect(() => {
    // This component probably shouldn't be async, so we're stacking promises here
    let buffer = currentFile?.arrayBuffer().then((buffer) => {return buffer})
    if (!buffer) return
    buffer.then((buffer) => {
      let content = parseCsv(buffer)
      // Remove the first two rows if the second row is empty (This is the case if the file follows the standard format, with metadata in the first row and headers in the third row)
      if (!content[1][0]) {
        content = content.slice(2)
      }
      console.log(content[1])
    })
  }, [currentFile])

  return (
    <>
      <form onSubmit={handleSubmit} className="action-form">
        {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new entries in AccessSelector (for example, when pressing enter to add someone to the list of editors) */}
        <input type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />
        <label htmlFor="name">Namn på färdplanen: </label>
        <input type="text" name="roadmapName" required id="roadmapName" defaultValue={currentRoadmap?.name} />
        <br />
        <label htmlFor="county">Vilket län gäller färdplanen? </label>
        <select name="county" id="county" required onChange={(e) => setSelectedCounty(e.target.value)}>
          <option value="">Välj län</option>
          { // If the user is an admin, they can select the entire country to make a national roadmap
            user?.isAdmin &&
            <option value="National">Hela landet (nationell färdplan)</option>
          }
          {
            Object.keys(countiesAndMunicipalities).map((county) => {
              return (
                <option key={county} value={county}>{county}</option>
              )
            })
          }
        </select>
        <br />
        { // If a county is selected, show a dropdown for municipalities in that county
          selectedCounty && selectedCounty !== "National" &&
          <>
            <label htmlFor="municipality">Vilken kommun gäller färdplanen? </label>
            <select name="municipality" id="municipality">
              <option value="">Välj kommun</option>
              <option value="Regional">Hela länet</option>
              {
                countiesAndMunicipalities[selectedCounty as keyof typeof countiesAndMunicipalities].map((municipality) => {
                  return (
                    <option key={municipality} value={municipality}>{municipality}</option>
                  )
                })
              }
            </select>
            <br />
          </>
        }
        <label htmlFor="csvUpload">Om du har en CSV-fil med målbanor kan du ladda upp den här: </label>
        <input type="file" name="csvUpload" id="csvUpload" accept=".csv" onChange={(e) => e.target.files ? setCurrentFile(e.target.files[0]) : setCurrentFile(null)} />
        <br />
        { // Only show the access selector if a new roadmap is being created, the user is an admin, or the user has edit access to the roadmap
          (!currentRoadmap || user?.isAdmin || user?.id === currentRoadmap.authorId) &&
          <>
            <AccessSelector groupOptions={userGroups} currentAccess={currentAccess} />
            <br />
          </>
        }
        <input type="submit" value="Skapa färdplan" className="call-to-action-primary" />
      </form>
    </>
  )
}