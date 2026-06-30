import type { Metadata } from 'next'
import ResetCookiesButton from './ResetCookiesButton'

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů a cookies',
  description: 'Zásady ochrany osobních údajů a používání cookies webu TJ Baník Švermov.',
}

const UPDATED = '30. 6. 2026'

export default function OchranaOsobnichUdajuPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">

        <h1 className="font-[Anton] text-4xl uppercase tracking-wide text-[#0a0a0a] mb-2">
          Ochrana osobních údajů
        </h1>
        <p className="text-sm text-gray-400 mb-10">Poslední aktualizace: {UPDATED}</p>

        {/* 1. Správce */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-3 pb-2 border-b border-gray-100">1. Správce osobních údajů</h2>
          <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
            <p><strong className="text-[#0a0a0a]">Tělovýchovná jednota Baník Švermov, z.s</strong></p>
            <p>Františka Oplta 1262</p>
            <p>273 09 Kladno – Švermov</p>
            <p>IČO: 48703877</p>
            <p>Datová schránka: zibaar4</p>
            <p>E-mail: <a href="mailto:baniksvermov@centrum.cz" className="text-[#c8102e] hover:underline">baniksvermov@centrum.cz</a></p>
            <p>Web: <a href="https://www.tjbaniksvermov.cz" className="text-[#c8102e] hover:underline">www.tjbaniksvermov.cz</a></p>
          </div>
        </section>

        {/* 2. Jaká data sbíráme */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-3 pb-2 border-b border-gray-100">2. Jaké osobní údaje zpracováváme</h2>
          <div className="text-sm text-gray-600 space-y-4 leading-relaxed">
            <div>
              <p className="font-semibold text-[#0a0a0a] mb-1">E-shop (objednávky)</p>
              <p>Jméno a příjmení, e-mailová adresa, telefonní číslo, obsah objednávky (produkty, velikosti, barvy, případný potisk). Tyto údaje jsou nezbytné pro vyřízení vaší objednávky.</p>
            </div>
            <div>
              <p className="font-semibold text-[#0a0a0a] mb-1">Rezervace hřiště</p>
              <p>Jméno, e-mailová adresa, telefonní číslo, termín a typ rezervace.</p>
            </div>
            <div>
              <p className="font-semibold text-[#0a0a0a] mb-1">Administrátorský přístup</p>
              <p>E-mailová adresa a heslo (hašované) pro přihlášení administrátorů webu prostřednictvím služby Supabase.</p>
            </div>
          </div>
        </section>

        {/* 3. Účel a právní základ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-3 pb-2 border-b border-gray-100">3. Účel a právní základ zpracování</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 font-semibold text-[#0a0a0a] border border-gray-100">Účel</th>
                  <th className="text-left px-3 py-2 font-semibold text-[#0a0a0a] border border-gray-100">Právní základ (GDPR)</th>
                  <th className="text-left px-3 py-2 font-semibold text-[#0a0a0a] border border-gray-100">Doba uchování</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="px-3 py-2 border border-gray-100">Vyřízení objednávky</td>
                  <td className="px-3 py-2 border border-gray-100">Plnění smlouvy (čl. 6 odst. 1 písm. b)</td>
                  <td className="px-3 py-2 border border-gray-100">5 let od vyřízení</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-3 py-2 border border-gray-100">Rezervace hřiště</td>
                  <td className="px-3 py-2 border border-gray-100">Plnění smlouvy (čl. 6 odst. 1 písm. b)</td>
                  <td className="px-3 py-2 border border-gray-100">1 rok od rezervace</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 border border-gray-100">Účetnictví a daňové povinnosti</td>
                  <td className="px-3 py-2 border border-gray-100">Právní povinnost (čl. 6 odst. 1 písm. c)</td>
                  <td className="px-3 py-2 border border-gray-100">10 let dle zákona</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-3 py-2 border border-gray-100">Správa webu</td>
                  <td className="px-3 py-2 border border-gray-100">Oprávněný zájem (čl. 6 odst. 1 písm. f)</td>
                  <td className="px-3 py-2 border border-gray-100">Po dobu trvání přístupu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Příjemci dat */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-3 pb-2 border-b border-gray-100">4. Příjemci osobních údajů</h2>
          <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
            <p>Vaše osobní údaje neprodáváme ani nepředáváme třetím stranám za marketingovými účely. Údaje mohou být sdíleny s následujícími zpracovateli v rozsahu nezbytném pro provoz webu:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-[#0a0a0a]">Supabase Inc.</strong> — cloudová databáze a autentizace (servery v EU/USA, smluvní doložky dle čl. 46 GDPR)</li>
              <li><strong className="text-[#0a0a0a]">Vercel Inc.</strong> — hosting webové aplikace (servery v EU/USA, standardní smluvní doložky)</li>
              <li><strong className="text-[#0a0a0a]">Resend Inc.</strong> — odesílání transakčních e-mailů (potvrzení objednávek, změny statusu)</li>
            </ul>
          </div>
        </section>

        {/* 5. Vaše práva */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-3 pb-2 border-b border-gray-100">5. Vaše práva</h2>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="mb-3">Dle GDPR máte právo:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Přístup', desc: 'Získat potvrzení, zda zpracováváme vaše údaje, a jejich kopii.' },
                { title: 'Oprava', desc: 'Požadovat opravu nesprávných nebo doplnění neúplných údajů.' },
                { title: 'Výmaz', desc: 'Požadovat smazání údajů (právo být zapomenut), není-li zpracování povinné ze zákona.' },
                { title: 'Omezení', desc: 'Požadovat omezení zpracování v případech stanovených GDPR.' },
                { title: 'Přenositelnost', desc: 'Získat vaše údaje ve strojově čitelném formátu.' },
                { title: 'Námitka', desc: 'Vznést námitku proti zpracování na základě oprávněného zájmu.' },
              ].map((r) => (
                <div key={r.title} className="rounded-lg bg-gray-50 px-4 py-3">
                  <p className="font-semibold text-[#0a0a0a] text-xs uppercase tracking-wide mb-1">{r.title}</p>
                  <p className="text-xs">{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              Svá práva uplatněte e-mailem na{' '}
              <a href="mailto:baniksvermov@centrum.cz" className="text-[#c8102e] hover:underline">baniksvermov@centrum.cz</a>.
              Máte také právo podat stížnost u dozorového orgánu:{' '}
              <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" className="text-[#c8102e] hover:underline">
                Úřad pro ochranu osobních údajů (www.uoou.cz)
              </a>.
            </p>
          </div>
        </section>

        {/* 6. Cookies */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-3 pb-2 border-b border-gray-100">6. Cookies</h2>
          <div className="text-sm text-gray-600 space-y-4 leading-relaxed">
            <p>
              Cookies jsou malé textové soubory ukládané do vašeho prohlížeče. Jejich používání upravuje zákon č. 127/2005 Sb. a nařízení GDPR.
            </p>

            <div className="space-y-3">
              <div className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-[#0a0a0a]">Nezbytné cookies</p>
                  <span className="text-xs bg-[#c8102e]/10 text-[#c8102e] px-2 py-0.5 rounded-full font-medium">Vždy aktivní</span>
                </div>
                <p className="text-xs text-gray-500">Zajišťují základní funkce webu — přihlášení administrátora, obsah košíku e-shopu, uložení vašeho souhlasu s cookies. Bez těchto cookies web nemůže správně fungovat.</p>
              </div>

              <div className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-[#0a0a0a]">Analytické cookies</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Volitelné</span>
                </div>
                <p className="text-xs text-gray-500">Umožňují měřit návštěvnost a chování uživatelů (Google Analytics apod.). Aktivujeme je pouze s vaším souhlasem. V současnosti nejsou aktivní.</p>
              </div>

              <div className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-[#0a0a0a]">Marketingové cookies</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Volitelné</span>
                </div>
                <p className="text-xs text-gray-500">Slouží k zobrazování relevantní reklamy (Facebook Pixel apod.). Aktivujeme je pouze s vaším souhlasem. V současnosti nejsou aktivní.</p>
              </div>
            </div>

            <p>
              Svůj souhlas s cookies můžete kdykoliv odvolat smazáním dat webu v nastavení prohlížeče nebo kliknutím na: <ResetCookiesButton />
            </p>
          </div>
        </section>

        {/* 7. Zabezpečení */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-3 pb-2 border-b border-gray-100">7. Zabezpečení dat</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Veškerá komunikace mezi vaším prohlížečem a naším webem je šifrována pomocí protokolu HTTPS/TLS. Osobní údaje jsou uchovávány v databázi Supabase s šifrováním dat v klidu. Přístup k databázi mají pouze oprávněné osoby.
          </p>
        </section>

        {/* 8. Změny */}
        <section>
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-3 pb-2 border-b border-gray-100">8. Změny zásad</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Tyto zásady ochrany osobních údajů můžeme čas od času aktualizovat. O podstatných změnách vás budeme informovat prostřednictvím oznámení na webu. Datum poslední aktualizace je uvedeno v záhlaví tohoto dokumentu.
          </p>
        </section>

      </div>
    </div>
  )
}
