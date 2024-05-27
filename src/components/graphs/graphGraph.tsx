"use client"

import MainDeltaGraph from "./mainGraphs/mainDeltaGraph";
import MainGraph from "./mainGraphs/mainGraph";
import MainRelativeGraph from "./mainGraphs/mainRelativeGraph";
import { DataSeries, Goal } from "@prisma/client";
import GraphSelector from "./graphselector/graphSelector";
import { useEffect, useState } from "react";
import { getStoredGraphType } from "./functions/graphFunctions";
import { PxWebApiV2TableContent } from "@/lib/pxWeb/pxWebApiV2Types";
import { allowStorage, clearStorage, storageConsent } from "@/functions/localStorage";

export enum GraphType {
  Main = "MAIN",
  Relative = "RELATIVE",
  Delta = "DELTA",
}

export default function GraphGraph({
  goal,
  nationalGoal,
  historicalData,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  nationalGoal: Goal & { dataSeries: DataSeries | null } | null,
  historicalData?: PxWebApiV2TableContent | null,
}) {
  const [graphType, setGraphType] = useState<GraphType | "">("");
  const [storageAllowed, setStorageAllowed] = useState(false)

  useEffect(() => {
    setStorageAllowed(storageConsent())
  }, [])
  useEffect(() => {
    setGraphType(getStoredGraphType(goal.id));
  }, [goal.id]);

  function graphSwitch(graphType: string) {
    switch (graphType) {
      case GraphType.Main:
        return <div>
          <label>
            <input type="checkbox" id="allowStorage" checked={storageAllowed} onChange={e => {
              if (e.target.checked) {
                setStorageAllowed(true);
                allowStorage();
              } else {
                setStorageAllowed(false);
                clearStorage();
              }
            }} />
            Spara framtida vyändringar mellan sessioner och sidnavigeringar
          </label>
          <nav className="display-flex align-items-center gap-25 margin-y-100">
            <GraphSelector goal={goal} current={graphType} setter={setGraphType} />
          </nav>
          <MainGraph goal={goal} nationalGoal={nationalGoal} historicalData={historicalData} />
        </div>;
      case GraphType.Relative:
        return <div>
          <label >
            <input type="checkbox" id="allowStorage" checked={storageAllowed} onChange={e => {
              if (e.target.checked) {
                setStorageAllowed(true);
                allowStorage();
              } else {
                setStorageAllowed(false);
                clearStorage();
              }
            }} />
            Spara framtida vyändringar mellan sessioner och sidnavigeringar
          </label>
          <nav className="display-flex align-items-center gap-25 margin-y-100">
            <GraphSelector goal={goal} current={graphType} setter={setGraphType} />
          </nav>
          <MainRelativeGraph goal={goal} nationalGoal={nationalGoal} />
        </div>;
      case GraphType.Delta:
        return <div>
          <label >
            <input type="checkbox" id="allowStorage" checked={storageAllowed} onChange={e => {
              if (e.target.checked) {
                setStorageAllowed(true);
                allowStorage();
              } else {
                setStorageAllowed(false);
                clearStorage();
              }
            }} />
            Spara framtida vyändringar mellan sessioner och sidnavigeringar
          </label>
          <nav className="display-flex align-items-center gap-25 margin-y-100">
            <GraphSelector goal={goal} current={graphType} setter={setGraphType} />
          </nav>
          <MainDeltaGraph goal={goal} nationalGoal={nationalGoal} />
        </div>;
      default:
        return graphSwitch(GraphType.Main);
    }
  };

  return (
    <>

      {graphSwitch(graphType)}
    </>
  );
}