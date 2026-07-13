import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { bookingCapacity } from '@/lib/umt-types'

const OPEN = '16:00'
const CLOSE = '22:00'

export async function GET() {
  const supabase = createServiceClient()

  // Všechny nevyřízené/potvrzené poptávky — blokují dané časové okno
  const { data } = await supabase
    .from('field_bookings')
    .select('requested_date, status, club_name, first_name, last_name, time_from, time_to, booking_type')
    .in('status', ['confirmed', 'new'])

  const rows = data ?? []

  // Obsazené časové úseky za den — chybějící čas bereme konzervativně jako celé hrací okno.
  // Kapacita: půlka hřiště = 0.5 (druhá půlka jde pronajmout ve stejný čas), celé hřiště = 1.
  const busy: Record<string, { from: string; to: string; capacity: number }[]> = {}
  for (const r of rows) {
    const from = (r.time_from ?? OPEN).slice(0, 5)
    const to = (r.time_to ?? CLOSE).slice(0, 5)
    ;(busy[r.requested_date] ??= []).push({ from, to, capacity: bookingCapacity(r.booking_type) })
  }

  // Potvrzené rezervace — veřejně zobrazíme tým/organizaci, čas a typ pronájmu
  const confirmed = rows
    .filter((r) => r.status === 'confirmed')
    .map((r) => ({
      date: r.requested_date,
      timeFrom: r.time_from,
      timeTo: r.time_to,
      team: r.club_name || `${r.first_name} ${r.last_name}`,
      bookingType: r.booking_type,
    }))

  return NextResponse.json({ busy, confirmed, openHour: OPEN, closeHour: CLOSE })
}
