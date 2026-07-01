'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

const FB_PAGE = 'https://www.facebook.com/baniksvermov'
const IG_PAGE = 'https://www.instagram.com/baniksvermov'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  function handleFbShare() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Facebook sdílet */}
      <button
        onClick={handleFbShare}
        className="inline-flex items-center gap-2 rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
        Facebook
      </button>

      {/* Instagram — odkaz na profil */}
      <a
        href={IG_PAGE}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
        </svg>
        Instagram
      </a>

      {/* Kopírovat odkaz */}
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
          copied
            ? 'border-green-300 bg-green-50 text-green-700'
            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Zkopírováno!
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            Kopírovat odkaz
          </>
        )}
      </button>
    </div>
  )
}
