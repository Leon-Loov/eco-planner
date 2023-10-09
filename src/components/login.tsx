'use client'
import {  SignupButton } from '@/components/redirectButtons'


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
      <main className="user-info-form">
        <h1>Logga In</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username </label>
          <input type="text" name="username" required id="username" autoComplete="username" />
          <br />
          <label htmlFor="password">Password </label>
          <input type="password" name="password" required id="password" autoComplete="current-password" />
          <br />
          <input type="submit" value={'Logga In'}/>
          <a href='/signup'>Skapa Konto</a>
        </form>
      </main>
    </>
  )
}