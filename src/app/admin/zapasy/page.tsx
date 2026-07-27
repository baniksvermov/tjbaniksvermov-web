import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import ZapasyClient from './ZapasyClient'
import type { Match, Team } from '@/types/database'

async function saveScore(matchId: string, scoreHome: number | null, scoreAway: number | null) {
  'use server'
  const supabase = await createClient()
  await supabase.from('matches').update({ score_home: scoreHome, score_away: scoreAway }).eq('id', matchId)
  revalidatePath('/kalendar')
  revalidatePath('/admin/zapasy')
}

async function addMatch(data: {
  teamId: string
  opponent: string
  kickOffAt: string | null
  isHome: boolean
  venue: string | null
}) {
  'use server'
  const supabase = await createClient()
  await supabase.from('matches').insert({
    team_id: data.teamId,
    opponent: data.opponent,
    kick_off_at: data.kickOffAt,
    is_home: data.isHome,
    venue: data.venue || null,
  })
  revalidatePath('/kalendar')
  revalidatePath('/admin/zapasy')
}

async function deleteMatch(matchId: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('matches').delete().eq('id', matchId)
  revalidatePath('/kalendar')
  revalidatePath('/admin/zapasy')
}

export default async function AdminZapasyPage() {
  const supabase = await createClient()

  const [{ data: teams }, { data: matches }] = await Promise.all([
    supabase.from('teams').select('id, name, slug, position').order('position'),
    supabase.from('matches').select('*').order('kick_off_at', { ascending: true }),
  ])

  return (
    <ZapasyClient
      teams={(teams as Team[]) ?? []}
      matches={(matches as Match[]) ?? []}
      saveScore={saveScore}
      addMatch={addMatch}
      deleteMatch={deleteMatch}
    />
  )
}
