import { notFound, redirect } from "next/navigation"
import countiesAndMunicipalities from "@/lib/countiesAndMunicipalities.json" with { type: "json" };
import DashboardBase from "@/components/dashboard/dashboardBase";

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

  return <>
    <DashboardBase county={decodedCounty} municipality={decodedMunicipality} />
  </>
}