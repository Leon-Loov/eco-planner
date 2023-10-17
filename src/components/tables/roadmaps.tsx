import './tables.css'
import { Goal, Roadmap } from "@prisma/client"

export default function Roadmap({
  title,
  roadmaps,
}: {
  title: String,
  roadmaps: (Roadmap & { goals: Goal[] })[],
}) {
  return <>
    <h2>{title}</h2>
    <div className="overflow-x-scroll">
      <table>
        <thead>
          <tr>
            <th>Namn</th>
            <th>Antal mål</th>
          </tr>
        </thead>
        <tbody>
          {roadmaps.map(roadmap => (
            <tr key={roadmap.id}>
              <td><a href={`/roadmap/${roadmap.id}`}>{roadmap.name}</a></td>
              <td>{roadmap.goals.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
}