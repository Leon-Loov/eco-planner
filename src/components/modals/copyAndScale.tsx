'use client';

import { DataSeries, Goal } from "@prisma/client";
import Image from "next/image";
import { closeModal, openModal } from "./modalFunctions";
import { useEffect, useRef, useState } from "react";
import getRoadmaps from "@/fetchers/getRoadmaps";
import { Data } from "@/lib/session";

export default function CopyAndScale({
  goal,
  user,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  user: Data["user"],
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapOptions, setRoadmapOptions] = useState<{ id: string, name: string, version: number }[]>([]);

  const modalRef = useRef<HTMLDialogElement | null>(null);

  // Get list of roadmaps user can add a copy of the goal to on mount
  useEffect(() => {
    getRoadmaps().then(roadmaps => {
      // Select only roadmaps user ha edit access to
      return roadmaps.filter(roadmap => {
        // There is an additional check in the API, so it's fine even if the user edits their client-side code
        if (user?.isAdmin) return true;
        if (roadmap.authorId === user?.id) return true;
        if (roadmap.editors.some(editor => editor.id === user?.id)) return true;
        if (roadmap.editGroups.some(editGroup => user?.userGroups.some(userGroup => userGroup === editGroup.name))) return true;
        return false;
      });
    }).then(roadmaps => {
      setRoadmapOptions(roadmaps.map(roadmap => ({ id: roadmap.id, name: roadmap.metaRoadmap.name, version: roadmap.version })));
    }).catch(error => {
      console.error("Error getting roadmaps", error);
      setRoadmapOptions([{ id: "error", name: "Error getting roadmaps", version: 0 }]);
    });
  }, [user]);

  return (
    <>
      <button type="button" className="call-to-action-primary margin-y-200" style={{ width: 'fit-content' }} onClick={() => openModal(modalRef)}>Kopiera målbanan till en annan färdplan och skala den</button>
      <dialog ref={modalRef} aria-modal>
        <div className={`display-flex flex-direction-row-reverse align-items-center justify-content-space-between`}>
          <button disabled={isLoading} onClick={() => closeModal(modalRef)} autoFocus aria-label="Close" >
            <Image src='/icons/close.svg' alt="" width={18} height={18} />
          </button>
          <h2>Kopiera och skala</h2>
        </div>
        <p>Kopiera och skala målbanan {goal.name}</p>
        <label htmlFor="copyTo">Under vilken färdplan vill du skapa en kopia av målbanan?</label>
        <select name="copyTo" id="copyTo">
          <option value="">Välj färdplan</option>
          {roadmapOptions.map(roadmap => (
            <option key={roadmap.id} value={roadmap.id}>{`${roadmap.name} ${roadmap.version ? `(version ${roadmap.version.toString()})` : null}`}</option>
          ))}
        </select>
      </dialog>
    </>
  )
}