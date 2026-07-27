'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import type { Match } from '@/types/database'

const STEP = 3

export default function UpcomingMatchesCarousel({ matches }: { matches: Match[] }) {
  const totalGroups = Math.ceil(matches.length / STEP)
  const [group, setGroup] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() => setGroup((g) => (g - 1 + totalGroups) % totalGroups), [totalGroups])
  const next = useCallback(() => setGroup((g) => (g + 1) % totalGroups), [totalGroups])

  useEffect(() => {
    if (paused || totalGroups <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next, totalGroups])

  if (matches.length === 0) return null

  const visible = matches.slice(group * STEP, group * STEP + STEP)

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {visible.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>

      {totalGroups > 1 && (
        <>
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

          <div className="mt-5 flex justify-center gap-2">
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
        </>
      )}
    </div>
  )
}

function MatchCard({ match }: { match: Match }) {
  const dateLabel = match.kick_off_at
    ? format(new Date(match.kick_off_at), 'EEEE d. M. · HH:mm', { locale: cs })
    : 'Termín upřesníme'

  const teamName = match.team?.name ?? 'Tým'
  const homeLabel = match.is_home ? teamName : match.opponent
  const awayLabel = match.is_home ? match.opponent : teamName

  return (
    <Link
      href={match.team?.slug ? `/kalendar?tym=${match.team.slug}` : '/kalendar'}
      className="group relative overflow-hidden rounded-2xl bg-[#111] border border-white/5 p-5 flex flex-col gap-3 hover:border-[#c8102e]/40 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#c8102e]/10 blur-2xl group-hover:bg-[#c8102e]/20 transition-colors duration-300" />

      <div className="relative flex items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full bg-[#c8102e]/10 px-2.5 py-0.5 text-xs font-semibold text-[#c8102e]">
          {teamName}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {match.is_home ? 'Doma' : 'Venku'}
        </span>
      </div>

      <p className="relative font-semibold text-white leading-snug">
        {homeLabel} <span className="text-gray-500 font-normal">vs</span> {awayLabel}
      </p>

      <div className="relative mt-auto space-y-1 text-sm text-gray-400">
        <p className="capitalize">{dateLabel}</p>
        {match.venue && (
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3 shrink-0" />
            {match.venue}
          </p>
        )}
      </div>
    </Link>
  )
}
