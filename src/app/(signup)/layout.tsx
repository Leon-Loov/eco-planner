import { HomeButton, LoginButton } from '@/components/redirectButtons'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <br />
        <HomeButton />
        <br />
        <LoginButton />
      </body>
    </html>
  )
}