'use client'

import Image from "next/image"

export default function LogoutButton() {
  return (
    <button className="flex align-items-center rounded transparent padding-50 gap-50 width-100" style={{fontSize: '1rem', fontWeight: '500', whiteSpace: 'nowrap'}} onClick={async () => {
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
    }}>
      <Image src="/icons/logout.svg" alt="" width="24" height="24" />
      Logga ut
    </button>
  )
}