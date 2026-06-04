-- ============================================================
-- TJ Baník Švermov — Initial Schema
-- ============================================================

-- ── PROFILES (admin uživatelé) ───────────────────────────────
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Admin can manage profiles" on profiles
  using (auth.uid() = id);

-- ── ARTICLE CATEGORIES ───────────────────────────────────────
create table article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  color text
);

alter table article_categories enable row level security;
create policy "Public read categories" on article_categories
  for select using (true);
create policy "Admin manage categories" on article_categories
  for all using (auth.role() = 'authenticated');

insert into article_categories (name, slug, color) values
  ('Akce', 'akce', '#c8102e'),
  ('Zápasové výsledky', 'zapasove-vysledky', '#0a0a0a'),
  ('Rozhovory', 'rozhovory', '#6b7280'),
  ('Média', 'media', '#3b82f6'),
  ('Info', 'info', '#10b981');

-- ── TEAMS ────────────────────────────────────────────────────
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text,
  competition_url text,
  schedule_url text,
  description text,
  photo_url text,
  position int default 0
);

alter table teams enable row level security;
create policy "Public read teams" on teams
  for select using (true);
create policy "Admin manage teams" on teams
  for all using (auth.role() = 'authenticated');

insert into teams (name, slug, category, position) values
  ('A-mužstvo', 'a-muzstvo', 'muži', 1),
  ('B-mužstvo', 'b-muzstvo', 'muži', 2),
  ('Dorost I.A třída', 'dorost-ia', 'dorost', 3),
  ('Dorost – okr. přebor', 'dorost-okresni-prebor', 'dorost', 4),
  ('Starší žáci', 'starsi-zaci', 'mládež', 5),
  ('Mladší žáci', 'mladsi-zaci', 'mládež', 6),
  ('Starší přípravka', 'starsi-pripravka', 'mládež', 7),
  ('Mladší přípravka', 'mladsi-pripravka', 'mládež', 8),
  ('Mini', 'mini', 'mládež', 9);

-- ── ARTICLES ─────────────────────────────────────────────────
create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb,
  hero_image_url text,
  category_id uuid references article_categories,
  author_id uuid references profiles,
  team_id uuid references teams,
  published_at timestamptz,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table articles enable row level security;
create policy "Public read published articles" on articles
  for select using (status = 'published');
create policy "Admin manage articles" on articles
  for all using (auth.role() = 'authenticated');

create index articles_slug_idx on articles (slug);
create index articles_status_idx on articles (status);
create index articles_published_at_idx on articles (published_at desc);

-- ── ARTICLE MEDIA ────────────────────────────────────────────
create table article_media (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles on delete cascade,
  type text not null default 'image',
  url text not null,
  alt text,
  position int default 0
);

alter table article_media enable row level security;
create policy "Public read article media" on article_media
  for select using (true);
create policy "Admin manage article media" on article_media
  for all using (auth.role() = 'authenticated');

-- ── PLAYERS ──────────────────────────────────────────────────
create table players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams on delete set null,
  first_name text,
  last_name text,
  jersey_number int,
  position text,
  birth_year int,
  photo_url text
);

alter table players enable row level security;
create policy "Public read players" on players
  for select using (true);
create policy "Admin manage players" on players
  for all using (auth.role() = 'authenticated');

-- ── COACHES ──────────────────────────────────────────────────
create table coaches (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams on delete set null,
  first_name text,
  last_name text,
  role text,
  phone text,
  email text,
  photo_url text
);

alter table coaches enable row level security;
create policy "Public read coaches" on coaches
  for select using (true);
create policy "Admin manage coaches" on coaches
  for all using (auth.role() = 'authenticated');

-- ── MATCHES ──────────────────────────────────────────────────
create table matches (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams,
  opponent text not null,
  kick_off_at timestamptz,
  is_home boolean,
  venue text,
  score_home int,
  score_away int,
  report_article_id uuid references articles,
  fotbal_cz_url text
);

alter table matches enable row level security;
create policy "Public read matches" on matches
  for select using (true);
create policy "Admin manage matches" on matches
  for all using (auth.role() = 'authenticated');

create index matches_kick_off_idx on matches (kick_off_at desc);

-- ── PARTNERS ─────────────────────────────────────────────────
create table partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  tier text default 'partner',
  position int default 0
);

alter table partners enable row level security;
create policy "Public read partners" on partners
  for select using (true);
create policy "Admin manage partners" on partners
  for all using (auth.role() = 'authenticated');

-- ── GALLERY ──────────────────────────────────────────────────
create table gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  cover_url text,
  event_date date,
  team_id uuid references teams
);

alter table gallery_albums enable row level security;
create policy "Public read albums" on gallery_albums
  for select using (true);
create policy "Admin manage albums" on gallery_albums
  for all using (auth.role() = 'authenticated');

create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references gallery_albums on delete cascade,
  type text not null default 'image',
  url text not null,
  caption text,
  position int default 0
);

alter table gallery_items enable row level security;
create policy "Public read gallery items" on gallery_items
  for select using (true);
create policy "Admin manage gallery items" on gallery_items
  for all using (auth.role() = 'authenticated');

-- ── PRODUCT CATEGORIES ───────────────────────────────────────
create table product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

alter table product_categories enable row level security;
create policy "Public read product categories" on product_categories
  for select using (true);
create policy "Admin manage product categories" on product_categories
  for all using (auth.role() = 'authenticated');

insert into product_categories (name, slug) values
  ('Dresy', 'dresy'),
  ('Štulpny', 'stulpny'),
  ('Mikiny', 'mikiny'),
  ('Bundy', 'bundy'),
  ('Doplňky', 'doplnky');

-- ── PRODUCTS ─────────────────────────────────────────────────
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references product_categories,
  description text,
  price numeric(10,2) not null,
  sizes text[],
  colors text[],
  images text[],
  in_stock boolean not null default true,
  status text not null default 'published',
  jako_sku text,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
create policy "Public read published products" on products
  for select using (status = 'published');
create policy "Admin manage products" on products
  for all using (auth.role() = 'authenticated');

create index products_status_idx on products (status);

-- ── ORDERS ───────────────────────────────────────────────────
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_first_name text not null,
  customer_last_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb,
  note text,
  subtotal numeric(10,2),
  shipping_cost numeric(10,2) default 0,
  total numeric(10,2),
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;
create policy "Admin manage orders" on orders
  for all using (auth.role() = 'authenticated');

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders on delete cascade,
  product_id uuid references products,
  product_name text,
  size text,
  color text,
  quantity int not null,
  unit_price numeric(10,2)
);

alter table order_items enable row level security;
create policy "Admin manage order items" on order_items
  for all using (auth.role() = 'authenticated');

create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders on delete cascade,
  from_status text,
  to_status text,
  changed_by uuid references profiles,
  note text,
  created_at timestamptz not null default now()
);

alter table order_status_history enable row level security;
create policy "Admin manage order history" on order_status_history
  for all using (auth.role() = 'authenticated');

-- ── FIELD BOOKINGS (poptávky pronájmu UMT) ───────────────────
create table field_bookings (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  club_name text,
  requested_date date not null,
  time_from time,
  time_to time,
  booking_type text,
  note text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table field_bookings enable row level security;
-- Kdokoliv může odeslat poptávku (INSERT), jen admin čte
create policy "Anyone can submit booking" on field_bookings
  for insert with check (true);
create policy "Admin read bookings" on field_bookings
  for select using (auth.role() = 'authenticated');
create policy "Admin manage bookings" on field_bookings
  for update using (auth.role() = 'authenticated');

-- ── SETTINGS ─────────────────────────────────────────────────
create table settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now()
);

alter table settings enable row level security;
create policy "Public read settings" on settings
  for select using (true);
create policy "Admin manage settings" on settings
  for all using (auth.role() = 'authenticated');

insert into settings (key, value) values
  ('phone', '"doplnit"'),
  ('address', '"Kladno – Švermov"'),
  ('pub_open_hours', '"Po–Pá: 15:00–22:00, So–Ne: 11:00–22:00"'),
  ('facebook_url', '"https://facebook.com"'),
  ('instagram_url', '"https://instagram.com"'),
  ('youtube_url', '"https://youtube.com"');

-- ── UPDATED_AT trigger ───────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger articles_updated_at
  before update on articles
  for each row execute function update_updated_at();
