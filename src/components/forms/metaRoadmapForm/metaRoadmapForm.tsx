'use client'

import countiesAndMunicipalities from "@/lib/countiesAndMunicipalities.json" with { type: "json" }
import { Data } from "@/lib/session";
import { AccessControlled, MetaRoadmapInput } from "@/types";
import { MetaRoadmap, RoadmapType } from "@prisma/client";
import { useState } from "react";
import AccessSelector, { getAccessData } from "@/components/forms/accessSelector/accessSelector";
import LinkInput, { getLinks } from "@/components/forms/linkInput/linkInput"
import formSubmitter from "@/functions/formSubmitter";

export default function MetaRoadmapForm({
  user,
  userGroups,
  parentRoadmapOptions,
  currentRoadmap,
}: {
  user: Data['user'],
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
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new entries in AccessSelector (for example, when pressing enter to add someone to the list of editors) */}
        <input type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />

        <label htmlFor="metaRoadmapName">Namn för den nya färdplanen</label>
        <input id="metaRoadmapName" name="metaRoadmapName" type="text" defaultValue={currentRoadmap?.name ?? undefined} required />

        <label htmlFor="description">Beskrivning av färdplanen</label>
        <textarea name="description" id="description" defaultValue={currentRoadmap?.description ?? undefined} required></textarea>

        <label htmlFor="type">Typ av färdplan</label>
        <select name="type" id="type" defaultValue={currentRoadmap?.type ?? ""} required>
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

        <label htmlFor="actor">Aktör för färdplanen</label>
        <input list="actors" id="actor" name="actor" type="text" defaultValue={currentRoadmap?.actor ?? undefined} />

        <div className="margin-y-300">
          <LinkInput />
        </div>

        { // Only show the access selector if a new roadmap is being created, the user is an admin, or the user is the author of the roadmap
          (!currentRoadmap || user?.isAdmin || user?.id === currentRoadmap.authorId) &&
          <>
            <AccessSelector groupOptions={userGroups} currentAccess={currentAccess} />
          </>
        }

        <label htmlFor="parentRoadmap">Om denna färdplan har en annan färdplan den jobbar mot kan den väljas här</label>
        <select name="parentRoadmap" id="parentRoadmap" defaultValue={currentRoadmap?.parentRoadmapId ?? ""}>
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
        {/* Add copy of RoadmapForm? Only if we decide to include it immediately rather than redirecting to it */}
        <input type="submit" value={currentRoadmap ? "Spara" : "Skapa färdplan"} className="margin-y-100 seagreen color-purewhite" />
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