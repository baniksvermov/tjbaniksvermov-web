import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { createPublicClient } from '@/lib/supabase/public'
import { ArrowRight, Mail, Phone, FileText } from 'lucide-react'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Info pro členy a hráče',
  description: 'Informace pro hráče a členy TJ Baník Švermov — valné hromady, usnesení, předpisy, příspěvky.',
}

export default async function InfoProClenyPage() {
  const supabase = createPublicClient()

  // Najdi kategorii "info" nebo "info-pro-cleny"
  const { data: category } = await supabase
    .from('article_categories')
    .select('id')
    .eq('slug', 'info')
    .single()

  const { data: articles } = category
    ? await supabase
        .from('articles')
        .select('id, title, slug, excerpt, published_at')
        .eq('status', 'published')
        .eq('category_id', category.id)
        .order('published_at', { ascending: false })
    : { data: [] }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Info pro členy a hráče</h1>
        <p className="mt-2 text-gray-500">Dokumenty, usnesení a informace pro členy klubu</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Články */}
        <div className="lg:col-span-2">
          {!articles?.length ? (
            <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
              <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Zatím žádné dokumenty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/novinky/${article.slug}`}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 hover:border-[#c8102e]/30 hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0a0a0a] group-hover:text-[#c8102e] transition-colors line-clamp-2">
                      {article.title}
                    </p>
                    {article.excerpt && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
                    )}
                    {article.published_at && (
                      <p className="mt-2 text-xs text-gray-400">
                        {format(new Date(article.published_at), 'd. MMMM yyyy', { locale: cs })}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 mt-1 text-gray-300 group-hover:text-[#c8102e] transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="font-semibold text-[#0a0a0a] mb-3">Kontakt na vedení</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <a href="mailto:baniksvermov@centrum.cz"
                className="flex items-center gap-2 hover:text-[#c8102e] transition-colors break-all">
                <Mail className="h-4 w-4 text-[#c8102e] shrink-0" />
                baniksvermov@centrum.cz
              </a>
              <a href="tel:+420604234643"
                className="flex items-start gap-2 hover:text-[#c8102e] transition-colors">
                <Phone className="h-4 w-4 text-[#c8102e] shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-[#0a0a0a]">David Nedvěd</div>
                  <div>+420 604 234 643</div>
                </div>
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="font-semibold text-[#0a0a0a] mb-3">Členské příspěvky</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Informace o výši a termínech platby členských příspěvků sdělí váš trenér nebo vedení klubu.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="font-semibold text-[#0a0a0a] mb-3">Trenéři týmů</h2>
            <p className="text-sm text-gray-600 mb-3">
              Kontakty na trenéry jednotlivých kategorií najdete na stránkách příslušných týmů.
            </p>
            <Link href="/tymy"
              className="inline-flex items-center gap-1 text-sm text-[#c8102e] hover:underline font-medium">
              Přejít na týmy <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
