import Link from "next/link";
import Image from "next/image";
import styles from './tableActions.module.css' with { type: "css" }

export function RoadmapActionButton() {
  return (
    <button className={`${styles.actionButton} display-flex`}>
      <Image src='/icons/dotsVertical.svg' alt='Åtgärder' width={24} height={24}></Image>
    </button>
  )
}

export function RoadmapActionMenu() {

}