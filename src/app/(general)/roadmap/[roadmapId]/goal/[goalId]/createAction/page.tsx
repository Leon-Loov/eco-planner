import ActionForm from "./actionForm"

export default function Page({ params }: { params: { roadmapId: string, goalId: string }}) {
  return (
    <>
      <h1>Skapa åtgärd</h1>
      <ActionForm roadmapId={params.roadmapId} goalId={params.goalId} />
    </>
  )
}