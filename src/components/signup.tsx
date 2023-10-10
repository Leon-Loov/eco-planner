'use client'
import Link from "next/link";

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
      alert('Signup failed.')
    }
  }).catch((err) => {
    alert('Signup failed.')
  })
}

export default function Signup() {
  return (
    <>
      <div className="card flex-row">
        <main className="user-info-form flex-grow-100">
          <h1>Skapa Konto</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Användarnam </label>
            <div className="flex-row">
              <div className="image">
                <img src="/icons/user.svg" alt="Användarnamn"/>
              </div>
              <input type="text" name="username" required id="username" autoComplete="username" />
            </div>
            <br />
            <label htmlFor="email">E-post </label>
            <div className="flex-row">
              <div className="image">
                <img src="/icons/email.svg" alt="Email Adress"/>
              </div>
              <input type="email" name="email" required id="email" autoComplete="email" />
            </div>
            <br />
            <label htmlFor="password">Lösenord </label>
            <div className="flex-row">
              <div className="image">
                <img src="/icons/password.svg" alt="Lösenord"/>
              </div>
              <input type="password" name="password" required id="password" autoComplete="new-password" />
            </div>
            <br />
            <input type="submit" value={'Skapa Konto'}/>
            <Link href='/login'>Logga in</Link>
          </form>
        </main>
        <aside className="flex-grow-25">
          <img src="/images/login-background.jpg" alt="Decorative Leaf" className="login-image"/>
        </aside>
      </div>
    </>
  )
}