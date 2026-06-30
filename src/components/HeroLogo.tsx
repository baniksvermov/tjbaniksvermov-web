'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function HeroLogo() {
  const [mounted, setMounted] = useState(false)
  const [size, setSize] = useState(500)

  useEffect(() => {
    function updateSize() {
      const w = window.innerWidth
      if (w < 640) setSize(0)         // xs: schovat
      else if (w < 1024) setSize(280) // sm/md: malé
      else setSize(500)               // lg+: plná velikost
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    const t = setTimeout(() => setMounted(true), 150)
    return () => { clearTimeout(t); window.removeEventListener('resize', updateSize) }
  }, [])

  if (size === 0) return null

  const glow = size + 60

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">

      {/* Červený glow za logem */}
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: glow,
          height: glow,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,16,46,0.20) 0%, rgba(200,16,46,0.06) 50%, transparent 75%)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 2.5s ease',
        }}
      />

      {/* Logo — kruhový ořez + gradient maska na okrajích */}
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: '50%',
          transform: mounted
            ? 'translateY(-50%) scale(1)'
            : 'translateY(-50%) scale(0.88)',
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 2.2s cubic-bezier(0.16,1,0.3,1), transform 2.2s cubic-bezier(0.16,1,0.3,1)',
          WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 68%, transparent 85%)',
          maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0.5) 68%, transparent 85%)',
        }}
      >
        <Image
          src="/logo-club.jpg"
          alt=""
          width={500}
          height={500}
          priority
          style={{
            width: '100%',
            height: '100%',
            filter: 'invert(1) brightness(1.1)',
            opacity: 0.18,
            display: 'block',
          }}
        />
      </div>

      {/* Tenký kruhový outline */}
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: size,
          height: size,
          borderRadius: '50%',
          border: '1px solid rgba(200,16,46,0.18)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 3s ease 0.5s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: size + 30,
          height: size + 30,
          borderRadius: '50%',
          border: '1px solid rgba(200,16,46,0.08)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 3s ease 0.8s',
        }}
      />

    </div>
  )
}
