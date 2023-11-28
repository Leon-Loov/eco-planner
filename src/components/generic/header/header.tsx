import styles from './header.module.css'
import LogoutButton from '@/components/buttons/logoutButton'
import { SecondaryLink, PrimaryLink } from '../links/links'
import { getSessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import Link from 'next/link'

export async function Header() {
  const { user } = await getSessionData(cookies())
  return <>
    <header className={styles.header}>
      <div className='layout-main display-flex justify-content-space-between'>
        <Link href='/' className='display-flex'>
          <img src='/icons/leaf.svg' /> 
        </Link>
        <nav>
          <Link href="/" className={styles.headerLink}> Hem </Link>
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
        </nav>
      </div>
    </header>
  </>
}
                