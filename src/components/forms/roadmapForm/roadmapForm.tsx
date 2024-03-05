'use client'

import AccessSelector, { getAccessData } from "@/components/forms/accessSelector/accessSelector"
import getOneRoadmap from "@/fetchers/getOneRoadmap"
import parseCsv, { csvToGoalList } from "@/functions/parseCsv"
import { Data } from "@/lib/session"
import { AccessControlled, GoalInput, RoadmapInput } from "@/types"
import { Goal, MetaRoadmap, Roadmap } from "@prisma/client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

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

    let goals: GoalInput[] = [];
    if (currentFile) {
      try {
        goals = csvToGoalList(parseCsv(await currentFile.arrayBuffer().then((buffer) => { return buffer })))
      }
      catch (e: any) {
        setIsLoading(false)
        alert(`Färdplan kunde inte skapas.\nAnledning: ${e.message || "Okänt fel"}`)
        return
      }
    }

    const inheritGoalIds: string[] = [];
    (form.namedItem('inheritGoals') as RadioNodeList | null)?.forEach((checkbox) => {
      if ((checkbox as HTMLInputElement).checked) {
        inheritGoalIds.push((checkbox as HTMLInputElement).value)
      }
    })
    console.log(inheritGoalIds)

    const formData: RoadmapInput & { roadmapId?: string, goals?: GoalInput[], timestamp: number } = {
      description: (form.namedItem("description") as HTMLTextAreaElement)?.value || undefined,
      editors: editUsers,
      viewers: viewUsers,
      editGroups,
      viewGroups,
      roadmapId: currentRoadmap?.id || undefined,
      goals: goals,
      metaRoadmapId,
      inheritFromIds: inheritGoalIds,
      targetVersion: parseInt((form.namedItem('targetVersion') as HTMLSelectElement)?.value) || null,
      timestamp,
    }

    const formJSON = JSON.stringify(formData)

    fetch('/api/roadmap', {
      // If a roadmap is being edited, use PUT instead of POST
      method: currentRoadmap ? 'PUT' : 'POST',
      body: formJSON,
      headers: { 'Content-Type': 'application/json' },
    }).then(async (res) => {
      if (res.ok) {
        return { body: await res.json(), location: res.headers.get('Location') }
      } else {
        if (res.status >= 400) {
          const data = await res.json()
          // Throw the massage and any location provided by the API
          throw { message: data.message, location: res.headers.get('Location') }
        } else {
          throw new Error('Något gick fel')
        }
      }
    }).then(data => {
      setIsLoading(false)
      window.location.href = data.location ?? `/roadmap/${data.body.id}`
    }).catch((err) => {
      setIsLoading(false)
      alert(`Färdplan kunde inte skapas.\nAnledning: ${err.message}`)
      // If a new location is provided, redirect to it
      if (err.location) {
        window.location.href = err.location
      }
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

  const defaultParentRoadmap: string | undefined = useSearchParams().get('metaRoadmapId') || undefined
  const [metaRoadmapId, setMetaId] = useState<string | undefined>(defaultParentRoadmap)
  const [targetVersion, setTargetVersion] = useState<number | null>(0)
  const [inheritableGoals, setInheritableGoals] = useState<Goal[]>([])
  const metaRoadmapTarget = useMemo(() => {
    // The meta roadmap that the parent meta roadmap works towards, if any
    return metaRoadmapAlternatives?.find((parentRoadmap) => parentRoadmap.id === metaRoadmapAlternatives?.find((roadmap) => roadmap.id === metaRoadmapId)?.parentRoadmapId)
  }, [metaRoadmapId, metaRoadmapAlternatives])

  // Fetch inheritable goals when the target version changes
  useEffect(() => {
    setIsLoading(true)
    getOneRoadmap(metaRoadmapTarget?.roadmapVersions.find((version) => version.version === targetVersion)?.id || "")
      .then((roadmap) => {
        if (!roadmap) {
          setInheritableGoals([]);
          setIsLoading(false);
          return;
        }
        setInheritableGoals(roadmap.goals);
        setIsLoading(false);
        return;
      })
      .catch((err) => {
        setInheritableGoals([]);
        setIsLoading(false);
        return;
      })
  }, [metaRoadmapTarget, targetVersion])

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
            <label htmlFor="parentRoadmap">Färdplansserie som detta är ett nytt inlägg i</label>
            <select name="parentRoadmap" id="parentRoadmap" defaultValue={defaultParentRoadmap} required onChange={(e) => setMetaId(e.target.value)}>
              <option value="">Inget alternativ valt</option>
              {
                metaRoadmapAlternatives.map((roadmap) => {
                  return (
                    <option key={roadmap.id} value={roadmap.id}>{`${roadmap.name}`}</option>
                  )
                })
              }
            </select>
            <p>Saknas färdplansserien du söker efter? Kolla att du har tillgång till den eller <Link href={`/metaRoadmap/createMetaRoadmap`}>skapa en ny färdplansserie</Link></p>
            {metaRoadmapTarget && metaRoadmapTarget.roadmapVersions.length && (
              <>
                <label htmlFor="targetVersion">Version av färdplansserien {`"${metaRoadmapTarget.name}"`} den här färdplanen arbetar mot</label>
                <select name="targetVersion" id="targetVersion" required defaultValue={currentRoadmap?.targetVersion || ""} onChange={(e) => setTargetVersion(parseInt(e.target.value) || null)}>
                  <option value="">Inget alternativ valt</option>
                  <option value={0}>Alltid senaste versionen</option>
                  {metaRoadmapTarget.roadmapVersions.map((version) => {
                    return (
                      <option key={version.version} value={version.version}>{`Version ${version.version}`}</option>
                    )
                  })}
                </select>
              </>
            )}
          </>
        }

        {/* TODO: Add checkboxes for inheriting some/all goals from another roadmap with `inheritFromID` */}
        {/* TODO: Allow choosing which which goal to inherit from, might be different from target  */}
        {inheritableGoals.length > 0 && (
          <>
            <fieldset>
              <legend>Välj mål att ärva från färdplanen</legend>
              {
                inheritableGoals.map((goal, index) => {
                  return (
                    <label key={goal.id}>
                      <input type="checkbox" name={`inheritGoals`} id={`inheritGoals-${goal.id}`} value={goal.id} />
                      {`${goal.name || goal.indicatorParameter}`}
                    </label>
                  )
                })
              }
            </fieldset>
          </>
        )}

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