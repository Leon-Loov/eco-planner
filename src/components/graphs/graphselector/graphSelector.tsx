"use client";

import { useGlobalContext } from "@/app/context/store";
import React, { ChangeEvent } from 'react';
import RadioImage from './radioImage';

export default function GraphSelector() {
  const { graphType, setGraphType } = useGlobalContext();

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGraphType(event.target.value);
    console.log(graphType)
  };

  // Set the selectedOption as the context value
  return (
    <>
      <RadioImage value="mainGraph" src="/icons/listTree.svg" name="table" checked={graphType === 'mainGraph'} onChange={handleRadioChange} />
      <RadioImage value="mainRelativeGraph" src="/icons/table.svg" name="table" checked={graphType === 'mainRelativeGraph '} onChange={handleRadioChange} />
      <RadioImage value="mainDeltaGraph" src="/icons/table.svg" name="table" checked={graphType === 'mainDeltaGraph'} onChange={handleRadioChange} />
    </>
  );
}
