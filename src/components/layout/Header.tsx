'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/shop/CartProvider'

const navItems = [
  { label: 'Domů', href: '/' },
  { label: 'Novinky', href: '/novinky' },
  {
    label: 'Týmy',
    href: '/tymy',
    children: [
      { label: 'A-mužstvo', href: '/tymy/a-muzstvo' },
      { label: 'B-mužstvo', href: '/tymy/b-muzstvo' },
      { label: 'Dorost I.A', href: '/tymy/dorost-ia' },
      { label: 'Dorost – okr. přebor', href: '/tymy/dorost-okresni-prebor' },
      { label: 'Starší žáci', href: '/tymy/starsi-zaci' },
      { label: 'Mladší žáci', href: '/tymy/mladsi-zaci' },
      { label: 'Starší přípravka', href: '/tymy/starsi-pripravka' },
      { label: 'Mladší přípravka', href: '/tymy/mladsi-pripravka' },
      { label: 'Mini', href: '/tymy/mini' },
    ],
  },
  {
    label: 'Klub',
    href: '/klub',
    children: [
      { label: 'Historie', href: '/klub/historie' },
      { label: 'Vedení', href: '/klub/vedeni' },
      { label: 'Trenéři', href: '/klub/treneri' },
      { label: 'Hřiště', href: '/klub/hriste' },
      { label: 'Partneři', href: '/klub/partneri' },
      { label: 'Info pro členy', href: '/klub/info-pro-cleny' },
    ],
  },
  { label: 'Kalendář', href: '/kalendar' },
  { label: 'Hospoda', href: '/hospoda' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Shop', href: '/eshop' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { itemCount, openCart } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] text-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8102e] font-bold text-white text-sm leading-none">
            TJB
          </div>
          <span className="font-[Anton] text-xl uppercase tracking-wide hidden sm:block">
            TJ Baník Švermov
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-0 w-52 rounded-b-lg bg-[#0a0a0a] border border-white/10 shadow-xl py-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#c8102e] hover:text-white transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Cart icon */}
        <button
          onClick={openCart}
          className="relative p-2 text-gray-300 hover:text-white"
          aria-label="Košík"
        >
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c8102e] text-[10px] font-bold text-white">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded text-gray-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0a0a0a] px-4 py-4">
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="block py-2.5 text-sm font-medium text-gray-300 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-4 border-l border-white/10 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-2 text-sm text-gray-400 hover:text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
