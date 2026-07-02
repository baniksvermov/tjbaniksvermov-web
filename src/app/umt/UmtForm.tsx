'use client'

import { useState, useEffect } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Label from '@/components/ui/Label'
import Button from '@/components/ui/Button'

const bookingTypes = [
  { value: 'match_no_lights', label: 'Celé hřiště — přípravný zápas, bez osvětlení' },
  { value: 'match_lights', label: 'Celé hřiště — přípravný zápas, s osvětlením' },
  { value: 'training_no_lights', label: 'Celé hřiště — trénink, bez osvětlení' },
  { value: 'training_lights', label: 'Celé hřiště — trénink, s osvětlením' },
  { value: 'half_no_lights', label: 'Půlka hřiště — trénink, bez osvětlení' },
  { value: 'half_lights', label: 'Půlka hřiště — trénink, s osvětlením' },
]

interface Props {
  selectedDate?: string
}

export default function UmtForm({ selectedDate = '' }: Props) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dateValue, setDateValue] = useState(selectedDate)

  useEffect(() => {
    if (selectedDate) setDateValue(selectedDate)
  }, [selectedDate])

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
        <h2 className="font-[Anton] text-2xl uppercase tracking-wide text-foreground mb-2">
          Poptávka odeslána!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Děkujeme za zájem. Ozveme se vám telefonicky pro potvrzení termínu, zpravidla do 24 hodin.
        </p>
        <Button variant="ghost" onClick={() => setSent(false)} className="mt-6">
          Odeslat další poptávku
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 lg:p-8">
      <h2 className="font-[Anton] text-2xl uppercase tracking-wide text-foreground mb-6">
        Poptávka pronájmu
      </h2>

      {/* Honeypot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="space-y-5">
        {/* Jméno + příjmení */}
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

        {/* Email + telefon */}
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

        {/* Název klubu/organizace */}
        <div>
          <Label>Klub / organizace</Label>
          <Input name="clubName" placeholder="FK Příklad" />
        </div>

        {/* Datum + čas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label>
              Požadovaný den *
              {dateValue && <span className="ml-2 text-xs font-normal text-primary">← vybráno z kalendáře</span>}
            </Label>
            <Input
              name="requestedDate"
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
            />
          </div>
          <div>
            <Label>Od</Label>
            <Input name="timeFrom" type="time" />
          </div>
          <div>
            <Label>Do</Label>
            <Input name="timeTo" type="time" />
          </div>
        </div>

        {/* Typ pronájmu */}
        <div>
          <Label>Typ pronájmu *</Label>
          <Select name="bookingType" required>
            <option value="">— vyberte typ —</option>
            {bookingTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>

        {/* Poznámka */}
        <div>
          <Label>Poznámka</Label>
          <Textarea name="note" rows={3} className="resize-none" placeholder="Další informace, požadavky..." />
        </div>

        {/* GDPR */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="gdpr"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="gdpr" className="text-sm text-gray-600">
            Souhlasím se zpracováním osobních údajů za účelem vyřízení poptávky pronájmu.{' '}
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
          {loading ? 'Odesílám...' : 'Odeslat poptávku'}
        </Button>
      </div>
    </form>
  )
}
