'use client';

import { closeModal, openModal } from "@/components/modals/modalFunctions";
import { LoginData } from "@/lib/session";
import { Goal } from "@prisma/client";
import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from './queryBuilder.module.css'
import { PxWebApiV2TableArray, PxWebApiV2TableContent, PxWebApiV2TableDetails } from "@/lib/pxWeb/pxWebApiV2Types";
import { externalDatasetBaseUrls } from "@/lib/pxWeb/utility";
import { getTables } from "@/lib/pxWeb/getTables";
import { getTableDetails } from "@/lib/pxWeb/getTableDetails";
import { getTableContent } from "@/lib/pxWeb/getTableContent";
import filterTableContentKeys from "@/lib/pxWeb/filterTableContentKeys";
import formSubmitter from "@/functions/formSubmitter";
import FormWrapper from "../formWrapper";

export default function QueryBuilder({
  goal,
  user
}: {
  goal: Goal,
  user: LoginData["user"],
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>("" as keyof typeof externalDatasetBaseUrls);
  const [tables, setTables] = useState<{ id: string, label: string }[] | null>(null);
  const [tableDetails, setTableDetails] = useState<PxWebApiV2TableDetails | null>(null);
  const [tableContent, setTableContent] = useState<PxWebApiV2TableContent | null>(null);

  const modalRef = useRef<HTMLDialogElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!dataSource) return;

    const query = (formRef.current?.elements.namedItem('tableSearch') as HTMLInputElement | null)?.value;

    getTables(dataSource, query).then(result => setTables(result));
  }, [dataSource]);

  function buildQuery(formData: FormData) {
    const queryObject: Object[] = []
    formData.forEach((value, key) => {
      // Skip empty values
      if (!value) return;
      // Skip externalDataset and externalTableId, as they are not part of the query
      if (key == "externalDataset") return;
      if (key == "externalTableId") return;
      // The time variable is special, as we want to fetch every period after (and including) the selected one
      if (key == formRef.current?.getElementsByClassName("TimeVariable")[0]?.id) {
        queryObject.push({ variableCode: key, valueCodes: [`FROM(${value as string})`] });
        return;
      }
      queryObject.push({ variableCode: key, valueCodes: [value as string] });
    });

    return queryObject;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Return if insufficient selection has been made
    if (!tables || !tableDetails) return;
    // Return if properly formatted response was not found
    if (!tableContent) return;
    if (!(event.target instanceof HTMLFormElement)) return;

    if (!(event.target.checkValidity())) return;
    const formData = new FormData(event.target);
    const query = buildQuery(formData);

    // Update the goal with the new data
    formSubmitter("/api/goal", JSON.stringify({
      goalId: goal.id,
      externalDataset: dataSource,
      externalTableId: formData.get("externalTableId") as string,
      externalSelection: query,
      timestamp: Date.now(),
    }), "PUT", setIsLoading);
  }

  function tryGetResult() {
    if (!(formRef.current instanceof HTMLFormElement)) return;
    if (!tables) return;
    if (!tableDetails) return;

    if (formRef.current.checkValidity()) {
      const formData = new FormData(formRef.current);
      const query = buildQuery(formData);
      getTableContent(formData.get("externalTableId") as string ?? "", query, dataSource).then(result => setTableContent(filterTableContentKeys(result)));
    }
  }

  function searchOnEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      handleSearch((event.target as HTMLInputElement).value);
    }
  }

  function searchWithButton() {
    const query = (formRef.current?.elements.namedItem('tableSearch') as HTMLInputElement | null)?.value;
    handleSearch(query ?? undefined);
  }

  function handleSearch(query?: string) {
    if (!externalDatasetBaseUrls[dataSource as keyof typeof externalDatasetBaseUrls]) return;

    getTables(dataSource, query).then(result => setTables(result));
  }

  function handleSelect(tableId: string) {
    if (!externalDatasetBaseUrls[dataSource as keyof typeof externalDatasetBaseUrls]) return;
    if (!tableId) return;

    getTableDetails(tableId, dataSource).then(result => setTableDetails(result));
  }

  return (
    <>
      <button type="button" className="transparent flex gap-50 padding-50" style={{ fontSize: '1rem', fontWeight: '500' }} onClick={() => openModal(modalRef)}>
        Lägg till historisk data
        <Image src='/icons/chartAdd.svg' alt="" width={24} height={24} />
      </button>
      <dialog className={styles.dialog} ref={modalRef} aria-modal style={{ border: '0', borderRadius: '.25rem', boxShadow: '0 0 .5rem -.25rem rgba(0,0,0,.25' }}>
        <div className={`display-flex flex-direction-row-reverse align-items-center justify-content-space-between`}>
          <button className="grid round padding-50 transparent" disabled={isLoading} onClick={() => closeModal(modalRef)} autoFocus aria-label="Close" >
            <Image src='/icons/close.svg' alt="" width={18} height={18} />
          </button>
          <h2 className="margin-0">Lägg till datakälla</h2>
        </div>
        <p>Lägg till en historisk dataserie till {goal.name ?? goal.indicatorParameter}</p>

        <form ref={formRef} onChange={tryGetResult} onSubmit={handleSubmit}>
          {/* Hidden disabled submit button to prevent accidental submisson */}
          <button type="submit" style={{ display: 'none' }} disabled></button>

          <FormWrapper>
            <fieldset>
              <label className="margin-y-75">
                Datakälla
                <select className="block margin-y-25" required name="externalDataset" id="externalDataset" onChange={e => setDataSource(e.target.value)}>
                  <option value="">Välj en källa</option>
                  {Object.keys(externalDatasetBaseUrls).map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </label>

              {/* TODO: Check that this works well with dynamic keyboards (smartphone/tablet) */}
              <div className="flex gap-25 align-items-flex-end margin-y-75">
                <label className="flex-grow-100">
                  <span className="block margin-y-25">Sök efter tabell</span>
                  <input type="search" className="block" onKeyDown={searchOnEnter} />
                </label>
                <button type="button" onClick={searchWithButton} style={{fontSize: '1rem'}}>Sök</button>
              </div>

              <div style={{height: '300px', overflowY: 'scroll', paddingRight: '.5rem'}}>
                {tables && tables.map(({ id, label }) => (
                  <label key={id} className={`${styles.tableSelect} block padding-y-25`}>
                    {label}
                    <input type="radio" value={id} name="table" onChange={e => handleSelect(e.target.value)} />
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="margin-y-100" style={{border: '1px solid var(--gray-90)', borderRadius: '3px', padding: '.5rem'}}>
              <legend className="padding-x-50">
                <strong>Välj värden för tabell</strong>
              </legend>
              {tableDetails && (
                <>
                  {tableDetails.variables.map(variable => (
                    <label key={variable.id} className="block margin-y-75">
                      {/* Use CSS to set proper capitalisation of labels; something like `label::first-letter { text-transform: capitalize; }` */}
                      {variable.type == "TimeVariable" ? "Startperiod" : variable.label} {!variable.elimination && <span style={{ color: "red" }}>*</span>}
                      <select className={`block margin-y-25 ${variable.type}`}
                        required={!variable.elimination}
                        name={variable.id}
                        id={variable.id}
                        // If only one value is available, pre-select it
                        defaultValue={variable.values.length == 1 ? variable.values[0].code : undefined}>
                        { // If only one value is available, don't show a placeholder option
                          variable.values.length != 1 &&
                          <option value="">Välj ett värde</option>
                        }
                        {variable.values.map(value => (
                          <option key={value.code} value={value.code} lang={tableDetails.language}>{value.label}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </>
              )}
            </fieldset>
          </FormWrapper>

          {tableContent ? (
            <div>
              <p>Ser detta rimligt ut? (visar max 5 värden)</p>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Period</th>
                    <th scope="col">Värde</th>
                  </tr>
                </thead>
                <tbody>
                  {tableContent.data.map((row, index) => (
                    index < 5 &&
                    <tr key={row.key[0]}>
                      <td>{row.key[0]}</td>
                      <td>{row.values[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <p>Inget läsbart resultat hittades. Vänligen uppdatera dina val.</p>
            </div>
          )}

          <button type="submit" className="seagreen color-purewhite">Lägg till datakälla</button>
        </form>
      </dialog>
    </>
  )
}