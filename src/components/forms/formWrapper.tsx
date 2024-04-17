'use client'

import { useState } from 'react'
import styles from './forms.module.css'
import Image from 'next/image'
import React from 'react'

export default function FormWrapper({
  children,
}: {
  children: React.ReactNode,
}) {

  const [transformIndex, setTransformIndex] = useState(0)
  const sections = React.Children.toArray(children)

  function iterateIndicators(currentTransformIndex: number) {
    const currentIndicator = document?.getElementById('current-indicator')
    const indicatorsParent = document?.getElementById('indicators')
    const indicators = Array.from(indicatorsParent?.children || [])

    // Turn indicators green if they are complete
    for (let i = 0; i < indicators.length; i++) {
      if (i < currentTransformIndex) {
        (indicators[i] as HTMLElement).style.backgroundColor = 'seagreen'
      } else {
        (indicators[i] as HTMLElement).style.backgroundColor = 'var(--gray-90)'
      }
    }

    if (currentIndicator) {
      currentIndicator.style.transform = `translate(${(250 * currentTransformIndex) + 50}%, 0)`
    }
  }

  function enableSubmitButton(currentTransformIndex: number) {
    const submitButton = document?.getElementById('submit-button')
    // Enable submitbutton if on final step
    if (submitButton) {
      if (currentTransformIndex == sections.length - 1) {
        submitButton.removeAttribute('disabled')
      } else {
        submitButton.setAttribute('disabled', 'true')
      }
    }
  }

  function iterateSections(options?: { reverse?: boolean }) {

    const currentTransformIndex = transformIndex + (options?.reverse ? -1 : 1)

    if (sections) {
      if ((currentTransformIndex >= sections.length && !options?.reverse) || (currentTransformIndex < 0 && options?.reverse)) {
        return
      }

      // TODO: Make this work :)
      {/* 
      sections.forEach(element => {
        if (React.isValidElement(element)) {

          const transformData = element.props['data-transform']

          if (transformData) {
            const test = parseInt(transformData);
            
            if (options?.reverse) {
              element.props['data-transform'] = (test + 100).toString();
            } else {
              element.props['data-transform'] = (test + 100).toString();
            }
            
            const datasetTransform = element.props['data-transform'];
            element.props.style.transform = `translate(${datasetTransform}%, 0)`
            
          }
          
        }
      })
      */}
    }

    iterateIndicators(currentTransformIndex)
    enableSubmitButton(currentTransformIndex)
    setTransformIndex(currentTransformIndex)

  }

  return (
    <>
      <div className={styles.formSlider}>
        {children}
      </div>

      <div className="margin-y-100 padding-x-100 display-flex align-items-flex-start justify-content-space-between gap-100">
        <button type="button" className="flex align-items-center transparent round gap-25" style={{ fontSize: '1rem' }} onClick={() => iterateSections({ reverse: true })}>
          <Image src="/icons/arrowLeft.svg" alt="" width={24} height={24} />
          Tillbaka
        </button>

        <div className="margin-y-50" style={{ marginInline: 'auto', width: 'fit-content' }}>
          <div id="indicators" className="display-flex justify-content-center gap-75 margin-y-50">
            {sections.map((section, index) => (
              <div className={styles.indicator} key={index}></div>
            ))} 
          </div>
          <div className={styles.currentIndicator} id="current-indicator"></div>
        </div>

        <button type="button" className="flex align-items-center transparent round gap-25" style={{ fontSize: '1rem' }} onClick={() => iterateSections()}>
          Nästa
          <Image src="/icons/arrowRight.svg" alt="" width={24} height={24} />
        </button>
      </div>

    </>
  )
}