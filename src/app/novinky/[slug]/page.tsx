export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { ArrowLeft } from 'lucide-react'
import { getArticleBySlug, getLatestArticles } from '@/lib/supabase/articles'
import { tiptapToHtml } from '@/lib/tiptap-renderer'
import ArticleCard from '@/components/ArticleCard'
import ShareButton from '@/components/ShareButton'
import ArticleGallery from '@/components/ArticleGallery'

interface Props {
  params: Promise<{ slug: string }>
}

function stripShortcodes(text: string | null | undefined): string {
  return text?.replace(/\[\/?\w[\w-]*[\s\S]*?\]/g, '').trim() ?? ''
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  const desc = stripShortcodes(article.excerpt)
  return {
    title: article.title,
    description: desc || undefined,
    openGraph: {
      title: article.title,
      description: desc || undefined,
      images: article.hero_image_url ? [article.hero_image_url] : [],
    },
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const [article, related] = await Promise.all([
    getArticleBySlug(slug),
    getLatestArticles(3),
  ])

  if (!article) notFound()

  const contentHtml = tiptapToHtml(article.content)
  const cleanExcerpt = stripShortcodes(article.excerpt)
  const publishedDate = article.published_at
    ? format(new Date(article.published_at), 'd. MMMM yyyy', { locale: cs })
    : ''

  const relatedArticles = related.filter((a) => a.slug !== slug).slice(0, 3)

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      {/* Zpět */}
      <Link
        href="/novinky"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#c8102e] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Zpět na novinky
      </Link>

      {/* Kategorie + datum */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {article.category && (
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: article.category.color ?? '#c8102e' }}
          >
            {article.category.name}
          </span>
        )}
        {publishedDate && (
          <time className="text-sm text-gray-400">{publishedDate}</time>
        )}
      </div>

      {/* Nadpis */}
      <h1 className="font-[Anton] text-3xl uppercase tracking-wide leading-tight lg:text-4xl">
        {article.title}
      </h1>

      {/* Perex */}
      {cleanExcerpt && (
        <p className="mt-4 text-lg text-gray-500 leading-relaxed border-l-4 border-[#c8102e] pl-4">
          {cleanExcerpt}
        </p>
      )}

      {/* Hero obrázek */}
      {article.hero_image_url && (
        <div className="mt-8 relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={article.hero_image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Obsah */}
      {contentHtml && (
        <div
          className="prose prose-lg mt-8 max-w-none
            prose-headings:font-[Anton] prose-headings:uppercase prose-headings:tracking-wide
            prose-a:text-[#c8102e] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#0a0a0a]
            prose-blockquote:border-l-[#c8102e] prose-blockquote:text-gray-600
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}

      {/* Fotogalerie */}
      {article.gallery_images && article.gallery_images.length > 0 && (
        <div className="mt-10">
          <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-4">Fotogalerie</h2>
          <ArticleGallery
            images={article.gallery_images}
            layout={article.gallery_layout ?? 'carousel'}
          />
        </div>
      )}

      {/* YouTube video */}
      {article.youtube_url && getYouTubeId(article.youtube_url) && (
        <div className="mt-10">
          <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-4">Video</h2>
          <div className="aspect-video overflow-hidden rounded-2xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(article.youtube_url)}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Sdílení */}
      <div className="mt-10 border-t border-gray-100 pt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-500">Sdílet:</span>
        <ShareButton />
      </div>

      {/* Související články */}
      {relatedArticles.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[Anton] text-2xl uppercase tracking-wide mb-6">
            Další novinky
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    return u.searchParams.get('v')
  } catch {
    return null
  }
}
