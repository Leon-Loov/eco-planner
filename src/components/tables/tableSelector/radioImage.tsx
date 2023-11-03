import '../tables.css';
import Image from "next/image";

export default function RadioImage({
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
      <div className="radioImageWrapper">
        <input type='radio' name={name} value={value}/>
        <div className="radioImage">
          <Image src={src} alt={value} width={24} height={24} />
        </div>
      </div>
    </>
  )
}