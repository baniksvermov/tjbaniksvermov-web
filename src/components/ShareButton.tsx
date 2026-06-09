'use client'

export default function ShareButton() {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(window.location.href)}
      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      Kopírovat odkaz
    </button>
  )
}
