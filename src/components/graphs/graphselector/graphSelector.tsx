import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import RadioImage from './radioImage';
import { DataSeries, Goal } from "@prisma/client";
import { GraphType } from "../graphGraph";
import { getSessionStorage, setSessionStorage } from '@/functions/localStorage';

export default function GraphSelector({
  goal,
  current,
  setter,
}: {
  goal: Goal & { dataSeries: DataSeries | null },
  current: GraphType | "",
  setter: Dispatch<SetStateAction<GraphType | "">>
}) {
  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSessionStorage(goal.id + "_graphType", event.target.value);
    if (Object.values(GraphType).includes(event.target.value as GraphType)) {
      setter(event.target.value as GraphType);
    }
    else {
      console.log("Invalid graph type");
      setter("");
    }
  };

  // Set the selectedOption as the context value
  return (
    <>
      <RadioImage value={GraphType.Main} src="/icons/chart.svg" name="graph" checked={current == GraphType.Main} onChange={handleRadioChange} />
      { // Don't allow relative graph if the main graph is already percent or fraction
        goal.dataSeries?.unit.toLowerCase() != 'procent' && goal.dataSeries?.unit.toLowerCase() != 'andel' &&
        <RadioImage value={GraphType.Relative} src="/icons/chartChange.svg" name="graph" checked={current == GraphType.Relative} onChange={handleRadioChange} />
      }
      <RadioImage value={GraphType.Delta} src="/icons/delta.svg" name="graph" checked={current == GraphType.Delta} onChange={handleRadioChange} />
    </>
  );
}
