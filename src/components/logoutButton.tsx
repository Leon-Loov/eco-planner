'use client'

export default function LogoutButton() {
  return (
    <button onClick={async () => {
      fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => {
        if (res.ok) {
          window.location.href = '/'
        } else {
          alert('Logout failed.')
        }
      })
    }}>Logout</button>
  )
}