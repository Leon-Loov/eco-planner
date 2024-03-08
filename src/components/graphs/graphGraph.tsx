"use client"

import MainDeltaGraph from "./mainDeltaGraph";
import MainGraph from "./mainGraph";
import MainRelativeGraph from "./mainRelativeGraph";
import { DataSeries, Goal } from "@prisma/client";
import GraphSelector from "./graphselector/graphSelector";
import { useEffect, useState } from "react";
import { getStoredGraphType } from "./graphFunctions";

export enum GraphType {
  Main = "MAIN",
  Relative = "RELATIVE",
  Delta = "DELTA",
}

export default function GraphGraph({
  goal,
  nationalGoal,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  nationalGoal: Goal & { dataSeries: DataSeries | null } | null,
}) {
  const [graphType, setGraphType] = useState<GraphType | "">("");

  useEffect(() => {
    setGraphType(getStoredGraphType(goal.id));
  }, [goal.id]);

  function graphSwitch(graphType: string) {
    switch (graphType) {
      case GraphType.Main:
        return <div>
          <h2 className="display-flex align-items-center justify-content-space-between">Målbana
            <nav className="display-flex align-items-center gap-50">
              <GraphSelector goal={goal} current={graphType} setter={setGraphType} />
            </nav>
          </h2>
          <MainGraph goal={goal} nationalGoal={nationalGoal} />
        </div>;
      case GraphType.Relative:
        return <div>
          <h2 className="display-flex align-items-center justify-content-space-between">Procent relativt basår
            <nav className="display-flex align-items-center gap-50">
              <GraphSelector goal={goal} current={graphType} setter={setGraphType} />
            </nav>
          </h2>
          <MainRelativeGraph goal={goal} nationalGoal={nationalGoal} />
        </div>;
      case GraphType.Delta:
        return <div>
          <h2 className="display-flex align-items-center justify-content-space-between">Årlig förändring
            <nav className="display-flex align-items-center gap-50">
              <GraphSelector goal={goal} current={graphType} setter={setGraphType} />
            </nav>
          </h2>
          <MainDeltaGraph goal={goal} nationalGoal={nationalGoal} />
        </div>;
      default:
        return graphSwitch(GraphType.Main);
    }
  };

  return graphSwitch(graphType);
}