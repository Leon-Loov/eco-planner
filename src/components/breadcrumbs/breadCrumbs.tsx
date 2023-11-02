// /components/NextBreadcrumb.tsx
'use client'

import styles from './breadcrumbs.module.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import findName from '@/functions/findName'

async function parseUUID(text: string) {
  let regex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/
  let isUUID = text.match(regex)
  if(isUUID) {
    return await findName(text)
  } else {
    return text
  }
}

export default async function() {
  const paths = usePathname()
  const pathNames = paths.split('/').filter(path => path)
  
  return (
    <>
      <section className='flex-row align-center gap-25'>
        {pathNames.map((path, index) => {
          let href = `/${pathNames.slice(0, index + 1).join('/')}`
          let itemLink = path[0].toUpperCase() + path.slice(1, path.length)
          return index === pathNames.length - 1 ? (
            <span key={index} className='flex-row align-center gap-25'>
              <Link href={href} className={styles.currentBreadCrumb}>
                {itemLink}
              </Link>
            </span>
          ) : (
            <span key={index} className='flex-row align-center gap-25'>
              <Link href={href} className={styles.breadCrumb}>
                {itemLink}
              </Link>
              <img src='/icons/chevronRight.svg' alt='' height={16} width={16} />
            </span>
          );
        })}
      </section>
    </>
  );
};
