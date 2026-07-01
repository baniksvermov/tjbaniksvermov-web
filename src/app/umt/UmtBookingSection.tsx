'use client'

import { useState } from 'react'
import UmtCalendar from './UmtCalendar'
import UmtForm from './UmtForm'

export default function UmtBookingSection() {
  const [selectedDate, setSelectedDate] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-1">Dostupné termíny</h2>
        <p className="text-sm text-gray-500">Klikněte na den pro výběr termínu — datum se automaticky vyplní do formuláře níže.</p>
      </div>
      <UmtCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <UmtForm selectedDate={selectedDate} />
    </div>
  )
}
