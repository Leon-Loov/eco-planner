import LoginButton from "@/components/loginButton"
import SignupButton from "@/components/signupButton"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <LoginButton />
        <br />
        <SignupButton />
        </body>
    </html>
  )
}