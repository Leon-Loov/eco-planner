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