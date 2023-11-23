import '../tables.css'
import styles from '../tables.module.css'
import { Action, DataSeries, Goal, Roadmap } from "@prisma/client"
import Image from 'next/image'
import goalsToTree from '@/functions/goalsToTree'

export default function LinkTree({
  roadmap,
}: {
  roadmap: Roadmap & {
    goals: (Goal & {
      _count: { actions: number }
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
      <ul style={{ listStyleType: "none" }}>
        {Object.keys(data).map((key) => (
          <li key={key}>
            { // If the current object is a goal (has an id), render a link to the goal
              typeof data[key].id == 'string' ? (
                <a href={`/roadmap/${roadmap.id}/goal/${data[key].id}`} className={`display-flex gap-50 align-items-center padding-y-50 ${styles.link}`}>
                  <Image src="/icons/link.svg" alt={`Link to ${key}`} width={16} height={16} />
                  <span>
                    {(data[key].indicatorParameter as string).split('\\')[0].toLowerCase() == "key" && "Scenarioantagande: "}
                    {(data[key].indicatorParameter as string).split('\\')[0].toLowerCase() == "demand" && "Scenarieresultat: "}
                    {key}
                  </span>
                </a>
              ) : (
                <details style={{ margin: "1em 0" }} className={styles.details}>
                  <summary>{key}</summary>
                  {Object.keys(data[key]).length > 0 && (
                    <NestedKeysRenderer data={data[key]} />
                  )}
                </details>
              )}
          </li>
        ))}
      </ul>
    );
  };

  let data = goalsToTree(roadmap.goals);

  return (
    <>
      <NestedKeysRenderer data={data} />
    </>
  );

}