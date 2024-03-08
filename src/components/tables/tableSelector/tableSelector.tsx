import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import RadioImage from './radioImage';
import { ViewMode } from '../goals';
import { setStoredViewMode } from '../tableFunctions';

export default function TableSelector({ id, current, setter }: { id: string, current: ViewMode | "", setter: Dispatch<SetStateAction<ViewMode | "">> }) {

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStoredViewMode(event.target.value, id);
    if (Object.values(ViewMode).includes(event.target.value as ViewMode)) {
      setter(event.target.value as ViewMode);
    }
    else {
      console.log("Invalid view mode")
      setter("");
    }
  };

  // Set the selectedOption as the context value
  return (
    <>
      <RadioImage value={ViewMode.Tree} src="/icons/listTree.svg" name="table" checked={current == ViewMode.Tree} onChange={handleRadioChange} />
      <RadioImage value={ViewMode.Table} src="/icons/table.svg" name="table" checked={current == ViewMode.Table} onChange={handleRadioChange} />
    </>
  );
}
