'use client'

import Link from "next/link";
import AttributedImage from "@/components/generic/images/attributedImage";
import ImageIcon from "@/components/generic/images/imageIcon";
import styles from './login.module.css'

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
      <div className="card display-flex">
        <main className={`flex-grow-100 ${styles.userInfo}`}>
          <h1>Logga In</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="username">Användarnamn </label>
            <div className="display-flex">
              <ImageIcon src="/icons/user.svg" alt="lösenord" />
              <input className="flex-grow-100" type="text" placeholder="användarnamn" name="username" required id="username" autoComplete="username" />
            </div>
            <label htmlFor="password">Lösenord</label>
            <div className="display-flex">
              <ImageIcon src="/icons/password.svg" alt="lösenord" />
              <input className="flex-grow-100" type="password" placeholder="lösenord" name="password" required id="password" autoComplete="current-password" />
            </div>
            <input type="submit" className={styles.submitButton} value={'Logga In'} style={{ display: 'block' }} />
            <Link href='/signup' >Skapa konto</Link>
          </form>
        </main>
        <aside style={{ width: '40%' }}>
          <AttributedImage src="/images/cyclists.webp" alt="" borderRadius="0 .5em .5em 0">
            Photo by <a href="https://unsplash.com/@samtekiefte?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sam te Kiefte</a> on <a href="https://unsplash.com/photos/man-in-red-long-sleeve-shirt-riding-bicycle-on-street-during-daytime-NMeO6NIUOcA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
          </AttributedImage>
        </aside>
      </div>
    </>
  )
}