'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '@/components/shop/CartProvider'

export default function ObjednavkaPage() {
  const { items, total, removeItem, itemKey, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formLoadedAt] = useState(() => Date.now())
  const [honeypot, setHoneypot] = useState('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    note: '',
  })

  // Potisk state
  const [potiskKlubu, setPotiskKlubu] = useState({ enabled: false, qty: 1 })
  const [potiskTextZada, setPotiskTextZada] = useState({ enabled: false, text: '' })
  const [potiskJmeno, setPotiskJmeno] = useState({ enabled: false, value: '' })
  const [potiskCislo, setPotiskCislo] = useState({ enabled: false, value: '' })

  // Výpočet ceny potisku
  const cisloNum = parseInt(potiskCislo.value) || 0
  const cisloCena = cisloNum >= 1 && cisloNum <= 9 ? 20 : cisloNum >= 10 && cisloNum <= 99 ? 40 : 0
  const potiskTotal =
    (potiskKlubu.enabled ? potiskKlubu.qty * 60 : 0) +
    (potiskTextZada.enabled ? 60 : 0) +
    (potiskJmeno.enabled ? 70 : 0) +
    (potiskCislo.enabled && cisloCena > 0 ? cisloCena : 0)
  const grandTotal = total + potiskTotal

  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function buildNote() {
    const parts: string[] = []
    if (form.note.trim()) parts.push(form.note.trim())
    const potiskLines: string[] = []
    if (potiskKlubu.enabled) potiskLines.push(`Potisk klubu: ${potiskKlubu.qty} ks × 60 Kč = ${potiskKlubu.qty * 60} Kč`)
    if (potiskTextZada.enabled) potiskLines.push(`Potisk text záda${potiskTextZada.text ? ` (${potiskTextZada.text})` : ''}: 60 Kč`)
    if (potiskJmeno.enabled && potiskJmeno.value) potiskLines.push(`Potisk jméno (${potiskJmeno.value}): 70 Kč`)
    if (potiskCislo.enabled && cisloCena > 0) potiskLines.push(`Potisk číslo (${potiskCislo.value}): ${cisloCena} Kč`)
    if (potiskLines.length > 0) parts.push('POTISK:\n' + potiskLines.join('\n'))
    return parts.join('\n\n')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (items.length === 0) { setError('Košík je prázdný.'); return }
    if (potiskCislo.enabled && potiskCislo.value && (cisloNum < 1 || cisloNum > 99)) {
      setError('Číslo potisku musí být v rozsahu 1–99.'); return
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
          note: buildNote() || null,
          potisk_total: potiskTotal,
          _hp: honeypot,
          _t: formLoadedAt,
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
        <Link href="/eshop" className="rounded bg-[#c8102e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a00e26]">
          Zpět do e-shopu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-700">Domů</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/eshop" className="hover:text-gray-700">E-shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700 font-medium">Objednávka</span>
        </nav>

        <h1 className="font-[Anton] text-3xl uppercase tracking-wide mb-8">Objednávka</h1>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Formulář */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            {/* Honeypot — skryté před lidmi, boti ho vyplní */}
            <div aria-hidden="true" className="hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
                value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg">Kontaktní údaje</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Jméno <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.firstName} onChange={(e) => setField('firstName', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" placeholder="Jan" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Příjmení <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.lastName} onChange={(e) => setField('lastName', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" placeholder="Novák" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">E-mail <span className="text-red-500">*</span></label>
                <input type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" placeholder="jan.novak@email.cz" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <input type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" placeholder="+420 123 456 789" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Poznámka</label>
                <textarea rows={3} value={form.note} onChange={(e) => setField('note', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e] resize-none"
                  placeholder="Dodatečné informace k objednávce…" />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-[#c8102e] py-3.5 text-sm font-semibold text-white hover:bg-[#a00e26] disabled:opacity-60 transition-colors">
              {loading ? 'Odesílám…' : 'Odeslat objednávku'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Po odeslání vás budeme kontaktovat na zadaný e-mail nebo telefon s dalšími informacemi o platbě a vyzvednutí.
            </p>
          </form>

          {/* Pravý sloupec */}
          <div className="lg:col-span-2 space-y-4">

            {/* POTISK */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold text-lg">Potisk dresu</h2>
                <p className="text-xs text-gray-400 mt-0.5">Volitelné — přidejte k objednávce</p>
              </div>

              <div className="space-y-4">

                {/* Potisk klubu */}
                <div className="rounded-lg border border-gray-100 p-3">
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={potiskKlubu.enabled}
                        onChange={(e) => setPotiskKlubu((p) => ({ ...p, enabled: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-[#c8102e] focus:ring-[#c8102e]" />
                      <div>
                        <p className="text-sm font-medium">Potisk klubu</p>
                        <p className="text-xs text-gray-400">60 Kč / ks</p>
                      </div>
                    </div>
                    {potiskKlubu.enabled && (
                      <span className="text-sm font-semibold text-[#c8102e]">{potiskKlubu.qty * 60} Kč</span>
                    )}
                  </label>
                  {potiskKlubu.enabled && (
                    <div className="mt-3 flex items-center gap-3">
                      <p className="text-xs text-gray-500">Počet kusů:</p>
                      <div className="flex items-center gap-1">
                        <button type="button"
                          onClick={() => setPotiskKlubu((p) => ({ ...p, qty: Math.max(1, p.qty - 1) }))}
                          className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 hover:bg-gray-50">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{potiskKlubu.qty}</span>
                        <button type="button"
                          onClick={() => setPotiskKlubu((p) => ({ ...p, qty: p.qty + 1 }))}
                          className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 hover:bg-gray-50">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Potisk text záda */}
                <div className="rounded-lg border border-gray-100 p-3">
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={potiskTextZada.enabled}
                        onChange={(e) => setPotiskTextZada((p) => ({ ...p, enabled: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-[#c8102e] focus:ring-[#c8102e]" />
                      <div>
                        <p className="text-sm font-medium">Potisk text záda</p>
                        <p className="text-xs text-gray-400">60 Kč</p>
                      </div>
                    </div>
                    {potiskTextZada.enabled && (
                      <span className="text-sm font-semibold text-[#c8102e]">60 Kč</span>
                    )}
                  </label>
                  {potiskTextZada.enabled && (
                    <input type="text" value={potiskTextZada.text}
                      onChange={(e) => setPotiskTextZada((p) => ({ ...p, text: e.target.value }))}
                      placeholder="Text na záda…"
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c8102e]" />
                  )}
                </div>

                {/* Potisk jméno */}
                <div className="rounded-lg border border-gray-100 p-3">
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={potiskJmeno.enabled}
                        onChange={(e) => setPotiskJmeno((p) => ({ ...p, enabled: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-[#c8102e] focus:ring-[#c8102e]" />
                      <div>
                        <p className="text-sm font-medium">Potisk jméno</p>
                        <p className="text-xs text-gray-400">70 Kč</p>
                      </div>
                    </div>
                    {potiskJmeno.enabled && (
                      <span className="text-sm font-semibold text-[#c8102e]">70 Kč</span>
                    )}
                  </label>
                  {potiskJmeno.enabled && (
                    <input type="text" value={potiskJmeno.value}
                      onChange={(e) => setPotiskJmeno((p) => ({ ...p, value: e.target.value }))}
                      placeholder="Příjmení / jméno…"
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c8102e]" />
                  )}
                </div>

                {/* Potisk číslo */}
                <div className="rounded-lg border border-gray-100 p-3">
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={potiskCislo.enabled}
                        onChange={(e) => setPotiskCislo((p) => ({ ...p, enabled: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300 text-[#c8102e] focus:ring-[#c8102e]" />
                      <div>
                        <p className="text-sm font-medium">Potisk číslo</p>
                        <p className="text-xs text-gray-400">1–9: 20 Kč · 10–99: 40 Kč</p>
                      </div>
                    </div>
                    {potiskCislo.enabled && cisloCena > 0 && (
                      <span className="text-sm font-semibold text-[#c8102e]">{cisloCena} Kč</span>
                    )}
                  </label>
                  {potiskCislo.enabled && (
                    <div className="mt-2 flex items-center gap-2">
                      <input type="number" min={1} max={99} value={potiskCislo.value}
                        onChange={(e) => setPotiskCislo((p) => ({ ...p, value: e.target.value }))}
                        placeholder="1–99"
                        className="w-24 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c8102e]" />
                      {potiskCislo.value && cisloCena === 0 && (
                        <p className="text-xs text-red-500">Zadejte číslo 1–99</p>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Potisk mezisoučet */}
              {potiskTotal > 0 && (
                <div className="mt-4 pt-3 border-t flex items-center justify-between text-sm">
                  <span className="text-gray-500">Potisk celkem</span>
                  <span className="font-semibold">+{potiskTotal.toLocaleString('cs-CZ')} Kč</span>
                </div>
              )}
            </div>

            {/* Shrnutí objednávky */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Shrnutí objednávky</h2>
              <ul className="space-y-3 divide-y">
                {items.map((item) => {
                  const key = itemKey(item)
                  return (
                    <li key={key} className="pt-3 first:pt-0 flex gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight line-clamp-2">{item.product_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {[item.size, item.color].filter(Boolean).join(' · ')} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-start gap-2 flex-shrink-0">
                        <span className="text-sm font-semibold">{(item.price * item.quantity).toLocaleString('cs-CZ')} Kč</span>
                        <button type="button" onClick={() => removeItem(key)}
                          className="text-gray-300 hover:text-red-500" aria-label="Odebrat">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {/* Potisk řádky */}
              {potiskTotal > 0 && (
                <div className="mt-3 pt-3 border-t space-y-1.5">
                  {potiskKlubu.enabled && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Potisk klubu × {potiskKlubu.qty} ks</span>
                      <span>{potiskKlubu.qty * 60} Kč</span>
                    </div>
                  )}
                  {potiskTextZada.enabled && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Potisk text záda</span>
                      <span>60 Kč</span>
                    </div>
                  )}
                  {potiskJmeno.enabled && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Potisk jméno{potiskJmeno.value ? ` (${potiskJmeno.value})` : ''}</span>
                      <span>70 Kč</span>
                    </div>
                  )}
                  {potiskCislo.enabled && cisloCena > 0 && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Potisk číslo {potiskCislo.value}</span>
                      <span>{cisloCena} Kč</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t flex items-center justify-between font-semibold">
                <span>Celkem</span>
                <span className="text-[#c8102e] text-lg">{grandTotal.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Cena bez dopravy</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
