'use client';

import { useEffect } from "react";

export function setLocalStorage(key: string, value: any) {
  if (!localStorage) {
    throw new Error('No localStorage available');
  }

  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorage(key: string) {
  if (!localStorage) {
    throw new Error('No localStorage available');
  }

  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
}

export function removeLocalStorage(key: string) {
  if (!localStorage) {
    throw new Error('No localStorage available');
  }

  localStorage.removeItem(key);
}