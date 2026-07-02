import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const VALID_STATUSES = ['new', 'confirmed', 'rejected', 'completed']

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 })

  const { booking_id, status } = await req.json()
  if (!booking_id || !status) return NextResponse.json({ error: 'Chybí parametry' }, { status: 400 })
  if (!VALID_STATUSES.includes(status)) return NextResponse.json({ error: 'Neplatný status' }, { status: 400 })

  const serviceSupabase = createServiceClient()
  const { error: updateErr } = await serviceSupabase
    .from('field_bookings')
    .update({ status })
    .eq('id', booking_id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
