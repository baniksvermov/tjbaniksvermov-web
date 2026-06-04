import type { Metadata } from 'next'
import { Clock, Phone, Mail, Users, Beer, Music } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hospůdka Na Baníku',
  description: 'Hospůdka Na Baníku — letní zahrádka 120 míst, Kozel 11°, Plzeň 12°, káva Camardo. Kladno–Švermov.',
}

const hours = [
  { day: 'Pondělí — Sobota', time: '16:00 – 22:00' },
  { day: 'Neděle', time: 'Zavřeno' },
]

const features = [
  { icon: Users, label: 'Hospůdka v 1. patře', desc: '35 míst, krbová kamna' },
  { icon: Users, label: 'Letní zahrádka', desc: '120 míst vč. 30 v pergole' },
  { icon: Beer, label: 'Na čepu', desc: 'Kozel 11°, Plzeň 12°, nealkoholické' },
  { icon: Music, label: 'Zábava', desc: 'Šipky, stolní fotbálek, dětské hřiště' },
]

export default function HospodaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* Hero */}
      <div className="mb-10 rounded-2xl bg-[#0a0a0a] text-white overflow-hidden">
        <div className="px-8 py-12 lg:px-12">
          <p className="text-[#c8102e] font-semibold uppercase tracking-wider text-sm mb-2">TJ Baník Švermov</p>
          <h1 className="font-[Anton] text-5xl uppercase tracking-wide lg:text-6xl">
            Hospůdka<br />Na Baníku
          </h1>
          <p className="mt-4 text-gray-400 max-w-lg text-lg">
            Příjemné posezení přímo u fotbalového hřiště. Kvalitní pivo, letní zahrádka
            s jezírkem a atmosféra fotbalového klubu.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500/20 border border-green-500/30 px-4 py-2 text-sm text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Otevřeno Po–So od 16:00
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Levý sloupec */}
        <div className="lg:col-span-2 space-y-6">

          {/* O hospůdce */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-[Anton] text-2xl uppercase tracking-wide text-[#0a0a0a] mb-4">O nás</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Hospůdka Na Baníku je srdcem našeho fotbalového areálu. Čepujeme s láskou
                a důrazem na správnou techniku — každé pivo si zaslouží péči.
              </p>
              <p>
                Na čepu najdete <strong>Kozel 11°</strong>, <strong>Plzeň 12°</strong> a
                nealkoholické nápoje. K tomu italskou kávu <strong>Camardo Miscela Bar</strong>.
                Občerstvení zajišťuje Hospůdka Na Garážích — v létě i zmrzliny.
              </p>
              <p>
                Zahrádka s <strong>přírodním jezírkem</strong> a pergolou pojme až 120 hostů.
                K dispozici parkoviště pro auta i kola.
              </p>
            </div>
          </div>

          {/* Vybavení */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.label} className="rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c8102e]/10 text-[#c8102e] mb-3">
                  <f.icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-[#0a0a0a] text-sm">{f.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Akce */}
          <div className="rounded-xl border border-[#c8102e]/20 bg-[#c8102e]/5 p-6">
            <h2 className="font-semibold text-[#0a0a0a] mb-2">Firemní a soukromé akce</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Pořádáme firemní večírky, narozeninové oslavy i jiné soukromé akce
              s rautovým občerstvením. Pro rezervaci nás kontaktujte.
            </p>
            <a
              href="mailto:hospudkanagarazich@centrum.cz"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#c8102e] hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              hospudkanagarazich@centrum.cz
            </a>
          </div>
        </div>

        {/* Pravý sloupec */}
        <div className="space-y-5">

          {/* Otevírací doba */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-[#c8102e]" />
              <h2 className="font-semibold text-[#0a0a0a]">Otevírací doba</h2>
            </div>
            <div className="space-y-2">
              {hours.map((h) => (
                <div key={h.day} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{h.day}</span>
                  <span className={`font-medium ${h.time === 'Zavřeno' ? 'text-gray-400' : 'text-[#0a0a0a]'}`}>
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              * V případě špatného počasí může být otevírací doba upravena.
            </p>
          </div>

          {/* Kontakt */}
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="font-semibold text-[#0a0a0a] mb-4">Kontakt</h2>
            <div className="space-y-3 text-sm">
              <a href="tel:+420608201278" className="flex items-center gap-3 text-gray-700 hover:text-[#c8102e] transition-colors">
                <Phone className="h-4 w-4 text-[#c8102e] shrink-0" />
                608 201 278
              </a>
              <a href="mailto:hospudkanagarazich@centrum.cz" className="flex items-center gap-3 text-gray-700 hover:text-[#c8102e] transition-colors break-all">
                <Mail className="h-4 w-4 text-[#c8102e] shrink-0" />
                hospudkanagarazich@centrum.cz
              </a>
            </div>
          </div>

          {/* Na čepu */}
          <div className="rounded-xl bg-[#0a0a0a] text-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Beer className="h-5 w-5 text-[#c8102e]" />
              <h2 className="font-semibold">Na čepu</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c8102e]" />
                Kozel 11°
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c8102e]" />
                Plzeň 12°
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c8102e]" />
                Nealkoholické nápoje
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c8102e]" />
                Káva Camardo Miscela Bar
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
