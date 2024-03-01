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

/** Removes the value stored under `key` in sessionStorage. */
export function removeSessionStorage(key: string) {
  if (!sessionStorage) {
    console.error('No sessionStorage available');
    return;
  }

  sessionStorage.removeItem(key);
}