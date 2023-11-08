import '@/styles/global.css'
import { Header } from '@/components/header/header'
import { GlobalContextProvider } from "./context/store"
import getOneRoadmap from '@/functions/getOneRoadmap';
import Breadcrumb from '@/components/breadcrumbs/breadcrumb2';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: {
    roadmapId?: string,
    goalId?: string,
    actionId?: string,
  }
}) {
  // If there are params, get the relevant objects
  let roadmap = params.roadmapId ? await getOneRoadmap(params.roadmapId) : null;
  let goal = params.goalId && roadmap ? roadmap.goals.find(goal => goal.id === params.goalId) ?? null : null;
  let action = params.actionId && goal ? goal.actions.find(action => action.id === params.actionId) ?? null : null;

  // Filter out nulls
  let relevantObjects = [roadmap, goal, action].filter(object => object != null) as { id: string; name?: string | null | undefined; indicatorParameter?: string | null | undefined; }[]

  return (
    <html lang="en">
      <body>
        <Header />
        <div className='layout-main'>
          <Breadcrumb relevantObjects={relevantObjects} />
          <GlobalContextProvider>
            {children}
          </GlobalContextProvider>
        </div>
      </body>
    </html>
  )
}