'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

const bookingTypes = [
  { value: 'match', label: 'Celé hřiště — přípravný zápas' },
  { value: 'training', label: 'Celé hřiště — trénink' },
  { value: 'half', label: 'Půlka hřiště — trénink' },
  { value: 'with_lights', label: 'S osvětlením' },
  { value: 'without_lights', label: 'Bez osvětlení' },
]

export default function UmtForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = {
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      clubName: (form.elements.namedItem('clubName') as HTMLInputElement).value,
      requestedDate: (form.elements.namedItem('requestedDate') as HTMLInputElement).value,
      timeFrom: (form.elements.namedItem('timeFrom') as HTMLInputElement).value,
      timeTo: (form.elements.namedItem('timeTo') as HTMLInputElement).value,
      bookingType: (form.elements.namedItem('bookingType') as HTMLSelectElement).value,
      note: (form.elements.namedItem('note') as HTMLTextAreaElement).value,
      honeypot: (form.elements.namedItem('website') as HTMLInputElement).value,
    }

    // Honeypot anti-spam
    if (data.honeypot) { setLoading(false); return }

    const res = await fetch('/api/umt-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setSent(true)
    } else {
      const json = await res.json().catch(() => ({}))
      setError(json.error ?? 'Nastala chyba. Zkuste to prosím znovu.')
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 p-10 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="font-[Anton] text-2xl uppercase tracking-wide text-[#0a0a0a] mb-2">
          Poptávka odeslána!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Děkujeme za zájem. Ozveme se vám telefonicky pro potvrzení termínu, zpravidla do 24 hodin.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-[#c8102e] hover:underline"
        >
          Odeslat další poptávku
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 lg:p-8">
      <h2 className="font-[Anton] text-2xl uppercase tracking-wide text-[#0a0a0a] mb-6">
        Poptávka pronájmu
      </h2>

      {/* Honeypot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="space-y-5">
        {/* Jméno + příjmení */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Jméno *</label>
            <input
              name="firstName"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
              placeholder="Jan"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Příjmení *</label>
            <input
              name="lastName"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
              placeholder="Novák"
            />
          </div>
        </div>

        {/* Email + telefon */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email *</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
              placeholder="jan@email.cz"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Telefon *</label>
            <input
              name="phone"
              type="tel"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
              placeholder="+420 600 000 000"
            />
          </div>
        </div>

        {/* Název klubu/organizace */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Klub / organizace</label>
          <input
            name="clubName"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
            placeholder="FK Příklad"
          />
        </div>

        {/* Datum + čas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Požadovaný den *</label>
            <input
              name="requestedDate"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Od</label>
            <input
              name="timeFrom"
              type="time"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Do</label>
            <input
              name="timeTo"
              type="time"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
            />
          </div>
        </div>

        {/* Typ pronájmu */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Typ pronájmu *</label>
          <select
            name="bookingType"
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors"
          >
            <option value="">— vyberte typ —</option>
            {bookingTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Poznámka */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Poznámka</label>
          <textarea
            name="note"
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:border-[#c8102e] focus:outline-none focus:ring-1 focus:ring-[#c8102e] transition-colors resize-none"
            placeholder="Další informace, požadavky..."
          />
        </div>

        {/* GDPR */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="gdpr"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#c8102e] focus:ring-[#c8102e]"
          />
          <label htmlFor="gdpr" className="text-sm text-gray-600">
            Souhlasím se zpracováním osobních údajů za účelem vyřízení poptávky pronájmu.{' '}
            <a href="/ochrana-osobnich-udaju" className="text-[#c8102e] hover:underline">
              Ochrana osobních údajů
            </a>
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#c8102e] py-3 text-sm font-semibold text-white hover:bg-[#a50d25] disabled:opacity-50 transition-colors"
        >
          <Send className="h-4 w-4" />
          {loading ? 'Odesílám...' : 'Odeslat poptávku'}
        </button>
      </div>
    </form>
  )
}
