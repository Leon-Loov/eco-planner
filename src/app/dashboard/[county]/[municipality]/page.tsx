import { notFound, redirect } from "next/navigation"
import countiesAndMunicipalities from "@/lib/countiesAndMunicipalities.json" with { type: "json" };
import { cookies } from "next/headers";
import { getSessionData } from "@/lib/session";
import getRoadmapSubset from "@/fetchers/getRoadmapSubset";
import getOneGoal from "@/fetchers/getOneGoal";
import GoalTable from "@/components/tables/goalTables/goalTable";

export default async function Page({ params }: { params: { county: string, municipality: string } }) {
  let decodedCounty = decodeURI(params.county)
  let decodedMunicipality = decodeURI(params.municipality)
  // TODO: Allow URLs with a and o to match values with å, ä, and ö
  // Redirect to correct county
  if (!(decodedCounty in countiesAndMunicipalities)) {
    if (Object.keys(countiesAndMunicipalities).find((county) => county.toLowerCase() == decodedCounty.toLowerCase())) {
      const target = Object.keys(countiesAndMunicipalities).find((county) => county.toLowerCase() == decodedCounty.toLowerCase())
      if (!target) return notFound()
      return redirect(`/dashboard/${encodeURIComponent(target)}/${encodeURIComponent(decodedMunicipality)}`)
    } else {
      return notFound()
    }
  }

  // Redirect to correct municipality
  if (!(countiesAndMunicipalities[decodedCounty as keyof typeof countiesAndMunicipalities]).find((municipality) => municipality == decodedMunicipality)) {
    if (countiesAndMunicipalities[decodedCounty as keyof typeof countiesAndMunicipalities].find((municipality) => municipality.toLowerCase() == decodedMunicipality.toLowerCase())) {
      const target = countiesAndMunicipalities[decodedCounty as keyof typeof countiesAndMunicipalities].find((municipality) => municipality.toLowerCase() == decodedMunicipality.toLowerCase())
      if (!target) return notFound()
      return redirect(`/dashboard/${encodeURIComponent(decodedCounty)}/${encodeURIComponent(target)}`)
    } else {
      return notFound()
    }
  }

  let [session, roadmaps] = await Promise.all([
    getSessionData(cookies()),
    getRoadmapSubset(decodedCounty, decodedMunicipality)
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