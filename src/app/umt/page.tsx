import type { Metadata } from 'next'
import UmtForm from './UmtForm'
import { Calendar, Clock, Phone, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pronájem UMT',
  description: 'Pronájem umělé trávy TJ Baník Švermov. Vyplňte poptávku a ozveme se zpět.',
}

export default function UmtPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Pronájem UMT</h1>
        <p className="mt-2 text-gray-500">
          Umělá tráva Champion EPDM — k dispozici pro zápasy, tréninky a turnaje
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Info panel */}
        <div className="space-y-4">
          <div className="rounded-xl bg-[#0a0a0a] text-white p-6">
            <h2 className="font-[Anton] text-xl uppercase tracking-wide mb-4">Informace</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-[#c8102e] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Dostupnost</p>
                  <p className="text-gray-400 mt-0.5">Celoročně, dle obsazenosti</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#c8102e] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Osvětlení</p>
                  <p className="text-gray-400 mt-0.5">K dispozici — hra možná do 22:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#c8102e] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Potvrzení rezervace</p>
                  <p className="text-gray-400 mt-0.5">Po odeslání poptávky vás kontaktujeme telefonicky</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-start gap-3 mb-3">
              <Info className="h-4 w-4 text-[#c8102e] mt-0.5 shrink-0" />
              <h2 className="font-semibold text-[#0a0a0a]">Typy pronájmu</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Celé hřiště — přípravný zápas',
                'Celé hřiště — trénink',
                'Půlka hřiště — trénink',
                'S osvětlením',
                'Bez osvětlení',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c8102e] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-medium mb-1">⚠️ Upozornění</p>
            <p>Poptávka nezaručuje rezervaci termínu. Termín je potvrzen až po telefonickém domluvení.</p>
          </div>
        </div>

        {/* Formulář */}
        <div className="lg:col-span-2">
          <UmtForm />
        </div>
      </div>
    </div>
  )
}
