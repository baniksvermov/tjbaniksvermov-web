'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/components/shop/CartProvider'

export default function ObjednavkaPage() {
  const { items, total, removeItem, itemKey, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    note: '',
  })

  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (items.length === 0) {
      setError('Košík je prázdný.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_first_name: form.firstName.trim(),
          customer_last_name: form.lastName.trim(),
          customer_email: form.email.trim(),
          customer_phone: form.phone.trim() || null,
          note: form.note.trim() || null,
          items: items.map((i) => ({
            product_id: i.product_id,
            product_name: i.product_name,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            unit_price: i.price,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Chyba při odesílání')

      clearCart()
      router.push(`/eshop/objednavka/uspech?order=${data.order_number}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se odeslat objednávku.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-gray-400">
        <ShoppingBag className="h-16 w-16" />
        <p className="text-lg">Košík je prázdný</p>
        <Link
          href="/eshop"
          className="rounded bg-[#c8102e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a00e26]"
        >
          Zpět do e-shopu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-700">Domů</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/eshop" className="hover:text-gray-700">E-shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700 font-medium">Objednávka</span>
        </nav>

        <h1 className="font-[Anton] text-3xl uppercase tracking-wide mb-8">Objednávka</h1>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg">Kontaktní údaje</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Jméno <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setField('firstName', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
                    placeholder="Jan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Příjmení <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setField('lastName', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
                    placeholder="Novák"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
                  placeholder="jan.novak@email.cz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]"
                  placeholder="+420 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Poznámka</label>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => setField('note', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e] resize-none"
                  placeholder="Dodatečné informace k objednávce…"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#c8102e] py-3.5 text-sm font-semibold text-white hover:bg-[#a00e26] disabled:opacity-60 transition-colors"
            >
              {loading ? 'Odesílám…' : 'Odeslat objednávku'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Po odeslání vás budeme kontaktovat na zadaný e-mail nebo telefon s dalšími
              informacemi o platbě a vyzvednutí.
            </p>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Shrnutí objednávky</h2>
              <ul className="space-y-3 divide-y">
                {items.map((item) => {
                  const key = itemKey(item)
                  return (
                    <li key={key} className="pt-3 first:pt-0 flex gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight line-clamp-2">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {[item.size, item.color].filter(Boolean).join(' · ')} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-start gap-2 flex-shrink-0">
                        <span className="text-sm font-semibold">
                          {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(key)}
                          className="text-gray-300 hover:text-red-500"
                          aria-label="Odebrat"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-4 pt-4 border-t flex items-center justify-between font-semibold">
                <span>Celkem</span>
                <span className="text-[#c8102e] text-lg">{total.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Cena bez dopravy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
