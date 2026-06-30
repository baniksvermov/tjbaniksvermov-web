-- 006_eshop_products.sql
-- Produkty e-shopu: ONE kolekce + SONIC kolekce (JAKO)
-- Ceny: vyšší než Celkem (klubová nákupní cena), nižší než Původní (JAKO katalog)
-- Obrázky z: https://www.team-jako.cz/ew/ew_images/image?EwImage={UUID}&Filter=38bb315d-6497-4ad4-9275-7213493a8945

INSERT INTO product_categories (name, slug) VALUES
  ('Trička', 'tricka'),
  ('Tepláky a šortky', 'teplaky-sortky');

INSERT INTO products (name, slug, category_id, description, price, sizes, colors, images, jako_sku) VALUES

-- ═══ ONE KOLEKCE ═══════════════════════════════════════════════════════════════

-- ONE bunda s kapucí — dětská (6800 | děti 116-164 | Celkem 740 / Původní 990)
(
  'ONE bunda s kapucí — dětská',
  'one-bunda-s-kapuci-detska',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  '100 % recyklovaný polyester s vnitřním microfleecem. Postranní kapsy, sportovní střih. Vhodná na trénink i každodenní nošení.',
  849.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červená'],
  ARRAY['https://www.team-jako.cz/ew/ew_images/image?EwImage=4f253467-6c6c-4145-99be-d788487bc3a4&Filter=38bb315d-6497-4ad4-9275-7213493a8945'],
  '6800'
),

-- ONE bunda s kapucí — dospělá (6800 | dospělí S-4XL | Celkem 940 / Původní 1250)
(
  'ONE bunda s kapucí — dospělá',
  'one-bunda-s-kapuci-dospela',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  '100 % recyklovaný polyester s vnitřním microfleecem. Postranní kapsy, sportovní střih. Vhodná na trénink i každodenní nošení.',
  1090.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červená'],
  ARRAY['https://www.team-jako.cz/ew/ew_images/image?EwImage=4f253467-6c6c-4145-99be-d788487bc3a4&Filter=38bb315d-6497-4ad4-9275-7213493a8945'],
  '6800'
),

-- ONE tepláková bunda — dětská (9300 | děti 116-164 | Celkem 670 / Původní 890)
(
  'ONE tepláková bunda — dětská',
  'one-teplakova-bunda-detska',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  '100 % recyklovaný polyester. Žebrované manžety a lem, postranní kapsy. Ochrana před větrem a chladem při tréninku.',
  790.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '9300'
),

-- ONE tepláková bunda — dospělá (9300 | dospělí S-4XL | Celkem 790 / Původní 1050)
(
  'ONE tepláková bunda — dospělá',
  'one-teplakova-bunda-dospela',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  '100 % recyklovaný polyester. Žebrované manžety a lem, postranní kapsy. Ochrana před větrem a chladem při tréninku.',
  949.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '9300'
),

-- ONE mikina krátký zip — dětská (8600 | děti 116-164 | Celkem 590 / Původní 790)
(
  'ONE mikina krátký zip — dětská',
  'one-mikina-kratky-zip-detska',
  (SELECT id FROM product_categories WHERE slug = 'mikiny'),
  '100 % recyklovaný polyester s vnitřním microfleecem. Prodyšný a odvlhčující materiál. Vhodná na trénink i volný čas.',
  690.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '8600'
),

-- ONE mikina krátký zip — dospělá (8600 | dospělí S-4XL | Celkem 670 / Původní 890)
(
  'ONE mikina krátký zip — dospělá',
  'one-mikina-kratky-zip-dospela',
  (SELECT id FROM product_categories WHERE slug = 'mikiny'),
  '100 % recyklovaný polyester s vnitřním microfleecem. Prodyšný a odvlhčující materiál. Vhodná na trénink i volný čas.',
  790.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '8600'
),

-- ONE tréninková mikina — dětská (8800 | děti 116-164 | Celkem 550 / Původní 730)
(
  'ONE tréninková mikina — dětská',
  'one-treninkova-mikina-detska',
  (SELECT id FROM product_categories WHERE slug = 'mikiny'),
  '100 % recyklovaný polyester s microfleecem uvnitř. Příjemný měkký pocit, optimální pohyb při tréninku i ve volném čase.',
  649.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '8800'
),

-- ONE tréninková mikina — dospělá (8800 | dospělí S-4XL | Celkem 640 / Původní 850)
(
  'ONE tréninková mikina — dospělá',
  'one-treninkova-mikina-dospela',
  (SELECT id FROM product_categories WHERE slug = 'mikiny'),
  '100 % recyklovaný polyester s microfleecem uvnitř. Příjemný měkký pocit, optimální pohyb při tréninku i ve volném čase.',
  749.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '8800'
),

-- ONE triko — dětská (6100 | děti 116-164 | Celkem 340 / Původní 450)
(
  'ONE triko — dětská',
  'one-triko-detske',
  (SELECT id FROM product_categories WHERE slug = 'tricka'),
  '100 % recyklovaný polyester, technologie Keep Dry. Efektivní odvod vlhkosti i při náročném tréninku. Prodyšné a odolné.',
  390.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červená'],
  ARRAY['https://www.team-jako.cz/ew/ew_images/image?EwImage=48ec217b-29d1-4bd8-81c0-468a01325a23&Filter=38bb315d-6497-4ad4-9275-7213493a8945'],
  '6100'
),

-- ONE triko — dospělé (6100 | dospělí S-4XL | Celkem 370 / Původní 490)
(
  'ONE triko — dospělé',
  'one-triko-dospele',
  (SELECT id FROM product_categories WHERE slug = 'tricka'),
  '100 % recyklovaný polyester, technologie Keep Dry. Efektivní odvod vlhkosti i při náročném tréninku. Prodyšné a odolné.',
  430.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červená'],
  ARRAY['https://www.team-jako.cz/ew/ew_images/image?EwImage=48ec217b-29d1-4bd8-81c0-468a01325a23&Filter=38bb315d-6497-4ad4-9275-7213493a8945'],
  '6100'
),

-- ONE triko s límečkem — dětská (6300 | děti 140-164 | Celkem 490 / Původní 650)
(
  'ONE triko s límečkem — dětská',
  'one-triko-s-limeckem-detske',
  (SELECT id FROM product_categories WHERE slug = 'tricka'),
  '100 % recyklovaný polyester, technologie Keep Dry. Klasický límec se třemi knoflíky. Sportovní design s prvky JAKO.',
  570.00,
  ARRAY['140','152','164'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '6300'
),

-- ONE triko s límečkem — dospělé (6300 | dospělí S-4XL | Celkem 570 / Původní 750)
(
  'ONE triko s límečkem — dospělé',
  'one-triko-s-limeckem-dospele',
  (SELECT id FROM product_categories WHERE slug = 'tricka'),
  '100 % recyklovaný polyester, technologie Keep Dry. Klasický límec se třemi knoflíky. Sportovní design s prvky JAKO.',
  660.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '6300'
),

-- ONE tepláky — dětská (9200 | děti 116-164 | Celkem 490 / Původní 650)
(
  'ONE tepláky — dětská',
  'one-teplaky-detske',
  (SELECT id FROM product_categories WHERE slug = 'teplaky-sortky'),
  '100 % recyklovaný polyester. Zip u nohavic, žebrované manžety, postranní kapsy. Lehký a prodyšný střih pro trénink i volný čas.',
  570.00,
  ARRAY['116','122','128','134','140','146','152','158','164'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '9200'
),

-- ONE tepláky — dospělé (9200 | dospělí S-4XL | Celkem 590 / Původní 790)
(
  'ONE tepláky — dospělé',
  'one-teplaky-dospele',
  (SELECT id FROM product_categories WHERE slug = 'teplaky-sortky'),
  '100 % recyklovaný polyester. Zip u nohavic, žebrované manžety, postranní kapsy. Lehký a prodyšný střih pro trénink i volný čas.',
  690.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '9200'
),

-- ONE vycházkové šortky — dětská (6200 | děti 116-164 | Celkem 390 / Původní 510)
(
  'ONE vycházkové šortky — dětská',
  'one-vychazkove-sortky-detske',
  (SELECT id FROM product_categories WHERE slug = 'teplaky-sortky'),
  '100 % recyklovaný polyester. Postranní kapsy se zipem. Lehký a prodyšný materiál pro sport i volný čas.',
  449.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '6200'
),

-- ONE vycházkové šortky — dospělé (6200 | dospělí S-4XL | Celkem 480 / Původní 630)
(
  'ONE vycházkové šortky — dospělé',
  'one-vychazkove-sortky-dospele',
  (SELECT id FROM product_categories WHERE slug = 'teplaky-sortky'),
  '100 % recyklovaný polyester. Postranní kapsy se zipem. Lehký a prodyšný materiál pro sport i volný čas.',
  559.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červená'],
  ARRAY[]::text[],
  '6200'
),

-- ═══ SONIC KOLEKCE ═════════════════════════════════════════════════════════════

-- Bunda s kapucí Sonic — dětská (6826 | děti 128-164 | Celkem 1120 / Původní 1490)
(
  'Bunda s kapucí Sonic — dětská',
  'sonic-bunda-s-kapuci-detska',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  '100 % recyklovaný polyester s interlock fleece vnitřní vrstvou. Moderní Sonic design s kontrastními prvky, postranní kapsy se zipem. Dostupná ve dvou barevných variantách.',
  1290.00,
  ARRAY['128','140','152','164'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY['https://www.team-jako.cz/ew/ew_images/image?EwImage=e5aa645e-aed2-4eb0-8f75-ef2c2c291e42&Filter=38bb315d-6497-4ad4-9275-7213493a8945'],
  '6826'
),

-- Bunda s kapucí Sonic — dospělá (6826 | dospělí S-4XL | Celkem 1240 / Původní 1650)
(
  'Bunda s kapucí Sonic — dospělá',
  'sonic-bunda-s-kapuci-dospela',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  '100 % recyklovaný polyester s interlock fleece vnitřní vrstvou. Moderní Sonic design s kontrastními prvky, postranní kapsy se zipem. Dostupná ve dvou barevných variantách.',
  1440.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY['https://www.team-jako.cz/ew/ew_images/image?EwImage=e5aa645e-aed2-4eb0-8f75-ef2c2c291e42&Filter=38bb315d-6497-4ad4-9275-7213493a8945'],
  '6826'
),

-- Tepláková bunda Sonic — dětská (9326 | děti 116-164 | Celkem 740 / Původní 990)
(
  'Tepláková bunda Sonic — dětská',
  'sonic-teplakova-bunda-detska',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  '100 % recyklovaný polyester. Dynamický Sonic design s kontrastními prvky, žebrované manžety. Dostupná ve dvou barevných variantách.',
  849.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY[]::text[],
  '9326'
),

-- Tepláková bunda Sonic — dospělá (9326 | dospělí S-4XL | Celkem 860 / Původní 1150)
(
  'Tepláková bunda Sonic — dospělá',
  'sonic-teplakova-bunda-dospela',
  (SELECT id FROM product_categories WHERE slug = 'bundy'),
  '100 % recyklovaný polyester. Dynamický Sonic design s kontrastními prvky, žebrované manžety. Dostupná ve dvou barevných variantách.',
  990.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY[]::text[],
  '9326'
),

-- Sonic mikina krátký zip — dětská (8626 | děti 128-164 | Celkem 860 / Původní 1150)
(
  'Sonic mikina krátký zip — dětská',
  'sonic-mikina-kratky-zip-detska',
  (SELECT id FROM product_categories WHERE slug = 'mikiny'),
  '100 % recyklovaný polyester s vnitřním microfleecem. Výrazný Sonic design s kontrastními prvky. Dostupná ve dvou barevných variantách.',
  990.00,
  ARRAY['128','140','152','164'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY[]::text[],
  '8626'
),

-- Sonic mikina krátký zip — dospělá (8626 | dospělí S-3XL | Celkem 940 / Původní 1250)
(
  'Sonic mikina krátký zip — dospělá',
  'sonic-mikina-kratky-zip-dospela',
  (SELECT id FROM product_categories WHERE slug = 'mikiny'),
  '100 % recyklovaný polyester s vnitřním microfleecem. Výrazný Sonic design s kontrastními prvky. Dostupná ve dvou barevných variantách.',
  1090.00,
  ARRAY['S','M','L','XL','XXL','3XL'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY[]::text[],
  '8626'
),

-- Mikina Sonic — dětská (8826 | děti 116-164 | Celkem 740 / Původní 990)
(
  'Mikina Sonic — dětská',
  'sonic-mikina-detska',
  (SELECT id FROM product_categories WHERE slug = 'mikiny'),
  '100 % recyklovaný polyester s vnitřním microfleecem. Dynamický Sonic design s kontrastními detaily. Dostupná ve dvou barevných variantách.',
  849.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY[]::text[],
  '8826'
),

-- Mikina Sonic — dospělá (8826 | dospělí S-4XL | Celkem 860 / Původní 1150)
(
  'Mikina Sonic — dospělá',
  'sonic-mikina-dospela',
  (SELECT id FROM product_categories WHERE slug = 'mikiny'),
  '100 % recyklovaný polyester s vnitřním microfleecem. Dynamický Sonic design s kontrastními detaily. Dostupná ve dvou barevných variantách.',
  990.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY[]::text[],
  '8826'
),

-- Triko Sonic — dětská (6126 | děti 116-164 | Celkem 570 / Původní 750)
(
  'Triko Sonic — dětská',
  'sonic-triko-detske',
  (SELECT id FROM product_categories WHERE slug = 'tricka'),
  '100 % recyklovaný polyester s odvodem vlhkosti. Dynamický Sonic design s tiskem na rukávech, žebrované manžety. Dvě barevné varianty.',
  660.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY['https://www.team-jako.cz/ew/ew_images/image?EwImage=5e8c3344-53fb-41c4-b425-2adc1ee591b7&Filter=38bb315d-6497-4ad4-9275-7213493a8945'],
  '6126'
),

-- Triko Sonic — dospělé (6126 | dospělí S-4XL | Celkem 670 / Původní 890)
(
  'Triko Sonic — dospělé',
  'sonic-triko-dospele',
  (SELECT id FROM product_categories WHERE slug = 'tricka'),
  '100 % recyklovaný polyester s odvodem vlhkosti. Dynamický Sonic design s tiskem na rukávech, žebrované manžety. Dvě barevné varianty.',
  780.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY['https://www.team-jako.cz/ew/ew_images/image?EwImage=5e8c3344-53fb-41c4-b425-2adc1ee591b7&Filter=38bb315d-6497-4ad4-9275-7213493a8945'],
  '6126'
),

-- Triko s límečkem Sonic — dětská (6326 | děti 140-164 | Celkem 670 / Původní 890)
(
  'Triko s límečkem Sonic — dětská',
  'sonic-triko-s-limeckem-detske',
  (SELECT id FROM product_categories WHERE slug = 'tricka'),
  '100 % recyklovaný polyester. Moderní Sonic design s kontrastními prvky a klasickým límcem. Dostupné ve dvou barevných variantách.',
  790.00,
  ARRAY['140','152','164'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY[]::text[],
  '6326'
),

-- Triko s límečkem Sonic — dospělé (6326 | dospělí S-4XL | Celkem 740 / Původní 990)
(
  'Triko s límečkem Sonic — dospělé',
  'sonic-triko-s-limeckem-dospele',
  (SELECT id FROM product_categories WHERE slug = 'tricka'),
  '100 % recyklovaný polyester. Moderní Sonic design s kontrastními prvky a klasickým límcem. Dostupné ve dvou barevných variantách.',
  869.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Červeno-bílá','Černo-červená'],
  ARRAY[]::text[],
  '6326'
),

-- DYNAMIC tepláky — dětská (9270 | děti 116-164 | Celkem 670 / Původní 890)
(
  'DYNAMIC tepláky — dětská',
  'dynamic-teplaky-detske',
  (SELECT id FROM product_categories WHERE slug = 'teplaky-sortky'),
  '100 % recyklovaný polyester. Dynamický sportovní design pro aktivní trénink i volný čas.',
  790.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '9270'
),

-- DYNAMIC tepláky — dospělé (9270 | dospělí S-4XL | Celkem 790 / Původní 1050)
(
  'DYNAMIC tepláky — dospělé',
  'dynamic-teplaky-dospele',
  (SELECT id FROM product_categories WHERE slug = 'teplaky-sortky'),
  '100 % recyklovaný polyester. Dynamický sportovní design pro aktivní trénink i volný čas.',
  920.00,
  ARRAY['S','M','L','XL','XXL','3XL','4XL'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '9270'
),

-- DYNAMIC volnočasové šortky — dětská (8370 | děti 116-164 | Celkem 670 / Původní 890)
(
  'DYNAMIC volnočasové šortky — dětská',
  'dynamic-volnocasove-sortky-detske',
  (SELECT id FROM product_categories WHERE slug = 'teplaky-sortky'),
  '100 % recyklovaný polyester. Praktické kapsy, dynamický sportovní design. Vhodné pro trénink i volný čas.',
  790.00,
  ARRAY['116','128','140','152','164'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8370'
),

-- DYNAMIC volnočasové šortky — dospělé (8370 | dospělí S-3XL | Celkem 740 / Původní 990)
(
  'DYNAMIC volnočasové šortky — dospělé',
  'dynamic-volnocasove-sortky-dospele',
  (SELECT id FROM product_categories WHERE slug = 'teplaky-sortky'),
  '100 % recyklovaný polyester. Praktické kapsy, dynamický sportovní design. Vhodné pro trénink i volný čas.',
  869.00,
  ARRAY['S','M','L','XL','XXL','3XL'],
  ARRAY['Černá'],
  ARRAY[]::text[],
  '8370'
);
