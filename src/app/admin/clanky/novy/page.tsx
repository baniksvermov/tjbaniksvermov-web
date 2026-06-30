import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/supabase/articles'
import ArticleEditor from '@/components/admin/ArticleEditor'

async function saveArticle(data: FormData): Promise<{ error?: string; slug?: string }> {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nejsi přihlášen.' }

  const title = data.get('title') as string
  const slug = data.get('slug') as string
  const excerpt = data.get('excerpt') as string
  const contentRaw = data.get('content') as string
  const categoryId = data.get('category_id') as string
  const status = data.get('status') as string
  const heroImageUrl = data.get('hero_image_url') as string
  const galleryImagesRaw = data.get('gallery_images') as string
  const galleryLayout = data.get('gallery_layout') as string
  const youtubeUrl = data.get('youtube_url') as string

  let content: any = contentRaw
  try { content = JSON.parse(contentRaw) } catch {
    content = contentRaw ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: contentRaw }] }] } : null
  }

  let galleryImages: string[] = []
  try { galleryImages = JSON.parse(galleryImagesRaw || '[]') } catch { galleryImages = [] }

  const { error } = await supabase.from('articles').insert({
    title,
    slug,
    excerpt: excerpt || null,
    content,
    category_id: categoryId || null,
    author_id: user.id,
    hero_image_url: heroImageUrl || null,
    gallery_images: galleryImages.length > 0 ? galleryImages : null,
    gallery_layout: galleryLayout || 'carousel',
    youtube_url: youtubeUrl || null,
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
  })

  if (error) return { error: error.message }
  redirect('/admin/clanky')
}

export default async function NovyClanekPage() {
  const categories = await getCategories()

  return <ArticleEditor categories={categories} onSave={saveArticle} />
}
