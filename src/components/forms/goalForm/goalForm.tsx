'use client'

import parameterOptions from "@/lib/LEAPList.json" with { type: "json" }
import { dataSeriesDataFieldNames } from "@/types"
import { DataSeries, Goal } from "@prisma/client"
import LinkInput, { getLinks } from "@/components/forms/linkInput/linkInput"

export default function GoalForm({
  roadmapId,
  currentGoal,
}: {
  roadmapId: string,
  currentGoal?: Goal &
  { dataSeries: DataSeries | null } &
  { author: { id: string, username: string } } &
  { links?: { url: string, description: string | null }[] } &
  { roadmap: { id: string } },
}) {
  // Submit the form to the API
  function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.target.elements

    const links = getLinks(event.target)

    // Convert the data series to an array of numbers, the actual parsing is done by the API
    const dataSeriesInput = (form.namedItem("dataSeries") as HTMLInputElement)?.value
    const dataSeries = dataSeriesInput.replaceAll(',', '.').split(/[\t;]/).map((value) => {
      return value
    })

    const formJSON = JSON.stringify({
      name: (form.namedItem("goalName") as HTMLInputElement)?.value || null,
      description: (form.namedItem("description") as HTMLInputElement)?.value || null,
      indicatorParameter: (form.namedItem("indicatorParameter") as HTMLInputElement)?.value || null,
      dataUnit: (form.namedItem("dataUnit") as HTMLInputElement)?.value || null,
      dataSeries: dataSeries,
      roadmapId: roadmapId,
      goalId: currentGoal?.id || null,
      links,
      timestamp,
    })

    fetch('/api/createGoal', {
      // If a goal is being edited, use PUT instead of POST
      method: currentGoal ? 'PUT' : 'POST',
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
      window.location.href = `/roadmap/${roadmapId}/goal/${data.id}`
    }).catch((err) => {
      alert(`Målbana kunde inte skapas.\nAnledning: ${err.message}`)
    })
  }

  // The amount of years in the data series
  const dataSeriesLength = dataSeriesDataFieldNames.length
  /**
   * This matches 0 to `dataSeriesLength` numbers separated by tabs or semicolons, with an optional decimal part.
   * The first position represents the value for the first year (currently 2020), and any number in the `dataSeriesLength`:th position
   * represents the value for the last year (currently 2050).
   * 
   * Two examle strings that match this pattern are:  
   * "2.0;2.1;2.2;2.3;2.4;2.5;2.6;2.7;2.8;2.9;3.0;3.1;3.2;3.3;3.4;3.5;3.6;3.7;3.8;3.9;4.0;4.1;4.2;4.3;4.4;4.5;4.6;4.7;4.8;4.9;5.0"  
   * and  
   * ";0;;;4;1"
   */
  const dataSeriesPattern = `(([0-9]+([.,][0-9]+)?)?[\t;]){0,${dataSeriesLength - 1}}([0-9]+([.,][0-9]+)?)?`

  const timestamp = Date.now();

  // If there is a data series, convert it to an array of numbers to use as a default value for the form
  let dataArray: (number | null)[] = []
  if (currentGoal?.dataSeries) {
    for (let i in currentGoal.dataSeries) {
      // All keys in dataSeries containing numbers are part of the data series itself and should be fine to push to the array
      if (i.match(/[0-9]+/)) {
        // This line *should* start complaining if we add any keys to DataSeries that are not part of the data series, unless the value is a number
        dataArray.push(currentGoal.dataSeries[i as keyof Omit<DataSeries, 'unit' | 'scale' | 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'goalId'>])
      }
    }
  }
  const dataSeriesString = dataArray.join(';')

  return (
    <>
      <form onSubmit={handleSubmit} className="action-form">
        {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new entries in AccessSelector (for example, when pressing enter to add someone to the list of editors) */}
        <button type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />
        <label htmlFor="goalName">Namn på målbanan: </label>
        <input type="text" name="goalName" id="goalName" defaultValue={currentGoal?.name ?? undefined} />
        <br />
        <label htmlFor="description">Beskrivning av målbanan: </label>
        <input type="text" name="description" id="description" defaultValue={currentGoal?.description ?? undefined} />
        <br />
        <label htmlFor="indicatorParameter">LEAP parameter: </label>
        <input type="text" list="LEAPOptions" name="indicatorParameter" required id="indicatorParameter" defaultValue={currentGoal?.indicatorParameter || undefined} />
        <br />
        <label htmlFor="dataUnit">Enhet för dataserie: </label>
        <input type="text" name="dataUnit" required id="dataUnit" defaultValue={currentGoal?.dataSeries?.unit} />
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
        {/* TODO: Make this allow .csv files and possibly excel files */}
        <input type="text" name="dataSeries" required id="dataSeries"
          pattern={dataSeriesPattern}
          title="Använd numeriska värden separerade med semikolon eller tab. Decimaltal kan använda antingen punkt eller komma."
          defaultValue={dataSeriesString}
        />
        <br />
        <LinkInput links={currentGoal?.links} />
        <br />
        <input type="submit" value={currentGoal ? "Spara" : "Skapa målbana"} className="call-to-action-primary" />
      </form>

      <datalist id="LEAPOptions">
        {/* Use all unique entries as suggestions for indicator parameter */}
        {parameterOptions.filter((option, index, self) => {
          return self.indexOf(option) === index
        }).map((option, index) => {
          return (
            <option key={`${option}${index}`} value={option} />
          )
        })}
      </datalist>
    </>
  )
}