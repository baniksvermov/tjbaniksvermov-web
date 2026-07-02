'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'

const teams = [
  { value: 'a-muzstvo', label: 'A-mužstvo' },
  { value: 'b-muzstvo', label: 'B-mužstvo' },
  { value: 'dorost', label: 'Dorost' },
  { value: 'zaci', label: 'Žáci' },
  { value: 'pripravka', label: 'Přípravka' },
  { value: 'mini', label: 'Mini' },
  { value: 'nevim', label: 'Nevím, poraďte mi' },
]

export default function PridejSeForm() {
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
      birthYear: (form.elements.namedItem('birthYear') as HTMLInputElement).value,
      team: (form.elements.namedItem('team') as HTMLSelectElement).value,
      note: (form.elements.namedItem('note') as HTMLTextAreaElement).value,
      honeypot: (form.elements.namedItem('website') as HTMLInputElement).value,
    }

    if (data.honeypot) { setLoading(false); return }

    const res = await fetch('/api/pridej-se', {
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
        <h2 className="font-[Anton] text-2xl uppercase tracking-wide text-foreground mb-2">
          Přihláška odeslána!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Děkujeme za zájem hrát za Baník Švermov. Ozveme se vám co nejdřív.
        </p>
        <Button variant="ghost" onClick={() => setSent(false)} className="mt-6">
          Odeslat další přihlášku
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 lg:p-8">
      {/* Honeypot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Jméno *</Label>
            <Input name="firstName" required placeholder="Jan" />
          </div>
          <div>
            <Label>Příjmení *</Label>
            <Input name="lastName" required placeholder="Novák" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Email *</Label>
            <Input name="email" type="email" required placeholder="jan@email.cz" />
          </div>
          <div>
            <Label>Telefon *</Label>
            <Input name="phone" type="tel" required placeholder="+420 600 000 000" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Rok narození</Label>
            <Input name="birthYear" type="number" min={1930} max={new Date().getFullYear()} placeholder="2012" />
          </div>
          <div>
            <Label>Preferovaný tým</Label>
            <Select name="team" defaultValue="">
              <option value="">— vyberte —</option>
              {teams.map((t) => (
                <option key={t.value} value={t.label}>{t.label}</option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label>Poznámka</Label>
          <Textarea name="note" rows={3} className="resize-none" placeholder="Dosavadní zkušenosti, pozice na hřišti…" />
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="gdpr"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="gdpr" className="text-sm text-gray-600">
            Souhlasím se zpracováním osobních údajů za účelem vyřízení přihlášky.{' '}
            <a href="/ochrana-osobnich-udaju" className="text-primary hover:underline">
              Ochrana osobních údajů
            </a>
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} size="lg" className="w-full">
          <Send className="h-4 w-4" />
          {loading ? 'Odesílám...' : 'Odeslat přihlášku'}
        </Button>
      </div>
    </form>
  )
}
