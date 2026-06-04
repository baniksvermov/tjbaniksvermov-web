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

export default function HospodaCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() =>
    setCurrent((c) => (c - 1 + photos.length) % photos.length), [])
  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % photos.length), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [paused, next])

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-[#0a0a0a]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative aspect-[16/9]">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 75vw"
            />
          </div>
        ))}

        {/* Gradient overlay spodek */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Popis */}
        <div className="absolute bottom-4 left-4 text-sm text-white/80">
          {photos[current].alt}
        </div>

        {/* Počítadlo */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
          {current + 1} / {photos.length}
        </div>
      </div>

      {/* Šipky */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-[#c8102e] transition-colors"
        aria-label="Předchozí"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-[#c8102e] transition-colors"
        aria-label="Další"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Tečky */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
