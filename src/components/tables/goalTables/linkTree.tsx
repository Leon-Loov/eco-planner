import styles from '../tables.module.css' with { type: "css" };
import { DataSeries, Goal } from "@prisma/client";
import Image from 'next/image';
import goalsToTree from '@/functions/goalsToTree';

interface LinkTreeCommonProps { }

interface LinkTreeWithGoals extends LinkTreeCommonProps {
  goals: (Goal & {
    _count: { actions: number }
    dataSeries: DataSeries | null,
    roadmap: { id: string, metaRoadmap: { name: string, id: string } },
  })[],
  roadmap?: never,
}

interface LinkTreeWithRoadmap extends LinkTreeCommonProps {
  goals?: never,
  roadmap: {
    id: string,
    metaRoadmap: { name: string, id: string },
    goals: (Goal & {
      _count: { actions: number },
      dataSeries: DataSeries | null,
    })[]
  },
}

type LinkTreeProps = LinkTreeWithGoals | LinkTreeWithRoadmap;

export default function LinkTree({
  goals,
  roadmap,
}: LinkTreeProps) {
  // Failsafe in case wrong props are passed
  if ((!goals && !roadmap) || (goals && roadmap)) throw new Error('LinkTree: Either `goals` XOR `roadmap` must be provided');

  if (!goals) {
    goals = roadmap.goals.map(goal => {
      return {
        ...goal,
        roadmap: (({ goals, ...data }) => data)(roadmap),
      }
    })
  }

  if (!goals.length) return (<p>Du har inte tillgång till några målbanor i denna färdplan, eller så är färdplanen tom.</p>);

  const NestedKeysRenderer = ({ data }: { data: any }) => {
    return (
      <ul style={{ listStyleType: "none" }}>
        {Object.keys(data).map((key) => (
          <li key={key}>
            { // If the current object is a goal (has an id), render a link to the goal
              typeof data[key].id == 'string' ? (
                <a href={`/roadmap/${data[key].roadmap.id}/goal/${data[key].id}`} className={`display-flex gap-50 align-items-center padding-y-50 ${styles.link}`}>
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