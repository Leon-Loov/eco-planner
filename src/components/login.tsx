'use client'

function handleSubmit(event: any) {
  event.preventDefault()

  const form = event.target
  const formJSON = JSON.stringify({
    username: form.username.value,
    password: form.password.value,
  })

  fetch('/api/login', {
    method: 'POST',
    body: formJSON,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default function Login() {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" required={true} />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" required={true} />
        <br />
        <input type="submit" />
      </form>
    </>
  )
}