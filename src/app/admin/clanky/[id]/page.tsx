import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/supabase/articles'
import ArticleEditor from '@/components/admin/ArticleEditor'

interface Props {
  params: Promise<{ id: string }>
}

async function updateArticle(id: string, data: FormData): Promise<{ error?: string }> {
  'use server'
  const supabase = await createClient()

  const title = data.get('title') as string
  const slug = data.get('slug') as string
  const excerpt = data.get('excerpt') as string
  const contentRaw = data.get('content') as string
  const categoryId = data.get('category_id') as string
  const status = data.get('status') as string
  const heroImageUrl = data.get('hero_image_url') as string

  let content: any = contentRaw
  try { content = JSON.parse(contentRaw) } catch {
    content = contentRaw ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: contentRaw }] }] } : null
  }

  const { error } = await supabase.from('articles').update({
    title, slug,
    excerpt: excerpt || null,
    content,
    category_id: categoryId || null,
    hero_image_url: heroImageUrl || null,
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
  }).eq('id', id)

  if (error) return { error: error.message }
  redirect('/admin/clanky')
}

async function deleteArticle(id: string): Promise<void> {
  'use server'
  const supabase = await createClient()
  await supabase.from('articles').delete().eq('id', id)
  redirect('/admin/clanky')
}

export default async function EditClanekPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) notFound()

  const categories = await getCategories()

  return (
    <ArticleEditor
      article={article}
      categories={categories}
      onSave={updateArticle.bind(null, id)}
      onDelete={deleteArticle.bind(null, id)}
    />
  )
}
