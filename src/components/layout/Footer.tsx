import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8102e] font-bold text-white text-sm">
                TJB
              </div>
              <span className="font-[Anton] text-lg uppercase tracking-wide text-white">
                TJ Baník Švermov
              </span>
            </div>
            <p className="text-sm leading-6">
              Fotbalový klub se sídlem v Kladně–Švermově. Hrajeme pro radost z
              fotbalu od těch nejmenších až po dospělé.
            </p>
            <div className="mt-4 flex gap-3">
              {/* Facebook */}
              <a href="https://facebook.com/baniksvermov" target="_blank" rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-400 hover:bg-[#c8102e] hover:text-white transition-colors" aria-label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/baniksvermov" target="_blank" rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-400 hover:bg-[#c8102e] hover:text-white transition-colors" aria-label="Instagram">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-400 hover:bg-[#c8102e] hover:text-white transition-colors" aria-label="YouTube">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Týmy */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Týmy
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                ['A-mužstvo', '/tymy/a-muzstvo'],
                ['B-mužstvo', '/tymy/b-muzstvo'],
                ['Dorost', '/tymy/dorost-ia'],
                ['Žáci', '/tymy/starsi-zaci'],
                ['Přípravka', '/tymy/starsi-pripravka'],
                ['Mini', '/tymy/mini'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Klub */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Klub
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Novinky', '/novinky'],
                ['Kalendář', '/kalendar'],
                ['Galerie', '/galerie'],
                ['Hospoda', '/hospoda'],
                ['Shop', '/shop'],
                ['Kontakt', '/kontakt'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Kontakt
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#c8102e]" />
                <span>Kladno – Švermov</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#c8102e]" />
                <a
                  href="mailto:baniksvermov@centrum.cz"
                  className="hover:text-white transition-colors"
                >
                  baniksvermov@centrum.cz
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#c8102e]" />
                <span>Doplnit telefon</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} TJ Baník Švermov, z.s · IČO: 48703877</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/obchodni-podminky" className="hover:text-gray-400 transition-colors">
              Obchodní podmínky
            </Link>
            <Link href="/ochrana-osobnich-udaju" className="hover:text-gray-400 transition-colors">
              Ochrana osobních údajů a cookies
            </Link>
          </div>
          <p className="mt-3 text-gray-700">
            Vytvořil{' '}
            <a
              href="https://tomasvydra.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Tomáš Vydra
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
