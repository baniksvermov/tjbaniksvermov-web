import { createPublicClient } from './public'
import type { Match } from '@/types/database'

export async function getUpcomingMatches(limit = 9) {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('matches')
    .select('*, team:teams(name, slug)')
    .gte('kick_off_at', new Date().toISOString())
    .order('kick_off_at', { ascending: true })
    .limit(limit)
  if (error) {
    console.error('getUpcomingMatches error:', error)
    return []
  }
  return (data ?? []) as Match[]
}
