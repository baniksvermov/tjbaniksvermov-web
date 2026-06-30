import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminProduktyPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, price, status, in_stock, category:product_categories(name)')
    .order('name')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a]">Produkty</h1>
          <p className="mt-1 text-sm text-gray-500">{products?.length ?? 0} produktů celkem</p>
        </div>
        <Link
          href="/admin/produkty/novy"
          className="flex items-center gap-2 rounded-lg bg-[#c8102e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a00e26] transition-colors"
        >
          <Plus className="h-4 w-4" /> Nový produkt
        </Link>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Název</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">Kategorie</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Cena</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">Stav</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products?.map((p) => {
              const cat = p.category && typeof p.category === 'object' && !Array.isArray(p.category)
                ? (p.category as { name: string }).name
                : '—'
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{cat}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {Number(p.price).toLocaleString('cs-CZ')} Kč
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === 'published'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status === 'published' ? 'Zveřejněno' : 'Skrytý'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/eshop/${p.slug}`}
                      target="_blank"
                      className="text-xs text-gray-400 hover:text-[#c8102e] transition-colors"
                    >
                      Náhled →
                    </Link>
                  </td>
                </tr>
              )
            })}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                  Žádné produkty. <Link href="/admin/produkty/novy" className="text-[#c8102e] hover:underline">Přidat první →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
