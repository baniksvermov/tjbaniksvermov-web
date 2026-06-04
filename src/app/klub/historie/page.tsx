import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Historie klubu',
  description: 'Historie TJ Baník Švermov od roku 1906 po současnost.',
}

const timeline = [
  {
    period: '1906–1910',
    title: 'Počátky fotbalu v regionu',
    content: 'Kopaná se v Hnidousích hrála už v roce 1906. O velikonocích toho roku sehrála skupinka Hnidouských chlapců přátelské utkání s mužstvem ze sousedního Kübecka — výsledek byl 0:15.',
  },
  {
    period: '1910',
    title: 'Oficiální založení klubu',
    content: 'Za oficiální počátek se považuje květen 1910, kdy vznikl „Sportovní kroužek Hnidousy" v lese Za Horovic. V září 1913 jej Okresní hejtmanství zaregistrovalo jako právně platný subjekt. Roku 1916 vznikl „Sportovní klub Motyčín" v hostinci Na Vyšehradě.',
  },
  {
    period: '1920–1940',
    title: 'Meziválečné období',
    content: 'V roce 1920 byl SK Hnidousy zařazen do II. třídy, SK Motyčín do III. třídy Středočeské župy fotbalové. Roku 1927 se Hnidouské mužstvo poprvé dostalo do I.A třídy. V roce 1928 zvítězili 7:2 nad profi-mužstvem SK Libeň, v dalším kole pak podlehli Spartě Praha 1:3.',
  },
  {
    period: '1948–1989',
    title: 'Období socialismu',
    content: 'Roku 1948 se kluby začlenily do Sokolu. V roce 1949 došlo ke sloučení Hnidous a Motyčína do společné obce Švermov. Od roku 1950 hrály týmy jako „Sokol Důl Gottwald Švermov", později jako „Baník DSO Švermov". V roce 1953 klub vyhrál Pohár ÚV DSO Baník výhrou 3:2 nad Opavou. V roce 1959 postoupili do divize — třetí nejvyšší soutěže.',
  },
  {
    period: '1989–2010',
    title: 'Transformace a návrat',
    content: 'Po roce 1989 následoval postupný sestup. Nejnižší bod přišel v sezóně 1998–1999, kdy mužstvo hrálo IV. třídu. Postupně se klub vrátil do vyšších soutěží.',
  },
  {
    period: '2010',
    title: '100 let organizovaného fotbalu',
    content: 'Dne 19. června 2010 se konaly oslavy sta let organizované fotbalové činnosti ve Švermově.',
  },
]

const legends = [
  { name: 'Josef Pleticha', years: '1902–1951', desc: 'Hráč SK Kladno, Viktorie Žižkov, Slavie Praha; 9× v národním mužstvu' },
  { name: 'František Vohradský', years: '1902–1971', desc: 'Vstřelil přes 500 gólů za SK Hnidousy' },
  { name: 'Zdeněk Kaiser', years: '1930–2009', desc: 'Klubový rekord — 675 odehraných utkání za A-mužstvo, 85 branek' },
  { name: 'Karel Němeček', years: '1933–1993', desc: '294 branek za Baník' },
  { name: 'Pavel Růžička', years: '* 1954', desc: '8× nejlepší střelec týmu, rekord 8 branek v jednom zápase' },
]

export default function HistoriePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <div className="mb-10">
        <h1 className="font-[Anton] text-4xl uppercase tracking-wide">Historie klubu</h1>
        <p className="mt-2 text-gray-500">TJ Baník Švermov — od roku 1906 po současnost</p>
      </div>

      {/* Timeline */}
      <div className="relative mb-14">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-8">
          {timeline.map((item) => (
            <div key={item.period} className="relative flex gap-6">
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c8102e] text-white text-xs font-bold text-center leading-tight p-1">
                {item.period.length <= 4 ? item.period : item.period.split('–')[0]}
              </div>
              <div className="pt-2 pb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#c8102e] mb-1">{item.period}</p>
                <h2 className="font-bold text-[#0a0a0a] text-lg mb-2">{item.title}</h2>
                <p className="text-gray-600 leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legendy */}
      <div>
        <h2 className="font-[Anton] text-2xl uppercase tracking-wide mb-6">Legendy klubu</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {legends.map((l) => (
            <div key={l.name} className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex items-start justify-between mb-1">
                <p className="font-bold text-[#0a0a0a]">{l.name}</p>
                <span className="text-xs text-gray-400 shrink-0 ml-2">{l.years}</span>
              </div>
              <p className="text-sm text-gray-600">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
