import '@/styles/global.css'
import { Header } from '@/components/header/header'
import { GlobalContextProvider } from "./context/store"
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
          {/*<BreadCrumbs />*/}
          <GlobalContextProvider>
            {children}
          </GlobalContextProvider>
        </div>
      </body>
    </html>
  )
}