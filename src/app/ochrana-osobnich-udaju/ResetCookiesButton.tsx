'use client'

export default function ResetCookiesButton() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem('tjbanik_cookie_consent')
        window.location.reload()
      }}
      className="text-[#c8102e] hover:underline"
    >
      Změnit nastavení cookies
    </button>
  )
}
