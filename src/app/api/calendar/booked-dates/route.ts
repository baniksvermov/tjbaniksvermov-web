import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const supabase = createServiceClient()

  // Confirmed bookings from DB
  const { data } = await supabase
    .from('field_bookings')
    .select('requested_date')
    .in('status', ['confirmed', 'new'])

  const dbDates = (data ?? []).map((r: { requested_date: string }) => r.requested_date)

  // Google Calendar (when configured)
  let googleDates: string[] = []
  const calId = process.env.GOOGLE_CALENDAR_ID
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY

  if (calId && apiKey) {
    try {
      const now = new Date()
      const tMin = now.toISOString()
      const tMax = new Date(now.getFullYear(), now.getMonth() + 3, 1).toISOString()
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events?key=${apiKey}&timeMin=${tMin}&timeMax=${tMax}&singleEvents=true&maxResults=250`
      const res = await fetch(url, { next: { revalidate: 300 } })
      if (res.ok) {
        const json = await res.json()
        googleDates = (json.items ?? []).map((e: { start: { date?: string; dateTime?: string } }) => {
          const d = e.start.date ?? e.start.dateTime ?? ''
          return d.slice(0, 10)
        }).filter(Boolean)
      }
    } catch {
      // silently ignore — Google Calendar not available
    }
  }

  const allDates = [...new Set([...dbDates, ...googleDates])]
  return NextResponse.json({ dates: allDates })
}
