import { getLocalStorage, getSessionStorage, setLocalStorage, setSessionStorage } from "@/functions/localStorage";
import { GraphType } from "./graphGraph";

/** Retrieves the graph type for a goal from storage. */
export function getStoredGraphType(goalId?: string) {
  let graphType: GraphType | undefined;
  // Check if this goal has a stored graph type
  if (goalId) {
    graphType = getSessionStorage(goalId + '_graphType');
  }
  // Check if the user has a stored latest graph type if no goalId is provided or the returned graphType is invalid
  if (!Object.values(GraphType).includes(graphType as any)) {
    graphType = getLocalStorage("graphType");
  }
  // Default to main graph if no valid graph type is found
  if (!Object.values(GraphType).includes(graphType as any) || graphType == null) {
    graphType != null && console.log("Invalid graph type in storage, defaulting to main graph.");
    setLocalStorage("graphType", GraphType.Main);
    graphType = GraphType.Main;
  }
  return graphType;
}

/** Stores the graph type for a goal in storage. */
export function setStoredGraphType(graphType: string, goalId?: string) {
  if (goalId) {
    setSessionStorage(goalId + "_graphType", graphType)
  };
  setLocalStorage("graphType", graphType);
}