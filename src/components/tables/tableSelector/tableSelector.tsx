"use client";

import { useGlobalContext } from "@/app/context/store";
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import RadioImage from './radioImage';
import { getLocalStorage, setLocalStorage } from "@/functions/localStorage";

export default function TableSelector({ id, setter }: { id?: string, setter?: Dispatch<SetStateAction<string>> }) {
  const [tableType, setTableType] = useState("");

  useEffect(() => {
    setTableType(getLocalStorage(id + "_viewMode"));
  }, [id]);

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTableType(event.target.value);
    setLocalStorage(id + "_viewMode", event.target.value);
    if (setter) setter(event.target.value);
  };

  // Set the selectedOption as the context value
  return (
    <>
      <RadioImage value="listTree" src="/icons/listTree.svg" name="table" checked={tableType === 'listTree'} onChange={handleRadioChange} />
      <RadioImage value="table" src="/icons/table.svg" name="table" checked={tableType === 'table'} onChange={handleRadioChange} />
    </>
  );
}
