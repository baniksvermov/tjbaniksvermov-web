/**
 * Druhá dávka produktů e-shopu (JAKO nabídka „Baník Švermov eshop").
 * Ceny: cca 15–18 % nad naší nákupní cenou, vždy pod cenou "Původní" (JAKO katalog).
 * Obrázky se doplní v samostatném kroku.
 * Spustit: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/seed-eshop-products-2.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://apyyhdeqflxxttbjgiya.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌  Nastav SUPABASE_SERVICE_ROLE_KEY jako env proměnnou')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const NEW_CATEGORIES = [
  { name: 'Funkční prádlo', slug: 'funkcni-pradlo' },
  { name: 'Tašky a batohy', slug: 'tasky-a-batohy' },
  { name: 'Brankářská výbava', slug: 'brankarska-vybava' },
]

// category = slug reference (existing: bundy, doplnky, stulpny; new: viz výše)
const PRODUCTS = [
  // ── Zimní bundy ──
  { name: 'Zimní bunda Stadium — dětská', slug: 'zimni-bunda-stadium-detska', category: 'bundy',
    description: 'Prošívaná zimní bunda s vycpávkou pro maximální teplo. Voděodolný povrchový materiál, kapsy na zip.',
    price: 2270, sizes: ['128', '140', '152', '164'], colors: ['Černá', 'Červená'], jako_sku: '7210' },
  { name: 'Zimní bunda Stadium — dospělá', slug: 'zimni-bunda-stadium-dospela', category: 'bundy',
    description: 'Prošívaná zimní bunda s vycpávkou pro maximální teplo. Voděodolný povrchový materiál, kapsy na zip.',
    price: 2610, sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'], colors: ['Černá', 'Červená'], jako_sku: '7210' },
  { name: 'Zimní bunda TEAM s kapucí — dětská', slug: 'zimni-bunda-team-s-kapuci-detska', category: 'bundy',
    description: 'Zateplená zimní bunda s odnímatelnou kapucí. Vhodná na trénink i do hlediště v chladných měsících.',
    price: 2270, sizes: ['128', '140', '152', '164'], colors: ['Červená', 'Černá'], jako_sku: '7103' },
  { name: 'Zimní bunda TEAM s kapucí — dospělá', slug: 'zimni-bunda-team-s-kapuci-dospela', category: 'bundy',
    description: 'Zateplená zimní bunda s odnímatelnou kapucí. Vhodná na trénink i do hlediště v chladných měsících.',
    price: 2610, sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'], colors: ['Červená', 'Černá'], jako_sku: '7103' },

  // ── Funkční prádlo ──
  { name: 'Štulpny bez ponožky', slug: 'stulpny-bez-ponozky', category: 'stulpny',
    description: 'Fotbalové štulpny bez našité ponožky, elastický materiál pro pevné držení.',
    price: 220, sizes: ['M', 'L'], colors: ['Červená', 'Černá'], jako_sku: '3401' },
  { name: 'Ponožky grip Comfort', slug: 'ponozky-grip-comfort', category: 'doplnky',
    description: 'Fotbalové ponožky s protiskluzovým gripem na chodidle pro lepší kontrolu v botě.',
    price: 340, sizes: ['3', '4', '5'], colors: ['Červená', 'Černá'], jako_sku: '3950' },
  { name: 'COMFORT 2.0 funkční triko dlouhý rukáv', slug: 'comfort-2-0-funkcni-triko-dlouhy-rukav', category: 'funkcni-pradlo',
    description: 'Funkční termo triko s dlouhým rukávem, efektivní odvod vlhkosti. Ideální vrstva pod dres při chladném počasí.',
    price: 920, sizes: ['3XS', 'XS', 'XXS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Červená', 'Černá'], jako_sku: '6455' },
  { name: 'COMFORT 2.0 funkční rolák', slug: 'comfort-2-0-funkcni-rolak', category: 'funkcni-pradlo',
    description: 'Funkční rolák s dlouhým rukávem, hřejivá vrstva na zimní tréninky a zápasy.',
    price: 950, sizes: ['3XS', 'XS', 'XXS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Červená', 'Černá'], jako_sku: '6955' },
  { name: 'WINTER triko dlouhý rukáv', slug: 'winter-triko-dlouhy-rukav', category: 'funkcni-pradlo',
    description: 'Zimní funkční triko s dlouhým rukávem pro extra teplo při nízkých teplotách.',
    price: 1000, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Černá'], jako_sku: '6957' },
  { name: 'COMPRESSION 2.0 elastické šortky — dětské', slug: 'compression-2-0-elasticke-sortky-detske', category: 'funkcni-pradlo',
    description: 'Kompresní šortky pod dres, podporují svalstvo a odvádí vlhkost při tréninku.',
    price: 650, sizes: ['140', '152', '164'], colors: ['Černá', 'Červená'], jako_sku: '8551' },
  { name: 'COMPRESSION 2.0 elastické šortky — dospělé', slug: 'compression-2-0-elasticke-sortky-dospele', category: 'funkcni-pradlo',
    description: 'Kompresní šortky pod dres, podporují svalstvo a odvádí vlhkost při tréninku.',
    price: 680, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Černá', 'Červená'], jako_sku: '8551' },
  { name: 'COMFORT 2.0 funkční elasťáky', slug: 'comfort-2-0-funkcni-elastaky', category: 'funkcni-pradlo',
    description: 'Funkční elastické legíny jako spodní vrstva pod trenýrky, hřejivé a pružné.',
    price: 780, sizes: ['3XS', 'XS', 'XXS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Červená', 'Černá'], jako_sku: '6555' },
  { name: 'Spodní elastické šortky Function — dětské', slug: 'spodni-elasticke-sortky-function-detske', category: 'funkcni-pradlo',
    description: 'Lehké spodní elastické šortky pod trenýrky, prodyšný materiál.',
    price: 480, sizes: ['116', '128', '140', '152', '164'], colors: ['Černá', 'Červená'], jako_sku: '8579' },
  { name: 'Spodní elastické šortky Function — dospělé', slug: 'spodni-elasticke-sortky-function-dospele', category: 'funkcni-pradlo',
    description: 'Lehké spodní elastické šortky pod trenýrky, prodyšný materiál.',
    price: 510, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Černá', 'Červená'], jako_sku: '8579' },

  // ── Tašky a batohy ──
  { name: 'Sportovní taška Iconic s odděleným spodním prostorem', slug: 'sportovni-taska-iconic', category: 'tasky-a-batohy',
    description: 'Prostorná sportovní taška s odděleným spodním prostorem na kopačky. Dvě velikosti dle potřeby.',
    price: 1090, sizes: ['M', 'L'], colors: ['Červená', 'Černá'], jako_sku: '2024' },
  { name: 'ONE batoh', slug: 'one-batoh', category: 'tasky-a-batohy',
    description: 'Praktický sportovní batoh s prostorem na notebook i sportovní vybavení.',
    price: 430, sizes: [], colors: ['Černá', 'Červená'], jako_sku: '1801' },
  { name: 'Taška na boty', slug: 'taska-na-boty', category: 'tasky-a-batohy',
    description: 'Samostatná taška na kopačky, odděluje obuv od zbytku výbavy.',
    price: 430, sizes: [], colors: ['Černá'], jako_sku: '1788' },
  { name: 'STRIKER batoh', slug: 'striker-batoh', category: 'tasky-a-batohy',
    description: 'Sportovní batoh se samostatnou kapsou na kopačky a hlavním prostorem na výbavu.',
    price: 650, sizes: [], colors: ['Červená', 'Černá'], jako_sku: '1816' },

  // ── Doplňky ──
  { name: 'Pantofle s vlastním potiskem', slug: 'pantofle-s-vlastnim-potiskem', category: 'doplnky',
    description: 'Pohodlné sportovní pantofle s možností vlastního potisku klubovým logem.',
    price: 610, sizes: ['28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48'],
    colors: ['Červeno-bílá', 'Černo-bílá'], jako_sku: 'PANTPOT' },
  { name: 'Fleecová čepice', slug: 'fleecova-cepice', category: 'doplnky',
    description: 'Teplá fleecová čepice na zimní tréninky a zápasy.',
    price: 260, sizes: ['1', '2'], colors: ['Červená', 'Černá'], jako_sku: '1224' },
  { name: 'Nákrčník z funkčního materiálu', slug: 'nakrcnik-z-funkcniho-materialu', category: 'doplnky',
    description: 'Funkční nákrčník proti chladu a větru, univerzální velikost.',
    price: 260, sizes: [], colors: ['Černá'], jako_sku: '1294' },
  { name: 'Nákrčník', slug: 'nakrcnik', category: 'doplnky',
    description: 'Fleecový nákrčník na chladné dny, univerzální velikost.',
    price: 340, sizes: [], colors: ['Červená', 'Černá'], jako_sku: '1292' },
  { name: 'Funkční hráčské rukavice teplé', slug: 'funkcni-hracske-rukavice-teple', category: 'doplnky',
    description: 'Zateplené hráčské rukavice pro zimní zápasy a tréninky.',
    price: 570, sizes: ['4','5','6','7','8','9','10','11'], colors: ['Černá'], jako_sku: '1234' },
  { name: 'Fleecové hráčské rukavice', slug: 'fleecove-hracske-rukavice', category: 'doplnky',
    description: 'Lehké fleecové hráčské rukavice na chladnější dny.',
    price: 340, sizes: ['4','5','6','7','8','9','10','11'], colors: ['Červená', 'Černá'], jako_sku: '1232' },
  { name: 'Kšiltovka CLUB', slug: 'ksiltovka-club', category: 'doplnky',
    description: 'Klubová kšiltovka s nastavitelným páskem, klasický sportovní styl.',
    price: 570, sizes: [], colors: ['Černá', 'Bílá', 'Červeno-černá'], jako_sku: '1280' },

  // ── Brankářská výbava ──
  { name: 'ONE brankářský dres — dětský', slug: 'one-brankarsky-dres-detsky', category: 'brankarska-vybava',
    description: 'Brankářský dres s polstrováním na loktech, prodyšný materiál pro maximální pohyblivost v brance.',
    price: 680, sizes: ['116', '128', '140', '152', '164'], colors: ['Červená', 'Černá'], jako_sku: '8900' },
  { name: 'ONE brankářský dres — dospělý', slug: 'one-brankarsky-dres-dospely', category: 'brankarska-vybava',
    description: 'Brankářský dres s polstrováním na loktech, prodyšný materiál pro maximální pohyblivost v brance.',
    price: 780, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Červená', 'Černá'], jako_sku: '8900' },
  { name: 'GK brankářské triko s vycpávkami', slug: 'gk-brankarske-triko-s-vycpavkami', category: 'brankarska-vybava',
    description: 'Brankářské triko s vycpávkami na loktech a ramenou pro ochranu při pádech.',
    price: 1130, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Černá'], jako_sku: '8965' },
  { name: 'STRIKER brankářské trenýrky — dětské', slug: 'striker-brankarske-trenyrky-detske', category: 'brankarska-vybava',
    description: 'Brankářské trenýrky s vycpávkami na bocích, odolný materiál pro časté pády.',
    price: 680, sizes: ['128', '140', '152', '164'], colors: ['Černá'], jako_sku: '8939' },
  { name: 'STRIKER brankářské trenýrky — dospělé', slug: 'striker-brankarske-trenyrky-dospele', category: 'brankarska-vybava',
    description: 'Brankářské trenýrky s vycpávkami na bocích, odolný materiál pro časté pády.',
    price: 780, sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'], colors: ['Černá'], jako_sku: '8939' },
  { name: 'STRIKER brankářské 3/4 kalhoty — dětské', slug: 'striker-brankarske-3-4-kalhoty-detske', category: 'brankarska-vybava',
    description: 'Brankářské kalhoty 3/4 délky s vycpávkami na kolenou a bocích.',
    price: 920, sizes: ['128', '140', '152', '164'], colors: ['Černá'], jako_sku: '8938' },
  { name: 'STRIKER brankářské 3/4 kalhoty — dospělé', slug: 'striker-brankarske-3-4-kalhoty-dospele', category: 'brankarska-vybava',
    description: 'Brankářské kalhoty 3/4 délky s vycpávkami na kolenou a bocích.',
    price: 1000, sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'], colors: ['Černá'], jako_sku: '8938' },
  { name: 'STRIKER brankářské kalhoty — dětské', slug: 'striker-brankarske-kalhoty-detske', category: 'brankarska-vybava',
    description: 'Brankářské kalhoty v plné délce s vycpávkami na kolenou a bocích, teplá zimní varianta.',
    price: 920, sizes: ['116', '128', '140', '152', '164'], colors: ['Černá'], jako_sku: '8936' },
  { name: 'STRIKER brankářské kalhoty — dospělé', slug: 'striker-brankarske-kalhoty-dospele', category: 'brankarska-vybava',
    description: 'Brankářské kalhoty v plné délce s vycpávkami na kolenou a bocích, teplá zimní varianta.',
    price: 1000, sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'], colors: ['Černá'], jako_sku: '8936' },
  { name: 'GK brankářské šortky s vycpávkami', slug: 'gk-brankarske-sortky-s-vycpavkami', category: 'brankarska-vybava',
    description: 'Brankářské šortky s vycpávkami na bocích pro ochranu při pádech.',
    price: 780, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Černá'], jako_sku: '8986' },
  { name: 'Brankařský dres River — dětský', slug: 'brankarsky-dres-river-detsky', category: 'brankarska-vybava',
    description: 'Brankářský dres River s polstrováním, výběr ze čtyř barevných variant.',
    price: 780, sizes: ['116', '128', '140', '152', '164'], colors: ['Zelená', 'Červená', 'Modrá', 'Černá'], jako_sku: '8946K' },
  { name: 'Brankařský dres River — dospělý', slug: 'brankarsky-dres-river-dospely', category: 'brankarska-vybava',
    description: 'Brankářský dres River s polstrováním, výběr ze čtyř barevných variant.',
    price: 860, sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'], colors: ['Zelená', 'Červená', 'Modrá', 'Černá'], jako_sku: '8946' },
]

async function main() {
  console.log(`→ Vytvářím ${NEW_CATEGORIES.length} nové kategorie…`)
  const { error: catError } = await supabase.from('product_categories').insert(NEW_CATEGORIES)
  if (catError) {
    console.error('❌ Chyba při vytváření kategorií:', catError.message)
    process.exit(1)
  }

  const { data: categories, error: catFetchError } = await supabase.from('product_categories').select('id, slug')
  if (catFetchError) {
    console.error('❌ Chyba při načítání kategorií:', catFetchError.message)
    process.exit(1)
  }
  const slugToId = Object.fromEntries(categories.map((c) => [c.slug, c.id]))

  console.log(`→ Vkládám ${PRODUCTS.length} produktů…`)
  const rows = PRODUCTS.map((p) => {
    const category_id = slugToId[p.category]
    if (!category_id) throw new Error(`Neznámá kategorie: ${p.category} (produkt ${p.name})`)
    return {
      name: p.name,
      slug: p.slug,
      category_id,
      description: p.description,
      price: p.price,
      sizes: p.sizes,
      colors: p.colors,
      images: [],
      jako_sku: p.jako_sku,
    }
  })

  const { data: inserted, error: prodError } = await supabase.from('products').insert(rows).select('id, name')
  if (prodError) {
    console.error('❌ Chyba při vkládání produktů:', prodError.message)
    process.exit(1)
  }

  console.log(`✅ Hotovo — vloženo ${inserted.length} produktů a ${NEW_CATEGORIES.length} kategorií.`)
}

main()
