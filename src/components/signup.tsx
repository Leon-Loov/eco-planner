'use client'

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
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" required={true} id="username" autoComplete="username" />
        <br />
        <label htmlFor="email">Email: </label>
        <input type="email" name="email" required={true} id="email" autoComplete="email" />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" required={true} id="password" autoComplete="new-password" />
        <br />
        <input type="submit" />
      </form>
    </>
  )
}