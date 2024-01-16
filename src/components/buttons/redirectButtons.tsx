import Link from "next/link";
import Image from "next/image";
import styles from './buttons.module.css'

//TODO: Get rid of this
export function BackButton({ href }: { href: string }) {
  return (
    <>
      <Link href={href} className={`${styles.backButton} display-flex align-items-center`}>
        <Image src="/icons/back.svg" alt="back" width="24" height="24" />
      </Link>
    </>
  )
}