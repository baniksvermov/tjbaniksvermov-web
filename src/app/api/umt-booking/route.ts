import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const BOOKING_TYPE_LABELS: Record<string, string> = {
  match: 'Celé hřiště — přípravný zápas',
  training: 'Celé hřiště — trénink',
  half: 'Půlka hřiště — trénink',
  with_lights: 'S osvětlením',
  without_lights: 'Bez osvětlení',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, clubName, requestedDate, timeFrom, timeTo, bookingType, note, honeypot } = body

    // Honeypot
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

    // Odeslat email přes Resend (pokud je API klíč nastaven)
    const resendKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.CONTACT_EMAIL ?? 'baniksvermov@centrum.cz'

    if (resendKey) {
      const typeLabel = BOOKING_TYPE_LABELS[bookingType] ?? bookingType
      const timeStr = timeFrom && timeTo ? `${timeFrom} – ${timeTo}` : timeFrom || 'neuvedeno'

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'TJ Baník Švermov <noreply@tjbaniksvermov.cz>',
          to: [adminEmail],
          reply_to: email,
          subject: `Nová poptávka pronájmu UMT — ${firstName} ${lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #0a0a0a; padding: 24px; border-radius: 12px 12px 0 0;">
                <h1 style="color: #c8102e; font-size: 20px; margin: 0;">Nová poptávka pronájmu UMT</h1>
                <p style="color: #9ca3af; margin: 4px 0 0;">TJ Baník Švermov</p>
              </div>
              <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">Jméno:</td><td style="padding: 8px 0; font-weight: bold;">${firstName} ${lastName}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Telefon:</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
                  ${clubName ? `<tr><td style="padding: 8px 0; color: #6b7280;">Klub:</td><td style="padding: 8px 0;">${clubName}</td></tr>` : ''}
                  <tr><td colspan="2" style="padding: 16px 0 8px; border-top: 1px solid #e5e7eb;"></td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Požadovaný den:</td><td style="padding: 8px 0; font-weight: bold;">${new Date(requestedDate).toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Čas:</td><td style="padding: 8px 0;">${timeStr}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Typ pronájmu:</td><td style="padding: 8px 0;">${typeLabel}</td></tr>
                  ${note ? `<tr><td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Poznámka:</td><td style="padding: 8px 0;">${note}</td></tr>` : ''}
                </table>
                <div style="margin-top: 20px; padding: 16px; background: #fff3cd; border-radius: 8px; border: 1px solid #fbbf24; font-size: 14px; color: #92400e;">
                  <strong>Akce:</strong> Zavolejte zájemci na <a href="tel:${phone}">${phone}</a> pro potvrzení termínu.
                </div>
              </div>
            </div>
          `,
        }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('UMT booking error:', err)
    return NextResponse.json({ error: 'Nastala neočekávaná chyba.' }, { status: 500 })
  }
}
