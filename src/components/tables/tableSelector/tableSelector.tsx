"use client";

import { useGlobalContext } from "@/app/context/store";
import React, { ChangeEvent } from 'react';
import RadioImage from './radioImage';

export default function TableSelector() {
  const { tableType, setTableType } = useGlobalContext();

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTableType(event.target.value);
  };

  // Set the selectedOption as the context value
  return (
    <>
      <RadioImage value="listTree" src="/icons/listTree.svg" name="table" checked={tableType === 'listTree'} onChange={handleRadioChange} />
      <RadioImage value="table" src="/icons/table.svg" name="table" checked={tableType === 'table'} onChange={handleRadioChange} />
      <RadioImage value="minTable" src="/icons/columns.svg" name="table" checked={tableType === 'minTable'} onChange={handleRadioChange} />
    </>
  );
}
