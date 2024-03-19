import styles from '../tables.module.css' with { type: "css" };
import { DataSeries, Goal } from "@prisma/client";
import Image from 'next/image';
import goalsToTree from '@/functions/goalsToTree';
import { SyntheticEvent } from 'react';
import { getSessionStorage, setSessionStorage } from '@/functions/localStorage';

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

  const openCategories = getSessionStorage(roadmap?.id || "") || [];

  // TODO: Make sure keys are unique to avoid things like luftfart/inrikes and sjöfart/inrikes sharing the same open state in localStorage
  const handleToggle = (e: SyntheticEvent<HTMLDetailsElement, Event>, key: string) => {
    if (!roadmap) return;
    let currentStorage: string[] = getSessionStorage(roadmap.id);
    if (!(currentStorage instanceof Array)) {
      setSessionStorage(roadmap.id, []);
      currentStorage = [];
    }

    if (e.currentTarget.open) {
      // Don't add the same category twice
      if (currentStorage.includes(key))
        return;
      setSessionStorage(roadmap.id, [...currentStorage, key]);
    } else {
      setSessionStorage(roadmap.id, currentStorage.filter(cat => cat != key));
    }
  };

  const NestedKeysRenderer = ({ data, previousKeys = "" }: { data: any, previousKeys?: string }) => {
    return (
      <ul className={styles.list}>
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
                <details className={styles.details} open={openCategories?.includes(previousKeys + "\\" + key)} onToggle={(e) => handleToggle(e, previousKeys + "\\" + key)}>
                  <summary>{key}</summary>
                  {Object.keys(data[key]).length > 0 && (
                    <NestedKeysRenderer data={data[key]} previousKeys={previousKeys + "\\" + key} />
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