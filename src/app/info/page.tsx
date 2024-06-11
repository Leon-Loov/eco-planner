import version from "@/lib/version.json" with { type: "json" };

export default function Page() {
  let remoteURL: URL | null = null
  let parsedVersion: string | null = null
  let commitURL: URL | null = null
  try {
    if (typeof version.remoteURL === "string") {
      remoteURL = new URL(version.remoteURL.endsWith("/") ? version.remoteURL : version.remoteURL + "/")
    }
  } catch (e) { /* Silently fail */ }
  if (typeof version.shortHash === "string") {
    parsedVersion = version.shortHash
    if (remoteURL) {
      commitURL = new URL(`commit/${version.shortHash}`, remoteURL)
    }
  }

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
        remoteURL
          ? <p>Remote: <a href={remoteURL.href} target="_blank" >
            {/* Gets the repository name from a github-like url with a trailing slash, with hostname as fallback */}
            {remoteURL.pathname.split("/")[remoteURL.pathname.split("/").length - 2] || remoteURL.hostname}
          </a></p>
          : null
      }
      {
        parsedVersion
          ? commitURL
            ? <p>Build: <a href={commitURL.href} target="_blank" >
              {parsedVersion}
            </a></p>
            :
            <p>Build: {parsedVersion}</p>
          : null
      }
    </>
  )
}