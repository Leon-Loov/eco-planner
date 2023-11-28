import Link from "next/link";

//TODO: Get rid of this
export function BackButton({ href }: { href: string }) {
  return (
    <>
      <Link href={href}>
        <img src="/icons/back.svg" alt="back" />
      </Link>
    </>
  )
}