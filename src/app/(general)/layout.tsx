import { getSessionData } from '@/lib/session'
import { cookies } from 'next/headers'
import '@/styles/global.css'
import { Header } from '@/components/header/header'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getSessionData(cookies())
  return (
    <html lang="en">
      <body>
        <Header />
        <div className='layout-main'>
          {children}
        </div>
      </body>
    </html>
  )
}