import LogoutButton from '@/components/logoutButton'
import { AdminButton, HomeButton, LoginButton, SignupButton } from '@/components/redirectButtons'
import { getSessionData } from '@/lib/session'
import { cookies } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getSessionData(cookies())
  return (
    <html lang="en">
      <body>
        {children}
        <br />
        <HomeButton />
        { // Link to login and signup if not logged in
          !user?.isLoggedIn &&
          <>
            <br />
            <LoginButton />
            <br />
            <SignupButton />
          </>
        }
        { // Link to admin page and a logout button if logged in
          user?.isLoggedIn &&
          <>
            <br />
            <AdminButton />
            <br />
            <LogoutButton />
          </>
        }
      </body>
    </html>
  )
}