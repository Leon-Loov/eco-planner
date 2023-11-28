import Link from "next/link";

// Important link ({`/${href}`} is not making sense?)
export function PrimaryLink({ href, children  }: { href: string; children: React.ReactNode }) {
  return (
    <>
      <Link href={`/${href}`} className="call-to-action-primary">
        {children}
      </Link>
    </>
  )
}

// Kinda important Link (Might make sense to turn into one and let classname be a prop)
export function SecondaryLink({ href, children  }: { href: string; children: React.ReactNode }) {
  return (
    <>
      <Link href={`/${href}`} className="call-to-action-secondary">
        {children}
      </Link>
    </>
  )
}

// Backbutton
// should not export href but rather move backwards
export function BackButton({ href }: { href: string }) {
  return (
    <>
      <Link href={href}>
        <img src="/icons/back.svg" alt="back" />
      </Link>
    </>
  )
}