'use client'

import { GenericEntry } from '@/types'
import styles from './breadcrumbs.module.css' with { type: "css" }
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Breadcrumbs({
  relevantObjects,
}: {
  relevantObjects: GenericEntry[]
}) {
  /** Regex for UUIDs */
  const regexUUID = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/

  // Get the sections of the pathname and filter out empty strings
  let sections = usePathname().split('/')
  sections = sections.filter(section => !!section)
  sections = sections.map(section => decodeURI(section))

  /** A second array where the UUIDs are replaced with the related object's name or indicatorParameter */
  const sectionNames = [...sections]

  // Replace UUIDs with names or indicatorParameters
  for (const i in sectionNames) {
    if (sectionNames[i].match(regexUUID)) {
      const thing = relevantObjects?.find(object => object.id === sectionNames[i])
      if (thing) {
        if (!thing.name && !thing.indicatorParameter && !thing.metaRoadmap?.name) {
          throw new Error('Breadcrumb: relevantObjects must have either a name, an indicatorParameter or a metaRoadmap with a name')
        }
        sectionNames[i] = (thing.name || thing.indicatorParameter || thing.metaRoadmap?.name) as string
      }
    }
  }

  return <>
    <nav className="display-flex align-items-center gap-25 flex-wrap-wrap">
      <span className='display-flex align-items-center gap-25'>
        <Link href='/' className={styles.breadCrumb}>
          Hem
        </Link>
        {sectionNames.length > 0 && (
          <Image src='/icons/chevronRight.svg' alt='' height={16} width={16} />
        )}
      </span>
      {sectionNames.map((section, index) => {
        // Create href from the original sections array
        const href = `/${sections.slice(0, index + 1).join('/')}`
        const linkName = section[0].toUpperCase() + section.slice(1, section.length)

        // If the section is a category, don't make it a link
        if (section == 'roadmap') {
          return (
            <span key={index} className={`display-flex align-items-center gap-25 ${styles.breadCrumbTitle}`}>
              Färdplan:
            </span>
          )
        }

        if (section == 'goal') {
          return (
            <span key={index} className={`display-flex align-items-center gap-25 ${styles.breadCrumbTitle}`}>
              Målbana:
            </span>
          )
        }

        if (section == 'action') {
          return (
            <span key={index} className={`display-flex align-items-center gap-25 ${styles.breadCrumbTitle}`}>
              Åtgärd:
            </span>
          )
        }

        if (section.toLowerCase() == 'metaroadmap') {
          return (
            <span key={index} className={`display-flex align-items-center gap-25 ${styles.breadCrumbTitle}`}>
              Metadata:
            </span>
          )
        }

        const isLastItem = index === sectionNames.length - 1;

        return (
          <span key={index} className='display-flex align-items-center gap-25'>
            <Link href={href} className={styles.breadCrumb}>
              {linkName}
            </Link>
            {!isLastItem && (
              <Image src='/icons/chevronRight.svg' alt='' height={16} width={16} />
            )}
          </span>
        )
      })}
    </nav>
  </>
}