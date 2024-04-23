import styles from './notification.module.css'
import Link from "next/link"
import Image from "next/image"

export default function Notifications() {
  return (
    <Link href="/" className={`flex align-items-center ${styles.link}`}>
      <div style={{position: 'relative', display: 'grid'}}>
        <Image src="/icons/bell.svg" alt="notifikationer" width={24} height={24} />
        <div style={{
          padding: '1px',
          borderRadius: '9999px', 
          fontSize: '8px',
          color: 'white',
          lineHeight: '1',
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translate(0, 0)'
        }}>
          <div
            style={{ 
              height: '12px', 
              minWidth: '12px', 
              padding: '2px',
              display: 'grid', 
              placeItems: 'center', 
              backgroundColor: 'red', 
              borderRadius: '9999px', 
            }}>
            9
          </div>
        </div>
      </div>
    </Link>
  )
} 