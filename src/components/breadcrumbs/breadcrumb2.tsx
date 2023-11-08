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
  /** Regex for UUIDs */
  let regexUUID = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/

  // Get the sections of the pathname and filter out empty strings
  let sections = usePathname().split('/')
  sections = sections.filter(section => !!section)

  /** A second array where the UUIDs are replaced with the related object's name or indicatorParameter */
  let sectionNames = [...sections]

  // Replace UUIDs with names or indicatorParameters
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
      // Create href from the original sections array
      let href = `/${sections.slice(0, index + 1).join('/')}`
      let linkName = section[0].toUpperCase() + section.slice(1, section.length)

      // If the section is a category, don't make it a link
      if (section == 'roadmap' || section == 'goal' || section == 'action') {
        return <span key={index} className='flex-row align-center gap-25'>
          {linkName}
          <Image src='/icons/chevronRight.svg' alt='' height={16} width={16} />
        </span>
      }
      // If it's the last section, don't add a chevron, otherwise do
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