"use client";

import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import RadioImage from './radioImage';
import { DataSeries, Goal } from "@prisma/client";
import { GraphType } from "../graphGraph";
import { getLocalStorage, setLocalStorage } from '@/functions/localStorage';

export default function GraphSelector({
  goal,
  setter,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  setter?: Dispatch<SetStateAction<GraphType | "">>
}) {
  const [graphType, setGraphType] = useState("");

  useEffect(() => {
    const storedGraphType = getLocalStorage(goal.id + "_graphType");
    if (Object.values(GraphType).includes(storedGraphType)) {
      setGraphType(storedGraphType);
    }
    else {
      // Default to main graph
      storedGraphType != null && console.log("Invalid graph type in storage, defaulting to main graph.");
      setGraphType(GraphType.Main);
    }
  }, [goal.id]);

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGraphType(event.target.value);
    setLocalStorage(goal.id + "_graphType", event.target.value);
    if (setter) {
      if (Object.values(GraphType).includes(event.target.value as GraphType)) {
        setter(event.target.value as GraphType);
      }
      else {
        console.log("Invalid graph type");
        setter("");
      }
    }
  };

  // Set the selectedOption as the context value
  return (
    <>
      <RadioImage value={GraphType.Main} src="/icons/chart.svg" name="graph" checked={graphType == GraphType.Main} onChange={handleRadioChange} />
      { // Don't allow relative graph if the main graph is already percent or fraction
        goal.dataSeries?.unit.toLowerCase() != 'procent' && goal.dataSeries?.unit.toLowerCase() != 'andel' &&
        <RadioImage value={GraphType.Relative} src="/icons/chartChange.svg" name="graph" checked={graphType == GraphType.Relative} onChange={handleRadioChange} />
      }
      <RadioImage value={GraphType.Delta} src="/icons/delta.svg" name="graph" checked={graphType == GraphType.Delta} onChange={handleRadioChange} />
    </>
  );
}
