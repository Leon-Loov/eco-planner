'use client'

import AccessSelector, { getAccessData } from "@/components/forms/accessSelector/accessSelector"
import parseCsv, { csvToGoalList } from "@/functions/parseCsv"
import countiesAndMunicipalities from "@/lib/countiesAndMunicipalities.json" with { type: "json" }
import { Data } from "@/lib/session"
import { AccessControlled } from "@/types"
import { Roadmap } from "@prisma/client"
import { useState } from "react"

export default function RoadmapForm({
  user,
  userGroups,
  nationalRoadmaps,
  currentRoadmap,
}: {
  user: Data['user'],
  userGroups: string[],
  nationalRoadmaps?: (Roadmap & {
    goals: {
      id: string,
      name: string | null,
      indicatorParameter: string,
    }[],
  })[],
  currentRoadmap?: Roadmap & AccessControlled,
}) {
  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const form = event.target.elements

    const { editUsers, viewUsers, editGroups, viewGroups } = getAccessData(
      form.namedItem("editUsers"),
      form.namedItem("viewUsers"),
      form.namedItem("editGroups"),
      form.namedItem("viewGroups")
    )

    const parentRoadmapId = (form.namedItem('parentRoadmap') as HTMLSelectElement)?.value

    const formJSON = JSON.stringify({
      name: (form.namedItem("roadmapName") as HTMLInputElement)?.value,
      description: (form.namedItem("description") as HTMLInputElement)?.value || undefined,
      county: (form.namedItem("county") as HTMLInputElement)?.value == "National" ? undefined : (form.namedItem("county") as HTMLInputElement)?.value || undefined,
      municipality: (form.namedItem("municipality") as HTMLInputElement)?.value == "Regional" ? undefined : (form.namedItem("municipality") as HTMLInputElement)?.value || undefined,
      isNational: (form.namedItem("county") as HTMLInputElement)?.value == "National",
      editors: editUsers,
      viewers: viewUsers,
      editGroups,
      viewGroups,
      roadmapId: currentRoadmap?.id || undefined,
      goals: [
        ...(currentFile ? csvToGoalList(parseCsv(await currentFile.arrayBuffer().then((buffer) => { return buffer })), "0") : [])
      ],
      parentRoadmapId,
      timestamp,
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
        return res.json().then((data) => {
          throw new Error(data.message)
        })
      }
    }).then(data => {
      setIsLoading(false)
      window.location.href = `/roadmap/${data.id}`
    }).catch((err) => {
      setIsLoading(false)
      alert(`Färdplan kunde inte skapas.\nAnledning: ${err.message}`)
    })
  }

  const [selectedCounty, setSelectedCounty] = useState<string | null>(currentRoadmap?.county || null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const timestamp = Date.now()

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

  return (
    <>
      <form onSubmit={handleSubmit} className="action-form">
        {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new entries in AccessSelector (for example, when pressing enter to add someone to the list of editors) */}
        <input type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />
        <label htmlFor="name">Färdplansnamn </label>
        <input type="text" name="roadmapName" required id="roadmapName" defaultValue={currentRoadmap?.name} />

        <label htmlFor="description">Beskrivning av färdplanen </label>
        <textarea name="description" id="description" defaultValue={currentRoadmap?.description ?? undefined}></textarea>

        {!!nationalRoadmaps &&
          <>
            <label htmlFor="copyFrom">Nationell färdplan denna färdplan är baserad på </label>
            <select name="parentRoadmap" id="copyFrom">
              <option value="">Ingen nationell färdplan</option>
              {
                nationalRoadmaps.map((roadmap) => {
                  return (
                    <option key={roadmap.id} value={roadmap.id}>{roadmap.name}</option>
                  )
                })
              }
            </select>
          </>
        }

        <div className="display-flex align-items-center gap-100">
          <div className="flex-grow-100" style={{maxWidth: "250px"}}>
            <label htmlFor="county">Län</label>
            <select name="county" id="county" required onChange={(e) => setSelectedCounty(e.target.value)} defaultValue={currentRoadmap?.isNational ? "National" : currentRoadmap?.county ?? undefined}>
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
          </div>
          <div className="flex-grow-100" style={{maxWidth: "250px"}}>
          { // If a county is selected, show a dropdown for municipalities in that county
            selectedCounty && selectedCounty !== "National" &&
            <>
              <label htmlFor="municipality">Kommun</label>
              <select name="municipality" id="municipality" required defaultValue={currentRoadmap?.municipality ?? undefined}>
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
            </>
          }
          </div>
        </div>

        <label htmlFor="csvUpload">Om du har en CSV-fil med målbanor kan du ladda upp den här. <br /> Notera att det här skapar nya målbanor även om det redan finns några. </label>
        <input type="file" name="csvUpload" id="csvUpload" accept=".csv" onChange={(e) => e.target.files ? setCurrentFile(e.target.files[0]) : setCurrentFile(null)} />
        { // Only show the access selector if a new roadmap is being created, the user is an admin, or the user has edit access to the roadmap
          (!currentRoadmap || user?.isAdmin || user?.id === currentRoadmap.authorId) &&
          <>
            <AccessSelector groupOptions={userGroups} currentAccess={currentAccess} />
          </>
        }
        {isLoading ? (
          // Show spinner or loading indicator when isLoading is true
          <div className="call-to-action-primary justify-contentcenter align-items-center gap-100" style={{ margin: "1em 0", position: "relative", display: "flex", width: "fit-content", border: "3px solid var(--accent-color-dark)", backgroundColor: "var(--accent-color-dark)" }}>
            <input
              className="call-to-action-primary"
              type="submit"
              value={currentRoadmap ? 'Spara' : 'Skapa färdplan'}
              style={{ opacity: "0", height: "0", margin: "unset", cursor: "not-allowed", padding: ".5em 0" }}
              disabled={isLoading}
            />
            <div className="loading" />
          </div>
        ) : (
          // Show the button or input element when isLoading is false
          <input
            className="call-to-action-primary"
            type="submit"
            value={currentRoadmap ? 'Spara' : 'Skapa färdplan'}
            disabled={isLoading}
          />
        )}
      </form>
    </>
  )
}