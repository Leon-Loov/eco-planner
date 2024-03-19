'use client'

import Link from "next/link";
import Image from "next/image";

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
      <form onSubmit={handleSubmit}>
        <h1 className="margin-y-100">Skapa Konto</h1>
        <label className="block margin-y-100">
          Användarnamn
          <div className="margin-y-50 padding-50 flex align-items-center gray-90 smooth focusable">
            <Image src="/icons/user.svg" alt="" width={24} height={24} />
            <input className="padding-0 margin-x-50" type="text" placeholder="användarnamn" name="username" required id="username" autoComplete="username" />
          </div>
        </label>
        <label className="block margin-y-100">
          E-post
          <div className="margin-y-50 padding-50 flex align-items-center gray-90 smooth focusable">
            <Image src="/icons/email.svg" alt="" width={24} height={24} />
            <input className="padding-0 margin-x-50" type="email" placeholder="email" name="email" required id="email" autoComplete="email" />
          </div>
        </label>
        <label className="block margin-y-100">
          Lösenord
          <div className="margin-y-50 padding-50 flex align-items-center gray-90 smooth focusable">
            <Image src="/icons/password.svg" alt="" width={24} height={24} />
            <input className="padding-0 margin-x-50" type="password" placeholder="password" name="password" required id="password" autoComplete="new-password" />
          </div>
        </label>
        <button className="block margin-y-100 font-weight-bold seagreen color-purewhite" type="submit"> Skapa Konto </button>
        <p className="padding-y-50" style={{borderTop: '1px solid var(--gray-90)'}}>
          <small>Har du redan ett konto? <Link href='/login'>Logga in</Link></small>
        </p>
      </form>
    </>
  )
}