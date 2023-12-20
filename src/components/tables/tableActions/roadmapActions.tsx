import Image from "next/image";
import styles from './tableActions.module.css' with { type: "css" }
import Link from "next/link";

//TODO: Close menu when pressing anywhere, also add close button

export function RoadmapActionButton(
  {
    addGoalHref,
    editHref,
    roadmapName,
  }: {
    addGoalHref: string,
    editHref: string,
    roadmapName: string
  }) {

  return (
    <>
      <div className={`${styles.actionButton} display-flex`}>
        <input type="radio" name="openMenu" aria-label={`Redigera färdplan ${roadmapName}`}/>
        <Image src='/icons/dotsVertical.svg' width={24} height={24} alt=""></Image>
        <nav className={styles.menu}>
          <Link href={addGoalHref} className={styles.menuAction}>
            <Image src='/icons/plus-light.svg' alt="" width={24} height={24} />
            <span>Lägg till målbana</span> 
          </Link>
          <Link href={editHref} className={styles.menuAction}>
            <Image src='/icons/edit.svg' alt="" width={24} height={24} />
            <span>Redigera färdplan</span>
          </Link>
          {/* <p>Ta bort färdplan</p> */}
        </nav>
      </div>
    </>
  )
}