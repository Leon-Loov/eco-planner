"use client"

import MainDeltaGraph from "./mainDeltaGraph";
import MainGraph from "./mainGraph";
import MainRelativeGraph from "./mainRelativeGraph";
import { DataSeries, Goal } from "@prisma/client";
import GraphSelector from "./graphselector/graphSelector";
import { useEffect, useState } from "react";
import { getSessionStorage } from "@/functions/localStorage";

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
    const storedGraphType = getSessionStorage(goal.id + "_graphType");
    if (Object.values(GraphType).includes(storedGraphType)) {
      setGraphType(storedGraphType);
    }
    else {
      // Default to main graph
      storedGraphType != null && console.log("Invalid graph type in storage, defaulting to main graph.");
      setGraphType(GraphType.Main);
    }
  }, [goal.id]);

  function graphSwitch(graphType: string) {
    switch (graphType) {
      case GraphType.Main:
        return <div>
          <h2 className="display-flex align-items-center justify-content-space-between">Målbana
            <nav className="display-flex align-items-center gap-50">
              <GraphSelector goal={goal} setter={setGraphType} />
            </nav>
          </h2>
          <MainGraph goal={goal} nationalGoal={nationalGoal} />
        </div>;
      case GraphType.Relative:
        return <div>
          <h2 className="display-flex align-items-center justify-content-space-between">Procent relativt basår
            <nav className="display-flex align-items-center gap-50">
              <GraphSelector goal={goal} setter={setGraphType} />
            </nav>
          </h2>
          <MainRelativeGraph goal={goal} nationalGoal={nationalGoal} />
        </div>;
      case GraphType.Delta:
        return <div>
          <h2 className="display-flex align-items-center justify-content-space-between">Årlig förändring
            <nav className="display-flex align-items-center gap-50">
              <GraphSelector goal={goal} setter={setGraphType} />
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