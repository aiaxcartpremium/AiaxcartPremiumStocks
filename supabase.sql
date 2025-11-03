create extension if not exists "uuid-ossp";

do $$ begin
  create type role_type as enum ('owner','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type channel_type as enum ('tg','fb','ig','tiktok','other');
exception when duplicate_object then null; end $$;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role role_type not null,
  display_name text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "read own or owner-all" on profiles
for select using (id = auth.uid() or exists (select 1 from profiles p where p.id=auth.uid() and p.role='owner'));
create policy "insert self" on profiles for insert with check (id = auth.uid());
create policy "no update roles via client" on profiles for update using (false);

create table if not exists stock_items (
  id uuid primary key default uuid_generate_v4(),
  product text not null,
  account_type text not null,
  months int not null default 30,
  email text, password text, profile text, pin text,
  price numeric(10,2),
  quantity int not null default 1,
  notes text,
  tags text[],
  status text not null default 'available',
  deleted_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  expires_at timestamptz generated always as (created_at + make_interval(days => months)) stored
);
alter table stock_items enable row level security;
create policy "owner full" on stock_items for all using (exists (select 1 from profiles p where p.id=auth.uid() and p.role='owner'));
create policy "admin read-only" on stock_items for select using (exists (select 1 from profiles p where p.id=auth.uid() and p.role in ('admin','owner')));

create table if not exists holds (
  id uuid primary key default uuid_generate_v4(),
  stock_id uuid references stock_items(id) on delete cascade,
  admin_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
alter table holds enable row level security;
create policy "admin manage own holds" on holds for all using (admin_id = auth.uid() or exists (select 1 from profiles p where p.id=auth.uid() and p.role='owner'));

create table if not exists sales (
  id uuid primary key default uuid_generate_v4(),
  stock_id uuid references stock_items(id) on delete set null,
  buyer_name text,
  channel channel_type,
  amount numeric(10,2),
  discount numeric(10,2) default 0,
  net_amount numeric(10,2),
  sold_by uuid references auth.users(id) on delete set null,
  sold_at timestamptz default now(),
  additional_days int default 0,
  new_expires_at timestamptz,
  deleted_at timestamptz
);
alter table sales enable row level security;
create policy "admin/owner manage" on sales for all using (exists (select 1 from profiles p where p.id=auth.uid() and p.role in ('admin','owner')));

create table if not exists audit_logs (
  id bigserial primary key,
  actor uuid,
  action text,
  entity text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

create table if not exists price_presets (
  product text not null,
  account_type text not null,
  months int not null,
  price numeric(10,2) not null,
  primary key (product,account_type,months)
);

create table if not exists alerts_config (
  product text primary key,
  low_stock_threshold int not null default 5
);

create or replace view admin_summary as
select product, account_type, months,
       sum(quantity) filter (where deleted_at is null and status='available')::int as available,
       min(price) as min_price, max(price) as max_price
from stock_items
group by 1,2,3;

create or replace function owner_add_stock_many(payload jsonb, n int)
returns void language plpgsql as $$
declare i int;
begin
  for i in 1..greatest(n,1) loop
    insert into stock_items(product,account_type,months,email,password,profile,pin,price,quantity,created_by,notes,tags)
    values (
      payload->>'product', payload->>'account_type', (payload->>'months')::int,
      nullif(payload->>'email',''), nullif(payload->>'password',''),
      nullif(payload->>'profile',''), nullif(payload->>'pin',''),
      nullif(payload->>'price','')::numeric, 1, auth.uid(),
      nullif(payload->>'notes',''),
      case when payload ? 'tags' then string_to_array(replace((payload->>'tags')::text,'"',''), ',')::text[] else null end
    );
  end loop;
end;
$$;

create or replace function create_hold(p_product text, p_type text, p_months int, p_minutes int default 3)
returns table(id uuid, expires_at timestamptz) language plpgsql security definer as $$
declare sid uuid;
begin
  select id into sid from stock_items
  where product=p_product and account_type=p_type and months=p_months and status='available' and deleted_at is null
  limit 1;
  if not found then return; end if;
  update stock_items set status='held' where id=sid;
  insert into holds(stock_id, admin_id, expires_at) values (sid, auth.uid(), now() + make_interval(mins => p_minutes))
  returning id, expires_at into id, expires_at;
end;
$$;

create or replace function confirm_hold(p_hold_id uuid)
returns table(stock_id uuid, email text, password text, profile text, pin text) language plpgsql security definer as $$
declare sid uuid;
begin
  update holds set status='confirmed' where id=p_hold_id and admin_id=auth.uid() and status='pending' and expires_at>now()
  returning stock_id into sid;
  if not found then raise exception 'Hold expired or not found'; end if;
  update stock_items set status='sold', quantity=0 where id=sid;
  insert into sales(stock_id, sold_by, amount, discount, net_amount) values (sid, auth.uid(), 0,0,0);
  return query select s.id, s.email, s.password, s.profile, s.pin from stock_items s where s.id=sid;
end;
$$;

create or replace function cancel_hold(p_hold_id uuid)
returns void language plpgsql security definer as $$
declare sid uuid;
begin
  update holds set status='cancelled' where id=p_hold_id and admin_id=auth.uid() and status='pending' returning stock_id into sid;
  if sid is not null then update stock_items set status='available' where id=sid; end if;
end;
$$;

create or replace function bump_expiry() returns trigger language plpgsql as $$
begin
  if new.additional_days is distinct from coalesce(old.additional_days,0) then
    update stock_items set expires_at = expires_at + make_interval(days => new.additional_days) where id = new.stock_id;
    new.new_expires_at := (select expires_at from stock_items where id = new.stock_id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_bump_expiry on sales;
create trigger trg_bump_expiry after insert or update of additional_days on sales
for each row execute procedure bump_expiry();

create or replace function low_stock_products() returns table(product text, available int, threshold int) language sql as $$
  select s.product,
         sum(s.quantity) filter (where s.status='available' and s.deleted_at is null)::int as available,
         coalesce(a.low_stock_threshold,5) as threshold
  from stock_items s
  left join alerts_config a on a.product=s.product
  group by s.product, a.low_stock_threshold
  having sum(s.quantity) filter (where s.status='available' and s.deleted_at is null) <= coalesce(a.low_stock_threshold,5)
$$;

grant usage on schema public to anon, authenticated;
grant select on admin_summary to authenticated;
grant execute on function owner_add_stock_many(jsonb,int) to authenticated;
grant execute on function create_hold(text,text,int,int) to authenticated;
grant execute on function confirm_hold(uuid) to authenticated;
grant execute on function cancel_hold(uuid) to authenticated;
grant execute on function low_stock_products() to authenticated;

-- Seed example (replace UUIDs)
-- insert into profiles(id, role, display_name) values
-- ('4830c7ae-562c-4ca5-9b8f-6e02c68d9638','owner','Owner'),
-- ('c6650341-509f-4eed-9cc6-18732f72a952','admin','Admin')
-- on conflict (id) do update set role=excluded.role;
