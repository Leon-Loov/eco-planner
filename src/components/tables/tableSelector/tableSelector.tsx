"use client";

import React, { ChangeEvent, useState } from "react";
import RadioImage from "./radioImage";

export default function TableSelector() {
  const [selectedOption, setSelectedOption] = useState("listTree");

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <RadioImage value='listTree' src='/icons/listTree.svg' name='table' checked={selectedOption === "listTree"} onChange={handleRadioChange} />
      <RadioImage value='table' src='/icons/table.svg' name='table' checked={selectedOption === "table"} onChange={handleRadioChange} />
      <RadioImage value='columns' src='/icons/columns.svg' name='table' checked={selectedOption === "columns"} onChange={handleRadioChange} />
      <p>Selected option: {selectedOption}</p>
    </>
  )
}