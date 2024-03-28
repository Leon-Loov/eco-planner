'use client';

import { DataSeries, Goal } from "@prisma/client";
import Image from "next/image";
import { closeModal, openModal } from "./modalFunctions";
import { useEffect, useRef, useState } from "react";
import getRoadmaps from "@/fetchers/getRoadmaps";
import { Data } from "@/lib/session";
import RepeatableScaling from "../repeatableScaling";
import { GoalInput, dataSeriesDataFieldNames } from "@/types";
import formSubmitter from "@/functions/formSubmitter";

export default function CopyAndScale({
  goal,
  user,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  user: Data["user"],
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapOptions, setRoadmapOptions] = useState<{ id: string, name: string, version: number, actor: string | null }[]>([]);
  const [scalingComponents, setScalingComponents] = useState<string[]>([crypto?.randomUUID() || Math.random().toString()]);

  const modalRef = useRef<HTMLDialogElement | null>(null);

  // Get list of roadmaps user can add a copy of the goal to
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
      setRoadmapOptions(roadmaps.map(roadmap => ({ id: roadmap.id, name: roadmap.metaRoadmap.name, version: roadmap.version, actor: roadmap.metaRoadmap.actor })));
    }).catch(error => {
      console.error("Error getting roadmaps", error);
      setRoadmapOptions([{ id: "error", name: "Error getting roadmaps", version: 0, actor: null }]);
    });
  }, [user]);

  function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const form = event.target.elements;

    // Id of the roadmap to copy the goal to
    const copyToId = (form.namedItem("copyTo") as HTMLSelectElement).value;

    // Get the scaling factor
    const scalars = form.namedItem("scaleFactor");
    let scaleFactor: number = 1;
    if (scalars instanceof HTMLInputElement && scalars.value) {
      scaleFactor = parseFloat((scalars as HTMLInputElement).value);
    } else if (scalars instanceof NodeList && scalars.length > 0) {
      for (const i of scalars) {
        if (i instanceof HTMLInputElement && i.value) {
          scaleFactor *= parseFloat(i.value);
        }
      }
    }

    // Get the data series from current goal
    const dataSeries: string[] = [];
    for (const i of dataSeriesDataFieldNames) {
      const value = goal.dataSeries?.[i];
      if (value == undefined) {
        dataSeries.push("");
      } else {
        dataSeries.push((value * scaleFactor).toString());
      }
    }

    const formData: GoalInput & { roadmapId: string } = {
      name: goal.name,
      description: goal.description,
      indicatorParameter: goal.indicatorParameter,
      dataUnit: goal.dataSeries?.unit || "missing",
      dataScale: goal.dataSeries?.scale || undefined,
      dataSeries: dataSeries,
      roadmapId: copyToId,
    };

    const formJSON = JSON.stringify(formData);

    formSubmitter('/api/goal', formJSON, 'POST', setIsLoading);
  }

  // Might use for keys for repeatableScaling
  // const uuid = crypto?.randomUUID() || Math.random().toString();

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
        <form onSubmit={handleSubmit}>
          <label htmlFor="copyTo">Under vilken färdplan vill du skapa en kopia av målbanan?</label>
          <select required name="copyTo" id="copyTo">
            <option value="">Välj färdplan</option>
            {roadmapOptions.map(roadmap => (
              <option key={roadmap.id} value={roadmap.id}>{`${roadmap.name} ${roadmap.version ? `(version ${roadmap.version.toString()})` : null}`}</option>
            ))}
          </select>
          <br />
          {scalingComponents.map((id) => {
            return (
              <RepeatableScaling key={id}>
                <button type="button" onClick={() => setScalingComponents(scalingComponents.filter((i) => i !== id))}>Ta bort</button>
              </RepeatableScaling>
            )
          })}
          <br />
          <button type="button" onClick={() => setScalingComponents([...scalingComponents, (crypto?.randomUUID() || Math.random().toString())])}>Lägg till skalning</button>
          <br />
          <input type="submit" value="Skapa skalad kopia" />
        </form>
      </dialog>
    </>
  )
}