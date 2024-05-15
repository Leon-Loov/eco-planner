'use client';

import { closeModal, openModal } from "@/components/modals/modalFunctions";
import { Data } from "@/lib/session";
import { Goal } from "@prisma/client";
import { useRef, useState } from "react";
import Image from "next/image";
import { PxWebApiV2TableArray, PxWebApiV2TableDetails } from "@/lib/pxWeb/pxWebApiV2Types";
import { externalDatasetBaseUrls } from "@/lib/pxWeb/utility";
import { getTables } from "@/lib/pxWeb/getTables";

export default function QueryBuilder({
  goal,
  user
}: {
  goal: Goal,
  user: Data["user"],
}) {
  // Requres a goal as input

  // Should do a POST request to api/goal where it updates:
  // `externalDataset`
  // `externalTableId`
  // `externalSelection`

  // First user selects a data source from `externalDatasetBaseUrls` in lib/pxWeb/utility.ts

  // Then user gets to write a search query passed into `getTables`, resulting in a list of tables added to a dropdown where they can select one

  // A query is made to `getTableDetails` to get the table's metadata

  // For each variable in the table, a dropdown is added to the form where the user can select a value
  // Variables with `elimination: true` are optional, others are required
  // If any variable only has one value, it should probably be pre-selected? 

  // The TimeVariable is used to select the first period, and thus results in something like
  // { variableCode: "Tid", valueCodes: ["FROM(SelectedValue)"] }
  // While other variables will be something like
  // { variableCode: "Name", valueCodes: ["SelectedValue"] }

  // Whenever a field is changed(?), try getting table content with the current selection and filter it through `filterTableContentKeys`
  // If a valid result is found, show it like "Does this look correct?" => Small table with metadata[0].label and some values from the data array
  // If invalid result, ask user to change selection, and block submission until a valid result is found

  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState<string>("" as keyof typeof externalDatasetBaseUrls);
  const [tables, setTables] = useState<{ id: string, label: string }[] | null>(null);
  const [tableDetails, setTableDetails] = useState<PxWebApiV2TableDetails | null>(null);

  const modalRef = useRef<HTMLDialogElement | null>(null);

  function searchOnEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      handleSearch((event.target as HTMLInputElement).value);
    }
  }

  function searchWithButton() {
    const query = (document?.getElementById('tableSearch') as HTMLInputElement).value;
    handleSearch(query);
  }

  function handleSearch(query?: string) {
    if (!externalDatasetBaseUrls[dataSource as keyof typeof externalDatasetBaseUrls]) return;

    getTables(dataSource, query).then(result => setTables(result));
  }

  return (
    <>
      <button type="button" className="transparent flex gap-50 padding-0" style={{ fontSize: '1rem', fontWeight: '500' }} onClick={() => openModal(modalRef)}>
        Lägg till historisk data
        {/* Add image */}
      </button>
      <dialog ref={modalRef} aria-modal style={{ border: '0', borderRadius: '.25rem', boxShadow: '0 0 .5rem -.25rem rgba(0,0,0,.25' }}>
        <div className={`display-flex flex-direction-row-reverse align-items-center justify-content-space-between`}>
          <button className="grid round padding-50 transparent" disabled={isLoading} onClick={() => closeModal(modalRef)} autoFocus aria-label="Close" >
            <Image src='/icons/close.svg' alt="" width={18} height={18} />
          </button>
          <h2 className="margin-0">Lägg till datakälla</h2>
        </div>
        <p>Lägg till en historisk dataserie till {goal.name ?? goal.indicatorParameter}</p>

        <form action="">
          {/* Hidden disabled submit button to prevent accidental */}
          <label className="margin-y-75">
            Datakälla
            <select className="block margin-y-25" required name="externalDataset" id="externalDataset">
              <option value="">Välj en källa</option>
              {Object.keys(externalDatasetBaseUrls).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>

          <label className="margin-y-75">
            Sök efter tabell
            <input type="search" className="block margin-y-25" id="tableSearch" onKeyDown={searchOnEnter} />
          </label>
          <button type="button" onClick={searchWithButton}>Sök</button>
        </form>
      </dialog>
    </>
  )
}