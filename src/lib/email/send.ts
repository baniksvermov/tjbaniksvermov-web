import { Resend } from 'resend'

const FROM = 'TJ Baník Švermov <onboarding@resend.dev>'

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY není nastaveno, email nebyl odeslán.')
    return
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({ from: FROM, to, subject, html })
  } catch (err) {
    console.error('[email] Chyba při odesílání:', err)
  }
}
