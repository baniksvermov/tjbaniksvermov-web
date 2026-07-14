import type { Metadata } from 'next'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kalendář zápasů',
  description: 'Kalendář zápasů TJ Baník Švermov — termíny a výsledky.',
}

export default function KalendarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#c8102e]/10 text-[#c8102e]">
        <Calendar className="h-8 w-8" />
      </div>
      <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a] lg:text-4xl">
        Kalendář zápasů
      </h1>
      <p className="mt-4 text-gray-600">
        Kalendář zápasů a výsledků právě připravujeme. Brzy zde najdete termíny a výsledky všech našich týmů.
      </p>
    </div>
  )
}
