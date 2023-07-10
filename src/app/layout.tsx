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
        { // Link to admin page if logged in
          user?.isLoggedIn &&
          <>
            <br />
            <AdminButton />
          </>
        }
        { // Link to login and signup if not logged in
          !user?.isLoggedIn &&
          <>
            <br />
            <LoginButton />
            <br />
            <SignupButton />
          </>
        }
        { // Button to logout if logged in
          user?.isLoggedIn &&
          <>
            <br />
            <LogoutButton />
          </>
        }
      </body>
    </html>
  )
}