import styles from '../tables.module.css' with { type: "css" };
import { DataSeries, Goal, Roadmap } from "@prisma/client"
import Image from 'next/image'
import goalsToTree from '@/functions/goalsToTree'

export default function LinkTree({
  goals,
  roadmapId,
}: {
  goals: ((Goal & {
    _count: { actions: number }
    dataSeries: DataSeries | null,
    roadmaps?: { id: string, name: string }[],
    author: { id: string, username: string },
    editors: { id: string, username: string }[],
    viewers: { id: string, username: string }[],
    editGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
    viewGroups: { id: string, name: string, users: { id: string, username: string }[] }[],
  }) | null)[],
  roadmapId?: string,
}) {
  if (!goals.length) return (<p>Du har inte tillgång till några målbanor i denna färdplan, eller så är färdplanen tom.</p>);

  if (!roadmapId && goals.find(goal => goal && !goal.roadmaps?.length)) { throw new Error('GoalTable: roadmapId must be provided if any goal does not pass a `.roadmaps` property') }

  const NestedKeysRenderer = ({ data }: { data: any }) => {
    return (
      <ul style={{ listStyleType: "none" }}>
        {Object.keys(data).map((key) => (
          <li key={key}>
            { // If the current object is a goal (has an id), render a link to the goal
              typeof data[key].id == 'string' ? (
                <a href={`/roadmap/${roadmapId || (data[key].roadmaps?.length ? data[key].roadmaps[0].id : null)}/goal/${data[key].id}`} className={`display-flex gap-50 align-items-center padding-y-50 ${styles.link}`}>
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

  let data = goalsToTree(goals);

  return (
    <>
      <NestedKeysRenderer data={data} />
    </>
  );

}