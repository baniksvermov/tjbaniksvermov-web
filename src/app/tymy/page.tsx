import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Týmy',
  description: 'Všechny týmy TJ Baník Švermov — od mini přípravky po A-mužstvo.',
}

const categories = ['muži', 'dorost', 'mládež']
const categoryLabels: Record<string, string> = {
  muži: 'Muži',
  dorost: 'Dorost',
  mládež: 'Mládež',
}

export default async function TymyPage() {
  const supabase = await createClient()
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .order('position')

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = (teams ?? []).filter((t) => t.category === cat)
    return acc
  }, {} as Record<string, typeof teams>)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Naše týmy</h1>
        <p className="mt-2 text-gray-500">Od nejmenších přípravkářů po A-mužstvo</p>
      </div>

      <div className="space-y-10">
        {categories.map((cat) => {
          const catTeams = grouped[cat]
          if (!catTeams?.length) return null
          return (
            <div key={cat}>
              <h2 className="font-[Anton] text-2xl uppercase tracking-wide mb-4 flex items-center gap-3">
                {categoryLabels[cat]}
                <span className="h-px flex-1 bg-gray-100" />
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/tymy/${team.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 hover:border-[#c8102e] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8102e]/10 text-[#c8102e] font-bold text-xs">
                        ⚽
                      </div>
                      <p className="font-semibold text-[#0a0a0a] group-hover:text-[#c8102e] transition-colors">
                        {team.name}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#c8102e] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
