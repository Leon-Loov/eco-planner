'use client'

function handleSubmit(event: any) {
  event.preventDefault()

  const form = event.target
  const formJSON = JSON.stringify({
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
  })

  fetch('/api/signup', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default function Signup() {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" required={true} />
        <br />
        <label htmlFor="email">Email: </label>
        <input type="email" name="email" required={true} />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" required={true} />
        <br />
        <input type="submit" />
      </form>
    </>
  )
}