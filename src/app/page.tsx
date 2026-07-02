import Link from 'next/link'
import { ArrowRight, Calendar, Users, ShoppingBag, Shield, Trophy } from 'lucide-react'
import { getLatestArticles } from '@/lib/supabase/articles'
import ArticleCard from '@/components/ArticleCard'
import HeroLogo from '@/components/HeroLogo'
import { Button } from '@/components/ui/Button'
import { IconBadge } from '@/components/ui/IconBadge'

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
              <Button href="/novinky" size="lg">
                Aktuální novinky
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/tymy/a-muzstvo" variant="outline" size="lg">
                Naše týmy
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { href: '/kalendar', icon: Calendar, label: 'Kalendář zápasů', sub: 'Termíny a výsledky' },
              { href: '/tymy',    icon: Users,    label: 'Naše týmy',       sub: 'Od mini po A-mužstvo' },
              { href: '/eshop',   icon: ShoppingBag, label: 'Klubový shop', sub: 'Dresy, mikiny a doplňky' },
            ].map(({ href, icon: Icon, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="group relative overflow-hidden rounded-2xl bg-[#111] border border-white/5 p-6 flex items-center gap-5 hover:border-[#c8102e]/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Red glow blob */}
                <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-[#c8102e]/10 blur-2xl group-hover:bg-[#c8102e]/20 transition-colors duration-300" />

                {/* Icon */}
                <IconBadge
                  bordered
                  className="relative group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-200"
                >
                  <Icon className="h-6 w-6" />
                </IconBadge>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-base leading-snug">{label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{sub}</p>
                </div>

                {/* Arrow */}
                <ArrowRight className="relative h-4 w-4 shrink-0 text-gray-600 group-hover:text-[#c8102e] group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Novinky */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-[Anton] text-3xl uppercase tracking-wide">
            Poslední novinky
          </h2>
          <Button href="/novinky" variant="ghost">
            Všechny novinky <ArrowRight className="h-3.5 w-3.5" />
          </Button>
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
          <Button href="/umt" variant="inverse" size="lg">
            Zaslat poptávku
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </>
  )
}
