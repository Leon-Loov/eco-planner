import '@/styles/global.css'
import Sidebar  from '@/components/generic/header/sidebar'
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs';
import getNames from '@/fetchers/getNames';
import { GenericEntry } from '@/types';
import styles from './page.module.css' with { type: "css" }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  // Get names and ids of all roadmaps, goals and actions

  const metaRoadmaps = await getNames()
  const roadmaps = metaRoadmaps.flatMap(metaRoadmap => metaRoadmap.roadmapVersions)
  const goals = roadmaps.flatMap(roadmap => roadmap.goals)
  const actions = goals.flatMap(goal => goal.actions)

  // Filter out nulls
  const objects = [...metaRoadmaps, ...roadmaps, ...goals, ...actions].filter(object => object != null) as GenericEntry[]

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
        <div className={`${styles.layout}`}>
          <Sidebar />
          <div className='flex-grow-100 padding-100'>
            <Breadcrumbs relevantObjects={objects} />
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}