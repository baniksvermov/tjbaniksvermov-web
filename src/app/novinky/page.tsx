import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
import { getArticles, getCategories } from '@/lib/supabase/articles'
import ArticleCard from '@/components/ArticleCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Novinky',
  description: 'Aktuální novinky, výsledky zápasů a informace z TJ Baník Švermov.',
}

const PER_PAGE = 12

interface Props {
  searchParams: Promise<{ page?: string; kategorie?: string }>
}

export default async function NovinkyPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const kategorie = params.kategorie

  const [{ articles, total }, categories] = await Promise.all([
    getArticles({ page, perPage: PER_PAGE, categorySlug: kategorie }),
    getCategories(),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* Nadpis */}
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Novinky</h1>
        <p className="mt-2 text-gray-500">Aktuální dění v klubu, výsledky a informace</p>
      </div>

      {/* Filtr kategorií */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/novinky"
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !kategorie
              ? 'bg-[#0a0a0a] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Vše
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/novinky?kategorie=${cat.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              kategorie === cat.slug
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={kategorie === cat.slug ? { backgroundColor: cat.color ?? '#c8102e' } : {}}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="py-24 text-center text-gray-400">
          <p className="text-5xl mb-4">⚽</p>
          <p className="text-lg font-medium">Zatím žádné příspěvky</p>
          <p className="text-sm mt-1">Brzy tu něco bude!</p>
        </div>
      ) : (
        <>
          {/* Featured článek */}
          {featured && !kategorie && page === 1 && (
            <div className="mb-8">
              <ArticleCard article={featured} featured />
            </div>
          )}

          {/* Grid článků */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(kategorie || page > 1 ? articles : rest).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Paginace */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/novinky?page=${page - 1}${kategorie ? `&kategorie=${kategorie}` : ''}`}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Předchozí
                </Link>
              )}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/novinky?page=${p}${kategorie ? `&kategorie=${kategorie}` : ''}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-[#c8102e] text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
              {page < totalPages && (
                <Link
                  href={`/novinky?page=${page + 1}${kategorie ? `&kategorie=${kategorie}` : ''}`}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Další <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
