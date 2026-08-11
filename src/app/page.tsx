import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Users, ShoppingBag, Trophy } from 'lucide-react'
import { getLatestArticles } from '@/lib/supabase/articles'
import { getUpcomingMatches } from '@/lib/supabase/matches'
import ArticleCard from '@/components/ArticleCard'
import UpcomingMatchesCarousel from '@/components/UpcomingMatchesCarousel'
import { Button } from '@/components/ui/Button'
import { IconBadge } from '@/components/ui/IconBadge'

export const revalidate = 300

export default async function HomePage() {
  const [latestArticles, upcomingMatches] = await Promise.all([
    getLatestArticles(3),
    getUpcomingMatches(9),
  ])
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Fotbalový klub · Kladno–Švermov
                </span>
              </div>
              <h1
                aria-label="Baník Švermov"
                className="font-[Anton] text-foreground uppercase leading-none text-6xl sm:text-7xl lg:text-8xl xl:text-9xl"
              >
                <span aria-hidden="true">
                  <span className="block">Baník</span>
                  <span className="mt-[0.3em] block">
                    <span className="relative inline-block">
                      {/* Anton nemá pořádně podporovaný háček nad Š — dokreslen ručně jako SVG */}
                      <svg
                        viewBox="0 0 24 12"
                        fill="none"
                        className="absolute left-1/2 top-[-0.26em] h-[0.2em] w-[0.42em] -translate-x-1/2 text-foreground"
                      >
                        <path
                          d="M2 2 L12 9 L22 2"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      S
                    </span>
                    vermov
                    <span className="ml-2 inline-block h-[0.16em] w-[0.16em] align-baseline bg-primary" />
                  </span>
                </span>
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-8 text-gray-600">
                Fotbalový klub s tradicí od roku 1910. Hrajeme pro radost z fotbalu
                od nejmenších až po dospělé muže.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Button href="/pridej-se" size="lg">
                  Chci hrát za Baník
                </Button>
                <Button href="/klub/historie" variant="ghost">
                  Více o klubu
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Foto hřiště */}
            <div className="hidden lg:block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
                <Image
                  src="/hriste-dron.jpg"
                  alt="Letecký pohled na hřiště TJ Baník Švermov"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-white">
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

      {/* Nejbližší zápasy */}
      {upcomingMatches.length > 0 && (
        <section className="bg-white border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-[Anton] text-3xl uppercase tracking-wide">
                Nejbližší zápasy
              </h2>
              <Button href="/kalendar" variant="ghost">
                Celý kalendář <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <UpcomingMatchesCarousel matches={upcomingMatches} />
          </div>
        </section>
      )}

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
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-[Anton] text-foreground uppercase text-4xl sm:text-5xl lg:text-6xl">
            Hrajeme pro radost z fotbalu
            <span className="ml-1 inline-block h-[0.16em] w-[0.16em] align-baseline bg-primary" />
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Od těch nejmenších až po dospělé
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-border px-4 pt-12 lg:px-8">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">
            Naše týmy
          </p>
          <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0 lg:divide-x lg:divide-border">
            {[
              { label: 'A-mužstvo', sub: 'Muži', href: '/tymy/a-muzstvo' },
              { label: 'B-mužstvo', sub: 'Muži', href: '/tymy/b-muzstvo' },
              { label: 'Dorost', sub: 'U19 · 1.A třída', href: '/tymy/dorost-ia' },
              { label: 'Žáci', sub: 'Starší žáci', href: '/tymy/starsi-zaci' },
              { label: 'Přípravka', sub: 'Starší přípravka', href: '/tymy/starsi-pripravka' },
              { label: 'Mini', sub: 'Nejmenší', href: '/tymy/mini-pripravka' },
            ].map((team) => (
              <Link key={team.href} href={team.href} className="group px-4 py-2 text-center">
                <p className="font-[Anton] uppercase text-xl text-foreground transition-colors group-hover:text-primary">
                  {team.label}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{team.sub}</p>
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
