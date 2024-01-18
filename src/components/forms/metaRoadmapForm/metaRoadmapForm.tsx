'use client'

import { Data } from "@/lib/session";
import { AccessControlled, MetaRoadmapInput } from "@/types";
import { MetaRoadmap, RoadmapType } from "@prisma/client";
import { useState } from "react";
import { getAccessData } from "@/components/forms/accessSelector/accessSelector";
import LinkInput, { getLinks } from "@/components/forms/linkInput/linkInput"

export default function MetaRoadmapForm({
  user,
  userGroups,
  currentRoadmap,
}: {
  user: Data['user'],
  userGroups: string[],
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

    let formData: MetaRoadmapInput & { id?: string, timestamp?: number } = {
      name: (form.namedItem("metaRoadmapName") as HTMLInputElement)?.value,
      description: (form.namedItem("description") as HTMLInputElement)?.value,
      type: ((form.namedItem("type") as HTMLSelectElement)?.value as RoadmapType) || undefined,
      actor: (form.namedItem("actor") as HTMLInputElement)?.value || undefined,
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

    fetch('/api/metaRoadmap', {
      // If a metaRoadmap is being edited, use PUT instead of POST
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
      // TODO: Update this when changing folder structure
      setIsLoading(false)
      window.location.href = `/roadmap/createRoadmap?metaRoadmapId=${data.id}`
    }).catch((err) => {
      setIsLoading(false)
      alert(`Färdplan kunde inte skapas.\nAnledning: ${err.message}`)
    });
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const timestamp = Date.now()

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* This hidden submit button prevents submitting by pressing enter, this avoids accidental submission when adding new entries in AccessSelector (for example, when pressing enter to add someone to the list of editors) */}
        <input type="submit" disabled={true} style={{ display: 'none' }} aria-hidden={true} />
        {/* Name input (required) */}
        {/* Description input (required) */}
        {/* type selector (using the `RoadmapType` enum) */}
        {/* Actor input (with datalist) */}
        {/* `LinkInput` */}
        {/* `AccessSelector` */}
        {/* Selector for a parent meta roadmap */}
        {/* Copy of RoadmapForm? Only if we decide to include it immediately rather than redirecting to it */}
      </form>
    </>
  )
}