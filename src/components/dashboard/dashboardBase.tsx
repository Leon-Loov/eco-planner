import getOneGoal from "@/fetchers/getOneGoal";
import getRoadmapSubset from "@/fetchers/getRoadmapSubset";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import GoalTable from "../tables/goalTables/goalTable";
import { Action } from "@prisma/client";
import { AccessControlled } from "@/types";
import ActionTable from "../tables/actionTables/actionTable";
import RoadmapTable from "../tables/roadmapTable";

export default async function DashboardBase({ county, municipality }: { county: string, municipality?: string }) {
  let [session, roadmaps] = await Promise.all([
    getSessionData(cookies()),
    getRoadmapSubset(county, municipality)
  ]);

  let goalIds: string[] = []
  for (let roadmap of roadmaps) {
    for (let goal of roadmap.goals) {
      goalIds.push(goal.id)
    }
  }

  let goals: Awaited<ReturnType<typeof getOneGoal>>[] = []

  if (roadmaps) {
    // Get all goals
    goals = await Promise.all(goalIds.map((goalId) => {
      return getOneGoal(goalId).catch((e: any) => { return null })
    }))

    // Remove null values
    goals = goals.filter((goal) => goal != null)
  }

  // Get a list of actions
  let actions: (Action & AccessControlled & { goals: { id: string, roadmap: { id: string } }[] })[] = [];
  for (let goal of goals) {
    if (!goal) continue;
    for (let action of goal.actions) {
      actions.push({ ...action, goals: [{ id: goal.id, roadmap: { id: goal.roadmap.id } }] })
    }
  }

  return <>
    <RoadmapTable title={municipality || county} roadmaps={roadmaps} user={session.user} />
    <GoalTable goals={goals} />
    <ActionTable actions={actions} />
  </>
}