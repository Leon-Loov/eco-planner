'use client'

import AccessSelector, { getAccessData } from "@/components/accessSelector"
import Tooltip from "@/lib/tooltipWrapper"

export default function CreateGoal({ roadmapId, userGroups }: { roadmapId: string, userGroups: string[] }) {
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
      name: (form.namedItem("goalName") as HTMLInputElement)?.value,
      goalObject: (form.namedItem("goalObject") as HTMLInputElement)?.value,
      nationalRoadmapId: (form.namedItem("nationalRoadmapId") as HTMLInputElement)?.value,
      indicatorParameter: (form.namedItem("indicatorParameter") as HTMLInputElement)?.value,
      dataUnit: (form.namedItem("dataUnit") as HTMLInputElement)?.value,
      dataSeries: (form.namedItem("dataSeries") as HTMLInputElement)?.value,
      // This functionality is temporarily or permanently disabled
      // dataSeriesId: (form.namedItem("dataSeriesId") as HTMLInputElement)?.value,
      roadmapId: roadmapId,
      editors: editUsers,
      viewers: viewUsers,
      editGroups,
      viewGroups,
    })

    fetch('/api/createGoal', {
      method: 'POST',
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />
        <label htmlFor="goalName">Namn på målbanan: </label>
        <input type="text" name="goalName" required id="goalName" />
        <br />
        <label htmlFor="goalObject">Målobjekt: </label>
        <input type="text" name="goalObject" required title="Målobjektet är den som &quot;äger&quot; ett mål, exempelvis en kommun, region eller organisation." id="goalObject" />
        <br />
        <label htmlFor="nationalRoadmapId">Nationell målbana denna är baserad på (om någon): </label>
        {/* TODO: Make this a dropdown with options from the database and proper IDs as values */}
        <select name="nationalRoadmapId" required={false} id="nationalRoadmapId">
          <option value={0}>Ingen nationell målbana</option>
          <option value="1">Nationell målbana 1</option>
          <option value="2">Nationell målbana 2</option>
          <option value="3">Nationell målbana 3</option>
        </select>
        <br />
        {/* TODO: Make this a dropdown with actual indicator parameters, plus a 'custom' option that allows typing in a custom parameter */}
        <label htmlFor="indicatorParameter">LEAP parameter: </label>
        <select name="indicatorParameter" required id="indicatorParameter">
          <option value="">Välj indikatorparameter</option>
          <option value="Test">Indikatorparameter 1</option>
          <option value="Thing">Indikatorparameter 2</option>
          <option value="A\B">Indikatorparameter 3</option>
        </select>
        <br />
        <label htmlFor="dataUnit">Enhet för dataserie: </label>
        <input type="text" name="dataUnit" required id="dataUnit" />
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
          style={{ width: 'auto' }}
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
        <AccessSelector groupOptions={userGroups} />
        <br />
        <input type="submit" value="Skapa målbana" />
        <Tooltip anchorSelect="#goalObject">
          Målobjektet är den som &quot;äger&quot; ett mål, exempelvis en kommun, region eller organisation.
        </Tooltip>
      </form>
    </>
  )
}