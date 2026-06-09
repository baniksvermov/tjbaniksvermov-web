import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Partneři',
  description: 'Partneři a sponzoři TJ Baník Švermov.',
}

const TIER_LABELS: Record<string, string> = {
  'hlavní':   'Hlavní partneři',
  'partner':  'Partneři',
  'mediální': 'Mediální partneři',
}

const TIER_ORDER = ['hlavní', 'partner', 'mediální']

export default async function PartneriPage() {
  const supabase = await createClient()
  const { data: partners } = await supabase
    .from('partners')
    .select('*')
    .order('position')

  const grouped = TIER_ORDER.reduce((acc, tier) => {
    acc[tier] = (partners ?? []).filter((p) => p.tier === tier)
    return acc
  }, {} as Record<string, typeof partners>)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Partneři</h1>
        <p className="mt-2 text-gray-500">Děkujeme všem, kteří podporují TJ Baník Švermov</p>
      </div>

      {!partners?.length ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">🤝</p>
          <p className="font-medium">Partneři budou brzy doplněni</p>
          <Link href="/kontakt" className="mt-3 inline-block text-sm text-[#c8102e] hover:underline">
            Chcete se stát partnerem? →
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {TIER_ORDER.map((tier) => {
            const list = grouped[tier]
            if (!list?.length) return null
            return (
              <div key={tier}>
                <h2 className="font-[Anton] text-2xl uppercase tracking-wide mb-5 flex items-center gap-3">
                  {TIER_LABELS[tier]}
                  <span className="h-px flex-1 bg-gray-100" />
                </h2>
                <div className={`grid gap-4 ${tier === 'hlavní' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
                  {list.map((p) => (
                    <a
                      key={p.id}
                      href={p.website_url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-5 hover:border-[#c8102e]/30 hover:shadow-sm transition-all text-center"
                    >
                      {p.logo_url ? (
                        <div className="relative h-14 w-full mb-3">
                          <Image src={p.logo_url} alt={p.name} fill className="object-contain" />
                        </div>
                      ) : (
                        <div className={`flex items-center justify-center rounded-lg bg-[#c8102e]/5 mb-3 ${tier === 'hlavní' ? 'h-16 w-full' : 'h-12 w-full'}`}>
                          <span className="font-[Anton] text-sm uppercase tracking-wide text-[#c8102e]">{p.name}</span>
                        </div>
                      )}
                      <p className={`font-semibold text-[#0a0a0a] group-hover:text-[#c8102e] transition-colors ${tier === 'hlavní' ? 'text-base' : 'text-sm'}`}>
                        {p.name}
                      </p>
                      {p.website_url && (
                        <span className="mt-1 flex items-center gap-1 text-xs text-gray-400 group-hover:text-[#c8102e] transition-colors">
                          <ExternalLink className="h-3 w-3" />
                          {p.website_url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CTA stát se partnerem */}
      <div className="mt-12 rounded-xl bg-[#0a0a0a] text-white p-8 text-center">
        <h2 className="font-[Anton] text-2xl uppercase tracking-wide mb-2">Staňte se partnerem</h2>
        <p className="text-gray-400 mb-5 max-w-lg mx-auto text-sm">
          Zajímá vás spolupráce s TJ Baník Švermov? Kontaktujte nás a domluvíme se na podmínkách.
        </p>
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 rounded-lg bg-[#c8102e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a50d25] transition-colors"
        >
          Kontaktovat klub →
        </Link>
      </div>
    </div>
  )
}
