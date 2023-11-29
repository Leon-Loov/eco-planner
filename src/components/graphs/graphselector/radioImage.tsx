import styles from '../../tables/tables.module.css' with { type: "css" };
import Image from "next/image";

export default function RadioImage({
  src,
  value,
  name, 
  checked,
  onChange,
}: {
  src: string,
  value: string,
  name: string,
  checked: boolean,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {


  return (
    <>
      <div className={styles.radioImageWrapper}>
        <input type='radio' name={name} value={value} checked={checked} onChange={onChange}/>
        <div className={styles.radioImage}>
          <Image src={src} alt={value} width={24} height={24} />
        </div>
      </div>
    </>
  )
}