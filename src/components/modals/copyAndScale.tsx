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

enum ScaleMethod {
  Algebraic = "ALGEBRAIC",
  Geometric = "GEOMETRIC",
  Multiplicative = "MULTIPLICATIVE",
}

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
  const [scalingMethod, setScalingMethod] = useState<ScaleMethod>(ScaleMethod.Geometric);

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

  function formSubmission(form: FormData) {
    setIsLoading(true);

    // If any of the inputs are files, throw. This will only happen if the user has tampered with the form, so no need to give a nice error message

    // Id of the roadmap to copy the goal to
    const copyToId = form.get("copyTo");
    if (copyToId instanceof File) {
      setIsLoading(false);
      throw new Error("Why is this a file?");
    }

    // Get the scaling factor
    const scalars = form.getAll("scaleFactor");
    const weights = form.getAll("weight");
    let scaleFactor: number = 1;
    let totalWeight: number;
    // If the input is a single value, use it as the scale factor
    if (scalars.length == 1) {
      if (scalars[0] instanceof File) {
        setIsLoading(false);
        throw new Error("Why is this a file?");
      }
      const tempScale = parseFloat(scalars[0].replace(",", "."));
      // If the value is a number, use it as the scale factor
      if (!isNaN(tempScale)) {
        scaleFactor = tempScale;
      };
    }
    // If there are multiple inputs, loop through them and calculate the weighted average of the scale factors
    // TODO: Add a toggle between weighted mean, product, and weighted geometric mean
    else if (scalars.length > 1) {
      switch (scalingMethod) {
        case ScaleMethod.Algebraic:
          totalWeight = 0;
          scaleFactor = 0;
          for (let i = 0; i < scalars.length; i++) {
            if (scalars[i] instanceof File || weights[i] instanceof File) {
              setIsLoading(false);
              throw new Error("Why is this a file?");
            }

            const scalar: number = parseFloat((scalars[i] as string).replace(",", "."));
            const weight: number = parseFloat((weights[i] as string ?? "1").replace(",", "."));

            // If scalar is a number, multiply total scale factor with it
            // If weight is not a number, default to 1 (but allow 0 to be used as a weight)
            if (!isNaN(scalar)) {
              if (!isNaN(weight)) {
                totalWeight += weight;
                scaleFactor += scalar * weight;
              } else {
                totalWeight += 1;
                scaleFactor += scalar * 1;
              }
            }
          }
          // If the total weight is not 0, divide the scale factor by it to get the weighted average
          if (totalWeight != 0) {
            scaleFactor /= totalWeight;
          }
          break;
        case ScaleMethod.Multiplicative:
          scaleFactor = 1;
          for (let i = 0; i < scalars.length; i++) {
            if (scalars[i] instanceof File) {
              setIsLoading(false);
              throw new Error("Why is this a file?");
            }

            const scalar: number = parseFloat((scalars[i] as string).replace(",", "."));

            // If scalar is a number, multiply total scale factor with it
            if (!isNaN(scalar)) {
              scaleFactor *= scalar;
            }
          }
          break;
        // Default to geometric scaling
        case ScaleMethod.Geometric:
        default:
          totalWeight = 0;
          scaleFactor = 1; // This initial value won't affect the result since it's the identity element for multiplication and it has no weight

          for (let i = 0; i < scalars.length; i++) {
            if (scalars[i] instanceof File || weights[i] instanceof File) {
              setIsLoading(false);
              throw new Error("Why is this a file?");
            }

            const scalar: number = parseFloat((scalars[i] as string).replace(",", "."));
            const weight: number = parseFloat((weights[i] as string ?? "1").replace(",", "."));

            // If scalar is a number, multiply total scale factor with it
            // If weight is not a number, default to 1 (but allow 0 to be used as a weight)
            if (!isNaN(scalar)) {
              if (!isNaN(weight)) {
                totalWeight += weight;
                scaleFactor *= Math.pow(scalar, weight);
              } else {
                totalWeight += 1;
                scaleFactor *= Math.pow(scalar, 1);
              }
            }
          }
          // Take the totalWeight-th root of the scale factor to get the weighted geometric mean
          // Will return NaN if the scale factor is negative before taking the root
          scaleFactor = Math.pow(scaleFactor, (1 / totalWeight));
          break;
      }
      // Don't proceed if the resultant scale factor is NaN, infinite, or non-numeric for some reason
      if (!Number.isFinite(scaleFactor)) {
        setIsLoading(false);
        alert("Felaktig inmatning. Skalningsfaktorn kunde inte beräknas. Ofta beror detta på ett ickenumeriskt värde i ett inmatningsfält eller att produkten av alla skalningsfaktorer är negativ.");
        return;
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
      roadmapId: copyToId ?? "",
    };

    const formJSON = JSON.stringify(formData);

    formSubmitter('/api/goal', formJSON, 'POST', setIsLoading);
  }

  return (
    <>
      <button type="button" className="transparent flex gap-50 padding-0" style={{fontSize: '1rem', fontWeight: '500'}} onClick={() => openModal(modalRef)}>
        Kopiera och skala målbana
        <Image src='/icons/copy.svg' alt="" width={24} height={24} />
      </button>
      <dialog ref={modalRef} aria-modal style={{border: '0', borderRadius: '.25rem', boxShadow: '0 0 .5rem -.25rem rgba(0,0,0,.25'}}>
        <div className={`display-flex flex-direction-row-reverse align-items-center justify-content-space-between`}>
          <button className="grid round padding-50 transparent" disabled={isLoading} onClick={() => closeModal(modalRef)} autoFocus aria-label="Close" >
            <Image src='/icons/close.svg' alt="" width={18} height={18} />
          </button>
          <h2 className="margin-0">Kopiera och skala</h2>
        </div>
        <p>Kopiera och skala målbanan {goal.name}</p>

        <form action={formSubmission}>
          <label className="margin-y-75">
            Under vilken färdplan vill du skapa en kopia av målbanan?
            <select className="block margin-y-25" required name="copyTo" id="copyTo">
              <option value="">Välj färdplan</option>
              {roadmapOptions.map(roadmap => (
                <option key={roadmap.id} value={roadmap.id}>{`${roadmap.name} ${roadmap.version ? `(version ${roadmap.version.toString()})` : null}`}</option>
              ))}
            </select>
          </label>

          {scalingComponents.map((id) => {
            return (
              <RepeatableScaling key={id} useWeight={scalingMethod != ScaleMethod.Multiplicative}> {/* Multiplicative scaling doesn't use weights */}
                <button type="button" onClick={() => setScalingComponents(scalingComponents.filter((i) => i !== id))}>Ta bort</button>
              </RepeatableScaling>
            )
          })}

          <fieldset className="margin-y-100">
            <legend>Välj skalningsmetod</legend>
            <label className="flex gap-25 align-items-center margin-y-50">
              <input type="radio" name="scalingMethod" value={ScaleMethod.Geometric} checked={scalingMethod === ScaleMethod.Geometric} onChange={() => setScalingMethod(ScaleMethod.Geometric)} />
              Geometriskt genomsnitt
            </label>
            <label className="flex gap-25 align-items-center margin-y-50">
              <input type="radio" name="scalingMethod" value={ScaleMethod.Algebraic} checked={scalingMethod === ScaleMethod.Algebraic} onChange={() => setScalingMethod(ScaleMethod.Algebraic)} />
              Algebraiskt genomsnitt
            </label>
            <label className="flex gap-25 align-items-center margin-y-50">
              <input type="radio" name="scalingMethod" value={ScaleMethod.Multiplicative} checked={scalingMethod === ScaleMethod.Multiplicative} onChange={() => setScalingMethod(ScaleMethod.Multiplicative)} />
              Multiplikativ skalning
            </label>
          </fieldset>

          <button type="button" className="margin-y-100" onClick={() => setScalingComponents([...scalingComponents, (crypto?.randomUUID() || Math.random().toString())])}>Lägg till skalning</button>
          <input type="submit" value="Skapa skalad kopia" />
        </form>
      </dialog>
    </>
  )
}