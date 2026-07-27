import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { Calendar, MapPin, ExternalLink, ArrowRight } from 'lucide-react'
import { createPublicClient } from '@/lib/supabase/public'
import type { Match, Team } from '@/types/database'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Kalendář zápasů',
  description: 'Kalendář zápasů TJ Baník Švermov — termíny a výsledky.',
}

interface Props {
  searchParams: Promise<{ tym?: string }>
}

export default async function KalendarPage({ searchParams }: Props) {
  const { tym } = await searchParams
  const supabase = createPublicClient()

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, slug, position, schedule_url')
    .order('position')

  const teamList = (teams as Team[]) ?? []
  const activeTeam = teamList.find((t) => t.slug === tym) ?? teamList[0]

  const { data: matchesData } = activeTeam
    ? await supabase
        .from('matches')
        .select('*')
        .eq('team_id', activeTeam.id)
        .order('kick_off_at', { ascending: true })
    : { data: [] }

  const matches = (matchesData as Match[]) ?? []
  const now = new Date()
  const upcoming = matches.filter((m) => !m.kick_off_at || new Date(m.kick_off_at) >= now)
  const played = matches
    .filter((m) => m.kick_off_at && new Date(m.kick_off_at) < now)
    .reverse()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c8102e]/10 text-[#c8102e]">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a] lg:text-4xl">
            Kalendář zápasů
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Termíny a výsledky všech týmů</p>
        </div>
      </div>

      {/* Přepínač týmů */}
      {teamList.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-100 pb-4">
          {teamList.map((t) => (
            <Link
              key={t.id}
              href={`/kalendar?tym=${t.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeTeam?.id === t.id
                  ? 'bg-[#c8102e] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>
      )}

      {!activeTeam ? (
        <div className="py-16 text-center text-gray-400">
          <p>Zatím žádné týmy k zobrazení.</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">Rozpis zápasů zatím není k dispozici</p>
          <p className="text-sm mt-1">Brzy zde najdete termíny a výsledky.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={`/tymy/${activeTeam.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c8102e] hover:underline"
            >
              Sestava a info o týmu {activeTeam.name}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {activeTeam.schedule_url && (
              <a
                href={activeTeam.schedule_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
              >
                Celý rozpis na fotbal.cz
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {upcoming.length > 0 && (
            <div className="mb-10">
              <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-4">Nadcházející zápasy</h2>
              <div className="space-y-2">
                {upcoming.map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            </div>
          )}

          {played.length > 0 && (
            <div>
              <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-4">Odehrané zápasy</h2>
              <div className="space-y-2">
                {played.map((m) => (
                  <MatchRow key={m.id} match={m} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MatchRow({ match }: { match: Match }) {
  const hasScore = match.score_home !== null && match.score_away !== null
  const dateLabel = match.kick_off_at
    ? format(new Date(match.kick_off_at), 'd. M. yyyy · HH:mm', { locale: cs })
    : 'Termín upřesníme'

  const homeLabel = match.is_home ? 'Baník Švermov' : match.opponent
  const awayLabel = match.is_home ? match.opponent : 'Baník Švermov'

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{dateLabel}</p>
        <p className="mt-1 font-semibold text-[#0a0a0a] truncate">
          {homeLabel} <span className="text-gray-400 font-normal">vs</span> {awayLabel}
        </p>
        {match.venue && (
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3 shrink-0" />
            {match.venue}
          </p>
        )}
      </div>
      <div className="shrink-0">
        {hasScore ? (
          <span className="inline-flex items-center rounded-lg bg-[#0a0a0a] px-3 py-1.5 font-[Anton] text-lg text-white tabular-nums">
            {match.score_home} : {match.score_away}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
            {match.is_home ? 'Doma' : 'Venku'}
          </span>
        )}
      </div>
    </div>
  )
}
