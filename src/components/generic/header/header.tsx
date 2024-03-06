import styles from './header.module.css' with { type: "css" }
import LogoutButton from '@/components/buttons/logoutButton'
import { getSessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

export async function Header() {
  const { user } = await getSessionData(cookies())
  return <>
    <div className={styles.container}>
      <div className={styles.menuToggleContainer}>
        <input type="checkbox" className={styles.menuToggle} />
        <Image src='/icons/menu.svg' alt='Toggle menu' width='24' height='24' />
      </div>
      <aside className={`${styles.aside} flex-grow-100`}>
        <nav className={styles.nav}>
          { // Link to signup if not logged in
            !user?.isLoggedIn &&
            <div>
              <Link href="/signup" className='flex gap-50 align-items-center padding-50 margin-y-25 round seagreen color-purewhite button' style={{ whiteSpace: 'nowrap', fontWeight: '500', }}>
                <Image src='/icons/userAdd.svg' alt='' width={24} height={24} />
                Skapa Konto
              </Link>
            </div>
          }
          <div className='flex-grow-100'>
            <Link href="/" className={styles.link}>
              <Image src='/icons/home.svg' alt='' width={24} height={24} />
              Hem
            </Link>
            <Link href="/info" className={styles.link}>
              <Image src='/icons/info.svg' alt='' width={24} height={24} />
              Information
            </Link>
          </div>
          <div>
            { // Link to login and signup if not logged in
              !user?.isLoggedIn &&
              <>
                <Link href="/login" className={styles.link}>
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
