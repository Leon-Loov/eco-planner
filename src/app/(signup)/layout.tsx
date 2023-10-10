import { HomeButton, LoginButton, SignupButton } from '@/components/redirectButtons'
import '@/styles/global.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <div className='layout-main'>
            <nav>
              <HomeButton />
              <LoginButton />
              <SignupButton />
            </nav>
          </div>
        </header>
        <div className='layout-main'>
          {children}
        </div>
      </body>
    </html>
  )
}