import '../tables.css'
import styles from '../tables.module.css'
import { Action, DataSeries, Goal, Roadmap } from "@prisma/client"
import parametersToTree from '@/functions/parametersToTree'
import Image from 'next/image'

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
          {Object.keys(data[key]).length === 0 ? (
            <a href={`#${key}`} className={`flex-row gap-50 align-center margin-y-50 ${styles.link}`}>
              <Image src="/icons/link.svg" alt={`Link to ${key}`} width={16} height={16} />
              <span>{key}</span>
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

  let data = parametersToTree(roadmap.goals.map(goal => (goal.indicatorParameter)));
  
  return (
    <>
      <NestedKeysRenderer data={data} />
    </>
  );

}