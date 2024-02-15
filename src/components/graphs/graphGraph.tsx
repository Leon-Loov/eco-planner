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
    <div>
      { // TODO: Make a proper toggle
        graphType == 'mainGraph' ?
          <>
            <h2 className="display-flex align-items-center justify-content-space-between">Målbana
              <nav className="display-flex align-items-center gap-50">
                <GraphSelector goal={goal} />
              </nav>
            </h2>
            <MainGraph goal={goal} nationalGoal={nationalGoal} />
          </> : null
      }
      {
        graphType == 'mainRelativeGraph' ?
          <>
            <h2 className="display-flex align-items-center justify-content-space-between">Procent relativt basår
              <nav className="display-flex align-items-center gap-50">
                <GraphSelector goal={goal} />
              </nav>
            </h2>
            <MainRelativeGraph goal={goal} nationalGoal={nationalGoal} />
          </> : null
      }
      {
        graphType == 'mainDeltaGraph' ?
          <>
            <h2 className="display-flex align-items-center justify-content-space-between">Årlig förändring
              <nav className="display-flex align-items-center gap-50">
                <GraphSelector goal={goal} />
              </nav>
            </h2>
            <MainDeltaGraph goal={goal} nationalGoal={nationalGoal} />
          </> : null
      }
    </div>
  )
}