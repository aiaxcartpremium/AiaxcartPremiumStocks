-- Core tables
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  role text check (role in ('admin','owner')),
  created_at timestamp with time zone default now()
);

create table if not exists stocks (
  id uuid primary key default gen_random_uuid(),
  product_key text not null,
  account_type text not null check (account_type in ('shared_profile','solo_profile','shared_acc','solo_acc')),
  term_days int not null default 30,
  price numeric,
  email text,
  password text,
  profile text,
  pin text,
  quantity int not null default 1,
  notes text,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  created_by uuid
);

create index if not exists idx_stocks_product on stocks(product_key);
create index if not exists idx_stocks_expires on stocks(expires_at);

-- Optional demo seed
insert into profiles(email, role) values
  ('admin1@aiaxcart.shop','admin')
on conflict (email) do update set role=excluded.role;

insert into profiles(email, role) values
  ('shanaiamau99@gmail.com','owner')
on conflict (email) do update set role=excluded.role;
