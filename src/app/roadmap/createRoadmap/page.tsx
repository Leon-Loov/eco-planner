import { getSessionData } from '@/lib/session';
import RoadmapForm from '@/components/forms/roadmapForm/roadmapForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import getMetaRoadmaps from '@/fetchers/getMetaRoadmaps';

export default async function Page() {
  let [session, metaRoadmapAlternatives] = await Promise.all([
    getSessionData(cookies()),
    getMetaRoadmaps(),
  ]);

  // User must be signed in
  if (!session.user) {
    return notFound();
  }

  metaRoadmapAlternatives = metaRoadmapAlternatives.filter(metaRoadmap => {
    if (metaRoadmap.author.id === session.user?.id) {
      return true
    }
    if (metaRoadmap.editors.some(editor => editor.id === session.user?.id)) {
      return true
    }
    if (metaRoadmap.editGroups.some(editGroup => session.user?.userGroups.some(userGroup => userGroup === editGroup.name))) {
      return true
    }
    return false
  })

  return (
    <>
      <div className='container-text' style={{marginInline: 'auto'}}>
        <h1>Skapa en ny version av en färdplan</h1>
        <RoadmapForm
          user={session.user}
          userGroups={session.user?.userGroups}
          metaRoadmapAlternatives={metaRoadmapAlternatives}
        />
      </div>
    </>
  )
}