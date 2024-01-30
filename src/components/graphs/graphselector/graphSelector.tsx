"use client";

import { useGlobalContext } from "@/app/context/store";
import React, { ChangeEvent } from 'react';
import RadioImage from './radioImage';
import { DataSeries, Goal } from "@prisma/client";

export default function GraphSelector({ goal }: { goal: Goal & { dataSeries: DataSeries | null } }) {
  const { graphType, setGraphType } = useGlobalContext();

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGraphType(event.target.value);
  };

  // Set the selectedOption as the context value
  return (
    <>
      <RadioImage value="mainGraph" src="/icons/chart.svg" name="graph" checked={graphType === 'mainGraph'} onChange={handleRadioChange} />
      { // Don't allow relative graph if the main graph is already percent or fraction
        goal.dataSeries?.unit.toLowerCase() != 'procent' && goal.dataSeries?.unit.toLowerCase() != 'andel' &&
        <RadioImage value="mainRelativeGraph" src="/icons/chartChange.svg" name="graph" checked={graphType === 'mainRelativeGraph '} onChange={handleRadioChange} />
      }
      <RadioImage value="mainDeltaGraph" src="/icons/delta.svg" name="graph" checked={graphType === 'mainDeltaGraph'} onChange={handleRadioChange} />
    </>
  );
}
