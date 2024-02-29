"use client";

import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import RadioImage from './radioImage';
import { getLocalStorage, setLocalStorage } from "@/functions/localStorage";
import { ViewMode } from '../goals';

export default function TableSelector({ id, setter }: { id?: string, setter?: Dispatch<SetStateAction<ViewMode | "">> }) {
  const [tableType, setTableType] = useState("");

  useEffect(() => {
    const storedTableType = getLocalStorage(id + "_viewMode")
    if (Object.values(ViewMode).includes(storedTableType as ViewMode)) {
      setTableType(storedTableType as ViewMode)
    }
    else {
      // Default to tree view
      console.log("Invalid view mode in storage, defaulting to tree view.")
      setTableType(ViewMode.Tree)
    }
  }, [id]);

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTableType(event.target.value);
    setLocalStorage(id + "_viewMode", event.target.value);
    if (setter) {
      if (Object.values(ViewMode).includes(event.target.value as ViewMode)) {
        setter(event.target.value as ViewMode);
      }
      else {
        console.log("Invalid view mode")
        setter("");
      }
    }
  };

  // Set the selectedOption as the context value
  return (
    <>
      <RadioImage value={ViewMode.Tree} src="/icons/listTree.svg" name="table" checked={tableType == ViewMode.Tree} onChange={handleRadioChange} />
      <RadioImage value={ViewMode.Table} src="/icons/table.svg" name="table" checked={tableType == ViewMode.Table} onChange={handleRadioChange} />
    </>
  );
}
