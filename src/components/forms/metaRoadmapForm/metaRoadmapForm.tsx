'use client'

import countiesAndMunicipalities from "@/lib/countiesAndMunicipalities.json" with { type: "json" }
import { LoginData } from "@/lib/session";
import { AccessControlled, MetaRoadmapInput } from "@/types";
import { MetaRoadmap, RoadmapType } from "@prisma/client";
import { useEffect, useState } from "react";
import { EditUsers, ViewUsers, getAccessData } from "@/components/forms/accessSelector/accessSelector";
import LinkInput, { getLinks } from "@/components/forms/linkInput/linkInput"
import formSubmitter from "@/functions/formSubmitter";
import styles from '../forms.module.css'
import FormWrapper from "../formWrapper";

export default function MetaRoadmapForm({
  user,
  userGroups,
  parentRoadmapOptions,
  currentRoadmap,
}: {
  user: LoginData['user'],
  userGroups: string[],
  parentRoadmapOptions?: MetaRoadmap[],
  currentRoadmap?: MetaRoadmap & AccessControlled,
}) {
  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    // Mostly the usual submit handler stuff.
    // We might want to redirect the user to the roadmap form immediately after successfully submitting the metaRoadmap form
    // (and pre-populate the roadmap form with the new metaRoadmap's ID)
    event.preventDefault();
    // Prevent double submission
    if (isLoading) return;
    setIsLoading(true);

    const form = event.target.elements;

    const links = getLinks(event.target);

    const { editUsers, viewUsers, editGroups, viewGroups } = getAccessData(
      form.namedItem("editUsers"),
      form.namedItem("viewUsers"),
      form.namedItem("editGroups"),
      form.namedItem("viewGroups")
    );

    const formData: MetaRoadmapInput & { id?: string, timestamp?: number } = {
      name: (form.namedItem("metaRoadmapName") as HTMLInputElement)?.value,
      description: (form.namedItem("description") as HTMLTextAreaElement)?.value,
      type: ((form.namedItem("type") as HTMLSelectElement)?.value as RoadmapType) || null,
      actor: (form.namedItem("actor") as HTMLInputElement)?.value || null,
      editors: editUsers,
      viewers: viewUsers,
      editGroups,
      viewGroups,
      isPublic: (form.namedItem("isPublic") as HTMLInputElement)?.checked || false,
      links,
      parentRoadmapId: (form.namedItem("parentRoadmap") as HTMLSelectElement)?.value || undefined,
      id: currentRoadmap?.id || undefined,
      timestamp,
    };

    const formJSON = JSON.stringify(formData);

    formSubmitter('/api/metaRoadmap', formJSON, currentRoadmap ? 'PUT' : 'POST', setIsLoading);
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const timestamp = Date.now()

  const customRoadmapTypes = {
    [RoadmapType.NATIONAL]: 'Nationell färdplan',
    [RoadmapType.REGIONAL]: 'Regional färdplan',
    [RoadmapType.MUNICIPAL]: 'Kommunal färdplan',
    [RoadmapType.LOCAL]: 'Lokal färdplan',
    [RoadmapType.OTHER]: 'Övrig färdplan, exempelvis för en organisation'
  }

  let currentAccess: AccessControlled | undefined = undefined;
  if (currentRoadmap) {
    currentAccess = {
      author: currentRoadmap.author,
      editors: currentRoadmap.editors,
      viewers: currentRoadmap.viewers,
      editGroups: currentRoadmap.editGroups,
      viewGroups: currentRoadmap.viewGroups,
      isPublic: currentRoadmap.isPublic,
    }
  }


  return (
    <>
      <form onSubmit={handleSubmit} >
        {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new entries in AccessSelector (for example, when pressing enter to add someone to the list of editors) */}
        <input type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />

        <FormWrapper>
          <fieldset className="width-100">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '0' }}>Beskriv din färdplan</h2>
              <p style={{ marginTop: '.25rem' }}>Ge din färdplan ett namn och en beskrivning.</p>
            </div>
            <label className="block margin-y-100">
              Namn för den nya färdplanen
              <input id="metaRoadmapName" name="metaRoadmapName" className="margin-y-25" type="text" defaultValue={currentRoadmap?.name ?? undefined} required />
            </label>

            <label className="block margin-y-100">
              Beskrivning av färdplanen
              <textarea className="block smooth margin-y-25" name="description" id="description" defaultValue={currentRoadmap?.description ?? undefined} required></textarea>
            </label>
          </fieldset>

          <fieldset className="width-100">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '0' }}>Vem ansvarar för den här färdplanen?</h2>
              <p style={{ marginTop: '.25rem' }}>Beskriv vem som ansvarar för färdplanen genom att välja en typ och en aktör. </p>
            </div>
            <label className="block margin-y-100">
              Typ av färdplan
              <select className="block margin-y-25" name="type" id="type" defaultValue={currentRoadmap?.type ?? ""} required>
                <option value="">Välj en typ</option>
                {
                  Object.values(RoadmapType).map((value) => {
                    if (value == RoadmapType.NATIONAL && !user?.isAdmin) return null;
                    return (
                      <option key={value} value={value}>{value in customRoadmapTypes ? customRoadmapTypes[value] : value}</option>
                    )
                  })
                }
              </select>
            </label>

            <label className="block margin-y-100">
              Aktör för färdplanen
              <input className="margin-y-25" list="actors" id="actor" name="actor" type="text" defaultValue={currentRoadmap?.actor ?? undefined} />
            </label>
          </fieldset>

          <fieldset className="width-100">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '0' }}>Är färdplanen beroende av några externa resurser?</h2>
              <p style={{ marginTop: '.25rem' }}>
                Om färdplanen är associerad med några utomstående resurser såsom externa textdokument eller
                hemsidor är det möjligt länka till dessa här.
              </p>
            </div>
            <LinkInput />
          </fieldset>

          {(!currentRoadmap || user?.isAdmin || user?.id === currentRoadmap.authorId) &&
            <fieldset className="width-100">
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '0' }}>Vem ska kunna se denna färdplan?</h2>
                <p style={{ marginTop: '.25rem' }}>
                  Fyll i vilka grupper eller personer som ska kunna se denna färdplan.
                </p>
              </div>
              <ViewUsers groupOptions={userGroups} /> {/*TODO: other params? */}
            </fieldset>
          }


          {(!currentRoadmap || user?.isAdmin || user?.id === currentRoadmap.authorId) &&
            <fieldset className="width-100">
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '0' }}>Vem ska kunna redigera färdplanen?</h2>
                <p style={{ marginTop: '.25rem' }}>
                  Fyll i vilka grupper eller personer som ska kunna redigera denna färdplan.
                </p>
              </div>
              <EditUsers groupOptions={userGroups} /> {/*TODO: other params? */}
            </fieldset>
          }

          <fieldset className="width-100">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '0' }}>Jobbar denna färdplan mot en annan färdplan?</h2>
              <p style={{ marginTop: '.25rem' }}>
                Fyll om denna färdplan jobbar mot en annan färdplan.
              </p>
            </div>
            <label className="block margin-y-100">
              Förälder
              <select name="parentRoadmap" id="parentRoadmap" className="block margin-y-25" defaultValue={currentRoadmap?.parentRoadmapId ?? ""}>
                <option value="">Ingen förälder vald</option>
                {
                  !parentRoadmapOptions && currentRoadmap && currentRoadmap.parentRoadmapId && (
                    <option value={currentRoadmap.parentRoadmapId} disabled>{currentRoadmap.parentRoadmapId}</option>
                  )
                }
                {
                  parentRoadmapOptions && parentRoadmapOptions.map((roadmap) => {
                    return (
                      <option key={roadmap.id} value={roadmap.id}>{roadmap.name}</option>
                    )
                  })
                }
              </select>
            </label>
          </fieldset>
        </FormWrapper>


        {/* Add copy of RoadmapForm? Only if we decide to include it immediately rather than redirecting to it */}

        <button type="submit" id="submit-button" value={currentRoadmap ? "Spara" : "Skapa färdplan"} disabled
          className={`${styles.submitButton} seagreen color-purewhite round block`} style={{ marginInline: 'auto', width: 'min(25ch, 100%)', fontSize: '1rem' }}>
          {currentRoadmap ? "Spara" : "Skapa färdplan"}
        </button>
      </form>

      <datalist id="actors">
        {
          Object.entries(countiesAndMunicipalities).flat(2).map((actor, index) => {
            return (
              <option key={`${actor}${index}`} value={actor} />
            )
          })
        }
      </datalist>
    </>
  )
}