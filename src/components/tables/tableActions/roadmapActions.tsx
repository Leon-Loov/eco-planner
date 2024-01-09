'use client'

import Image from "next/image";
import styles from './tableActions.module.css' with { type: "css" }
import Link from "next/link";
import { useState } from "react";

//TODO: Close menu when pressing anywhere, also add close button

export function RoadmapActionButton(
  {
    addGoalHref,
    editHref,
    id,
  }: {
    addGoalHref: string,
    editHref: string,
    id: string
  }) {

  const [menu, setMenu] = useState(false)

  const openMenu = () => {  
    if (menu) {
      setMenu(false)
      return
    }
    setMenu(true)
  }

  return (
    <>
      <div className={`${styles.actionButton} display-flex`}>
        <button onClick={openMenu} className={styles.button}>
          <Image src='/icons/dotsVertical.svg' width={24} height={24} alt=""></Image>
        </button> {/* Button should open menu */}
        {menu ?
          <nav className={styles.menu} id={`${id}-menu`}>
            <div className={`display-flex align-items-center justify-content-space-between ${styles.menuHeading}`}>
              <strong>Redigera</strong>
              <button onClick={openMenu} className={styles.button} >
                <Image src='/icons/close.svg' alt="" width={18} height={18} />
              </button>
            </div>
            <Link href={addGoalHref} className={styles.menuAction}>
              <span>Lägg till målbana</span> 
              <Image src='/icons/plus-light.svg' alt="" width={24} height={24} />
            </Link>
            <Link href={editHref} className={styles.menuAction}>
              <span>Redigera färdplan</span>
              <Image src='/icons/edit.svg' alt="" width={24} height={24} />
            </Link>
            {/* <p>Ta bort färdplan</p> */}
          </nav>
        : null }
      </div>
    </>
  )
}