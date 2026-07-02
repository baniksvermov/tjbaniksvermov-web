import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send'
import { emailNewBookingAdmin } from '@/lib/email/templates'
import { BOOKING_TYPE_LABELS } from '@/lib/umt-types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, clubName, requestedDate, timeFrom, timeTo, bookingType, note, honeypot } = body

    // Honeypot anti-spam
    if (honeypot) return NextResponse.json({ ok: true })

    // Validace povinných polí
    if (!firstName || !lastName || !email || !phone || !requestedDate || !bookingType) {
      return NextResponse.json({ error: 'Vyplňte všechna povinná pole.' }, { status: 400 })
    }

    // Uložit do Supabase
    const supabase = await createClient()
    const { error: dbError } = await supabase.from('field_bookings').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      club_name: clubName || null,
      requested_date: requestedDate,
      time_from: timeFrom || null,
      time_to: timeTo || null,
      booking_type: bookingType,
      note: note || null,
      status: 'new',
    })

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Chyba při ukládání. Zkuste to znovu.' }, { status: 500 })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      const { subject, html } = emailNewBookingAdmin({
        firstName,
        lastName,
        email,
        phone,
        clubName,
        requestedDate,
        timeFrom,
        timeTo,
        bookingTypeLabel: BOOKING_TYPE_LABELS[bookingType] ?? bookingType,
        note,
      })
      await sendEmail(adminEmail, subject, html)
    } else {
      console.warn('[umt-booking] ADMIN_EMAIL není nastaveno, email nebyl odeslán.')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('UMT booking error:', err)
    return NextResponse.json({ error: 'Nastala neočekávaná chyba.' }, { status: 500 })
  }
}
