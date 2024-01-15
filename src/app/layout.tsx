import '@/styles/global.css'
import { Header } from '@/components/generic/header/header'
import { GlobalContextProvider } from "./context/store"
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

  // Filter out nulls
  let objects = [...roadmaps, ...goals, ...actions].filter(object => object != null) as { id: string; name?: string | null | undefined; indicatorParameter?: string | null | undefined; }[]

  return (
    <html lang="en">
      <body>
        <Header />
        <div className='layout-main'>
          <Breadcrumb relevantObjects={objects} />
          <GlobalContextProvider>
            {children}
          </GlobalContextProvider>
        </div>
      </body>
    </html>
  )
}