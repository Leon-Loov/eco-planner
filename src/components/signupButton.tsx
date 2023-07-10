import Link from "next/link";

export default function SignupButton() {
  return (
    <>
      <Link href="/login">
        <button>Sign up</button>
      </Link>
    </>
  )
}