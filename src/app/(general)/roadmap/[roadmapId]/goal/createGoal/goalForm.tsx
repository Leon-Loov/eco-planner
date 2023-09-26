'use client'

import AccessSelector, { getAccessData } from "@/components/accessSelector"
import { Data } from "@/lib/session"
import Tooltip from "@/lib/tooltipWrapper"
import { AccessControlled } from "@/types"
import { DataSeries, Goal, Roadmap } from "@prisma/client"
import { useState } from "react"

export default function GoalForm({
  roadmapId,
  user,
  nationalRoadmaps,
  currentGoal,
}: {
  roadmapId: string,
  user: Data['user'],
  nationalRoadmaps: (Roadmap & { goals: Goal[] })[],
  currentGoal?: Goal & AccessControlled & { dataSeries: DataSeries },
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

    // Convert the data series to an array of numbers, the actual parsing is done by the API
    const dataSeriesInput = (form.namedItem("dataSeries") as HTMLInputElement)?.value
    const dataSeries = dataSeriesInput.replaceAll(',', '.').split(/[\t;]/).map((value) => {
      return value
    })

    const formJSON = JSON.stringify({
      name: (form.namedItem("goalName") as HTMLInputElement)?.value || null,
      goalObject: (form.namedItem("goalObject") as HTMLInputElement)?.value || null,
      nationalRoadmapId: (form.namedItem("nationalRoadmapId") as HTMLInputElement)?.value || null,
      nationalGoalId: (form.namedItem("nationalGoalId") as HTMLInputElement)?.value || null,
      indicatorParameter: (form.namedItem("indicatorParameter") as HTMLInputElement)?.value || null,
      dataUnit: (form.namedItem("dataUnit") as HTMLInputElement)?.value || null,
      dataSeries: dataSeries,
      // This functionality is temporarily or permanently disabled
      // dataSeriesId: (form.namedItem("dataSeriesId") as HTMLInputElement)?.value,
      roadmapId: roadmapId,
      editors: editUsers,
      viewers: viewUsers,
      editGroups,
      viewGroups,
    })

    console.log(formJSON)

    fetch('/api/createGoal', {
      // If a goal is being edited, use PUT instead of POST
      method: currentGoal ? 'PUT' : 'POST',
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

  /**
   * This matches 0 to 31 numbers separated by tabs or semicolons, with an optional decimal part.
   * The first position represents the value for year 2020, and any number in the 31:st position represents the value for year 2050.
   * 
   * Two examle strings that match this pattern are:  
   * "2.0;2.1;2.2;2.3;2.4;2.5;2.6;2.7;2.8;2.9;3.0;3.1;3.2;3.3;3.4;3.5;3.6;3.7;3.8;3.9;4.0;4.1;4.2;4.3;4.4;4.5;4.6;4.7;4.8;4.9;5.0"  
   * and  
   * ";0;;;4;1"
   */
  const dataSeriesPattern = "(([0-9]+([.,][0-9]+)?)?[\t;]){0,30}([0-9]+([.,][0-9]+)?)?"

  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null)

  let dataArray: (number | null)[] = []
  if (currentGoal?.dataSeries) {
    for (let i in currentGoal.dataSeries) {
      // All keys in dataSeries containing numbers are part of the data series itself and should be fine to push to the array
      if (i.match(/[0-9]+/)) {
        // This line *should* start complaining if we add any keys to DataSeries that are not part of the data series, unless the value is a number
        dataArray.push(currentGoal.dataSeries[i as keyof Omit<DataSeries, 'author' | 'unit' | 'id' | 'createdAt' | 'updatedAt' | 'editors' | 'viewers' | 'editGroups' | 'viewGroups' | 'authorId'>])
      }
    }
  }
  const dataSeriesString = dataArray.join(';')

  let currentAccess: AccessControlled | undefined = undefined;
  if (currentGoal) {
    currentAccess = {
      author: currentGoal.author,
      editors: currentGoal.editors,
      viewers: currentGoal.viewers,
      editGroups: currentGoal.editGroups,
      viewGroups: currentGoal.viewGroups,
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new entries in AccessSelector (for example, when pressing enter to add someone to the list of editors) */}
        <button type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />
        <label htmlFor="goalName">Namn på målbanan: </label>
        <input type="text" name="goalName" required id="goalName" defaultValue={currentGoal?.name} />
        <br />
        <label htmlFor="goalObject">Målobjekt: </label>
        <input type="text" name="goalObject" required title="Målobjektet är den som &quot;äger&quot; ett mål, exempelvis en kommun, region eller organisation." id="goalObject" defaultValue={currentGoal?.goalObject} />
        <br />
        <label htmlFor="nationalRoadmapId">Nationell färdplan denna är baserad på (om någon): </label>
        {/* TODO: Make this a dropdown with options from the database and proper IDs as values */}
        <select name="nationalRoadmapId" id="nationalRoadmapId" onChange={(e) => setSelectedRoadmap(e.target.value)} defaultValue={currentGoal?.nationalRoadmapId || undefined}>
          <option value="">Ingen nationell målbana</option>
          {nationalRoadmaps.map((roadmap) => {
            return (
              <option key={roadmap.id} value={roadmap.id}>{roadmap.name}</option>
            )
          })}
        </select>
        <br />
        { // If a national roadmap is selected, allow the user to choose a goal from that roadmap to base this goal on
          selectedRoadmap &&
          <>
            <label htmlFor="nationalGoalId">Målbana i den nationella färdplanen denna är baserad på (om någon): </label>
            <select name="nationalGoalId" id="nationalGoalId" defaultValue={currentGoal?.nationalGoalId || undefined}>
              <option value="">Inget mål</option>
              { // Allows choosing the goals from the selected national roadmap
                nationalRoadmaps.find((roadmap) => roadmap.id === selectedRoadmap)?.goals.map((goal) => {
                  return (
                    <option key={goal.id} value={goal.id}>{goal.name}</option>
                  )
                })}
            </select>
            <br />
          </>
        }
        {/* TODO: Make this a dropdown with actual indicator parameters, plus a 'custom' option that allows typing in a custom parameter */}
        <label htmlFor="indicatorParameter">LEAP parameter: </label>
        <select name="indicatorParameter" required id="indicatorParameter" defaultValue={currentGoal?.indicatorParameter || undefined}>
          <option value="">Välj indikatorparameter</option>
          <option value="Test">Indikatorparameter 1</option>
          <option value="Thing">Indikatorparameter 2</option>
          <option value="A\B">Indikatorparameter 3</option>
        </select>
        <br />
        <label htmlFor="dataUnit">Enhet för dataserie: </label>
        <input type="text" name="dataUnit" required id="dataUnit" defaultValue={currentGoal?.dataSeries.unit} />
        <br />
        <details>
          <summary>
            Extra information om dataserie
          </summary>
          <p>
            Fältet &quot;Dataserie&quot; tar emot en serie värden separerade med semikolon eller tab, vilket innebär att du kan klistra in en serie värden från Excel eller liknande.<br />
            <strong>OBS: Värden får inte vara separerade med komma (&quot;,&quot;).</strong><br />
            Decimaltal kan använda antingen decimalpunkt eller decimalkomma.<br />
            Det första värdet representerar år 2020 och serien kan fortsätta maximalt till år 2050 (totalt 31 värden).<br />
            Om värden saknas för ett år kan du lämna det tomt, exempelvis kan &quot;;1;;;;5&quot; användas för att ange värdena 1 och 5 för år 2021 och 2025.
          </p>
        </details>
        <label htmlFor="dataSeries">Dataserie: </label>
        {/* TODO: Make this allow .csv files, and do parsing stuff and forced format if text */}
        <input type="text" name="dataSeries" required id="dataSeries"
          pattern={dataSeriesPattern}
          title="Använd numeriska värden separerade med semikolon eller tab. Decimaltal kan använda antingen punkt eller komma."
          defaultValue={dataSeriesString}
        />
        <br />
        {/* This functionality is temporarily or permanently disabled */}
        {/* <label htmlFor="dataSeriesId">Alternativt, välj en dataserie från listan: </label> */}
        {/* TODO: Make this a dropdown with options from the database and proper IDs as values */}
        {/* <select name="dataSeriesId" required={false} id="dataSeriesId">
          <option value={0}>Ingen dataserie</option>
          <option value="1">Dataserie 1</option>
          <option value="2">Dataserie 2</option>
          <option value="3">Dataserie 3</option>
        </select>
        <br /> */}
        { // Only show the access selector if a new goal is being created, the user is an admin, or the user is the author of the goal.
          (!currentGoal || user?.isAdmin || currentGoal.authorId === user?.id) &&
          <>
            <AccessSelector groupOptions={user?.userGroups || []} currentAccess={currentAccess} />
            <br />
          </>
        }
        <input type="submit" value="Skapa målbana" />
        <Tooltip anchorSelect="#goalObject">
          Målobjektet är den som &quot;äger&quot; ett mål, exempelvis en kommun, region eller organisation.
        </Tooltip>
      </form>
    </>
  )
}