import getRoadmapSubset from "@/fetchers/getRoadmapSubset";
import { getSessionData } from "@/lib/session";
import { cookies } from "next/headers";
import countiesAndMunicipalities from "@/lib/countiesAndMunicipalities.json" with { type: "json" };
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: { county: string } }) {
  let decodedCounty = decodeURI(params.county)
  console.log(decodedCounty)
  console.log(Object.keys(countiesAndMunicipalities))
  if (!(decodedCounty in countiesAndMunicipalities)) {
    if (Object.keys(countiesAndMunicipalities).find((county) => county.toLowerCase() == decodedCounty.toLowerCase())) {
      const target = Object.keys(countiesAndMunicipalities).find((county) => county.toLowerCase() == decodedCounty.toLowerCase())
      return redirect(`/dashboard/${target}`)
    } else {
      return notFound()
    }
  }

  await Promise.all([
    getSessionData(cookies()),
    getRoadmapSubset(decodedCounty)
  ]);
}