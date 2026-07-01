import type { Metadata } from 'next'
import { Clock, Phone, AlertTriangle, Trophy, Dumbbell, Zap, ZapOff } from 'lucide-react'
import UmtBookingSection from './UmtBookingSection'

export const metadata: Metadata = {
  title: 'Pronájem UMT',
  description: 'Pronájem umělé trávy TJ Baník Švermov. Zkontrolujte dostupné termíny a vyplňte poptávku.',
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

          {/* Typy pronájmu */}
          <div className="rounded-xl bg-[#0a0a0a] text-white p-6 space-y-5">
            <h2 className="font-[Anton] text-xl uppercase tracking-wide">Typy pronájmu</h2>

            {/* Celé hřiště */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Celé hřiště</p>
              <div className="space-y-2">
                {[
                  { icon: Trophy, label: 'Přípravný zápas', lights: false },
                  { icon: Trophy, label: 'Přípravný zápas', lights: true },
                  { icon: Dumbbell, label: 'Trénink', lights: false },
                  { icon: Dumbbell, label: 'Trénink', lights: true },
                ].map(({ icon: Icon, label, lights }) => (
                  <div
                    key={label + lights}
                    className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/8 px-3 py-2.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/15 text-[#c8102e]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm text-gray-200">{label}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${lights ? 'bg-yellow-400/15 text-yellow-300' : 'bg-white/8 text-gray-500'}`}>
                      {lights ? <Zap className="h-3 w-3" /> : <ZapOff className="h-3 w-3" />}
                      {lights ? 'osvětlení' : 'bez světla'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Půlka hřiště */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Půlka hřiště</p>
              <div className="space-y-2">
                {[
                  { lights: false },
                  { lights: true },
                ].map(({ lights }) => (
                  <div
                    key={'pul' + lights}
                    className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/8 px-3 py-2.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/15 text-[#c8102e]">
                      <Dumbbell className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm text-gray-200">Trénink</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${lights ? 'bg-yellow-400/15 text-yellow-300' : 'bg-white/8 text-gray-500'}`}>
                      {lights ? <Zap className="h-3 w-3" /> : <ZapOff className="h-3 w-3" />}
                      {lights ? 'osvětlení' : 'bez světla'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-medium mb-1 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Upozornění
            </p>
            <p>Poptávka nezaručuje rezervaci termínu. Termín je potvrzen až po telefonickém domluvení.</p>
          </div>
        </div>

        {/* Kalendář + Formulář */}
        <div className="lg:col-span-2">
          <UmtBookingSection />
        </div>
      </div>
    </div>
  )
}
