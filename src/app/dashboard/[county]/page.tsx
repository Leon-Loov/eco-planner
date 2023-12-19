import { notFound, redirect } from "next/navigation";
import countiesAndMunicipalities from "@/lib/countiesAndMunicipalities.json" with { type: "json" };
import DashboardBase from "@/components/dashboard/dashboardBase";

export default async function Page({ params }: { params: { county: string } }) {
  let decodedCounty = decodeURI(params.county)
  // TODO: Allow URLs with a and o to match values with å, ä, and ö
  // Redirect to correct county
  if (!(decodedCounty in countiesAndMunicipalities)) {
    if (Object.keys(countiesAndMunicipalities).find((county) => county.toLowerCase() == decodedCounty.toLowerCase())) {
      const target = Object.keys(countiesAndMunicipalities).find((county) => county.toLowerCase() == decodedCounty.toLowerCase())
      if (!target) return notFound()
      return redirect(`/dashboard/${encodeURIComponent(target)}`)
    } else {
      return notFound()
    }
  }

  return <>
    <DashboardBase county={decodedCounty} />
  </>
}