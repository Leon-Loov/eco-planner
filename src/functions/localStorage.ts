'use client';

// Silently fail if sessionStorage is not available, but log an error to the user

/** Stringifies `value` and stores it in sessionStorage under `key`. */
export function setSessionStorage(key: string, value: any) {
  if (!sessionStorage) {
    console.error('No sessionStorage available');
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(value));
}

/** Stringifies `value` and stores it in localStorage under `key`. */
export function setLocalStorage(key: string, value: any) {
  if (!localStorage) {
    console.error('No localStorage available');
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

/** Retrieves the value stored under `key` in sessionStorage, parsed as JSON. */
export function getSessionStorage(key: string): any {
  if (!sessionStorage) {
    console.error('No sessionStorage available');
    return null;
  }

  const value = sessionStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
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

/** Retrieves all keys in sessionStorage. */
export function getSessionStorageKeys() {
  if (!sessionStorage) {
    console.error('No sessionStorage available');
    return null;
  }

  return Object.keys(sessionStorage);
}

/** Retrieves all keys in localStorage. */
export function getLocalStorageKeys() {
  if (!localStorage) {
    console.error('No localStorage available');
    return null;
  }

  return Object.keys(localStorage);
}

/** Removes the value stored under `key` in sessionStorage. */
export function removeSessionStorage(key: string) {
  if (!sessionStorage) {
    console.error('No sessionStorage available');
    return;
  }

  sessionStorage.removeItem(key);
}

/** Removes the value stored under `key` in localStorage. */
export function removeLocalStorage(key: string) {
  if (!localStorage) {
    console.error('No localStorage available');
    return;
  }

  localStorage.removeItem(key);
}