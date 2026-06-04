import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Partneři',
  description: 'Partneři a sponzoři TJ Baník Švermov.',
}

export default async function PartneriPage() {
  const supabase = await createClient()
  const { data: partners } = await supabase
    .from('partners')
    .select('*')
    .order('position')

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Partneři</h1>
        <p className="mt-2 text-gray-500">Děkujeme všem, kteří podporují TJ Baník Švermov</p>
      </div>

      {!partners?.length ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">🤝</p>
          <p className="font-medium">Partneři budou brzy doplněni</p>
          <p className="text-sm mt-1">Chcete se stát partnerem? Kontaktujte nás.</p>
          <Link href="/kontakt" className="mt-3 inline-block text-sm text-[#c8102e] hover:underline">
            Kontaktovat klub →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((p) => (
            <a
              key={p.id}
              href={p.website_url ?? '#'}
              target={p.website_url ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 hover:border-[#c8102e]/30 hover:shadow-sm transition-all text-center"
            >
              {p.logo_url ? (
                <div className="relative h-16 w-full mb-3">
                  <Image src={p.logo_url} alt={p.name} fill className="object-contain" />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl mb-3">🤝</div>
              )}
              <p className="font-medium text-sm text-[#0a0a0a] group-hover:text-[#c8102e] transition-colors">
                {p.name}
              </p>
              {p.tier && (
                <span className="mt-1 text-xs text-gray-400">{p.tier}</span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
