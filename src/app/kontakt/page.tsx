import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Building2, CreditCard, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktní údaje TJ Baník Švermov — adresa, telefony, email, mapa hřiště.',
}

const contacts = [
  { name: 'David Nedvěd', phone: '+420 604 234 643', role: 'Předseda klubu' },
  { name: 'Ivan Bělohradský', phone: '+420 731 920 066', role: 'Kontaktní osoba' },
  { name: 'Marek Mencl', phone: '+420 608 269 063', role: 'Kontaktní osoba' },
]

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Kontakt</h1>
        <p className="mt-2 text-gray-500">Tělovýchovná jednota Baník Švermov, z.s.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Levý sloupec — info */}
        <div className="space-y-5">

          {/* Adresa */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/10 text-[#c8102e]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-[#0a0a0a] mb-1">Adresa</h2>
                <p className="text-gray-700">Františka Oplta 1262</p>
                <p className="text-gray-700">273 09 Kladno – Švermov</p>
                <a
                  href="https://www.google.com/maps/place/Franti%C5%A1ka+Oplta+1262,+273+09+Kladno+7-%C5%A0vermov/@50.1672045,14.1123392,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-[#c8102e] hover:underline"
                >
                  Otevřít v Google Maps <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/10 text-[#c8102e]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-[#0a0a0a] mb-2">Email</h2>
                <a href="mailto:baniksvermov@centrum.cz" className="block text-gray-700 hover:text-[#c8102e] transition-colors">
                  baniksvermov@centrum.cz
                </a>
                <a href="mailto:info@baniksvermov.cz" className="block text-gray-700 hover:text-[#c8102e] transition-colors">
                  info@baniksvermov.cz
                </a>
              </div>
            </div>
          </div>

          {/* Telefony */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/10 text-[#c8102e]">
                <Phone className="h-5 w-5" />
              </div>
              <div className="w-full">
                <h2 className="font-semibold text-[#0a0a0a] mb-3">Kontaktní osoby</h2>
                <div className="space-y-3">
                  {contacts.map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#0a0a0a] text-sm">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.role}</p>
                      </div>
                      <a
                        href={`tel:${c.phone.replace(/\s/g, '')}`}
                        className="text-sm font-medium text-[#c8102e] hover:underline"
                      >
                        {c.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Organizační údaje */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/10 text-[#c8102e]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-[#0a0a0a] mb-2">Organizační údaje</h2>
                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="text-gray-400">IČO:</span> 48703877</p>
                  <p><span className="text-gray-400">Datová schránka:</span> zibaar4</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bankovní účet */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/10 text-[#c8102e]">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-[#0a0a0a] mb-1">Bankovní spojení</h2>
                <p className="text-gray-700 font-mono">385469319/0800</p>
                <p className="text-xs text-gray-400 mt-1">Česká spořitelna</p>
              </div>
            </div>
          </div>

          {/* Sociální sítě */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-semibold text-[#0a0a0a] mb-3">Sociální sítě</h2>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/baniksvermov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                Facebook
              </a>
              <a
                href="https://instagram.com/baniksvermov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Pravý sloupec — mapa */}
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
            <div className="px-6 pt-5 pb-3">
              <h2 className="font-semibold text-[#0a0a0a]">Mapa — fotbalové hřiště</h2>
              <p className="text-sm text-gray-500 mt-0.5">Františka Oplta 1262, Kladno – Švermov</p>
            </div>
            {/* Google Maps embed — hřiště TJ Baník Švermov */}
            <div className="relative" style={{ paddingBottom: '65%' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2490.12!2d14.1097643!3d50.1672079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470bc839530d0ee3%3A0xf1e921fd6b4c16ee!2sFranti%C5%A1ka+Oplta+1262%2C+273+09+Kladno!5e0!3m2!1scs!2scz!4v1717000000000!5m2!1scs!2scz"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa hřiště TJ Baník Švermov"
              />
            </div>
          </div>

          {/* CTA pronájem */}
          <div className="rounded-xl bg-[#0a0a0a] text-white p-6">
            <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-2">Pronájem UMT</h2>
            <p className="text-sm text-gray-400 mb-4">
              Máte zájem o pronájem umělé trávy? Vyplňte poptávku — ozveme se zpět.
            </p>
            <a
              href="/umt"
              className="inline-flex items-center gap-2 rounded-lg bg-[#c8102e] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#a50d25] transition-colors"
            >
              Odeslat poptávku →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
