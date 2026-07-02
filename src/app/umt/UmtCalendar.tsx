'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { BOOKING_TYPE_LABELS } from '@/lib/umt-types'

const DAY_LABELS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
const MONTH_NAMES = [
  'Leden','Únor','Březen','Duben','Květen','Červen',
  'Červenec','Srpen','Září','Říjen','Listopad','Prosinec',
]

const OPEN_MIN = 16 * 60
const CLOSE_MIN = 22 * 60

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// Returns Mon-first day-of-week index (0=Mon…6=Sun)
function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

function fromMinutes(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

type Occupancy = 'free' | 'half' | 'full'

function classify(capacity: number): Occupancy {
  if (capacity >= 0.999) return 'full'
  if (capacity > 0.001) return 'half'
  return 'free'
}

// Sweep-line přes obsazené úseky dne — půlka hřiště = kapacita 0.5 (dá se přidat druhá půlka
// ve stejný čas), celé hřiště = kapacita 1. Vrátí sloučené úseky s výslednou obsazeností.
function daySegments(slots: BusySlot[]) {
  const clamped = slots
    .map((s) => ({ from: Math.max(toMinutes(s.from), OPEN_MIN), to: Math.min(toMinutes(s.to), CLOSE_MIN), capacity: s.capacity }))
    .filter((s) => s.to > s.from)

  const boundaries = new Set<number>([OPEN_MIN, CLOSE_MIN])
  for (const s of clamped) { boundaries.add(s.from); boundaries.add(s.to) }
  const sorted = [...boundaries].sort((a, b) => a - b)

  const raw: { from: number; to: number; occupancy: Occupancy }[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const from = sorted[i]
    const to = sorted[i + 1]
    if (to <= from) continue
    const mid = (from + to) / 2
    const capacity = clamped.reduce((sum, s) => sum + (mid >= s.from && mid < s.to ? s.capacity : 0), 0)
    raw.push({ from, to, occupancy: classify(capacity) })
  }

  const merged: typeof raw = []
  for (const seg of raw) {
    const last = merged[merged.length - 1]
    if (last && last.occupancy === seg.occupancy) last.to = seg.to
    else merged.push({ ...seg })
  }
  return merged
}

interface ConfirmedBooking {
  date: string
  timeFrom: string | null
  timeTo: string | null
  team: string
  bookingType: string | null
}

interface BusySlot {
  from: string
  to: string
  capacity: number
}

interface Props {
  selectedDate: string
  onSelectDate: (date: string) => void
}

export default function UmtCalendar({ selectedDate, onSelectDate }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [busy, setBusy] = useState<Record<string, BusySlot[]>>({})
  const [confirmed, setConfirmed] = useState<ConfirmedBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/calendar/booked-dates')
      .then((r) => r.json())
      .then((json) => {
        setBusy(json.busy ?? {})
        setConfirmed(json.confirmed ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const confirmedByDate = new Map(confirmed.map((c) => [c.date, c]))

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // Can't go before current month
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = mondayIndex(firstDay) // blanks before day 1

  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  const cells: Array<{ day: number | null; iso: string | null }> = []
  for (let i = 0; i < startOffset; i++) cells.push({ day: null, iso: null })
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, iso: isoDate(year, month, d) })
  }
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push({ day: null, iso: null })

  const selectedSegments = selectedDate ? daySegments(busy[selectedDate] ?? []) : null

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={isCurrentMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
          aria-label="Předchozí měsíc"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-semibold text-[#0a0a0a]">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Další měsíc"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      {loading ? (
        <div className="h-48 flex items-center justify-center text-sm text-gray-400">Načítám…</div>
      ) : (
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((cell, i) => {
            if (!cell.day || !cell.iso) {
              return <div key={i} />
            }

            const isPast = cell.iso < todayIso
            const isToday = cell.iso === todayIso
            const daySlots = busy[cell.iso]
            const segments = daySlots ? daySegments(daySlots) : null
            const isFullyBooked = !!segments && segments.every((s) => s.occupancy === 'full')
            const isPartiallyBooked = !!segments && !isFullyBooked && segments.some((s) => s.occupancy !== 'free')
            const isSelected = cell.iso === selectedDate
            const booking = confirmedByDate.get(cell.iso)

            let cls =
              'relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors select-none '

            if (isPast) {
              cls += 'text-gray-300 cursor-not-allowed'
            } else if (isFullyBooked) {
              cls += 'bg-red-50 text-red-400 cursor-not-allowed line-through'
            } else if (isSelected) {
              cls += 'bg-[#c8102e] text-white font-semibold cursor-pointer'
            } else if (isToday) {
              cls += 'border-2 border-[#c8102e] text-[#c8102e] font-semibold cursor-pointer hover:bg-[#c8102e]/10'
            } else if (isPartiallyBooked) {
              cls += 'bg-amber-50 text-amber-700 cursor-pointer hover:bg-amber-100'
            } else {
              cls += 'text-[#0a0a0a] cursor-pointer hover:bg-[#c8102e]/10 hover:text-[#c8102e]'
            }

            return (
              <button
                key={cell.iso}
                type="button"
                disabled={isPast || isFullyBooked}
                onClick={() => onSelectDate(isSelected ? '' : cell.iso ?? '')}
                className={cls}
                title={
                  booking
                    ? `${booking.team}${booking.timeFrom ? ` · ${booking.timeFrom}${booking.timeTo ? `–${booking.timeTo}` : ''}` : ''}`
                    : isFullyBooked ? 'Plně obsazeno' : isPartiallyBooked ? 'Částečně obsazeno — klikněte pro přehled' : undefined
                }
              >
                {cell.day}
                {isFullyBooked && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-red-400" />
                )}
                {isPartiallyBooked && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-amber-500" />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-[#c8102e]/15 border border-[#c8102e]/30" /> Volné
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-50 border border-amber-200" /> Volná půlka hřiště
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-50 border border-red-200" /> Plně obsazeno
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-[#c8102e]" /> Vybraný termín
        </span>
      </div>

      {/* Denní přehled volných/obsazených hodin (16:00–22:00) */}
      {selectedDate && selectedSegments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Rozpis {format(new Date(selectedDate), 'd. M. yyyy', { locale: cs })} · hrací okno 16:00–22:00
          </p>

          {/* Vizuální časová osa — plná výška = obsazeno celé hřiště, poloviční výška = obsazená jen půlka */}
          <div className="relative h-10 w-full overflow-hidden rounded-lg bg-green-50 border border-green-100">
            {selectedSegments.filter((s) => s.occupancy !== 'free').map((s, i) => {
              const left = ((s.from - OPEN_MIN) / (CLOSE_MIN - OPEN_MIN)) * 100
              const width = ((s.to - s.from) / (CLOSE_MIN - OPEN_MIN)) * 100
              return (
                <div
                  key={i}
                  className={`absolute bottom-0 ${s.occupancy === 'full' ? 'inset-y-0 bg-red-300' : 'h-1/2 bg-amber-300'}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={
                    s.occupancy === 'full'
                      ? `Obsazeno celé hřiště ${fromMinutes(s.from)}–${fromMinutes(s.to)}`
                      : `Obsazená půlka hřiště ${fromMinutes(s.from)}–${fromMinutes(s.to)} — druhá půlka volná`
                  }
                />
              )
            })}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>16:00</span>
            <span>18:00</span>
            <span>20:00</span>
            <span>22:00</span>
          </div>

          {/* Textový výpis */}
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedSegments.every((s) => s.occupancy === 'full') ? (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500">
                Celý den je obsazený
              </span>
            ) : (
              selectedSegments.filter((s) => s.occupancy !== 'full').map((s, i) => (
                <span
                  key={i}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    s.occupancy === 'free' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {s.occupancy === 'free'
                    ? `Volno ${fromMinutes(s.from)}–${fromMinutes(s.to)}`
                    : `Volná půlka ${fromMinutes(s.from)}–${fromMinutes(s.to)}`}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Nejbližší potvrzené rezervace */}
      {(() => {
        const upcoming = confirmed
          .filter((c) => c.date >= todayIso)
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 5)
        if (upcoming.length === 0) return null
        return (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Nejbližší rezervace
            </p>
            <ul className="space-y-2">
              {upcoming.map((c) => (
                <li key={`${c.date}-${c.team}-${c.timeFrom}`} className="text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-[#0a0a0a] truncate">{c.team}</span>
                    <span className="shrink-0 text-gray-500">
                      {format(new Date(c.date), 'd. M.', { locale: cs })}
                      {c.timeFrom && ` · ${c.timeFrom}${c.timeTo ? `–${c.timeTo}` : ''}`}
                    </span>
                  </div>
                  {c.bookingType && (
                    <span className="text-xs text-gray-400">
                      {BOOKING_TYPE_LABELS[c.bookingType] ?? c.bookingType}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      })()}
    </div>
  )
}
