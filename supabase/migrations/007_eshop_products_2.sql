-- 007_eshop_products_2.sql
-- Druhá dávka produktů e-shopu (JAKO nabídka „Baník Švermov eshop")
-- Ceny: cca 15–18 % nad naši nákupní cenu (sloupec "Celkem" v nabídce), vždy pod cenou "Původní" (JAKO katalog)
--
-- POZNÁMKA: Tato migrace slouží jako dokumentace/reference. Skutečné vložení dat proběhlo přes
-- scripts/seed-eshop-products-2.mjs (kategorie + produkty) a scripts/update-eshop-images-2.mjs
-- (obrázky z jakojedenteam.cz, doplněné dodatečně — proto zde ARRAY[]::text[] neodpovídá živé DB).

-- Doplňky (doplnky) a Štulpny (stulpny) už existují ze základního schématu (001_initial_schema.sql) — nepřidávat znovu.
INSERT INTO product_categories (name, slug) VALUES
  ('Funkční prádlo', 'funkcni-pradlo'),
  ('Tašky a batohy', 'tasky-a-batohy'),
  ('Brankářská výbava', 'brankarska-vybava');

INSERT INTO products (name, slug, category_id, description, price, sizes, colors, images, jako_sku) VALUES

-- ═══ ZIMNÍ BUNDY ═══════════════════════════════════════════════════════════════

-- Zimní bunda Stadium — dětská (7210 | děti 128-164 | Celkem 1950 / Původní 2590)
(
  'Zimní bunda Stadium — dětská',
  'zimni-bunda-stadium-detska',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  'Prošívaná zimní bunda s vycpávkou pro maximální teplo. Voděodolný povrchový materiál, kapsy na zip.',
  2270.00,
  ARRAY['128','140','152','164'],
  ARRAY['Černá','Červená'],
  ARRAY[]::text[],
  '7210'
),

-- Zimní bunda Stadium — dospělá (7210 | dospělí S-4XL | Celkem 2250 / Původní 2990)
(
  'Zimní bunda Stadium — dospělá',
  'zimni-bunda-stadium-dospela',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  'Prošívaná zimní bunda s vycpávkou pro maximální teplo. Voděodolný povrchový materiál, kapsy na zip.',
  2610.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Černá','Červená'],
  ARRAY[]::text[],
  '7210'
),

-- Zimní bunda TEAM s kapucí — dětská (7103 | děti 128-164 | Celkem 1950 / Původní 2590)
(
  'Zimní bunda TEAM s kapucí — dětská',
  'zimni-bunda-team-s-kapuci-detska',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  'Zateplená zimní bunda s odnímatelnou kapucí. Vhodná na trénink i do hlediště v chladných měsících.',
  2270.00,
  ARRAY['128','140','152','164'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '7103'
),

-- Zimní bunda TEAM s kapucí — dospělá (7103 | dospělí S-4XL | Celkem 2250 / Původní 2790)
(
  'Zimní bunda TEAM s kapucí — dospělá',
  'zimni-bunda-team-s-kapuci-dospela',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  'Zateplená zimní bunda s odnímatelnou kapucí. Vhodná na trénink i do hlediště v chladných měsících.',
  2610.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '7103'
),

-- ═══ FUNKČNÍ PRÁDLO ════════════════════════════════════════════════════════════

-- Štulpny bez ponožky (3401 | L, M | Celkem 190 / Původní 250)
(
  'Štulpny bez ponožky',
  'stulpny-bez-ponozky',
  (SELECT id FROM product_categories WHERE slug = 'stulpny'),
  'Fotbalové štulpny bez našité ponožky, elastický materiál pro pevné držení.',
  220.00,
  ARRAY['M','L'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '3401'
),

-- Ponožky grip Comfort (3950 | vel. 3-5 | Celkem 290 / Původní 390)
(
  'Ponožky grip Comfort',
  'ponozky-grip-comfort',
  (SELECT id FROM product_categories WHERE slug = 'doplnky'),
  'Fotbalové ponožky s protiskluzovým gripem na chodidle pro lepší kontrolu v botě.',
  340.00,
  ARRAY['3','4','5'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '3950'
),

-- COMFORT 2.0 funkční triko dlouhý rukáv (6455 | dospělí 3XS-XXL | Celkem 790 / Původní 1050)
(
  'COMFORT 2.0 funkční triko dlouhý rukáv',
  'comfort-2-0-funkcni-triko-dlouhy-rukav',
  (SELECT id FROM product_categories WHERE slug = 'funkcni-pradlo'),
  'Funkční termo triko s dlouhým rukávem, efektivní odvod vlhkosti. Ideální vrstva pod dres při chladném počasí.',
  920.00,
  ARRAY['3XS','XS','XXS','S','M','L','XL','XXL'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '6455'
),

-- COMFORT 2.0 funkční rolák (6955 | dospělí 3XS-XXL | Celkem 820 / Původní 1090)
(
  'COMFORT 2.0 funkční rolák',
  'comfort-2-0-funkcni-rolak',
  (SELECT id FROM product_categories WHERE slug = 'funkcni-pradlo'),
  'Funkční rolák s dlouhým rukávem, hřejivá vrstva na zimní tréninky a zápasy.',
  950.00,
  ARRAY['3XS','XS','XXS','S','M','L','XL','XXL'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '6955'
),

-- WINTER triko dlouhý rukáv (6957 | dospělí L-XXL,S | Celkem 860 / Původní 1150)
(
  'WINTER triko dlouhý rukáv',
  'winter-triko-dlouhy-rukav',
  (SELECT id FROM product_categories WHERE slug = 'funkcni-pradlo'),
  'Zimní funkční triko s dlouhým rukávem pro extra teplo při nízkých teplotách.',
  1000.00,
  ARRAY['S','M','L','XL','XXL'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '6957'
),

-- COMPRESSION 2.0 elastické šortky — dětské (8551 | děti 140-164 | Celkem 560 / Původní 750)
(
  'COMPRESSION 2.0 elastické šortky — dětské',
  'compression-2-0-elasticke-sortky-detske',
  (SELECT id FROM product_categories WHERE slug = 'funkcni-pradlo'),
  'Kompresní šortky pod dres, podporují svalstvo a odvádí vlhkost při tréninku.',
  650.00,
  ARRAY['140','152','164'],
  ARRAY['Černá','Červená'],
  ARRAY[]::text[],
  '8551'
),

-- COMPRESSION 2.0 elastické šortky — dospělé (8551 | dospělí S-XXL | Celkem 590 / Původní 790)
(
  'COMPRESSION 2.0 elastické šortky — dospělé',
  'compression-2-0-elasticke-sortky-dospele',
  (SELECT id FROM product_categories WHERE slug = 'funkcni-pradlo'),
  'Kompresní šortky pod dres, podporují svalstvo a odvádí vlhkost při tréninku.',
  680.00,
  ARRAY['S','M','L','XL','XXL'],
  ARRAY['Černá','Červená'],
  ARRAY[]::text[],
  '8551'
),

-- COMFORT 2.0 funkční elasťáky (6555 | dospělí 3XS-XXL | Celkem 670 / Původní 890)
(
  'COMFORT 2.0 funkční elasťáky',
  'comfort-2-0-funkcni-elastaky',
  (SELECT id FROM product_categories WHERE slug = 'funkcni-pradlo'),
  'Funkční elastické legíny jako spodní vrstva pod trenýrky, hřejivé a pružné.',
  780.00,
  ARRAY['3XS','XS','XXS','S','M','L','XL','XXL'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '6555'
),

-- Spodní elastické šortky Function — dětské (8579 | děti 116-164 | Celkem 410 / Původní 550)
(
  'Spodní elastické šortky Function — dětské',
  'spodni-elasticke-sortky-function-detske',
  (SELECT id FROM product_categories WHERE slug = 'funkcni-pradlo'),
  'Lehké spodní elastické šortky pod trenýrky, prodyšný materiál.',
  480.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Černá','Červená'],
  ARRAY[]::text[],
  '8579'
),

-- Spodní elastické šortky Function — dospělé (8579 | dospělí S-XXL | Celkem 440 / Původní 590)
(
  'Spodní elastické šortky Function — dospělé',
  'spodni-elasticke-sortky-function-dospele',
  (SELECT id FROM product_categories WHERE slug = 'funkcni-pradlo'),
  'Lehké spodní elastické šortky pod trenýrky, prodyšný materiál.',
  510.00,
  ARRAY['S','M','L','XL','XXL'],
  ARRAY['Černá','Červená'],
  ARRAY[]::text[],
  '8579'
),

-- ═══ TAŠKY A BATOHY ════════════════════════════════════════════════════════════

-- Sportovní taška Iconic s odděleným spodním prostorem (2024 | vel. M, L | Celkem 940 / Původní 1250)
(
  'Sportovní taška Iconic s odděleným spodním prostorem',
  'sportovni-taska-iconic',
  (SELECT id FROM product_categories WHERE slug = 'tasky-a-batohy'),
  'Prostorná sportovní taška s odděleným spodním prostorem na kopačky. Dvě velikosti dle potřeby.',
  1090.00,
  ARRAY['M','L'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '2024'
),

-- ONE batoh (1801 | Celkem 370 / Původní 490)
(
  'ONE batoh',
  'one-batoh',
  (SELECT id FROM product_categories WHERE slug = 'tasky-a-batohy'),
  'Praktický sportovní batoh s prostorem na notebook i sportovní vybavení.',
  430.00,
  ARRAY[]::text[],
  ARRAY['Černá','Červená'],
  ARRAY[]::text[],
  '1801'
),

-- Taška na boty (1788 | Celkem 370 / Původní 490)
(
  'Taška na boty',
  'taska-na-boty',
  (SELECT id FROM product_categories WHERE slug = 'tasky-a-batohy'),
  'Samostatná taška na kopačky, odděluje obuv od zbytku výbavy.',
  430.00,
  ARRAY[]::text[],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '1788'
),

-- STRIKER batoh (1816 | Celkem 560 / Původní 750)
(
  'STRIKER batoh',
  'striker-batoh',
  (SELECT id FROM product_categories WHERE slug = 'tasky-a-batohy'),
  'Sportovní batoh se samostatnou kapsou na kopačky a hlavním prostorem na výbavu.',
  650.00,
  ARRAY[]::text[],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '1816'
),

-- ═══ DOPLŇKY ═══════════════════════════════════════════════════════════════════

-- Pantofle s vlastním potiskem (PANTPOT | vel. 28-48 | Celkem 550 / Původní 650)
(
  'Pantofle s vlastním potiskem',
  'pantofle-s-vlastnim-potiskem',
  (SELECT id FROM product_categories WHERE slug = 'doplnky'),
  'Pohodlné sportovní pantofle s možností vlastního potisku klubovým logem.',
  610.00,
  ARRAY['28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48'],
  ARRAY['Červeno-bílá','Černo-bílá'],
  ARRAY[]::text[],
  'PANTPOT'
),

-- Fleecová čepice (1224 | vel. 1, 2 | Celkem 220 / Původní 290)
(
  'Fleecová čepice',
  'fleecova-cepice',
  (SELECT id FROM product_categories WHERE slug = 'doplnky'),
  'Teplá fleecová čepice na zimní tréninky a zápasy.',
  260.00,
  ARRAY['1','2'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '1224'
),

-- Nákrčník z funkčního materiálu (1294 | Celkem 220 / Původní 290)
(
  'Nákrčník z funkčního materiálu',
  'nakrcnik-z-funkcniho-materialu',
  (SELECT id FROM product_categories WHERE slug = 'doplnky'),
  'Funkční nákrčník proti chladu a větru, univerzální velikost.',
  260.00,
  ARRAY[]::text[],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '1294'
),

-- Nákrčník (1292 | Celkem 290 / Původní 390)
(
  'Nákrčník',
  'nakrcnik',
  (SELECT id FROM product_categories WHERE slug = 'doplnky'),
  'Fleecový nákrčník na chladné dny, univerzální velikost.',
  340.00,
  ARRAY[]::text[],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '1292'
),

-- Funkční hráčské rukavice teplé (1234 | vel. 4-11 | Celkem 490 / Původní 650)
(
  'Funkční hráčské rukavice teplé',
  'funkcni-hracske-rukavice-teple',
  (SELECT id FROM product_categories WHERE slug = 'doplnky'),
  'Zateplené hráčské rukavice pro zimní zápasy a tréninky.',
  570.00,
  ARRAY['4','5','6','7','8','9','10','11'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '1234'
),

-- Fleecové hráčské rukavice (1232 | vel. 4-11 | Celkem 290 / Původní 390)
(
  'Fleecové hráčské rukavice',
  'fleecove-hracske-rukavice',
  (SELECT id FROM product_categories WHERE slug = 'doplnky'),
  'Lehké fleecové hráčské rukavice na chladnější dny.',
  340.00,
  ARRAY['4','5','6','7','8','9','10','11'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '1232'
),

-- Kšiltovka CLUB (1280 | Celkem 490 / Původní 650)
(
  'Kšiltovka CLUB',
  'ksiltovka-club',
  (SELECT id FROM product_categories WHERE slug = 'doplnky'),
  'Klubová kšiltovka s nastavitelným páskem, klasický sportovní styl.',
  570.00,
  ARRAY[]::text[],
  ARRAY['Černá','Bílá','Červeno-černá'],
  ARRAY[]::text[],
  '1280'
),

-- ═══ BRANKÁŘSKÁ VÝBAVA ═════════════════════════════════════════════════════════

-- ONE brankářský dres — dětský (8900 | děti 116-164 | Celkem 590 / Původní 790)
(
  'ONE brankářský dres — dětský',
  'one-brankarsky-dres-detsky',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářský dres s polstrováním na loktech, prodyšný materiál pro maximální pohyblivost v brance.',
  680.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '8900'
),

-- ONE brankářský dres — dospělý (8900 | dospělí S-XXL | Celkem 670 / Původní 890)
(
  'ONE brankářský dres — dospělý',
  'one-brankarsky-dres-dospely',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářský dres s polstrováním na loktech, prodyšný materiál pro maximální pohyblivost v brance.',
  780.00,
  ARRAY['S','M','L','XL','XXL'],
  ARRAY['Červená','Černá'],
  ARRAY[]::text[],
  '8900'
),

-- GK brankářské triko s vycpávkami (8965 | dospělí XS-XXL | Celkem 970 / Původní 1290)
(
  'GK brankářské triko s vycpávkami',
  'gk-brankarske-triko-s-vycpavkami',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářské triko s vycpávkami na loktech a ramenou pro ochranu při pádech.',
  1130.00,
  ARRAY['XS','S','M','L','XL','XXL'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8965'
),

-- STRIKER brankářské trenýrky — dětské (8939 | děti 128-164 | Celkem 590 / Původní 790)
(
  'STRIKER brankářské trenýrky — dětské',
  'striker-brankarske-trenyrky-detske',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářské trenýrky s vycpávkami na bocích, odolný materiál pro časté pády.',
  680.00,
  ARRAY['128','140','152','164'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8939'
),

-- STRIKER brankářské trenýrky — dospělé (8939 | dospělí S-3XL | Celkem 670 / Původní 890)
(
  'STRIKER brankářské trenýrky — dospělé',
  'striker-brankarske-trenyrky-dospele',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářské trenýrky s vycpávkami na bocích, odolný materiál pro časté pády.',
  780.00,
  ARRAY['S','M','L','XL','XXL','3XL'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8939'
),

-- STRIKER brankářské 3/4 kalhoty — dětské (8938 | děti 128-164 | Celkem 790 / Původní 1050)
(
  'STRIKER brankářské 3/4 kalhoty — dětské',
  'striker-brankarske-3-4-kalhoty-detske',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářské kalhoty 3/4 délky s vycpávkami na kolenou a bocích.',
  920.00,
  ARRAY['128','140','152','164'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8938'
),

-- STRIKER brankářské 3/4 kalhoty — dospělé (8938 | dospělí S-3XL | Celkem 860 / Původní 1150)
(
  'STRIKER brankářské 3/4 kalhoty — dospělé',
  'striker-brankarske-3-4-kalhoty-dospele',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářské kalhoty 3/4 délky s vycpávkami na kolenou a bocích.',
  1000.00,
  ARRAY['S','M','L','XL','XXL','3XL'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8938'
),

-- STRIKER brankářské kalhoty — dětské (8936 | děti 116-164 | Celkem 790 / Původní 1050)
(
  'STRIKER brankářské kalhoty — dětské',
  'striker-brankarske-kalhoty-detske',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářské kalhoty v plné délce s vycpávkami na kolenou a bocích, teplá zimní varianta.',
  920.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8936'
),

-- STRIKER brankářské kalhoty — dospělé (8936 | dospělí S-3XL | Celkem 860 / Původní 1150)
(
  'STRIKER brankářské kalhoty — dospělé',
  'striker-brankarske-kalhoty-dospele',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářské kalhoty v plné délce s vycpávkami na kolenou a bocích, teplá zimní varianta.',
  1000.00,
  ARRAY['S','M','L','XL','XXL','3XL'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8936'
),

-- GK brankářské šortky s vycpávkami (8986 | dospělí XS-XXL | Celkem 670 / Původní 890)
(
  'GK brankářské šortky s vycpávkami',
  'gk-brankarske-sortky-s-vycpavkami',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářské šortky s vycpávkami na bocích pro ochranu při pádech.',
  780.00,
  ARRAY['XS','S','M','L','XL','XXL'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8986'
),

-- Brankařský dres River — dětský (8946K | děti 116-164 | Celkem 670 / Původní 890)
(
  'Brankařský dres River — dětský',
  'brankarsky-dres-river-detsky',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářský dres River s polstrováním, výběr ze čtyř barevných variant.',
  780.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Zelená','Červená','Modrá','Černá'],
  ARRAY[]::text[],
  '8946K'
),

-- Brankařský dres River — dospělý (8946 | dospělí S-3XL | Celkem 740 / Původní 990)
(
  'Brankařský dres River — dospělý',
  'brankarsky-dres-river-dospely',
  (SELECT id FROM product_categories WHERE slug = 'brankarska-vybava'),
  'Brankářský dres River s polstrováním, výběr ze čtyř barevných variant.',
  860.00,
  ARRAY['S','M','L','XL','XXL','3XL'],
  ARRAY['Zelená','Červená','Modrá','Černá'],
  ARRAY[]::text[],
  '8946'
);
