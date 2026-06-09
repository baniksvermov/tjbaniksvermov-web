-- Vedení klubu TJ Baník Švermov
-- Smaž staré záznamy vedení (bez týmu) a vlož aktuální

delete from coaches where team_id is null;

insert into coaches (first_name, last_name, role, phone, email, team_id) values
  ('David',    'Nedvěd',        'Předseda',                              '+420 604 234 643', 'baniksvermov@centrum.cz', null),
  ('Marek',    'Mencl',         'Místopředseda',                         '+420 608 269 063', 'baniksvermov@centrum.cz', null),
  ('Michal',   'Bouška',        'Ekonomický úsek',                       '+420 776 860 360', 'baniksvermov@centrum.cz', null),
  ('Jindřich', 'Chocholatý',    'Sekretář',                              '+420 607 521 279', 'baniksvermov@centrum.cz', null),
  ('Robert',   'Štochl',        'Administrátor FAČR',                    '+420 602 241 461', 'baniksvermov@centrum.cz', null),
  ('Tomáš',    'Vydra',         'Administrátor webu a sociálních sítí',  '+420 725 430 492', 'tomas@tjbaniksvermov.cz', null),
  ('Ivan',     'Bělohradský',   'Údržba areálu',                         '+420 731 920 066', 'baniksvermov@centrum.cz', null),
  ('Tomáš',    'Bělohradský',   'Šéftrenér mládeže',                     '+420 737 264 509', 'baniksvermov@centrum.cz', null);
