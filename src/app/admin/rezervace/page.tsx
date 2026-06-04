import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'

const TYPE_LABELS: Record<string, string> = {
  match: 'Přípravný zápas',
  training: 'Trénink — celé',
  half: 'Trénink — půlka',
  with_lights: 'S osvětlením',
  without_lights: 'Bez osvětlení',
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nová',
  confirmed: 'Potvrzena',
  rejected: 'Zamítnuta',
  completed: 'Proběhla',
}

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
            <p className="text-4xl mb-3">📋</p>
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
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status] ?? STATUS_STYLES.new}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <a href={`mailto:${b.email}`} className="hover:text-[#c8102e]">{b.email}</a>
                      <a href={`tel:${b.phone}`} className="hover:text-[#c8102e] font-medium">{b.phone}</a>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm mt-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                        📅 {format(new Date(b.requested_date), 'EEEE d. M. yyyy', { locale: cs })}
                      </span>
                      {b.time_from && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                          🕐 {b.time_from}{b.time_to ? ` – ${b.time_to}` : ''}
                        </span>
                      )}
                      {b.booking_type && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#c8102e]/10 px-3 py-1 text-[#c8102e]">
                          {TYPE_LABELS[b.booking_type] ?? b.booking_type}
                        </span>
                      )}
                    </div>
                    {b.note && <p className="text-sm text-gray-500 italic mt-1">„{b.note}"</p>}
                  </div>
                  <div className="text-xs text-gray-400 shrink-0">
                    {format(new Date(b.created_at), 'd. M. yyyy HH:mm', { locale: cs })}
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
