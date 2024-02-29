'use client';

// Silently fail if localStorage is not available, but log an error to the user

/** Stringifies `value` and stores it in localStorage under `key`. */
export function setLocalStorage(key: string, value: any) {
  if (!localStorage) {
    console.error('No localStorage available');
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

/** Retrieves the value stored under `key` in localStorage, parsed as JSON. */
export function getLocalStorage(key: string): any {
  if (!localStorage) {
    console.error('No localStorage available');
    return null;
  }

  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
}

/** Removes the value stored under `key` in localStorage. */
export function removeLocalStorage(key: string) {
  if (!localStorage) {
    console.error('No localStorage available');
    return;
  }

  localStorage.removeItem(key);
}