import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'MISSING'
  const keyPrefix = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) ?? 'MISSING'

  try {
    const supabase = await createClient()
    const { count: total } = await supabase
      .from('articles').select('*', { count: 'exact', head: true })

    const { count: published } = await supabase
      .from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published')

    const { data: sample, error } = await supabase
      .from('articles').select('title, status, published_at').limit(3)

    return NextResponse.json({ url, keyPrefix, total, published, sample, error: error?.message ?? null })
  } catch (e: any) {
    return NextResponse.json({ url, keyPrefix, error: e.message }, { status: 500 })
  }
}
