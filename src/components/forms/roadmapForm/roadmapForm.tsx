'use client'

import AccessSelector, { getAccessData } from "@/components/forms/accessSelector/accessSelector"
import parseCsv, { csvToGoalList } from "@/functions/parseCsv"
import { Data } from "@/lib/session"
import { AccessControlled, RoadmapInput } from "@/types"
import { MetaRoadmap, Roadmap } from "@prisma/client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function RoadmapForm({
  user,
  userGroups,
  metaRoadmapAlternatives,
  currentRoadmap,
}: {
  user: Data['user'],
  userGroups: string[],
  metaRoadmapAlternatives?: (MetaRoadmap & {
    roadmapVersions: { id: string, version: number }[],
  })[],
  currentRoadmap?: Roadmap & AccessControlled & { metaRoadmap: MetaRoadmap },
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

    const metaRoadmapId = (form.namedItem('parentRoadmap') as HTMLSelectElement)?.value

    const formData: RoadmapInput & { roadmapId?: string, goals?: any, timestamp: number } = {
      description: (form.namedItem("description") as HTMLTextAreaElement)?.value || undefined,
      editors: editUsers,
      viewers: viewUsers,
      editGroups,
      viewGroups,
      roadmapId: currentRoadmap?.id || undefined,
      goals: [
        ...(currentFile ? csvToGoalList(parseCsv(await currentFile.arrayBuffer().then((buffer) => { return buffer })), "0") : [])
      ],
      metaRoadmapId,
      inheritFromId: (form.namedItem('inheritFromId') as HTMLSelectElement)?.value || undefined,
      timestamp,
    }

    const formJSON = JSON.stringify(formData)

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

  let defaultParentRoadmap: string | undefined = useSearchParams().get('metaRoadmapId') || undefined

  return (
    <>
      <form onSubmit={handleSubmit} className="action-form">
        {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new entries in AccessSelector (for example, when pressing enter to add someone to the list of editors) */}
        <input type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />

        <label htmlFor="description">Extra beskrivning av den här versionen av färdplanen </label>
        <textarea name="description" id="description" defaultValue={currentRoadmap?.description ?? undefined}></textarea>

        {/* TODO: Change to meta roadmaps instead */}
        {!!metaRoadmapAlternatives &&
          <>
            <label htmlFor="copyFrom">Meta-färdplan som detta är en ny version av</label>
            <select name="parentRoadmap" id="copyFrom" defaultValue={defaultParentRoadmap} required>
              <option value="">Inget alternativ valt</option>
              {
                metaRoadmapAlternatives.map((roadmap) => {
                  return (
                    <option key={roadmap.id} value={roadmap.id}>{`${roadmap.name}`}</option>
                  )
                })
              }
            </select>
            <p>Saknas meta-färdplanen du söker efter? Kolla att du har tillgång till den eller <Link href={`/metaRoadmap/createMetaRoadmap`}>skapa en ny meta-färdplan</Link></p>
            {/* TODO: Add secondary dropdown to select target version if parent meta-roadmap targets another meta-roadmap*/}
          </>
        }

        {/* TODO: Add selector for inheriting some/all goals from another roadmap */}

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