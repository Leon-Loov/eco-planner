"use client";

import React, { ChangeEvent, useState, useContext } from 'react';
import RadioImage from './radioImage';
import { tableContext } from '../tableContext';

export interface TableValueContext {
  tableValue: string;
  setTableValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function TableSelector() {
  let currentValue: string = useContext(tableContext)
  const [tableValue, setTableValue] = useState<string>(currentValue);

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTableValue(event.target.value);
  };

  // Set the selectedOption as the context value
  return (
    <tableContext.Provider value={tableValue}>
      <>
        <RadioImage value="listTree" src="/icons/listTree.svg" name="table" checked={tableValue === 'listTree'} onChange={handleRadioChange} />
        <RadioImage value="table" src="/icons/table.svg" name="table" checked={tableValue === 'table'} onChange={handleRadioChange} />
        <RadioImage value="columns" src="/icons/columns.svg" name="table" checked={tableValue === 'columns'} onChange={handleRadioChange} />
        <p>Selected option: {tableValue}</p>
      </>
    </tableContext.Provider>
  );
}
