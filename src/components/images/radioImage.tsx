import styles from './images.module.css';
import Image from "next/image";

export default function imageLink({
  src,
  value,
  name, 
}: {
  src: string,
  value: string,
  name: string,
}) {
  return (
    <>
      <div className={styles.radioImageWrapper}>
        <input type='radio' name={name} value={value} />
        <div className={styles.radioImage}>
          <Image src={src} alt={value} width={24} height={24} />
        </div>
      </div>
    </>
  )
}