'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface Props {
  images: string[]
  layout: 'carousel' | 'side-by-side' | 'single'
}

export default function ArticleGallery({ images, layout }: Props) {
  const [active, setActive] = useState(0)

  if (!images || images.length === 0) return null

  if (layout === 'single') {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
        <Image src={images[0]} alt="" fill className="object-cover" sizes="(max-width: 896px) 100vw, 896px" />
      </div>
    )
  }

  if (layout === 'side-by-side') {
    return (
      <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {images.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            <Image src={src} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="300px" />
          </div>
        ))}
      </div>
    )
  }

  // carousel
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-100">
      <div className="relative aspect-[16/9]">
        <Image
          src={images[active]}
          alt=""
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 896px) 100vw, 896px"
          key={active}
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => setActive((a) => (a - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Předchozí"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActive((a) => (a + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Další"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  active === i ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Obrázek ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
