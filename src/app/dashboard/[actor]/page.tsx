import { notFound, redirect } from "next/navigation";
import countiesAndMunicipalities from "@/lib/countiesAndMunicipalities.json" with { type: "json" };
import DashboardBase from "@/components/dashboard/dashboardBase";

export default async function Page({ params }: { params: { actor: string } }) {
  let decodedActor = decodeURI(params.actor)
  // TODO: Get valid actors from some other source, since they can now be more than just counties and municipalities
  // TODO: Allow URLs with a and o to match values with å, ä, and ö
  // Redirect to correct county
  if (!(decodedActor in countiesAndMunicipalities)) {
    if (Object.keys(countiesAndMunicipalities).find((actor) => actor.toLowerCase() == decodedActor.toLowerCase())) {
      const target = Object.keys(countiesAndMunicipalities).find((county) => county.toLowerCase() == decodedActor.toLowerCase())
      if (!target) return notFound()
      return redirect(`/dashboard/${encodeURIComponent(target)}`)
    } else {
      return notFound()
    }
  }

  return <>
    <DashboardBase actor={decodedActor} />
  </>
}