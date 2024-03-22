'use client';

import formSubmitter from "@/functions/formSubmitter";
import { useState } from "react";
import { closeModal } from "@/components/modals/modalFunctions";

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
    <dialog ref={modalRef}>
      <h2>Radera inlägg</h2>
      <p>För att radera {targetName}, skriv in namnet i rutan nedan och klicka sedan {'"Radera"'}</p>
      <input type="text" placeholder={targetName} />
      <div>
        <button type="button" onClick={() => closeModal(modalRef)}>Avbryt</button>
        <button type="button" disabled={isLoading} onClick={handleDelete}>Radera</button>
      </div>
    </dialog>
  );
}