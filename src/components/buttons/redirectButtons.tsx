import Link from "next/link";

export function BackButton({ href }: { href: string }) {
  return (
    <>
      <Link href={href}>
        <img src="/icons/back.svg" alt="back" />
      </Link>
    </>
  )
}