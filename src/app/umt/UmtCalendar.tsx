'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAY_LABELS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']
const MONTH_NAMES = [
  'Leden','Únor','Březen','Duben','Květen','Červen',
  'Červenec','Srpen','Září','Říjen','Listopad','Prosinec',
]

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// Returns Mon-first day-of-week index (0=Mon…6=Sun)
function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

interface Props {
  selectedDate: string
  onSelectDate: (date: string) => void
}

export default function UmtCalendar({ selectedDate, onSelectDate }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/calendar/booked-dates')
      .then((r) => r.json())
      .then((json) => {
        setBookedDates(new Set(json.dates ?? []))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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
            const isBooked = bookedDates.has(cell.iso)
            const isSelected = cell.iso === selectedDate

            let cls =
              'relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors select-none '

            if (isPast) {
              cls += 'text-gray-300 cursor-not-allowed'
            } else if (isBooked) {
              cls += 'bg-red-50 text-red-400 cursor-not-allowed line-through'
            } else if (isSelected) {
              cls += 'bg-[#c8102e] text-white font-semibold cursor-pointer'
            } else if (isToday) {
              cls += 'border-2 border-[#c8102e] text-[#c8102e] font-semibold cursor-pointer hover:bg-[#c8102e]/10'
            } else {
              cls += 'text-[#0a0a0a] cursor-pointer hover:bg-[#c8102e]/10 hover:text-[#c8102e]'
            }

            return (
              <button
                key={cell.iso}
                type="button"
                disabled={isPast || isBooked}
                onClick={() => onSelectDate(isSelected ? '' : cell.iso ?? '')}
                className={cls}
                title={isBooked ? 'Obsazeno' : undefined}
              >
                {cell.day}
                {isBooked && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-red-400" />
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
          <span className="h-3 w-3 rounded bg-red-50 border border-red-200" /> Obsazeno
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-[#c8102e]" /> Vybraný termín
        </span>
      </div>
    </div>
  )
}
