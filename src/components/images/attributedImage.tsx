import styles from './images.module.css';
import Image from "next/image";


export default function AttributedImage({
    children,
    src,
    alt,
    borderRadius,
  }: {
    children: React.ReactNode
    src: string,
    alt: string,
    borderRadius: string,
  }) {
    return (
      <>
        <div className={styles.wrapper}>
          <Image src={src} alt={alt} layout="fill" className={styles.image} style={{borderRadius: borderRadius}} />  
          <span className={styles.attribution}>{children}</span>
        </div>
      </>
    )
}