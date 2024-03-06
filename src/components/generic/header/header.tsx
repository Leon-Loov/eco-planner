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
    <div className={styles.container}>
      <header className={`${styles.tempHeader} padding-100`}>
        <div className={styles.menuToggleContainer}>
          <input type="checkbox" className={styles.menuToggle} />
          <Image src='/icons/menu.svg' alt='Toggle menu' width='24' height='24' />
        </div>
      </header>
      <aside className={styles.tempAside}>
        <nav className={styles.nav}>
          <div>
            <Link href="/" className={styles.headerLink}>
              <Image src='/icons/home.svg' alt='' width={24} height={24} />
              Hem
            </Link>
            <Link href="/info" className={styles.headerLink}>
              <Image src='/icons/info.svg' alt='' width={24} height={24} />
              Information
            </Link>
          </div>
          <div>
            { // Link to login and signup if not logged in
              !user?.isLoggedIn &&
              <>
                <Link href="/signup" className='flex gap-50 align-items-center padding-50 margin-y-25 smooth seagreen color-purewhite button' style={{whiteSpace: 'nowrap', fontWeight: '500',}}>
                  <Image src='/icons/userAdd.svg' alt='' width={24} height={24} />
                  Skapa Konto
                </Link>
                <Link href="/login" className={styles.headerLink}>
                  <Image src='/icons/login.svg' alt='' width={24} height={24} />
                  Logga In
                </Link>
              </>
            }
            { // Link to admin page and a logout button if logged in
              user?.isLoggedIn &&
              <>
                {/* Admin pages don't currently exist */}
                {/* <PrimaryLink href="/admin">To Admin Page</PrimaryLink> */}
                <LogoutButton />
              </>
            }
          </div>
        </nav>
      </aside>
    </div>
  </>
}
