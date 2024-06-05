import version from "@/lib/version.json" with { type: "json" };

export default function Page() {
  let parsedVersion: string | null = null
  let remoteURL: URL | null = null
  if (typeof version.shortHash === "string") {
    parsedVersion = version.shortHash
  }
  try {
    if (typeof version.remoteURL === "string") {
      remoteURL = new URL(`commit/${parsedVersion}`, (version.remoteURL.endsWith("/") ? version.remoteURL : version.remoteURL + "/"))
    }
  } catch (e) { /* Silently fail */ }

  return (
    <>
      <h1>Information</h1>
      <p>
        Detta verktyg syftar till att bidra till Sveriges klimatomställning.
        I verktyget kan nationella scenarier, även kallade kvantitativa färdplaner, brytas ner till regional och lokal nivå och en handlingsplan kan skapas.
        Handlingsplanen byggs upp av åtgärder vilka relaterar till en specifik målbana och målbanorna utgör tillsammans hela färdplanen.
        Användare kan inspireras av varandras åtgärder, på så sätt skapas en gemensam åtgärdsdatabas för Sverige.
        På lokal nivå kan också olika aktörer samarbeta kring åtgärder.
      </p>
      { // Display as much build info as possible
        parsedVersion
          ? remoteURL
            ? <p>Build: <a href={remoteURL.href} target="_blank" >
              {parsedVersion}
            </a></p>
            :
            <p>Build: {parsedVersion}</p>
          : null
      }
    </>
  )
}