import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { cs } from 'date-fns/locale'
import type { Article } from '@/types/database'

interface Props {
  article: Article
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: Props) {
  const date = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: cs })
    : ''

  if (featured) {
    return (
      <Link href={`/novinky/${article.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] aspect-[16/9]">
          {article.hero_image_url ? (
            <Image
              src={article.hero_image_url}
              alt={article.title}
              fill
              className="object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {article.category && (
              <span
                className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: article.category.color ?? '#c8102e' }}
              >
                {article.category.name}
              </span>
            )}
            <h2 className="text-xl font-bold text-white leading-tight group-hover:text-red-200 transition-colors lg:text-2xl">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="mt-2 text-sm text-gray-300 line-clamp-2">{article.excerpt}</p>
            )}
            <p className="mt-3 text-xs text-gray-400">{date}</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/novinky/${article.slug}`} className="group block">
      <div className="rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#c8102e]/30 transition-all">
        <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
          {article.hero_image_url ? (
            <Image
              src={article.hero_image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-4xl">⚽</span>
            </div>
          )}
        </div>
        <div className="p-4">
          {article.category && (
            <span
              className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: article.category.color ?? '#c8102e' }}
            >
              {article.category.name}
            </span>
          )}
          <h3 className="font-bold text-[#0a0a0a] leading-snug group-hover:text-[#c8102e] transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
          )}
          <p className="mt-3 text-xs text-gray-400">{date}</p>
        </div>
      </div>
    </Link>
  )
}
