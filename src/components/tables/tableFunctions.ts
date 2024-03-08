import { getLocalStorage, getSessionStorage, setLocalStorage, setSessionStorage } from "@/functions/localStorage";
import { ViewMode } from "./goals";

/** Retrieves the view mode for a roadmap from storage. */
export function getStoredViewMode(id?: string) {
  let viewMode: ViewMode | undefined | null;
  // Check if this goal has a stored view mode
  if (id) {
    viewMode = getSessionStorage(id + '_viewMode');
  }
  // Check if the user has a stored latest view mode if no id is provided or the returned viewMode is invalid
  if (!Object.values(ViewMode).includes(viewMode as any) || !viewMode) {
    viewMode = getLocalStorage("viewMode");
  }
  // Default to tree view if no valid view mode is found
  if (!Object.values(ViewMode).includes(viewMode as any) || !viewMode) {
    !!viewMode && console.log("Invalid view mode in storage, defaulting to tree view.");
    setLocalStorage("viewMode", ViewMode.Tree);
    viewMode = ViewMode.Tree;
  }
  return viewMode;
}

/** Stores the view mode for a roadmap in storage. */
export function setStoredViewMode(viewMode: string, id?: string) {
  if (id) {
    setSessionStorage(id + "_viewMode", viewMode)
  };
  setLocalStorage("viewMode", viewMode);
}