import '@/styles/global.css'
import { Header } from '@/components/header/header'
import BreadCrumbs from '@/components/breadcrumbs/breadCrumbs'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className='layout-main'>
          <BreadCrumbs />
          {children}
        </div>
      </body>
    </html>
  )
}