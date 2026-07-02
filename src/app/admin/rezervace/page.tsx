import { createClient } from '@/lib/supabase/server'
import RezervaceClient from './RezervaceClient'
import type { FieldBooking } from '@/types/database'

export default async function AdminRezervacePage() {
  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from('field_bookings')
    .select('*')
    .order('created_at', { ascending: false })

  return <RezervaceClient bookings={(bookings ?? []) as FieldBooking[]} />
}
