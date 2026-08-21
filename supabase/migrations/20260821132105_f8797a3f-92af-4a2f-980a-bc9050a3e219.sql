-- 1. Roles System
create type public.app_role as enum ('admin', 'technician');

create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null,
    unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- 2. Profiles Table
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    nome text not null,
    matricula text unique not null,
    email text unique not null,
    created_at timestamptz default now()
);

grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- 3. Parques Table
create table public.parques (
    id text primary key,
    nome text not null,
    aeros integer[] not null,
    created_at timestamptz default now()
);

grant select on public.parques to authenticated;
grant all on public.parques to service_role;

alter table public.parques enable row level security;

create policy "Technicians can view parques"
on public.parques
for select
to authenticated
using (true);

-- 4. Pecas (SAP Catalog) Table
create table public.pecas (
    sap text primary key,
    descricao text not null,
    created_at timestamptz default now()
);

grant select on public.pecas to authenticated;
grant all on public.pecas to service_role;

alter table public.pecas enable row level security;

create policy "Technicians can view catalog"
on public.pecas
for select
to authenticated
using (true);

-- 5. Movimentacoes (History) Table
create table public.movimentacoes (
    id uuid primary key default gen_random_uuid(),
    data timestamptz default now(),
    tecnico_id uuid references auth.users(id) not null,
    parque_id text references public.parques(id) not null,
    aero text not null,
    sap text references public.pecas(sap) not null,
    quantidade integer not null check (quantidade > 0),
    wo text,
    estoque text,
    created_at timestamptz default now()
);

grant select, insert on public.movimentacoes to authenticated;
grant all on public.movimentacoes to service_role;

alter table public.movimentacoes enable row level security;

create policy "Technicians can view their own movimentacoes"
on public.movimentacoes
for select
to authenticated
using (auth.uid() = tecnico_id);

create policy "Admins can view all movimentacoes"
on public.movimentacoes
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Technicians can insert movimentacoes"
on public.movimentacoes
for insert
to authenticated
with check (auth.uid() = tecnico_id);

-- 6. Initial Data Seeding
insert into public.parques (id, nome, aeros) values
('MA', 'Macaúbas', Array[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]),
('NH', 'Novo Horizonte', Array[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]),
('SE', 'Seabra', Array[1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18]); -- Seabra 11 removed

insert into public.pecas (sap, descricao) values
('1001', 'Rolamento Principal'),
('1002', 'Sensor de Vibração'),
('1003', 'Placa de Potência'),
('1004', 'Cabo de Dados Blindado'),
('1005', 'Filtro de Óleo'),
('2001', 'Gerador de Energia'),
('2002', 'Pá Eólica (Fragmento)'),
('2003', 'Freio Hidráulico'),
('2004', 'Inversor de Frequência'),
('2005', 'Transformador de Corrente'),
('3001', 'Anemômetro'),
('3002', 'Biruta Digital'),
('3003', 'Controlador Lógico'),
('3004', 'Válvula Solenoide'),
('3005', 'Bomba de Arrefecimento');
