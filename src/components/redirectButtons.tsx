import Link from "next/link";

export function AdminButton() {
  return (
    <>
      <Link href="/admin">
        <button>To Admin Page</button>
      </Link>
    </>
  )
}

export function HomeButton() {
  return (
    <>
      <Link href="/">
        <button>Home</button>
      </Link>
    </>
  )
}

export function LoginButton() {
  return (
    <>
      <Link href="/login">
        <button>Login</button>
      </Link>
    </>
  )
}

export function SignupButton() {
  return (
    <>
      <Link href="/signup">
        <button>Sign up</button>
      </Link>
    </>
  )
}