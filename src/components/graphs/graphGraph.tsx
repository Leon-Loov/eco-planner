"use client"

import { useGlobalContext } from "@/app/context/store";
import MainDeltaGraph from "./mainDeltaGraph";
import MainGraph from "./mainGraph";
import MainRelativeGraph from "./mainRelativeGraph";
import { DataSeries, Goal } from "@prisma/client";

export default function GraphGraph({
    goal,
    nationalGoal,
  }: 
  {
    goal: Goal & { dataSeries: DataSeries | null },
    nationalGoal: Goal & { dataSeries: DataSeries | null } | null, 
  }) {
  const { graphType } = useGlobalContext();

  return (
    <>
      { // TODO: Make a proper toggle
        graphType == 'mainGraph' ?
          <MainGraph goal={goal} nationalGoal={nationalGoal} /> : null
      }
      {
        graphType == 'mainRelativeGraph' ?
          <MainRelativeGraph goal={goal} nationalGoal={nationalGoal} /> : null
      }
      {
        graphType == 'mainDeltaGraph' ?
          <MainDeltaGraph goal={goal} nationalGoal={nationalGoal} /> : null
      }
    </>
  )
}