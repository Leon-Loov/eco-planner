'use client'

import Image from "next/image";
import styles from './tableActions.module.css' with { type: "css" }
import Link from "next/link";
import { useRef } from "react";

//TODO: Close menu when pressing anywhere, also add close button

export function RoadmapActionButton(
  {
    addGoalHref,
    editHref,
    id,
    tableName,
  }: {
    addGoalHref: string,
    editHref: string,
    id: string,
    tableName: string,
  }) {

  let menu = useRef<HTMLDialogElement | null>(null);

  const openMenu = () => {
    menu.current?.show();
  }

  const closeMenu = (e: React.FocusEvent<HTMLDialogElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDialogElement>) => {
    // Don't close if focus stays within menu
    if (e.type === 'blur') {
      e = e as React.FocusEvent<HTMLDialogElement>
      if (menu.current?.contains(e.relatedTarget as Node) || menu.current === e.relatedTarget) {
        return;
      }
    }
    // Don't close if non-escape key is pressed
    if ("key" in e && e.key !== 'Escape' && e.key !== 'Esc') {
      return;
    }
    menu.current?.close();
  }

  return (
    <>
      <div className={`${styles.actionButton} display-flex`}>
        <button onClick={openMenu} className={styles.button}>
          <Image src='/icons/dotsVertical.svg' width={24} height={24} alt=""></Image>
        </button>
        <dialog className={styles.menu} id={`${id}-menu`} onBlur={closeMenu} ref={menu} onKeyUp={closeMenu}>
          <div className={`display-flex align-items-center justify-content-space-between ${styles.menuHeading}`}>
            <Link href={`/roadmap/${id}`} className={styles.menuHeadingTitle}>{tableName}</Link>
            <button onClick={closeMenu} className={styles.button} autoFocus >
              <Image src='/icons/close.svg' alt="" width={18} height={18} />
            </button>
          </div>
          <Link href={addGoalHref} className={styles.menuAction}>
            <span>Ny målbana</span>
            <Image src='/icons/plus-light.svg' alt="" width={24} height={24} className={styles.actionImage} />
          </Link>
          <Link href={editHref} className={styles.menuAction}>
            <span>Redigera färdplan</span>
            <Image src='/icons/edit.svg' alt="" width={24} height={24} className={styles.actionImage} />
          </Link>
          {/*
            <Link href={editHref} className={styles.menuAction}>
              <span>Radera färdplan</span>
              <Image src='/icons/delete.svg' alt="" width={24} height={24} className={styles.actionImage} />
            </Link> 
          */}
        </dialog>
      </div>
    </>
  )
}