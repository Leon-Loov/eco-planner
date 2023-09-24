'use client'

import AccessSelector from "@/components/accessSelector"
import Tooltip from "@/lib/tooltipWrapper"

export default function CreateGoal({ roadmapId, userGroups }: { roadmapId: string, userGroups: string[] }) {
  // Submit the form to the API
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    const formJSON = JSON.stringify({
      name: form.goalName.value,
      goalObject: form.goalObject.value,
      nationalRoadmapId: form.nationalRoadmapId.value,
      indicatorParameter: form.indicatorParameter.value,
      dataUnit: form.dataUnit.value,
      dataSeries: form.dataSeries.value,
      dataSeriesId: form.dataSeriesId.value,
      roadmapId: roadmapId,
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />
        <label htmlFor="goalName">Namn på målbanan: </label>
        <input type="text" name="goalName" required={true} id="goalName" />
        <br />
        <label htmlFor="goalObject">Målobjekt: </label>
        <input type="text" name="goalObject" required={true} />
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
        <select name="indicatorParameter" required={true} id="indicatorParameter">
          <option value="Test">Indikatorparameter 1</option>
          <option value="Thing">Indikatorparameter 2</option>
          <option value="A\B">Indikatorparameter 3</option>
        </select>
        <br />
        <label htmlFor="dataUnit">Enhet för dataserie: </label>
        <input type="text" name="dataUnit" required={true} id="dataUnit" />
        <br />
        <label htmlFor="dataSeries">Dataserie: </label>
        {/* TODO: Make this allow .csv files, and do parsing stuff and forced format if text */}
        <input type="text" name="dataSeries" required={false} id="dataSeries" />
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
        <Tooltip anchorSelect="#goalObject, label[for=goalObject]">
          Målobjektet är den som &quot;äger&quot; ett mål, exempelvis en kommun, region eller organisation.
        </Tooltip>
        <Tooltip anchorSelect="#dataSeries, label[for=dataSeries]">
          Du kan klistra in en serie värden separerade med mellanslag (&quot; &quot;), semikolon (&quot;;&quot;) eller tab (&quot;&emsp;&quot;).<br />
          <strong>OBS: Inklistrade värden får inte vara separerade med komma (&quot;,&quot;).</strong><br />
          Decimaltal kan använda antingen decimalpunkt eller decimalkomma.<br />
          Det första värdet representerar år 2020 och serien kan fortsätta maximalt till år 2050 (totalt 31 värden).<br />
          Om värden saknas för ett år kan du lämna det tomt, exempelvis kan &quot;;1;;;;5&quot; användas för att ange värdena 1 och 5 för år 2021 och 2025.
        </Tooltip>
      </form>
    </>
  )
}