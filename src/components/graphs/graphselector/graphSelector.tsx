"use client";

import { useGlobalContext } from "@/app/context/store";
import React, { ChangeEvent } from 'react';
import RadioImage from './radioImage';

export default function GraphSelector() {
  const { graphType, setGraphType } = useGlobalContext();

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGraphType(event.target.value);
  };

  // Set the selectedOption as the context value
  return (
    <>
      <RadioImage value="mainGraph" src="/icons/chart.svg" name="graph" checked={graphType === 'mainGraph'} onChange={handleRadioChange} />
      <RadioImage value="mainRelativeGraph" src="/icons/chartChange.svg" name="graph" checked={graphType === 'mainRelativeGraph '} onChange={handleRadioChange} />
      <RadioImage value="mainDeltaGraph" src="/icons/delta.svg" name="graph" checked={graphType === 'mainDeltaGraph'} onChange={handleRadioChange} />
    </>
  );
}
