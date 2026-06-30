import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { Plus, Pencil, Eye, FileText } from 'lucide-react'

export default async function AdminClankyPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*, category:article_categories(name, color)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a]">Články</h1>
          <p className="mt-1 text-gray-500">{articles?.length ?? 0} článků celkem</p>
        </div>
        <Link
          href="/admin/clanky/novy"
          className="inline-flex items-center gap-2 rounded-lg bg-[#c8102e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a50d25] transition-colors"
        >
          <Plus className="h-4 w-4" /> Nový článek
        </Link>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        {!articles?.length ? (
          <div className="py-16 text-center text-gray-400">
            <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Žádné články</p>
            <Link href="/admin/clanky/novy" className="mt-3 inline-block text-sm text-[#c8102e] hover:underline">
              Přidat první článek →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Název</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Kategorie</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Datum</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#0a0a0a] line-clamp-1">{article.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">/novinky/{article.slug}</p>
                  </td>
                  <td className="px-5 py-4">
                    {article.category ? (
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: article.category.color ?? '#6b7280' }}
                      >
                        {article.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      article.status === 'published'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {article.status === 'published' ? 'Publikováno' : 'Koncept'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {article.created_at
                      ? format(new Date(article.created_at), 'd. M. yyyy', { locale: cs })
                      : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {article.status === 'published' && (
                        <Link
                          href={`/novinky/${article.slug}`}
                          target="_blank"
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                          title="Zobrazit"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/clanky/${article.id}`}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        title="Upravit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
