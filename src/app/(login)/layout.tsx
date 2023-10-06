import { HomeButton, SignupButton } from '@/components/redirectButtons'
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
            <HomeButton />
            <SignupButton />
          </div>
        </header>
        <div className='layout-main'>
          {children}
        </div>
      </body>
    </html>
  )
}