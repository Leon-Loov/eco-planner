import CreateGoal from "./goalForm";

export default function Page({ params }: { params: { roadmapId: string } }) {
  return (
    <>
      <h1>Skapa målbana</h1>
      <CreateGoal roadmapId={params.roadmapId} />
    </>
  )
}