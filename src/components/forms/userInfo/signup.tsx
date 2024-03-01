'use client'

import AttributedImage from "@/components/generic/images/attributedImage";
import Link from "next/link";
import Image from "next/image";
import styles from './userInfo.module.css'

function handleSubmit(event: any) {
  event.preventDefault()

  const form = event.target
  const formJSON = JSON.stringify({
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
  })

  // Try to signup, redirect to the home page if successful.
  fetch('/api/signup', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      window.location.href = '/'
    } else {
      res.json().then((data) => {
        alert(`Signup failed.\nReason: ${data.message}`)
      })
    }
  }).catch((err) => {
    alert('Signup failed.')
  })
}

export default function Signup() {
  return (
    <>
      <div className="display-flex gap-100 align-items-center container">
        <main className="container-text">
          <h1>Skapa Konto</h1>
          <form onSubmit={handleSubmit} className={styles.form}>

          <label className="block margin-y-100">
              Användarnamn
              <div className="margin-y-50 padding-50 flex align-items-center gray-90 smooth focusable">
                <Image src="/icons/user.svg" alt="lösenord" width={24} height={24} />
                <input className="padding-0 margin-x-50" type="text" placeholder="användarnamn" name="username" required id="username" autoComplete="username" />
              </div>
            </label>

            <label className="block margin-y-100">
              E-post
              <div className="margin-y-50 padding-50 flex align-items-center gray-90 smooth focusable">
                <Image src="/icons/email.svg" alt="lösenord" width={24} height={24} />
                <input className="padding-0 margin-x-50" type="email" placeholder="email" name="email" required id="email" autoComplete="email" />
              </div>
            </label>

            <label className="block margin-y-100">
              Lösenord
              <div className="margin-y-50 padding-50 flex align-items-center gray-90 smooth focusable">
                <Image src="/icons/password.svg" alt="lösenord" width={24} height={24} />
                <input className="padding-0 margin-x-50" type="password" placeholder="password" name="password" required id="password" autoComplete="new-password" />
              </div>
            </label>

            <button className="block margin-y-25 font-weight-bold seagreen color-purewhite" type="submit"> Skapa Konto </button>
            <Link href='/login'>Logga in</Link>
          </form>
        </main>
        <div className="position-relative width-100 rounded overflow-hidden" style={{height: '500px'}}>
          <AttributedImage src="/images/hydroelectric.jpg" alt="">
            <div className="width-100 padding-100">
              Photo by <a className="color-purewhite" href="https://unsplash.com/@dmey503?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Dan Meyers</a> on <a className="color-purewhite" href="https://unsplash.com/photos/aerial-photography-of-body-of-water-w6X7XaolqA0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
            </div>
          </AttributedImage>
        </div>
      </div>
    </>
  )
}