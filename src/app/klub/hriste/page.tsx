import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, Sun } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hřiště',
  description: 'Fotbalové hřiště TJ Baník Švermov — umělá tráva Champion EPDM, osvětlení, pronájem.',
}

export default function HristePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Hřiště</h1>
        <p className="mt-2 text-gray-500">Františka Oplta 1262, Kladno – Švermov</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          {/* UMT */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-4">Umělá tráva (UMT)</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-[#c8102e] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#0a0a0a]">Povrch Champion EPDM</p>
                  <p className="text-gray-500 mt-0.5">Profesionální povrch pro celoroční hru za každého počasí</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-4 w-4 text-[#c8102e] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#0a0a0a]">LED osvětlení</p>
                  <p className="text-gray-500 mt-0.5">Hra možná až do 22:00, k dispozici za příplatek</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sun className="h-4 w-4 text-[#c8102e] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#0a0a0a]">Celoroční dostupnost</p>
                  <p className="text-gray-500 mt-0.5">K pronájmu dle obsazenosti kalendáře</p>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link
                href="/umt"
                className="inline-flex items-center gap-2 rounded-lg bg-[#c8102e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#a50d25] transition-colors"
              >
                Poptávka pronájmu <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Přírodní tráva */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-3">Přírodní trávník</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Hlavní hrací plocha s přírodním trávníkem slouží pro domácí zápasy A a B mužstva.
              Kapacita hlediště s možností sezení podél hřiště.
            </p>
          </div>
        </div>

        {/* Mapa */}
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h2 className="font-semibold text-[#0a0a0a]">Kde nás najdete</h2>
            <p className="text-sm text-gray-500 mt-0.5">Františka Oplta 1262, 273 09 Kladno – Švermov</p>
          </div>
          <div className="relative" style={{ paddingBottom: '70%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2490.12!2d14.1097643!3d50.1672079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470bc839530d0ee3%3A0xf1e921fd6b4c16ee!2sFranti%C5%A1ka+Oplta+1262%2C+273+09+Kladno!5e0!3m2!1scs!2scz!4v1717000000000!5m2!1scs!2scz"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa hřiště"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
