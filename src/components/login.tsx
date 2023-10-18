'use client'
import Link from "next/link";
import AttributedImage from "./images/attributedImage";
import ImageIcon from "./images/imageIcon";

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
              <ImageIcon src="/icons/user.svg" alt="lösenord" />
              <input type="text" placeholder="användarnamn" name="username" required id="username" autoComplete="username" />
            </div>
            <br />
            <label htmlFor="password">Lösenord</label>
            <div className="flex-row">
              <ImageIcon src="/icons/password.svg" alt="lösenord" />
              <input type="password" placeholder="lösenord" name="password" required id="password" autoComplete="current-password" />
            </div>
            <br />
            <input type="submit" className="call-to-action-primary" value={'Logga In'} />
            <Link href='/signup'>Skapa konto</Link>
          </form>
        </main>
        <aside style={{ width: '40%' }}>
          <AttributedImage src="/images/bee.webp" alt="Bee pollinating a flower" borderRadius="0 .5em .5em 0">
            Photo by <a href="https://unsplash.com/@alken?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Alfred Kenneally</a> on <a href="https://unsplash.com/photos/cf7YFJ_e8RE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
          </AttributedImage>
        </aside>
      </div>
    </>
  )
}