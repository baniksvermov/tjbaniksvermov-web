import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Phone, Mail, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Trenéři',
  description: 'Trenéři všech oddílů TJ Baník Švermov.',
}

interface CoachRow {
  id: string
  first_name: string | null
  last_name: string | null
  role: string | null
  phone: string | null
  email: string | null
  photo_url: string | null
  team: {
    id: string
    name: string
    slug: string
    position: number
  } | null
}

export default async function TreneriPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('coaches')
    .select('*, team:teams(id, name, slug, position)')
    .not('team_id', 'is', null)
    .order('last_name')

  const coaches = (data ?? []) as CoachRow[]

  // Skupiny podle týmu, seřazené podle pozice týmu
  const teamMap = new Map<string, { team: CoachRow['team']; coaches: CoachRow[] }>()
  for (const coach of coaches) {
    if (!coach.team) continue
    const key = coach.team.id
    if (!teamMap.has(key)) teamMap.set(key, { team: coach.team, coaches: [] })
    teamMap.get(key)!.coaches.push(coach)
  }

  const groups = Array.from(teamMap.values()).sort(
    (a, b) => (a.team?.position ?? 99) - (b.team?.position ?? 99)
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <div className="mb-10">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Trenéři</h1>
        <p className="mt-2 text-gray-500">Realizační týmy všech oddílů TJ Baník Švermov</p>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-medium">Informace o trenérech budou brzy doplněny</p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(({ team, coaches: teamCoaches }) => (
            <section key={team?.id}>
              {/* Hlavička oddílu */}
              <div className="flex items-center gap-4 mb-5">
                <h2 className="font-[Anton] text-2xl uppercase tracking-wide text-[#0a0a0a]">
                  {team?.name}
                </h2>
                <div className="h-px flex-1 bg-gray-100" />
                {team?.slug && (
                  <Link
                    href={`/tymy/${team.slug}`}
                    className="text-xs text-gray-400 hover:text-[#c8102e] transition-colors whitespace-nowrap"
                  >
                    Stránka týmu →
                  </Link>
                )}
              </div>

              {/* Kartičky trenérů */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teamCoaches.map((c) => (
                  <div key={c.id} className="rounded-xl border border-gray-100 bg-white p-5 flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-[#c8102e]/10 flex items-center justify-center text-[#c8102e]">
                      {c.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.photo_url} alt="" className="h-full w-full object-cover" />
                      ) : c.first_name || c.last_name ? (
                        <span className="font-bold text-sm">
                          {c.first_name?.[0]}{c.last_name?.[0]}
                        </span>
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <p className="font-bold text-[#0a0a0a] leading-tight">
                        {c.first_name} {c.last_name}
                      </p>
                      {c.role && (
                        <p className="text-xs text-[#c8102e] mt-0.5 font-medium">{c.role}</p>
                      )}
                      <div className="mt-2 space-y-1">
                        {c.phone && (
                          <a
                            href={`tel:${c.phone.replace(/\s/g, '')}`}
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#c8102e] transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{c.phone}</span>
                          </a>
                        )}
                        {c.email && (
                          <a
                            href={`mailto:${c.email}`}
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#c8102e] transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{c.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
