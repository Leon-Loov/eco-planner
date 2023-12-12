import getRoadmapSubset from "@/fetchers/getRoadmapSubset";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import countiesAndMunicipalities from "@/lib/countiesAndMunicipalities.json" with { type: "json" };
import { notFound, redirect } from "next/navigation";
import getOneGoal from "@/fetchers/getOneGoal";
import GoalTable from "@/components/tables/goalTables/goalTable";

export default async function Page({ params }: { params: { county: string } }) {
  let decodedCounty = decodeURI(params.county)
  // TODO: Allow URLs with a and o to match values with å, ä, and ö
  if (!(decodedCounty in countiesAndMunicipalities)) {
    if (Object.keys(countiesAndMunicipalities).find((county) => county.toLowerCase() == decodedCounty.toLowerCase())) {
      const target = Object.keys(countiesAndMunicipalities).find((county) => county.toLowerCase() == decodedCounty.toLowerCase())
      if (!target) return notFound()
      return redirect(`/dashboard/${encodeURIComponent(target)}`)
    } else {
      return notFound()
    }
  }

  let [session, roadmaps] = await Promise.all([
    getSessionData(cookies()),
    getRoadmapSubset(decodedCounty)
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
    goals = goals.filter((goal) => goal)
  }

  return <>
    <GoalTable goals={goals} />
  </>
}