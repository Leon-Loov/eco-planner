import '../tables.css'
import styles from '../tables.module.css'
import { Action, DataSeries, Goal, Roadmap } from "@prisma/client"
import parametersToTree from '@/functions/parametersToTree'
// parametersToTree(roadmap.goals.map(goal => (goal.indicatorParameter)))

export default function LinkTree({
  roadmap,
}: {
  roadmap: Roadmap & {
    goals: (Goal & {
      actions: Action[],
      dataSeries: DataSeries | null,
      author: { id: string, username: string },
      editors: { id: string, username: string }[],
      viewers: { id: string, username: string }[],
      editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
      viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    })[],
  },
}) {

  const NestedKeysRenderer = ({ data }: { data: any }) => {
    return (
      <ul style={{listStyleType: "none"}}>
        {Object.keys(data).map((key) => (
          <li key={key}>
            <details style={{margin: "1em 0"}} className={styles.details}>
              <summary>{key}</summary>
              {Object.keys(data[key]).length > 0 && (
                <NestedKeysRenderer data={data[key]} />
              )}
            </details>
          </li>
        ))}
      </ul>
    );
  };

  let data = parametersToTree(roadmap.goals.map(goal => (goal.indicatorParameter)));
  console.log(data)
  return (
    <>
      <NestedKeysRenderer data={data} />
    </>
  );

}