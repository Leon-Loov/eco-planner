import styles from './images.module.css' with { type: "css" };
import Image from "next/image";


export default function imageIcon({
  src,
  alt,
}: {
  src: string,
  alt: string,
}) {
  return (
      <>
      <div className={styles.imageIcon}>
        <Image src={src} alt={alt} layout="fill" objectFit='scale-down' />
      </div>
      </>
      )
}