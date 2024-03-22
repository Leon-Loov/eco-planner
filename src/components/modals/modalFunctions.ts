'use client';

export function closeModal(modalRef: React.MutableRefObject<HTMLDialogElement | null>) {
  modalRef.current?.close();
}

export function openModal(modalRef: React.MutableRefObject<HTMLDialogElement | null>) {
  modalRef.current?.showModal();
}