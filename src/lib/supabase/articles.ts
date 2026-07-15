import { createPublicClient } from './public'
import type { Article, ArticleCategory } from '@/types/database'

export async function getArticles({
  page = 1,
  perPage = 12,
  categorySlug,
}: {
  page?: number
  perPage?: number
  categorySlug?: string
} = {}) {
  const supabase = createPublicClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('articles')
    .select(
      `*, category:article_categories(id, name, slug, color)`,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('article_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data, count, error } = await query
  if (error) {
    console.error('getArticles error:', error)
    return { articles: [], total: 0 }
  }
  return { articles: (data ?? []) as Article[], total: count ?? 0 }
}

export async function getAllArticleSlugs() {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('articles').select('slug').eq('status', 'published')
  if (error) return []
  return (data ?? []).map((a) => a.slug as string)
}

export async function getArticleBySlug(slug: string) {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('articles')
    .select(`*, category:article_categories(id, name, slug, color), media:article_media(*)`)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data as Article & { media: any[] }
}

export async function getCategories() {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('article_categories')
      .select('*')
      .order('name')
    if (error) {
      console.error('getCategories error:', error)
      return []
    }
    return (data ?? []) as ArticleCategory[]
  } catch {
    return []
  }
}

export async function getLatestArticles(limit = 3) {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('articles')
      .select(`*, category:article_categories(id, name, slug, color)`)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) {
      console.error('getLatestArticles error:', error)
      return []
    }
    return (data ?? []) as Article[]
  } catch {
    return []
  }
}
