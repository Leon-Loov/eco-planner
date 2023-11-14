"use client"

import { useGlobalContext } from "@/app/context/store";
import MainDeltaGraph from "./mainDeltaGraph";
import MainGraph from "./mainGraph";
import MainRelativeGraph from "./mainRelativeGraph";
import { DataSeries, Goal } from "@prisma/client";
import GraphSelector from "./graphselector/graphSelector";

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
          <>
            <h2 className="flex-row align-center flex-between margin-y-50">Målbana
              <nav className="flex-row align-center gap-50">
                <GraphSelector />
              </nav>
            </h2>
            <MainGraph goal={goal} nationalGoal={nationalGoal} />
          </> : null
      }
      {
        graphType == 'mainRelativeGraph' ?
          <>
            <h2 className="flex-row align-center flex-between margin-y-50">Procent relativt basår
              <nav className="flex-row align-center gap-50">
                <GraphSelector />
              </nav>
            </h2>
            <MainRelativeGraph goal={goal} nationalGoal={nationalGoal} />
          </> : null
      }
      {
        graphType == 'mainDeltaGraph' ?
          <>
            <h2 className="flex-row align-center flex-between margin-y-50">Årlig förändring
              <nav className="flex-row align-center gap-50">
                <GraphSelector />
              </nav>
            </h2>
            <MainDeltaGraph goal={goal} nationalGoal={nationalGoal} />
          </> : null
      }
    </>
  )
}