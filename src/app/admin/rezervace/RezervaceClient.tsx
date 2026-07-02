'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { ClipboardList, Calendar, Clock, Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import BookingStatusSelect from './BookingStatusSelect'
import BookingForm, { type BookingFormValues } from './BookingForm'
import { BOOKING_TYPE_LABELS } from '@/lib/umt-types'
import type { FieldBooking } from '@/types/database'

function toFormValues(b: FieldBooking): BookingFormValues {
  return {
    team: b.club_name || `${b.first_name} ${b.last_name}`.trim(),
    requestedDate: b.requested_date,
    timeFrom: b.time_from?.slice(0, 5) ?? '',
    timeTo: b.time_to?.slice(0, 5) ?? '',
    bookingType: b.booking_type ?? '',
    note: b.note ?? '',
  }
}

export default function RezervaceClient({ bookings }: { bookings: FieldBooking[] }) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  function refreshAndClose() {
    router.refresh()
    setAdding(false)
    setEditingId(null)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a]">Pronájmy UMT</h1>
          <p className="mt-1 text-gray-500">{bookings.length} poptávek celkem</p>
        </div>
        {!adding && (
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" />
            Přidat rezervaci
          </Button>
        )}
      </div>

      {adding && (
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-[#0a0a0a]">Nová rezervace (rovnou potvrzena)</p>
          <BookingForm onDone={refreshAndClose} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        {!bookings.length ? (
          <div className="py-16 text-center text-gray-400">
            <ClipboardList className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Žádné poptávky zatím</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {bookings.map((b) => (
              <div key={b.id} className="p-5 hover:bg-gray-50 transition-colors">
                {editingId === b.id ? (
                  <BookingForm
                    bookingId={b.id}
                    initial={toFormValues(b)}
                    onDone={refreshAndClose}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#0a0a0a]">{b.first_name} {b.last_name}</span>
                        {b.club_name && <span className="text-sm text-gray-500">({b.club_name})</span>}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <a href={`mailto:${b.email}`} className="hover:text-[#c8102e]">{b.email}</a>
                        {b.phone && <a href={`tel:${b.phone}`} className="hover:text-[#c8102e] font-medium">{b.phone}</a>}
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
                      <button
                        onClick={() => setEditingId(b.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-[#c8102e] mt-1"
                      >
                        <Pencil className="h-3 w-3" /> Upravit datum/čas
                      </button>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <BookingStatusSelect bookingId={b.id} currentStatus={b.status} />
                      <div className="text-xs text-gray-400">
                        {format(new Date(b.created_at), 'd. M. yyyy HH:mm', { locale: cs })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
