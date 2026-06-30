'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ChevronDown, ChevronUp, Shield } from 'lucide-react'

type Consent = {
  necessary: true
  analytics: boolean
  marketing: boolean
  timestamp: number
}

const STORAGE_KEY = 'tjbanik_cookie_consent'

export function useCookieConsent() {
  const [consent, setConsentState] = useState<Consent | null>(null)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setConsentState(JSON.parse(raw))
  }, [])
  return consent
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [settings, setSettings] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) setVisible(true)
  }, [])

  function save(anal: boolean, mkt: boolean) {
    const c: Consent = { necessary: true, analytics: anal, marketing: mkt, timestamp: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-md text-white">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c8102e]/20">
              <Shield className="h-4 w-4 text-[#c8102e]" />
            </div>
            <p className="font-semibold text-sm">Tento web používá cookies</p>
          </div>
          <button onClick={() => save(false, false)} className="text-gray-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="px-5 text-xs text-gray-400 leading-relaxed">
          Používáme cookies pro zajištění základní funkčnosti webu a zlepšení vašeho zážitku. Nepovinné cookies (analytické, marketingové) aktivujeme pouze s vaším souhlasem.{' '}
          <Link href="/ochrana-osobnich-udaju" className="text-[#c8102e] hover:underline">
            Zásady ochrany osobních údajů
          </Link>
        </p>

        {/* Nastavení */}
        {settings && (
          <div className="mx-5 mt-3 rounded-xl border border-white/10 divide-y divide-white/10">
            {/* Nezbytné */}
            <div className="flex items-start justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Nezbytné cookies</p>
                <p className="text-xs text-gray-400 mt-0.5">Přihlašování administrátora, košík e-shopu. Nelze vypnout.</p>
              </div>
              <div className="mt-0.5 shrink-0">
                <span className="rounded-full bg-[#c8102e]/20 px-2.5 py-0.5 text-xs text-[#c8102e] font-medium">Vždy aktivní</span>
              </div>
            </div>
            {/* Analytické */}
            <div className="flex items-start justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Analytické cookies</p>
                <p className="text-xs text-gray-400 mt-0.5">Měření návštěvnosti a chování uživatelů na webu (Google Analytics apod.).</p>
              </div>
              <button
                onClick={() => setAnalytics(!analytics)}
                className={`relative mt-0.5 shrink-0 h-5 w-9 rounded-full transition-colors ${analytics ? 'bg-[#c8102e]' : 'bg-white/20'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${analytics ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {/* Marketingové */}
            <div className="flex items-start justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Marketingové cookies</p>
                <p className="text-xs text-gray-400 mt-0.5">Cílená reklama a sledování konverzí (Facebook Pixel apod.).</p>
              </div>
              <button
                onClick={() => setMarketing(!marketing)}
                className={`relative mt-0.5 shrink-0 h-5 w-9 rounded-full transition-colors ${marketing ? 'bg-[#c8102e]' : 'bg-white/20'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${marketing ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Akce */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <button
            onClick={() => setSettings(!settings)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {settings ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {settings ? 'Skrýt nastavení' : 'Nastavení cookies'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => save(false, false)}
              className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Odmítnout nepovinné
            </button>
            {settings ? (
              <button
                onClick={() => save(analytics, marketing)}
                className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Uložit nastavení
              </button>
            ) : null}
            <button
              onClick={() => save(true, true)}
              className="rounded-lg bg-[#c8102e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#a50d25] transition-colors"
            >
              Přijmout vše
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
