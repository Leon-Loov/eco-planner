import '@/styles/global.css'
import { Header } from '@/components/header/header'
import { GlobalContextProvider } from "./context/store"
import getOneRoadmap from '@/functions/getOneRoadmap';
import Breadcrumb from '@/components/breadcrumbs/breadcrumb2';
import getRoadmaps from '@/functions/getRoadmaps';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  // If there are params, get the relevant objects
  let roadmaps = await getRoadmaps()
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