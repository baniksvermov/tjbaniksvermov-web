'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STATUS_LABELS, STATUS_STYLES } from './page'

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nová' },
  { value: 'confirmed', label: 'Potvrzená' },
  { value: 'ready', label: 'Připravena' },
  { value: 'picked_up', label: 'Vyzvednuta' },
  { value: 'cancelled', label: 'Zrušena' },
]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
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
      const res = await fetch('/api/admin/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus }),
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
    <div className="space-y-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e] disabled:opacity-60 bg-white"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <div className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.new}`}>
        {STATUS_LABELS[status] ?? status}
      </div>

      {loading && <p className="text-xs text-gray-400">Ukládám…</p>}
      {success && <p className="text-xs text-green-600">✓ Uloženo — zákazníkovi odeslán email</p>}
    </div>
  )
}
