import Link from "next/link";

export function AdminButton() {
  return (
    <>
      <Link href="/admin"> To Admin Page </Link>
    </>
  )
}

export function HomeButton() {
  return (
    <>
      <Link href="/" className="header-link"> Home </Link>
    </>
  )
}

export function LoginButton() {
  return (
    <>
      <Link href="/login" className="call-to-action-primary"> Login </Link>
    </>
  )
}

export function SignupButton() {
  return (
    <>
      <Link href="/signup" className="call-to-action-secondary"> Sign up </Link>
    </>
  )
}

export function NewActionButton({ roadmapId, goalId }: { roadmapId: string, goalId: string}) {
  return (
    <>
      <Link href={`/roadmap/${roadmapId}/goal/${goalId}/createAction`}>
        <button>Skapa ny åtgärd</button>
      </Link>
    </>
  )
}

export function NewGoalButton({ roadmapId }: { roadmapId: string }) {
  return (
    <>
      <Link href={`/roadmap/${roadmapId}/goal/createGoal`}>
        <button>Skapa ny målbana</button>
      </Link>
    </>
  )
}

export function NewRoadmapButton() {
  return (
    <>
      <Link href="/roadmap/createRoadmap">
        <button>Skapa ny färdplan</button>
      </Link>
    </>
  )
}