'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nová' },
  { value: 'confirmed', label: 'Potvrzena' },
  { value: 'rejected', label: 'Zamítnuta' },
  { value: 'completed', label: 'Proběhla' },
]

export default function BookingStatusSelect({
  bookingId,
  currentStatus,
}: {
  bookingId: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleChange(newStatus: string) {
    if (newStatus === status) return
    setLoading(true)
    setSuccess(false)
    try {
      const res = await fetch('/api/admin/update-booking-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, status: newStatus }),
      })
      if (res.ok) {
        setStatus(newStatus)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2500)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className={`rounded-full border-0 px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 ${STATUS_STYLES[status] ?? STATUS_STYLES.new}`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {loading && <p className="text-[11px] text-gray-400">Ukládám…</p>}
      {success && <p className="text-[11px] text-green-600">✓ Uloženo</p>}
    </div>
  )
}
