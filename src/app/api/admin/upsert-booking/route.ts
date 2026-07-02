import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 })

  const { booking_id, team, requested_date, time_from, time_to, booking_type, note } = await req.json()

  if (!team || !requested_date) {
    return NextResponse.json({ error: 'Vyplňte tým a datum.' }, { status: 400 })
  }

  const serviceSupabase = createServiceClient()
  const payload = {
    first_name: team,
    last_name: '',
    email: 'interni@tjbaniksvermov.cz',
    phone: null,
    club_name: null,
    requested_date,
    time_from: time_from || null,
    time_to: time_to || null,
    booking_type: booking_type || null,
    note: note || null,
    status: 'confirmed',
  }

  if (booking_id) {
    const { error } = await serviceSupabase.from('field_bookings').update(payload).eq('id', booking_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await serviceSupabase.from('field_bookings').insert(payload)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
