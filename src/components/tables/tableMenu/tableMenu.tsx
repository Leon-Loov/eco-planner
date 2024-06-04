'use client'

import Image from "next/image";
import styles from './tableMenu.module.css' with { type: "css" }
import Link from "next/link";
import { useRef } from "react";
import { Action, DataSeries, Goal, MetaRoadmap } from "@prisma/client";
import { AccessLevel } from "@/types";
import ConfirmDelete from "@/components/modals/confirmDelete";
import { openModal } from "@/components/modals/modalFunctions";

// TODO: This acts as a general purpose button for roadmaps, goals and actions. 
// Update the name of the component to reflect this

export function TableMenu(
  {
    accessLevel,
    object,
  }: {
    accessLevel?: AccessLevel,
    object: (
      // Action
      (Action & {
        goal: { id: string, roadmap: { id: string } },
        roadmapVersions?: never,
        metaRoadmap?: never,
        roadmap?: never,
      })
      // Goal
      | (Goal & {
        _count: { actions: number }
        dataSeries: DataSeries | null,
        roadmap: { id: string, metaRoadmap: { name: string, id: string } },
        roadmapVersions?: never,
        metaRoadmap?: never,
        goal?: never,
      })
      // Roadmap
      | ({
        id: string,
        version: number,
        _count: { goals: number },
        metaRoadmap: MetaRoadmap,
        roadmapVersions?: never,
        roadmap?: never,
        goal?: never,
        name?: never,
      })
      // MetaRoadmap
      | (MetaRoadmap & {
        roadmapVersions: { id: string, version: number, _count: { goals: number } }[],
        metaRoadmap?: never,
        roadmap?: never,
        goal?: never,
      })
    )
  }) {
  const menu = useRef<HTMLDialogElement | null>(null);
  const deletionRef = useRef<HTMLDialogElement | null>(null);

  // If user doesn't have edit access, don't show the menu
  if (!(accessLevel === AccessLevel.Edit || accessLevel === AccessLevel.Author || accessLevel === AccessLevel.Admin)) {
    return null;
  }

  let selfLink: string | undefined;
  let creationLink: string | undefined;
  let creationDescription: string | undefined;
  let editLink: string | undefined;
  let deleteLink: string | undefined;
  // MetaRoadmaps
  if (object.roadmapVersions != undefined) {
    selfLink = `/metaRoadmap/${object.id}`;
    creationLink = `roadmap/createRoadmap?metaRoadmapId=${object.id}`;
    creationDescription = 'Ny färdplan';
    editLink = `/metaRoadmap/${object.id}/editMetaRoadmap`;
    deleteLink = "/api/metaRoadmap"
  }
  // Roadmaps
  else if (object.metaRoadmap != undefined) {
    selfLink = `/roadmap/${object.id}`
    creationLink = `/roadmap/${object.id}/goal/createGoal`;
    creationDescription = 'Ny målbana';
    editLink = `/roadmap/${object.id}/editRoadmap`;
    deleteLink = "/api/roadmap"
  }
  // Goals
  else if (object.roadmap != undefined) {
    selfLink = `/roadmap/${object.roadmap.id}/goal/${object.id}`;
    creationLink = `/roadmap/${object.roadmap.id}/goal/${object.id}/action/createAction`;
    creationDescription = 'Ny åtgärd';
    editLink = `/roadmap/${object.roadmap.id}/goal/${object.id}/editGoal`;
    deleteLink = "/api/goal"
    if (!object.name) {
      object.name = object.indicatorParameter;
    }
  }
  // Actions
  else if (object.goal != undefined) {
    selfLink = `/roadmap/${object.goal.roadmap.id}/goal/${object.goal.id}/action/${object.id}`;
    editLink = `/roadmap/${object.goal.roadmap.id}/goal/${object.goal.id}/action/${object.id}/editAction`;
    deleteLink = "/api/action"
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
    // Close children as well
    deletionRef.current?.close();
  }

  return (
    <>
      <div className={`${styles.actionButton} display-flex`}>
        <button onClick={openMenu} className={styles.button} aria-label={`meny för ${object.name || object.metaRoadmap?.name || "Namn saknas"}`}>
          <Image src='/icons/dotsVertical.svg' width={24} height={24} alt="meny"></Image>
        </button>
        <dialog className={styles.menu} id={`${object.id}-menu`} onBlur={closeMenu} ref={menu} onKeyUp={closeMenu}>
          <div className={`display-flex flex-direction-row-reverse align-items-center justify-content-space-between ${styles.menuHeading}`}>
            {/* Button to close menu */}
            <button onClick={closeMenu} className={styles.button} autoFocus >
              <Image src='/icons/close.svg' alt="stäng" width={18} height={18} />
            </button>
            {/* Link to the object */}
            <Link href={selfLink} className={styles.menuHeadingTitle}>{object.name || object.metaRoadmap?.name}</Link>
          </div>
          {creationLink &&
            <Link href={creationLink} className={styles.menuAction}>
              <span>{creationDescription}</span>
              <Image src='/icons/plus-light.svg' alt="" width={24} height={24} className={styles.actionImage} />
            </Link>
          }
          <Link href={editLink} className={styles.menuAction}>
            <span>Redigera</span>
            <Image src='/icons/edit.svg' alt="" width={24} height={24} className={styles.actionImage} />
          </Link>
          { // Admins and authors can delete items
            (accessLevel === AccessLevel.Admin || accessLevel === AccessLevel.Author) &&
            <>
              <button type="button" className="width-100 transparent display-flex align-items-center justify-content-space-between" style={{ padding: '.5rem', fontSize: '1rem' }} onClick={() => openModal(deletionRef)}>
                Radera inlägg
                <Image src='/icons/delete.svg' alt="" width={24} height={24} className={styles.actionImage} />
              </button>
              <ConfirmDelete modalRef={deletionRef} targetUrl={deleteLink} targetName={object.name || object.metaRoadmap?.name || "Namn saknas"} targetId={object.id} />
            </>
          }
        </dialog>
      </div>
    </>
  )
}