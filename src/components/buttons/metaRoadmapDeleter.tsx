'use client';

import getOneMetaRoadmap from "@/fetchers/getOneMetaRoadmap";
import { useRef } from "react";
import ConfirmDelete from "../modals/confirmDelete";
import { openModal } from "../modals/modalFunctions";

export default function MetaRoadmapDeleter({ metaRoadmap }: { metaRoadmap: NonNullable<Awaited<ReturnType<typeof getOneMetaRoadmap>>> }) {
  const deletionRef = useRef<HTMLDialogElement | null>(null);
  return (
    <>
      <button type="button" className="red color-purewhite" onClick={() => openModal(deletionRef)}>Ta bort metadata</button>
      <ConfirmDelete modalRef={deletionRef} targetUrl={`/api/metaRoadmap`} targetName={metaRoadmap.name} targetId={metaRoadmap.id} />
    </>
  )
}