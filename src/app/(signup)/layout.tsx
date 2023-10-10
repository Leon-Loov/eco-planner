import { HomeButton, LoginButton, SignupButton } from '@/components/redirectButtons'
import '@/styles/global.css'
import Link from 'next/link'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <div className='layout-main flex-row flex-between'>
            <Link href='/' className='flex-row'>
              <img src='/icons/leaf.svg' /> 
            </Link>
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