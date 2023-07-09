import Link from "next/link";

export default function LoginButton() {
  return (
    <>
      <Link href="/login">
        <button>Login</button>
      </Link>
    </>
  )
}