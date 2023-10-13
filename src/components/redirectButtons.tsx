import Link from "next/link";

export function AdminButton() {
  return (
    <>
      <Link href="/admin"> To Admin Page </Link>
    </>
  )
}

export function BackButton({ href }: { href: string }) {
  return (
    <>
      <Link href={href}> 
        <img src="/icons/back.svg" alt="back" />
      </Link>
    </>
  )
}

export function LoginButton() {
  return (
    <>
      <Link href="/login" className="call-to-action-secondary"> Logga in </Link>
    </>
  )
}

export function SignupButton() {
  return (
    <>
      <Link href="/signup" className="call-to-action-primary"> Skapa konto </Link>
    </>
  )
}

export function NewActionButton({ roadmapId, goalId }: { roadmapId: string, goalId: string}) {
  return (
    <>
      <Link href={`/roadmap/${roadmapId}/goal/${goalId}/createAction`} className="call-to-action-primary"> Skapa ny åtgärd </Link>
    </>
  )
}

export function NewGoalButton({ roadmapId }: { roadmapId: string }) {
  return (
    <>
      <Link href={`/roadmap/${roadmapId}/goal/createGoal`} className="call-to-action-primary"> Skapa ny målbana </Link>
    </>
  )
}

export function NewRoadmapButton() {
  return (
    <>
      <Link href="/roadmap/createRoadmap" className="call-to-action-primary"> Skapa ny färdplan </Link>
    </>
  )
}