import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/send'
import { emailNewNaborAdmin } from '@/lib/email/templates'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, birthYear, team, note, honeypot } = body

    // Honeypot anti-spam
    if (honeypot) return NextResponse.json({ ok: true })

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Vyplňte prosím všechna povinná pole.' }, { status: 400 })
    }

    const naborEmail = process.env.NABOR_EMAIL
    if (!naborEmail) {
      console.warn('[pridej-se] NABOR_EMAIL není nastaveno, email nebyl odeslán.')
      return NextResponse.json({ ok: true })
    }

    const { subject, html } = emailNewNaborAdmin({ firstName, lastName, email, phone, birthYear, team, note })
    await sendEmail(naborEmail, subject, html)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Pridej-se error:', err)
    return NextResponse.json({ error: 'Nastala neočekávaná chyba.' }, { status: 500 })
  }
}
