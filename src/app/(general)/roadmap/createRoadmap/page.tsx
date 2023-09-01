import { getSessionData } from '@/lib/session';
import CreateRoadmap from './createRoadmap';
import { cookies } from 'next/headers';

export default async function Page() {
  let session = await getSessionData(cookies())
  return (
    <>
      <h1>Skapa färdplan</h1>
      <CreateRoadmap>
        { // This is the toggle to make the roadmap a national roadmap and should only be visible to admins
          session.user?.isAdmin &&
          <>
            <label htmlFor="isNational">Är färdplanen en nationell färdplan?</label>
            <input type="checkbox" name="isNational" id="isNational" />
            <br />
          </>
        }
      </CreateRoadmap>
    </>
  )
}