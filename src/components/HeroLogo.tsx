'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function HeroLogo() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Červený glow za logem */}
      <div
        className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(200,16,46,0.22) 0%, transparent 70%)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />

      {/* Logo — pomalu se otáčí */}
      <div
        className="absolute right-[-8%] top-1/2 -translate-y-1/2"
        style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1.8s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          style={{
            animation: mounted
              ? 'logo-enter 1.6s cubic-bezier(0.16,1,0.3,1) forwards, spin-slow 50s linear infinite 1.6s'
              : 'none',
          }}
        >
          <Image
            src="/logo-club.jpg"
            alt=""
            width={580}
            height={580}
            priority
            className="opacity-[0.09] mix-blend-screen"
            style={{ filter: 'invert(1) brightness(1.4)' }}
          />
        </div>
      </div>

      {/* Tenká červená linka na pravé straně */}
      <div
        className="absolute right-0 top-0 h-full w-[2px]"
        style={{
          background: 'linear-gradient(to bottom, transparent, #c8102e 30%, #c8102e 70%, transparent)',
          opacity: mounted ? 0.35 : 0,
          transition: 'opacity 2s ease 0.5s',
        }}
      />
    </div>
  )
}
