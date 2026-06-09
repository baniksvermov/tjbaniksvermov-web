import type { Metadata } from 'next'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vedení klubu',
  description: 'Vedení a realizační tým TJ Baník Švermov.',
}

export default async function VedeniPage() {
  const supabase = await createClient()
  const { data: coaches } = await supabase
    .from('coaches')
    .select('*, team:teams(name, slug)')
    .is('team_id', null)
    .order('role')

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Vedení klubu</h1>
        <p className="mt-2 text-gray-500">Realizační tým TJ Baník Švermov</p>
      </div>

      {!coaches?.length ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-medium">Informace o vedení budou brzy doplněny</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((c) => (
            <div key={c.id} className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="mb-3 relative h-24 w-24 overflow-hidden rounded-full bg-gray-100">
                {c.photo_url ? (
                  <Image
                    src={c.photo_url}
                    alt={`${c.first_name} ${c.last_name}`}
                    fill
                    className="object-cover object-top"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#c8102e]/10 text-[#c8102e] text-2xl font-bold">
                    {c.first_name?.[0]}{c.last_name?.[0]}
                  </div>
                )}
              </div>
              <p className="font-bold text-[#0a0a0a]">{c.first_name} {c.last_name}</p>
              {c.role && <p className="text-sm text-[#c8102e] mt-0.5">{c.role}</p>}
              <div className="mt-3 space-y-1.5">
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#c8102e] transition-colors">
                    <Phone className="h-3.5 w-3.5" /> {c.phone}
                  </a>
                )}
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#c8102e] transition-colors">
                    <Mail className="h-3.5 w-3.5" /> {c.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
