import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Info pro členy',
  description: 'Informace pro hráče a členy TJ Baník Švermov.',
}

export default function InfoProClenyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Info pro členy</h1>
        <p className="mt-2 text-gray-500">Informace pro hráče a členy klubu</p>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="font-semibold text-[#0a0a0a] mb-3">Členské příspěvky</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Informace o výši a termínech platby členských příspěvků vám sdělí váš trenér
            nebo vedení klubu.
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="font-semibold text-[#0a0a0a] mb-3">Kontakt na trenéry</h2>
          <p className="text-gray-600 text-sm mb-4">
            Kontakty na trenéry jednotlivých kategorií najdete na stránkách příslušných týmů.
          </p>
          <Link href="/tymy/a-muzstvo" className="text-sm text-[#c8102e] hover:underline">
            Přejít na týmy →
          </Link>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="font-semibold text-[#0a0a0a] mb-3">Kontakt na vedení</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <a href="mailto:baniksvermov@centrum.cz" className="flex items-center gap-2 hover:text-[#c8102e] transition-colors">
              <Mail className="h-4 w-4 text-[#c8102e]" /> baniksvermov@centrum.cz
            </a>
            <a href="tel:+420604234643" className="flex items-center gap-2 hover:text-[#c8102e] transition-colors">
              <Phone className="h-4 w-4 text-[#c8102e]" /> David Nedvěd: +420 604 234 643
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-400">
          <p className="text-sm">Další dokumenty a informace budou brzy doplněny.</p>
        </div>
      </div>
    </div>
  )
}
