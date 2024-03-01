import '@/styles/global.css'
import { Header } from '@/components/generic/header/header'
import Breadcrumb from '@/components/breadcrumbs/breadcrumb2';
import getNames from '@/fetchers/getNames';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  // Get names and ids of all roadmaps, goals and actions
  let metaRoadmaps = await getNames()
  let roadmaps = metaRoadmaps.flatMap(metaRoadmap => metaRoadmap.roadmapVersions)
  let goals = roadmaps.flatMap(roadmap => roadmap.goals)
  let actions = goals.flatMap(goal => goal.actions)

  type GenericObject = (
    {
      // Action or MetaRoadmap
      id: string,
      name: string,
      indicatorParameter: never,
      metaRoadmap: never,
    } |
    {
      // Goal
      id: string,
      name?: string | null,
      indicatorParameter: string,
      metaRoadmap: never,
    } |
    {
      // Roadmap
      id: string,
      name: never,
      indicatorParameter: never,
      metaRoadmap: { name: string },
    }
  )

  // Filter out nulls
  let objects = [...metaRoadmaps, ...roadmaps, ...goals, ...actions].filter(object => object != null) as GenericObject[]

  return (
    <html lang="sv">
      <head>
        <title>Eco - Planner</title>
        <link rel="icon" type="image/x-icon" href="/icons/leaf.svg" />


        <meta name="description" content="Ett verktyg som syftar till att bidra till Sveriges klimatomställning. 
        I verktyget kan nationella scenarier, även kallade kvantitativa färdplaner, brytas ner till regional och lokal nivå och en handlingsplan kan skapas. 
        Handlingsplanen byggs upp av åtgärder vilka relaterar till en specifik målbana och målbanorna utgör tillsammans hela färdplanen. 
        Användare kan inspireras av varandras åtgärder, på så sätt skapas en gemensam åtgärdsdatabas för Sverige. På lokal nivå kan också olika aktörer samarbeta kring åtgärder. "/>

        {/* Facebook Meta Tags */}
        <meta name="og:site_name" content="Eco - Planner" />
        <meta property="og:url" content="https://stuns.molnet.xyz/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Eco - Planner" />
        <meta property="og:description" content="Ett verktyg som syftar till att bidra till Sveriges klimatomställning. 
        I verktyget kan nationella scenarier, även kallade kvantitativa färdplaner, brytas ner till regional och lokal nivå och en handlingsplan kan skapas. 
        Handlingsplanen byggs upp av åtgärder vilka relaterar till en specifik målbana och målbanorna utgör tillsammans hela färdplanen. 
        Användare kan inspireras av varandras åtgärder, på så sätt skapas en gemensam åtgärdsdatabas för Sverige. På lokal nivå kan också olika aktörer samarbeta kring åtgärder. "/>
        <meta property="og:image" content="https://stuns.molnet.xyz/images/roadmap.jpg" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="stuns.molnet.xyz" />
        <meta property="twitter:url" content="https://stuns.molnet.xyz/" />
        <meta name="twitter:title" content="Eco - Planner" />
        <meta name="twitter:description" content="Ett verktyg som syftar till att bidra till Sveriges klimatomställning. 
        I verktyget kan nationella scenarier, även kallade kvantitativa färdplaner, brytas ner till regional och lokal nivå och en handlingsplan kan skapas. 
        Handlingsplanen byggs upp av åtgärder vilka relaterar till en specifik målbana och målbanorna utgör tillsammans hela färdplanen. 
        Användare kan inspireras av varandras åtgärder, på så sätt skapas en gemensam åtgärdsdatabas för Sverige. På lokal nivå kan också olika aktörer samarbeta kring åtgärder. "/>
        <meta name="twitter:image" content="https://stuns.molnet.xyz/images/roadmap.jpg" />


      </head>
      <body>
        <div className='display-flex'>
          <Header />
          <div className='flex-grow-100 padding-100' style={{ minWidth: '0' }}>
            <Breadcrumb relevantObjects={objects} />
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}