'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { BOOKING_TYPE_LABELS } from '@/lib/umt-types'

export interface BookingFormValues {
  team: string
  requestedDate: string
  timeFrom: string
  timeTo: string
  bookingType: string
  note: string
}

const EMPTY: BookingFormValues = {
  team: '', requestedDate: '', timeFrom: '', timeTo: '', bookingType: '', note: '',
}

interface Props {
  bookingId?: string
  initial?: BookingFormValues
  onDone: () => void
  onCancel?: () => void
}

export default function BookingForm({ bookingId, initial, onDone, onCancel }: Props) {
  const [values, setValues] = useState<BookingFormValues>(initial ?? EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof BookingFormValues>(key: K, value: BookingFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/upsert-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          team: values.team,
          requested_date: values.requestedDate,
          time_from: values.timeFrom,
          time_to: values.timeTo,
          booking_type: values.bookingType,
          note: values.note,
        }),
      })
      if (res.ok) {
        onDone()
      } else {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? 'Nepodařilo se uložit.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label>Tým / organizace *</Label>
          <Input
            required
            value={values.team}
            onChange={(e) => set('team', e.target.value)}
            placeholder="např. TJ Baník Švermov - dorost"
          />
        </div>
        <div>
          <Label>Datum *</Label>
          <Input
            type="date"
            required
            value={values.requestedDate}
            onChange={(e) => set('requestedDate', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <Label>Čas od</Label>
          <Input type="time" value={values.timeFrom} onChange={(e) => set('timeFrom', e.target.value)} />
        </div>
        <div>
          <Label>Čas do</Label>
          <Input type="time" value={values.timeTo} onChange={(e) => set('timeTo', e.target.value)} />
        </div>
        <div>
          <Label>Typ pronájmu</Label>
          <Select value={values.bookingType} onChange={(e) => set('bookingType', e.target.value)}>
            <option value="">— vyberte —</option>
            {Object.entries(BOOKING_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label>Poznámka</Label>
        <Textarea rows={2} className="resize-none" value={values.note} onChange={(e) => set('note', e.target.value)} />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading} size="sm">
          {loading ? 'Ukládám…' : bookingId ? 'Uložit změny' : 'Přidat rezervaci'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Zrušit
          </Button>
        )}
      </div>
    </form>
  )
}
