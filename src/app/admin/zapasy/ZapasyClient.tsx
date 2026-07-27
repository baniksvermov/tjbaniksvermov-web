'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { Trophy, Plus, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Match, Team } from '@/types/database'

interface Props {
  teams: Team[]
  matches: Match[]
  saveScore: (matchId: string, scoreHome: number | null, scoreAway: number | null) => Promise<void>
  addMatch: (data: {
    teamId: string
    opponent: string
    kickOffAt: string | null
    isHome: boolean
    venue: string | null
  }) => Promise<void>
  deleteMatch: (matchId: string) => Promise<void>
}

export default function ZapasyClient({ teams, matches, saveScore, addMatch, deleteMatch }: Props) {
  const router = useRouter()
  const [activeTeamId, setActiveTeamId] = useState(teams[0]?.id ?? '')
  const [adding, setAdding] = useState(false)

  const teamMatches = useMemo(
    () => matches.filter((m) => m.team_id === activeTeamId),
    [matches, activeTeamId]
  )

  function refresh() {
    router.refresh()
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a]">Zápasy</h1>
          <p className="mt-1 text-gray-500">Rozpis a výsledky — {matches.length} zápasů celkem</p>
        </div>
        {!adding && (
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" />
            Přidat zápas
          </Button>
        )}
      </div>

      {adding && (
        <AddMatchForm
          teams={teams}
          defaultTeamId={activeTeamId}
          onDone={() => {
            setAdding(false)
            refresh()
          }}
          onCancel={() => setAdding(false)}
          addMatch={addMatch}
        />
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTeamId(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeTeamId === t.id ? 'bg-[#c8102e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        {teamMatches.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Trophy className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Žádné zápasy pro tento tým</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {teamMatches.map((m) => (
              <MatchRow key={m.id} match={m} saveScore={saveScore} deleteMatch={deleteMatch} onSaved={refresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MatchRow({
  match,
  saveScore,
  deleteMatch,
  onSaved,
}: {
  match: Match
  saveScore: Props['saveScore']
  deleteMatch: Props['deleteMatch']
  onSaved: () => void
}) {
  const [home, setHome] = useState(match.score_home?.toString() ?? '')
  const [away, setAway] = useState(match.score_away?.toString() ?? '')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    const h = home.trim() === '' ? null : Number(home)
    const a = away.trim() === '' ? null : Number(away)
    startTransition(async () => {
      await saveScore(match.id, h, a)
      onSaved()
    })
  }

  function handleDelete() {
    if (!confirm(`Opravdu smazat zápas vs ${match.opponent}?`)) return
    startTransition(async () => {
      await deleteMatch(match.id)
      onSaved()
    })
  }

  const dateLabel = match.kick_off_at
    ? format(new Date(match.kick_off_at), 'd. M. yyyy · HH:mm', { locale: cs })
    : 'Termín neurčen'

  return (
    <div className="p-4 flex flex-wrap items-center gap-4 hover:bg-gray-50 transition-colors">
      <div className="min-w-[160px] text-xs font-semibold uppercase tracking-wide text-gray-400">
        {dateLabel}
      </div>
      <div className="flex-1 min-w-[200px]">
        <p className="font-semibold text-[#0a0a0a]">
          {match.is_home ? 'Doma' : 'Venku'} vs {match.opponent}
        </p>
        {match.venue && <p className="text-xs text-gray-400">{match.venue}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={home}
          onChange={(e) => setHome(e.target.value)}
          placeholder="—"
          className="w-14 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm"
        />
        <span className="text-gray-400">:</span>
        <input
          type="number"
          value={away}
          onChange={(e) => setAway(e.target.value)}
          placeholder="—"
          className="w-14 rounded-lg border border-gray-200 px-2 py-1 text-center text-sm"
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-600 transition-colors disabled:opacity-50"
          aria-label="Uložit výsledek"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
          aria-label="Smazat zápas"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function AddMatchForm({
  teams,
  defaultTeamId,
  onDone,
  onCancel,
  addMatch,
}: {
  teams: Team[]
  defaultTeamId: string
  onDone: () => void
  onCancel: () => void
  addMatch: Props['addMatch']
}) {
  const [teamId, setTeamId] = useState(defaultTeamId)
  const [opponent, setOpponent] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isHome, setIsHome] = useState(true)
  const [venue, setVenue] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!teamId || !opponent.trim()) return
    const kickOffAt = date ? new Date(`${date}T${time || '00:00'}`).toISOString() : null
    startTransition(async () => {
      await addMatch({ teamId, opponent: opponent.trim(), kickOffAt, isHome, venue: venue.trim() || null })
      onDone()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-gray-100 bg-white p-5 space-y-4">
      <p className="text-sm font-semibold text-[#0a0a0a]">Nový zápas</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Tým</label>
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Soupeř</label>
          <input
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Datum</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Čas výkopu</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Místo</label>
          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Švermov - UMT"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={isHome} onChange={() => setIsHome(true)} />
            Doma
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" checked={!isHome} onChange={() => setIsHome(false)} />
            Venku
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>Uložit</Button>
        <button type="button" onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600 px-3">
          Zrušit
        </button>
      </div>
    </form>
  )
}
