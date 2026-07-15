import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createPublicClient } from '@/lib/supabase/public'
import { ExternalLink, User, Users } from 'lucide-react'
import type { Player, Coach } from '@/types/database'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateStaticParams() {
  const supabase = createPublicClient()
  const { data } = await supabase.from('teams').select('slug')
  return (data ?? []).map((t) => ({ slug: t.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = createPublicClient()
  const { data } = await supabase.from('teams').select('name').eq('slug', slug).single()
  if (!data) return {}
  return { title: data.name, description: `${data.name} — TJ Baník Švermov` }
}

export default async function TymPage({ params }: Props) {
  const { slug } = await params
  const supabase = createPublicClient()

  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!team) notFound()

  const [{ data: players }, { data: coaches }] = await Promise.all([
    supabase.from('players').select('*').eq('team_id', team.id).order('jersey_number'),
    supabase.from('coaches').select('*').eq('team_id', team.id),
  ])

  const positionOrder = ['brankář', 'obránce', 'záložník', 'útočník']
  const sortedPlayers = (players ?? []).sort((a: Player, b: Player) => {
    const ai = positionOrder.indexOf(a.position ?? '')
    const bi = positionOrder.indexOf(b.position ?? '')
    if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    return (a.jersey_number ?? 99) - (b.jersey_number ?? 99)
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-400">
        <Link href="/tymy" className="hover:text-[#c8102e] transition-colors">Týmy</Link>
        <span className="mx-2">›</span>
        <span className="text-[#0a0a0a]">{team.name}</span>
      </div>

      {/* Hero */}
      <div className="mb-8 rounded-2xl bg-[#0a0a0a] text-white px-8 py-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#c8102e]">
          {team.category}
        </span>
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide mt-1 lg:text-5xl">
          {team.name}
        </h1>
        {team.description && (
          <p className="mt-3 text-gray-400 max-w-xl">{team.description}</p>
        )}
        {(team.competition_url || team.schedule_url) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {team.competition_url && (
              <a href={team.competition_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition-colors">
                <ExternalLink className="h-3.5 w-3.5" /> Tabulka (fotbal.cz)
              </a>
            )}
            {team.schedule_url && (
              <a href={team.schedule_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition-colors">
                <ExternalLink className="h-3.5 w-3.5" /> Rozpis zápasů
              </a>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Soupiska */}
        <div className="lg:col-span-2">
          <h2 className="font-[Anton] text-2xl uppercase tracking-wide mb-4">Soupiska</h2>
          {!sortedPlayers.length ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-14 text-center text-gray-400">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Soupiska bude brzy doplněna</p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 w-10">#</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Hráč</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 hidden sm:table-cell">Post</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 hidden sm:table-cell">Ročník</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedPlayers.map((p: Player) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-400">{p.jersey_number ?? '—'}</td>
                      <td className="px-4 py-3 font-medium text-[#0a0a0a]">
                        {p.first_name} {p.last_name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize hidden sm:table-cell">{p.position ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.birth_year ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Realizační tým */}
        <div>
          <h2 className="font-[Anton] text-2xl uppercase tracking-wide mb-4">Realizační tým</h2>
          {!coaches?.length ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-gray-400">
              <p className="text-sm">Bude doplněno</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(coaches as Coach[]).map((c) => (
                <div key={c.id} className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8102e]/10 text-[#c8102e]">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0a0a0a] text-sm">{c.first_name} {c.last_name}</p>
                      {c.role && <p className="text-xs text-gray-400">{c.role}</p>}
                    </div>
                  </div>
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="mt-2 block text-xs text-[#c8102e] hover:underline">
                      {c.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
