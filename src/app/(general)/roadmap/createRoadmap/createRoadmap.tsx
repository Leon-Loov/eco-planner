'use client'

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const form = event.target as HTMLFormElement
  const formJSON = JSON.stringify({
    name: form.roadmapName.value,
    isNational: !!form.isNational?.value,
  })

  fetch('/api/createRoadmap', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    } else {
      throw new Error('Roadmap could not be created.')
    }
  }).then(data => {
    window.location.href = `/roadmap/${data.id}`
  }).catch((err) => {
    alert('Färdplan kunde inte skapas.')
  })
}

export default function CreateRoadmap({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Namn på färdplanen: </label>
        <input type="text" name="roadmapName" required={true} id="roadmapName" />
        <br />
        {/* The 'children' prop contains a toggle to make the roadmap a national roadmap and should only be visible to admins */}
        {children}
        <p>
          Här ska det finnas möjlighet att välja vilka som kan se och/eller redigera färdplan.
        </p>
        {/*
          TODO: Add a way to choose who can see and/or edit, something like
          Public, Internal, Private, Custom (with a list of groups to choose from).
          Also allow adding specific people individually, by email address.
          This should probably be done as a component that is reused
          in all forms that include editing/viewing permissions.
        */}
        <br />
        <input type="submit" value="Skapa färdplan" />
      </form>
    </>
  )
}