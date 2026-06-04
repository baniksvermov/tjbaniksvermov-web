-- Testovací články — spusť v Supabase SQL Editoru
-- Nejdříve zjistíme ID kategorií

do $$
declare
  cat_zapasy uuid;
  cat_akce uuid;
  cat_info uuid;
begin
  select id into cat_zapasy from article_categories where slug = 'zapasove-vysledky';
  select id into cat_akce from article_categories where slug = 'akce';
  select id into cat_info from article_categories where slug = 'info';

  insert into articles (title, slug, excerpt, content, category_id, status, published_at) values
  (
    'A-mužstvo remizovalo 1:1 v derby s Kladnem',
    'a-muzstvo-remizovalo-1-1-derby-kladno',
    'Vyrovnaný souboj skončil remízou. Branku za nás vstřelil Martin Novák v 67. minutě po přesné přihrávce od Petra Svobody.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Sobotní derby přilákalo na hřiště přes 200 diváků. Zápas byl od začátku vyrovnaný a ani jeden tým si nevytvořil jednoznačnou převahu."}]},{"type":"paragraph","content":[{"type":"text","text":"Soupeř šel do vedení v 34. minutě po standardní situaci. Naši hráči ale neztráceli hlavu a ve druhém poločase srovnali stav. Branku vstřelil Martin Novák hlavičkou po rohu."}]},{"type":"paragraph","content":[{"type":"text","text":"Remíza 1:1 je z venkovního pohledu solidní výsledek. Příští domácí zápas hrajeme tuto sobotu od 15:00."}]}]}',
    cat_zapasy,
    'published',
    now() - interval '2 days'
  ),
  (
    'Letní fotbalový kemp pro mládež — přihlášky otevřeny',
    'letni-fotbalovy-kemp-mladez-prihlaseni',
    'Zveme děti ve věku 6–15 let na týdenní fotbalový kemp plný tréninků, zábavy a nových přátelství. Kemp proběhne 14.–18. července 2026.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Letní fotbalový kemp je určen pro všechny děti, které chtějí zlepšit svou techniku a užít si fotbal v příjemném prostředí."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Program kempu"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Ranní rozcvičení a technické tréninky"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Odpolední zápasy a soutěže"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Závěrečný turnaj s cenami"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"Cena: 2 500 Kč (zahrnuje stravu, trenéry a materiál). Přihlášky zasílejte na baniksvermov@gmail.com."}]}]}',
    cat_akce,
    'published',
    now() - interval '5 days'
  ),
  (
    'Nová umělá tráva je připravena k pronájmu',
    'nova-umela-trava-pripravena-pronajem',
    'Po dokončení úprav je náš UMT povrch Champion EPDM opět plně k dispozici. Nový systém osvětlení umožňuje hru až do 22:00.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"S radostí oznamujeme, že náš fotbalový areál prošel obnovou a umělá tráva je nyní plně k dispozici pro pronájem."}]},{"type":"paragraph","content":[{"type":"text","text":"Povrch Champion EPDM zajišťuje kvalitní herní podmínky za každého počasí. Nové LED osvětlení umožňuje hrát i za soumraku."}]},{"type":"paragraph","content":[{"type":"text","text":"Pro poptávku pronájmu použijte formulář na stránce UMT nebo nás kontaktujte na baniksvermov@centrum.cz."}]}]}',
    cat_info,
    'published',
    now() - interval '10 days'
  );
end $$;
