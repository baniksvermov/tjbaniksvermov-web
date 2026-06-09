import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'MISSING'
  const keyPrefix = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) ?? 'MISSING'

  try {
    const supabase = await createClient()
    // Test přesně stejný dotaz jako getArticles()
    const { data, count, error } = await supabase
      .from('articles')
      .select('*, category:article_categories(id, name, slug, color)', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(0, 2)

    return NextResponse.json({
      url, keyPrefix,
      count,
      titles: data?.map(a => a.title),
      error: error?.message ?? null,
      errorCode: (error as any)?.code ?? null,
    })
  } catch (e: any) {
    return NextResponse.json({ url, keyPrefix, error: e.message }, { status: 500 })
  }
}
