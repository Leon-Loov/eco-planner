'use client'

import Image from "next/image";
import styles from './tableMenu.module.css' with { type: "css" }
import Link from "next/link";
import { useRef } from "react";
import { Action, DataSeries, Goal, MetaRoadmap } from "@prisma/client";

// TODO: This acts as a general purpose button for roadmaps, goals and actions. 
// Update the name of the component to reflect this

export function TableMenu(
  {
    object,
  }: {
    object: (
      // Action
      (Action & {
        goal: { id: string, roadmap: { id: string } },
        metaRoadmap?: never,
      })
      // Goal
      | (Goal & {
        _count: { actions: number }
        dataSeries: DataSeries | null,
        roadmap: { id: string, metaRoadmap: { name: string, id: string } },
        metaRoadmap?: never,
      })
      // Roadmap
      | ({
        id: string,
        version: number,
        _count: { goals: number },
        metaRoadmap: MetaRoadmap,
        name?: never,
      })
      // TODO: Add MetaRoadmap?
    )
  }) {
  const menu = useRef<HTMLDialogElement | null>(null);

  // TODO: Add access checks
  let selfLink: string | undefined;
  let creationLink: string | undefined;
  let editLink: string | undefined;
  // TODO: Add function for deleting object
  // Roadmaps
  if (object.metaRoadmap != undefined) {
    selfLink = `/roadmap/${object.id}`
    creationLink = `/roadmap/${object.id}/goal/createGoal`;
    editLink = `/roadmap/${object.id}/editRoadmap`;
  }
  // Goals
  else if ('dataSeries' in object) {
    selfLink = `/roadmap/${object.roadmap.id}/goal/${object.id}`;
    creationLink = `/roadmap/${object.roadmap.id}/goal/${object.id}/action/createAction`;
    editLink = `/roadmap/${object.roadmap.id}/goal/${object.id}/editGoal`;
  }
  // Actions
  else if ('goal' in object) {
    selfLink = `/roadmap/${object.goal.roadmap.id}/goal/${object.goal.id}/action/${object.id}`;
    editLink = `/roadmap/${object.goal.roadmap.id}/goal/${object.goal.id}/action/${object.id}/editAction`;
  }
  // Catch all
  else {
    return null;
  }

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
        <dialog className={styles.menu} id={`${object.id}-menu`} onBlur={closeMenu} ref={menu} onKeyUp={closeMenu}>
          <div className={`display-flex flex-direction-row-reverse align-items-center justify-content-space-between ${styles.menuHeading}`}>
            {/* Button to close menu */}
            <button onClick={closeMenu} className={styles.button} autoFocus >
              <Image src='/icons/close.svg' alt="" width={18} height={18} />
            </button>
            {/* Link to the object */}
            <Link href={selfLink} className={styles.menuHeadingTitle}>{object.name || object.metaRoadmap?.name}</Link>
          </div>
          {creationLink &&
            <Link href={creationLink} className={styles.menuAction}>
              <span>Ny målbana</span>
              <Image src='/icons/plus-light.svg' alt="" width={24} height={24} className={styles.actionImage} />
            </Link>
          }
          <Link href={editLink} className={styles.menuAction}>
            <span>Redigera</span>
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