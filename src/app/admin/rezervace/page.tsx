import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { ClipboardList, Calendar, Clock } from 'lucide-react'
import BookingStatusSelect from './BookingStatusSelect'
import { BOOKING_TYPE_LABELS } from '@/lib/umt-types'

export default async function AdminRezervacePage() {
  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from('field_bookings')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a]">Pronájmy UMT</h1>
        <p className="mt-1 text-gray-500">{bookings?.length ?? 0} poptávek celkem</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        {!bookings?.length ? (
          <div className="py-16 text-center text-gray-400">
            <ClipboardList className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Žádné poptávky zatím</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {bookings.map((b) => (
              <div key={b.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#0a0a0a]">{b.first_name} {b.last_name}</span>
                      {b.club_name && <span className="text-sm text-gray-500">({b.club_name})</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <a href={`mailto:${b.email}`} className="hover:text-[#c8102e]">{b.email}</a>
                      <a href={`tel:${b.phone}`} className="hover:text-[#c8102e] font-medium">{b.phone}</a>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm mt-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                        <Calendar className="h-3.5 w-3.5" /> {format(new Date(b.requested_date), 'EEEE d. M. yyyy', { locale: cs })}
                      </span>
                      {b.time_from && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                          <Clock className="h-3.5 w-3.5" /> {b.time_from}{b.time_to ? ` – ${b.time_to}` : ''}
                        </span>
                      )}
                      {b.booking_type && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#c8102e]/10 px-3 py-1 text-[#c8102e]">
                          {BOOKING_TYPE_LABELS[b.booking_type] ?? b.booking_type}
                        </span>
                      )}
                    </div>
                    {b.note && <p className="text-sm text-gray-500 italic mt-1">„{b.note}"</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <BookingStatusSelect bookingId={b.id} currentStatus={b.status} />
                    <div className="text-xs text-gray-400">
                      {format(new Date(b.created_at), 'd. M. yyyy HH:mm', { locale: cs })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
