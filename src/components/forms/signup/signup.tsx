'use client'
import AttributedImage from "../../generic/images/attributedImage";
import Link from "next/link";
import ImageIcon from "../../generic/images/imageIcon";

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
      <div className="card flex-row">
        <main className="user-info-form flex-grow-100">
          <h1>Skapa Konto</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Användarnam </label>
            <div className="flex-row">
              <ImageIcon src="/icons/user.svg" alt="lösenord" />
              <input type="text" placeholder="användarnamn" name="username" required id="username" autoComplete="username" />
            </div>
            <br />
            <label htmlFor="email">E-post </label>
            <div className="flex-row">
              <ImageIcon src="/icons/email.svg" alt="lösenord" />
              <input type="email" placeholder="email" name="email" required id="email" autoComplete="email" />
            </div>
            <br />
            <label htmlFor="password">Lösenord </label>
            <div className="flex-row">
              <ImageIcon src="/icons/password.svg" alt="lösenord" />
              <input type="password" placeholder="password" name="password" required id="password" autoComplete="new-password" />
            </div>
            <br />
            <input type="submit" className="call-to-action-primary" value={'Skapa Konto'} />
            <Link href='/login'>Logga in</Link>
          </form>
        </main>
        <aside style={{ width: '40%' }}>
          <AttributedImage src="/images/charging_car.webp" alt="" borderRadius="0 .5em .5em 0">
            Photo by <a href="https://unsplash.com/@juice_world?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">JUICE</a> on <a href="https://unsplash.com/photos/a-man-and-a-woman-are-charging-their-cars-cBHAhaGK_zU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
          </AttributedImage>
        </aside>
      </div>
    </>
  )
}