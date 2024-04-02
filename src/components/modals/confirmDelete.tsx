'use client';

import formSubmitter from "@/functions/formSubmitter";
import { useState } from "react";
import { closeModal } from "@/components/modals/modalFunctions";
import styles from './modals.module.css'

export default function ConfirmDelete({
  modalRef,
  targetUrl,
  targetName,
  targetId,
}: {
  modalRef: React.MutableRefObject<HTMLDialogElement | null>;
  targetUrl: string;
  targetName: string;
  targetId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  function handleDelete() {
    setIsLoading(true);
    formSubmitter(targetUrl, JSON.stringify({ id: targetId }), "DELETE", setIsLoading)
    closeModal(modalRef);
  };

  return (
    <dialog ref={modalRef} className={styles.modal}>
      <strong className="block" style={{fontSize: 'larger'}}>Radera inlägg</strong>
      <p className="padding-y-100" style={{borderBlock: '2px solid var(--gray-90)'}}>
        Är du säker på att du vill radera inlägg <strong>{targetName}</strong>? <br/>
        Du kan ej ångra denna åtgärd senare.
      </p>
      <label className="block margin-y-75">
        <strong>Skriv {targetName} för att bekräfta</strong>
        <input className="margin-y-25" type="text" placeholder={targetName} />
      </label>
      <div className="display-flex justify-content-flex-end margin-top-75">
        <button type="button" className="margin-x-25" style={{fontWeight: 500}} onClick={() => closeModal(modalRef)}>Avbryt</button>
        <button type="button" className="margin-x-25 red color-purewhite" style={{fontWeight: 500}} disabled={isLoading} onClick={handleDelete}>Radera</button>
      </div>
    </dialog>
  );
}