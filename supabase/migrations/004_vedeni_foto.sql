-- Přidání fotek k vedení klubu

update coaches set photo_url = '/vedeni/david-nedved.jpg'      where last_name = 'Nedvěd'      and team_id is null;
update coaches set photo_url = '/vedeni/marek-mencl.jpg'       where last_name = 'Mencl'        and team_id is null;
update coaches set photo_url = '/vedeni/michal-bouska.jpg'     where last_name = 'Bouška'       and team_id is null;
update coaches set photo_url = '/vedeni/jindrich-chocholaty.jpg' where last_name = 'Chocholatý' and team_id is null;
update coaches set photo_url = '/vedeni/robert-stochl.jpg'     where last_name = 'Štochl'       and team_id is null;
update coaches set photo_url = '/vedeni/tomas-vydra.jpg'       where last_name = 'Vydra'        and team_id is null;
update coaches set photo_url = '/vedeni/ivan-belohradsky.jpg'  where last_name = 'Bělohradský' and first_name = 'Ivan' and team_id is null;

-- Jaroslav Křtěn — přidán z fotek (nebyl v původní migraci)
insert into coaches (first_name, last_name, role, photo_url, team_id)
values ('Jaroslav', 'Křtěn', 'Člen vedení', '/vedeni/jaroslav-krten.jpg', null)
on conflict do nothing;
