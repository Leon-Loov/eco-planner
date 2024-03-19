import styles from './images.module.css' with { type: "css" };
import Image from "next/image";


export default function AttributedImage({
  children,
  src,
  alt,
}: {
  children: React.ReactNode
  src: string,
  alt: string,
}) {
  return (
    <>
      <Image src={src} alt={alt} fill={true} className={styles.attributedImage} />
      <div className={styles.attribution}>
        {children}
      </div>
    </>
  )
}