'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Newspaper, ShoppingBag, PackageCheck,
  Users, Trophy, Image, Settings, LogOut, ExternalLink, ClipboardList,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Články', href: '/admin/clanky', icon: Newspaper },
  { label: 'Týmy & Hráči', href: '/admin/tymy', icon: Users },
  { label: 'Zápasy', href: '/admin/zapasy', icon: Trophy },
  { label: 'Galerie', href: '/admin/galerie', icon: Image },
  { label: 'Produkty', href: '/admin/produkty', icon: ShoppingBag },
  { label: 'Objednávky', href: '/admin/objednavky', icon: PackageCheck },
  { label: 'Pronájmy UMT', href: '/admin/rezervace', icon: ClipboardList },
  { label: 'Nastavení', href: '/admin/nastaveni', icon: Settings },
]

interface Props {
  userEmail: string
}

export default function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-[#0a0a0a] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c8102e] text-xs font-bold">
          TJB
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">Baník Švermov</p>
          <p className="mt-0.5 text-xs text-gray-500">Admin</p>
        </div>
      </div>

      {/* Navigace */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-[#c8102e] text-white font-medium'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-3 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Zobrazit web
        </Link>
        <div className="px-3 py-2">
          <p className="text-xs text-gray-600 truncate">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Odhlásit se
        </button>
      </div>
    </aside>
  )
}
