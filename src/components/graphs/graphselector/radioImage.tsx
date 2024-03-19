import styles from '../graphs.module.css' with { type: "css" };
import Image from "next/image";

export default function RadioImage({
  src,
  value,
  name, 
  checked,
  text,
  onChange,
}: {
  src: string,
  value: string,
  name: string,
  checked: boolean,
  text: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {


  return (
    <>
      <label className={`button transparent font-weight-bold flex align-items-center gap-50 smooth ${styles.radioImageWrapper}`}>
        {text}
        <input type='radio' name={name} value={value} checked={checked} onChange={onChange}/>
        <div className='grid' >
          <Image src={src} alt={value} width={24} height={24} />
        </div>
      </label>
    </>
  )
}