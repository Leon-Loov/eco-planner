import styles from './header.module.css' with { type: "css" }
import LogoutButton from '@/components/buttons/logoutButton'
import { SecondaryLink, PrimaryLink } from '../links/links'
import { getSessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

export async function Header() {
  const { user } = await getSessionData(cookies())
  return <>
    <aside className={styles.header}>
      <div className={`display-flex flex-direction-column justify-content-space-between`} style={{height: '100%'}}>
        <div className={styles.menuToggleContainer}>
          <input type="checkbox" className={styles.menuToggle} />
          <Image src='/icons/menu.svg' alt='Toggle menu' width='24' height='24' /> 
        </div>
        <nav>
          <div>
            <Link href="/" className={styles.headerLink}>
              <Image src='/icons/home.svg' alt='Hem' width={24} height={24} /> 
              Hem 
            </Link>
            <Link href="/info" className={styles.headerLink}>
              <Image src='/icons/info.svg' alt='Information' width={24} height={24} /> 
              Information
            </Link>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '.5rem'}}>
            { // Link to login and signup if not logged in
              !user?.isLoggedIn &&
              <>
                <PrimaryLink href='./signup'>Skapa Konto</PrimaryLink>
                <SecondaryLink href='./login'>Logga In</SecondaryLink>
              </>
            }
            { // Link to admin page and a logout button if logged in
              user?.isLoggedIn &&
              <>
                {/* Admin pages don't currently exist */}
                {/* <PrimaryLink href="./admin">To Admin Page</PrimaryLink> */}
                <LogoutButton />
              </>
            }
          </div>
        </nav>
      </div>
    </aside>
  </>
}
                