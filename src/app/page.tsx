import Link from 'next/link'
import { ArrowRight, Calendar, Users, ShoppingBag, Shield, Trophy } from 'lucide-react'
import { getLatestArticles } from '@/lib/supabase/articles'
import ArticleCard from '@/components/ArticleCard'
import HeroLogo from '@/components/HeroLogo'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const latestArticles = await getLatestArticles(3)
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0a0a0a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#c8102e] opacity-5 skew-x-12 translate-x-20" />
        <HeroLogo />
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c8102e]/30 bg-[#c8102e]/10 px-4 py-1.5 text-sm text-[#c8102e]">
              <Shield className="h-3.5 w-3.5" /> Fotbalový klub — Kladno Švermov
            </div>
            <h1 className="font-[Anton] text-5xl uppercase tracking-wide leading-tight lg:text-7xl">
              TJ Baník
              <br />
              <span className="text-[#c8102e]">Švermov</span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-8 max-w-lg">
              Fotbalový klub s tradicí od roku 1910. Hrajeme pro radost z fotbalu
              od nejmenších až po dospělé muže.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/novinky"
                className="inline-flex items-center gap-2 rounded-lg bg-[#c8102e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a50d25] transition-colors"
              >
                Aktuální novinky
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tymy/a-muzstvo"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Naše týmy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/kalendar"
              className="group flex items-center gap-4 rounded-xl border border-gray-100 p-5 hover:border-[#c8102e] hover:shadow-sm transition-all"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/10 text-[#c8102e] group-hover:bg-[#c8102e] group-hover:text-white transition-colors">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#0a0a0a]">Kalendář zápasů</p>
                <p className="text-sm text-gray-500">Termíny a výsledky</p>
              </div>
            </Link>
            <Link
              href="/tymy"
              className="group flex items-center gap-4 rounded-xl border border-gray-100 p-5 hover:border-[#c8102e] hover:shadow-sm transition-all"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/10 text-[#c8102e] group-hover:bg-[#c8102e] group-hover:text-white transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#0a0a0a]">Naše týmy</p>
                <p className="text-sm text-gray-500">Od mini po A-mužstvo</p>
              </div>
            </Link>
            <Link
              href="/eshop"
              className="group flex items-center gap-4 rounded-xl border border-gray-100 p-5 hover:border-[#c8102e] hover:shadow-sm transition-all"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#c8102e]/10 text-[#c8102e] group-hover:bg-[#c8102e] group-hover:text-white transition-colors">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#0a0a0a]">Klubový shop</p>
                <p className="text-sm text-gray-500">Dresy, mikiny a doplňky</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Novinky */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-[Anton] text-3xl uppercase tracking-wide">
            Poslední novinky
          </h2>
          <Link
            href="/novinky"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline"
          >
            Všechny novinky <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
            <Trophy className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Novinky přibudou brzy</p>
          </div>
        )}
      </section>

      {/* Týmy */}
      <section className="bg-[#0a0a0a] text-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-[Anton] text-3xl uppercase tracking-wide mb-8 text-center">
            Naše týmy
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: 'A-mužstvo', href: '/tymy/a-muzstvo' },
              { label: 'B-mužstvo', href: '/tymy/b-muzstvo' },
              { label: 'Dorost', href: '/tymy/dorost-ia' },
              { label: 'Žáci', href: '/tymy/starsi-zaci' },
              { label: 'Přípravka', href: '/tymy/starsi-pripravka' },
            ].map((team) => (
              <Link
                key={team.href}
                href={team.href}
                className="flex items-center justify-center rounded-lg border border-white/10 px-4 py-4 text-sm font-semibold text-center hover:bg-[#c8102e] hover:border-[#c8102e] transition-colors"
              >
                {team.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA pronájem */}
      <section className="bg-[#c8102e] text-white py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="font-[Anton] text-3xl uppercase tracking-wide mb-3">
            Pronájem umělé trávy
          </h2>
          <p className="text-red-100 mb-6 max-w-xl mx-auto">
            Máte zájem o pronájem UMT? Vyplňte poptávku a my se vám ozveme zpět.
          </p>
          <Link
            href="/umt"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#c8102e] hover:bg-red-50 transition-colors"
          >
            Zaslat poptávku
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
