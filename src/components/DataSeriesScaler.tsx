'use client';

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import areaCodes from "@/lib/areaCodes.json" with { type: "json" };
import { areaSorter } from "@/lib/sorters";
import scbPopulationQuery from "@/lib/scbPopulationQuery";
import scbAreaQuery from "@/lib/scbAreaQuery";
import scaleDataSeries from "@/functions/scaleDataSeries";

export default function DataSeriesScaler({ dataSeriesId }: { dataSeriesId: string }) {
  enum ScaleBy {
    Custom = "CUSTOM",
    Inhabitants = "INHABITANTS",
    Area = "AREA",
  }
  let modal = useRef<HTMLDialogElement | null>(null);

  const [scaleBy, setScaleBy] = useState<ScaleBy | "">("");
  const [value1, setValue1] = useState<number | undefined>(undefined);
  const [area1, setArea1] = useState<string | undefined>(undefined);
  const [value2, setValue2] = useState<number | undefined>(undefined);
  const [area2, setArea2] = useState<string | undefined>(undefined);
  const [value3, setValue3] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Sets resulting scale 
  useEffect(() => {
    if (value1 && value2) {
      setValue3(value2 / value1);
    }
    else {
      setValue3(undefined);
    }
  }, [value1, value2]);

  const openModal = () => {
    modal.current?.showModal();
  }

  const closeModal = () => {
    modal.current?.close();
  }

  async function doScaling() {
    setIsLoading(true);
    const scalar = value3 ?? 1;
    const result = await scaleDataSeries(dataSeriesId, scalar);
    if (!result) {
      alert(`Värdena har uppdaterats. Om det var ett misstag kan du skala med värdet ${1 / scalar} för att få värden nära de ursprungliga.`);
      setIsLoading(false);
      closeModal();
      window.location.reload();
    }
    else {
      alert(`Ett fel uppstod: ${result}`);
      setIsLoading(false);
      closeModal();
    }
  }

  async function getValue(e: ChangeEvent<HTMLSelectElement>) {
    const areaCode = e.target.value;
    let value: number | undefined = undefined;
    if (!areaCode) {
      return undefined;
    }
    switch (scaleBy) {
      case ScaleBy.Inhabitants:
        setIsLoading(true);
        value = parseFloat((await scbPopulationQuery(areaCode))?.population ?? "0");
        setIsLoading(false);
        return value;
        break;
      case ScaleBy.Area:
        setIsLoading(true);
        value = parseFloat((await scbAreaQuery(areaCode))?.area ?? "0");
        return value;
        break;
      default:
        return undefined;
    }
  }

  function SecondPart() {
    switch (scaleBy) {
      case ScaleBy.Custom:
        return (
          <div key={ScaleBy.Custom}>
            <label htmlFor="scaleFactor">Med vilket värde vill du skala?</label>
            <input required type="number" name="scaleFactor" id="scaleFactor" onBlur={(e) => setValue3(parseFloat(e.target.value))} />
          </div>
        );
      case ScaleBy.Inhabitants:
        return (
          <div key={ScaleBy.Inhabitants}>
            <label htmlFor="parentArea">Ursprungligt område, vanligtvis det större</label>
            <select required name="parentArea" id="parentArea" value={area1 ?? ""} onChange={(e) => { setArea1(e.target.value); getValue(e).then((result) => setValue1(result)) }}>
              <option value="">Välj område</option>
              {
                Object.entries(areaCodes).sort(areaSorter).map(([name, code]) => (
                  <option key={code} value={code}>{name}</option>
                ))
              }
            </select>
            <label htmlFor="parentAreaPopulation">Antal invånare: </label>
            <output name="parentAreaPopulation" id="parentAreaPopulation">{value1 ?? "Värde saknas"}</output>
            <label htmlFor="childArea">Nytt område, vanligtvis det mindre</label>
            <select required name="childArea" id="childArea" value={area2 ?? ""} onChange={(e) => { setArea2(e.target.value); getValue(e).then((result) => setValue2(result)) }}>
              <option value="">Välj område</option>
              {
                Object.entries(areaCodes).sort(areaSorter).map(([name, code]) => (
                  <option key={code} value={code}>{name}</option>
                ))
              }
            </select>
            <label htmlFor="childAreaPopulation">Antal invånare: </label>
            <output name="childAreaPopulation" id="childAreaPopulation">{value2 ?? "Värde saknas"}</output>
          </div>
        );
      case ScaleBy.Area:
        return (
          <div key={ScaleBy.Area}>
            <label htmlFor="parentArea">Ursprungligt område, vanligtvis det större</label>
            <select required name="parentArea" id="parentArea" value={area1 ?? ""} onChange={(e) => { setArea1(e.target.value); getValue(e).then((result) => setValue1(result)) }}>
              <option value="">Välj område</option>
              {
                Object.entries(areaCodes).sort(areaSorter).map(([name, code]) => (
                  <option key={code} value={code}>{name}</option>
                ))
              }
            </select>
            <label htmlFor="parentAreaArea">Ytarea: </label>
            <output name="parentAreaArea" id="parentAreaArea">{value1 ? `${value1} kvadratkilometer` : "Värde saknas"}</output>
            <label htmlFor="childArea">Nytt område, vanligtvis det mindre</label>
            <select required name="childArea" id="childArea" value={area2 ?? ""} onChange={(e) => { setArea2(e.target.value); getValue(e).then((result) => setValue2(result)) }}>
              <option value="">Välj område</option>
              {
                Object.entries(areaCodes).sort(areaSorter).map(([name, code]) => (
                  <option key={code} value={code}>{name}</option>
                ))
              }
            </select>
            <label htmlFor="childAreaArea">Ytarea: </label>
            <output name="childAreaArea" id="childAreaArea">{value2 ? `${value2} kvadratkilometer` : "Värde saknas"}</output>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <button type="button" className="call-to-action-primary margin-y-200" style={{width: 'fit-content'}} onClick={openModal}>Skala alla värden i serien</button>
      <dialog ref={modal} aria-modal>
        <div className={`display-flex flex-direction-row-reverse align-items-center justify-content-space-between`}>
          <button disabled={isLoading} onClick={closeModal} autoFocus aria-label="Close" >
            <Image src='/icons/close.svg' alt="" width={18} height={18} />
          </button>
          <h2>Skala värden i serien</h2>
        </div>
        <label htmlFor="scaleBy">Vad vill du skala värdena utifrån</label>
        <select name="scaleBy" id="scaleBy" defaultValue={""} onChange={(e) => {
          setScaleBy(e.target.value as ScaleBy | "");
          setValue1(undefined);
          setValue2(undefined);
          setArea1(undefined);
          setArea2(undefined);
        }}>
          <option value="">Inget alternativ valt</option>
          <option value={ScaleBy.Custom}>Specifikt värde</option>
          <option value={ScaleBy.Inhabitants}>Antal invånare</option>
          <option value={ScaleBy.Area}>Ytarea</option>
        </select>
        <SecondPart />
        <label htmlFor="scaleFactor">Resulterande skalfaktor: </label>
        <output name="scaleFactor" id="scaleFactor">{value3 ?? "Värde saknas"}</output>
        <br />
        <div className={`display-flex flex-direction-row align-items-center justify-content-space-between`}>
          <button disabled={!value3} type="button" onClick={doScaling}>Skala värdena</button>
          <button disabled={isLoading} type="button" onClick={closeModal}>Avbryt</button>
        </div>
      </dialog>
    </>
  );
}