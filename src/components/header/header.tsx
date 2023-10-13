import './header.css'
import LogoutButton from '@/components/logoutButton'
import { HomeButton, LoginButton, SignupButton } from '@/components/redirectButtons'
import { getSessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import Link from 'next/link'

export async function Header() {
  const { user } = await getSessionData(cookies())
  return <>
    <header>
      <div className='layout-main flex-row flex-between'>
        <Link href='/' className='flex-row'>
          <img src='/icons/leaf.svg' /> 
        </Link>
        <nav>
          <HomeButton />
          { // Link to login and signup if not logged in
            !user?.isLoggedIn &&
            <>
              <LoginButton />
              <SignupButton />
            </>
          }
          { // Link to admin page and a logout button if logged in
            user?.isLoggedIn &&
            <>
              {/* Admin pages don't currently exist */}
              {/* <br />
              <AdminButton /> */}
              <LogoutButton />
            </>
          }
        </nav>
      </div>
    </header>
  </>
}
                