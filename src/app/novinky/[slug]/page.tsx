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

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
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
      {article.excerpt && (
        <p className="mt-4 text-lg text-gray-500 leading-relaxed border-l-4 border-[#c8102e] pl-4">
          {article.excerpt}
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

      {/* Galerie článku */}
      {article.media && article.media.length > 0 && (
        <div className="mt-10">
          <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-4">Fotogalerie</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {article.media
              .filter((m) => m.type === 'image')
              .map((m) => (
                <div key={m.id} className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <Image src={m.url} alt={m.alt ?? ''} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Sdílení */}
      <div className="mt-10 border-t border-gray-100 pt-6 flex items-center gap-3">
        <span className="text-sm text-gray-500">Sdílet:</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://tjbaniksvermov.cz/novinky/${article.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Facebook
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Kopírovat odkaz
        </button>
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
