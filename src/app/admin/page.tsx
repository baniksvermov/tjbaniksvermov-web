import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Newspaper, ShoppingBag, PackageCheck, ClipboardList, Plus } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: articlesCount },
    { count: ordersCount },
    { count: newOrdersCount },
    { count: bookingsCount },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('field_bookings').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  const stats = [
    { label: 'Články', value: articlesCount ?? 0, href: '/admin/clanky', icon: Newspaper, color: 'bg-blue-50 text-blue-600' },
    { label: 'Objednávky celkem', value: ordersCount ?? 0, href: '/admin/objednavky', icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
    { label: 'Nové objednávky', value: newOrdersCount ?? 0, href: '/admin/objednavky', icon: PackageCheck, color: 'bg-[#c8102e]/10 text-[#c8102e]' },
    { label: 'Nové pronájmy UMT', value: bookingsCount ?? 0, href: '/admin/rezervace', icon: ClipboardList, color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-3xl uppercase tracking-wide text-[#0a0a0a]">Dashboard</h1>
        <p className="mt-1 text-gray-500">Přehled webu TJ Baník Švermov</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-gray-100 bg-white p-5 hover:shadow-sm transition-shadow"
          >
            <div className={`inline-flex rounded-lg p-2.5 ${stat.color} mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-[#0a0a0a]">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Rychlé akce */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="font-semibold text-[#0a0a0a] mb-4">Rychlé akce</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/clanky/novy"
            className="inline-flex items-center gap-2 rounded-lg bg-[#c8102e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#a50d25] transition-colors"
          >
            <Plus className="h-4 w-4" /> Nový článek
          </Link>
          <Link
            href="/admin/produkty/novy"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" /> Nový produkt
          </Link>
          <Link
            href="/admin/objednavky"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <PackageCheck className="h-4 w-4" /> Objednávky
          </Link>
          <Link
            href="/admin/rezervace"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ClipboardList className="h-4 w-4" /> Pronájmy UMT
          </Link>
        </div>
      </div>
    </div>
  )
}
