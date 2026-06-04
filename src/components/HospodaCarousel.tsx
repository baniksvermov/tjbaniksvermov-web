'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const photos = [
  { src: '/hospoda/terasa.jpg', alt: 'Terasa s výhledem na hřiště' },
  { src: '/hospoda/foto-1.jpg', alt: 'Letní zahrádka' },
  { src: '/hospoda/foto-2.jpg', alt: 'Zahrádka s pergolou' },
  { src: '/hospoda/foto-3.jpg', alt: 'Přírodní jezírko' },
  { src: '/hospoda/foto-4.jpg', alt: 'Jezírko a zeleň' },
  { src: '/hospoda/foto-5.jpg', alt: 'Pohled na hřiště' },
  { src: '/hospoda/foto-6.jpg', alt: 'Areál hospůdky' },
  { src: '/hospoda/foto-7.jpg', alt: 'Dětské hřiště' },
  { src: '/hospoda/foto-9.jpg', alt: 'Pergola — bar a šipky' },
]

const STEP = 3
const totalGroups = Math.ceil(photos.length / STEP)

export default function HospodaCarousel() {
  const [group, setGroup] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() => setGroup((g) => (g - 1 + totalGroups) % totalGroups), [])
  const next = useCallback(() => setGroup((g) => (g + 1) % totalGroups), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [paused, next])

  const visible = photos.slice(group * STEP, group * STEP + STEP)

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Grid 3 fotek */}
      <div className="grid grid-cols-3 gap-3">
        {visible.map((photo, i) => (
          <div key={`${group}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#0a0a0a]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-2 left-2 text-xs text-white/80 leading-tight">{photo.alt}</p>
          </div>
        ))}
      </div>

      {/* Šipky */}
      <button
        onClick={prev}
        className="absolute -left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0a0a]/80 text-white hover:bg-[#c8102e] transition-colors shadow-lg"
        aria-label="Předchozí"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0a0a]/80 text-white hover:bg-[#c8102e] transition-colors shadow-lg"
        aria-label="Další"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Tečky */}
      <div className="mt-3 flex justify-center gap-2">
        {Array.from({ length: totalGroups }).map((_, i) => (
          <button
            key={i}
            onClick={() => setGroup(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === group ? 'w-6 bg-[#c8102e]' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Skupina ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
