'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Breadcrumb({
  relevantObjects,
}: {
  relevantObjects?: {
    id: string,
    name?: string | null,
    indicatorParameter?: string | null,
  }[]
}) {
  let regexUUID = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/
  let sections = usePathname().split('/')
  if (!sections[0]) sections.shift()
  let sectionNames = [...sections]

  for (let i in sectionNames) {
    if (sectionNames[i].match(regexUUID)) {
      let thing = relevantObjects?.find(object => object.id === sectionNames[i])
      if (thing) {
        if (!thing.name && !thing.indicatorParameter) {
          throw new Error('Breadcrumb: relevantObjects must have either a name or an indicatorParameter')
        }
        sectionNames[i] = (thing.name || thing.indicatorParameter) as string
      }
    }
  }

  return <>
    {sectionNames.map((section, index) => {
      let href = `/${sections.slice(0, index + 1).join('/')}`
      let linkName = section[0].toUpperCase() + section.slice(1, section.length)
      if (section == 'roadmap' || section == 'goal' || section == 'action') {
        return <span key={index} className='flex-row align-center gap-25'>
          {linkName}
          <Image src='/icons/chevronRight.svg' alt='' height={16} width={16} />
        </span>
      }
      return index === sectionNames.length - 1 ? (
        <span key={index} className='flex-row align-center gap-25'>
          <Link href={href}>
            {linkName}
          </Link>
        </span>
      ) : (
        <span key={index} className='flex-row align-center gap-25'>
          <Link href={href}>
            {linkName}
          </Link>
          <Image src='/icons/chevronRight.svg' alt='' height={16} width={16} />
        </span>
      );
    })}
  </>
}