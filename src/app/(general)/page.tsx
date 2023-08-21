import getRoadmaps from "@/functions/getRoadmaps";
import { Goal, Roadmap } from "@prisma/client"

export default async function Page() {
  let roadmaps: (Roadmap & {goals: Goal[]})[] = [];
  roadmaps = await getRoadmaps();

  let nationalRoadmaps = roadmaps.filter(roadmap => roadmap.isNational)
  let regionalRoadmaps = roadmaps.filter(roadmap => !roadmap.isNational)

  return <>
    <h1>Nationella färdplaner</h1>
    <table>
      <thead>
        <tr>
          <th>Namn</th>
          <th>Antal mål</th>
        </tr>
      </thead>
      <tbody>
        {nationalRoadmaps.map(roadmap => (
          <tr key={roadmap.id}>
            <td><a href={`/roadmap/${roadmap.id}`}>{roadmap.name}</a></td>
            <td>{roadmap.goals.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <h1>Regionala färdplaner</h1>
    <table>
      <thead>
        <tr>
          <th>Namn</th>
          <th>Antal mål</th>
        </tr>
      </thead>
      <tbody>
        {regionalRoadmaps.map(roadmap => (
          <tr key={roadmap.id}>
            <td><a href={`/roadmap/${roadmap.id}`}>{roadmap.name}</a></td>
            <td>{roadmap.goals.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
}