import styles from './header.module.css' with { type: "css" }
import LogoutButton from '@/components/buttons/logoutButton'
import { getSession } from '@/lib/session'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import Notifications from '../notifications/notification'

export default async function Sidebar() {
  const { user } = await getSession(cookies())
  return <>
    <aside className={styles.container}>
      <label className={styles.menuToggleContainer}>
        <input type="checkbox" className={styles.menuToggle} />
        <Image src='/icons/menu.svg' alt='Toggle menu' width='24' height='24' />
      </label>
      <aside className={`${styles.aside} flex-grow-100`}>
        <nav className={styles.nav}>
          <div>
            { // Link to signup if not logged in
              !user?.isLoggedIn &&
              <Link href="/signup" className='flex gap-50 align-items-center padding-50 margin-y-25 round seagreen color-purewhite button' style={{ whiteSpace: 'nowrap', fontWeight: '500', }}>
                <Image src='/icons/userAdd.svg' alt='' width={24} height={24} />
                Skapa Konto
              </Link>
            }
            { // Link to user if logged in
              user?.isLoggedIn &&
              <div>
                <Link href={`/user/${user.username}`} className={styles.link}>
                  <Image src='/icons/user.svg' alt='' width={24} height={24} />
                  Mitt Konto
                </Link>
                {/*<Notifications amount={} /> */}
              </div>
            }
          </div>
          <div className='flex-grow-100'>
            <Link href="/" className={styles.link}>
              <Image src='/icons/home.svg' alt='' width={24} height={24} />
              Hem
            </Link>
            <Link href="/info" className={styles.link}>
              <Image src='/icons/info.svg' alt='' width={24} height={24} />
              Om verktyget
            </Link>
          </div>
          <div>
            { // Link to login
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
                {/* <Link href="/admin">To Admin Page</Link> */}
                <LogoutButton />
              </>
            }
          </div>
        </nav>
      </aside>
    </aside>
  </>
}
