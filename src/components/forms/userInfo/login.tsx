'use client'

import Link from "next/link";
import Image from "next/image";

function handleSubmit(event: any) {
  event.preventDefault()

  const form = event.target
  const formJSON = JSON.stringify({
    username: form.username.value,
    password: form.password.value,
  })

  // Try to login, redirect to the home page if successful.
  fetch('/api/login', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      window.location.href = '/'
    } else {
      alert('Login failed.')
    }
  }).catch((err) => {
    alert('Login failed.')
  })
}

export default function Login() {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="margin-y-100">Logga In</h1>

        <label className="block margin-y-100">
          Användarnamn
          <div className="margin-y-50 padding-50 flex align-items-center gray-90 smooth focusable">
            <Image src="/icons/user.svg" alt="" width={24} height={24} />
            <input className="padding-0 margin-x-50"  type="text" placeholder="användarnamn" name="username" required id="username" autoComplete="username" />
          </div>
        </label>

        <label className="block margin-y-100">
          Lösenord
          <div className="margin-y-50 padding-50 flex align-items-center gray-90 smooth focusable">
            <Image src="/icons/password.svg" alt="" width={24} height={24} />
            <input className="padding-0 margin-x-50"  type="password" placeholder="lösenord" name="password" required id="password" autoComplete="current-password" />
          </div>
        </label>

        <button role="submit" className="block margin-y-50 font-weight-bold seagreen color-purewhite">Logga In</button>
        <p className="padding-y-50" style={{borderTop: '1px solid var(--gray-90)'}}>
          <small>Har du inget konto? <Link href='/signup'>Skapa konto</Link></small>
        </p>
      </form>
    </>
  )
}