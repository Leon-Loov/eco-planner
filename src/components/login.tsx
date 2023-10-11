'use client'
import Link from "next/link";

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
      <div className="card flex-row">
        <main className="user-info-form flex-grow-100">
          <h1>Logga In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Användarnamn </label>
            <div className="flex-row">
              <div className="image">
                <img src="/icons/user.svg" alt="Användarnamn"/>
              </div>
              <input type="text" name="username" required id="username" autoComplete="username" />
            </div>
            <br />
            <label htmlFor="password">Lösenord</label>
            <div className="flex-row">
              <div className="image">
                <img src="/icons/password.svg" alt="Lösenord"/>
              </div>
              <input type="password" name="password" required id="password" autoComplete="current-password" />
            </div>
            <br />
            <input type="submit" value={'Logga In'}/>
            <Link href='/signup'>Skapa Konto</Link>
          </form>
        </main>
        <aside className="flex-grow-25">
          <img src="/images/bee.webp" alt="" className="login-image"/>
        </aside>
      </div>
    </>
  )
}