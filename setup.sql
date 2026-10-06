-- PeopleGro Insights: database setup
-- Paste this whole script into Supabase > SQL Editor and click Run.
-- Safe to run more than once.

-- 1. Profiles table: one row per person, scores on the 50-point scale
create table if not exists public.iopt_profiles (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  first_name  text not null,
  last_name   text,
  team        text not null,
  rs          numeric(4,1) not null,
  lp          numeric(4,1) not null,
  ha          numeric(4,1) not null,
  ri          numeric(4,1) not null,
  dominant    text not null,
  secondary   text not null,
  pattern     text not null,
  report_date date,
  created_at  timestamptz not null default now()
);

-- 2. Row Level Security on
alter table public.iopt_profiles enable row level security;

-- 3. Helper: looks up the signed-in person's team by their login email
create or replace function public.my_iopt_team()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select team from public.iopt_profiles
  where lower(email) = lower(auth.jwt() ->> 'email')
  limit 1
$$;

-- 4. Access policy: a signed-in person can read every profile on their own team
--    (including their own). People with no profile row see nothing.
drop policy if exists "Users can read their own I-OPT profile" on public.iopt_profiles;
drop policy if exists "Team members can read their team's profiles" on public.iopt_profiles;
create policy "Team members can read their team's profiles"
  on public.iopt_profiles
  for select
  to authenticated
  using (team = public.my_iopt_team());

-- 5. Load the PeopleGro team
insert into public.iopt_profiles
  (email, first_name, last_name, team, rs, lp, ha, ri, dominant, secondary, pattern, report_date)
values
  ('nlemieux@peoplegro.com',        'Nicole',  'Lemieux',     'PeopleGro', 12.5,  4.0,  6.5, 27.0, 'RI', 'RS', 'Changer',     '2026-08-14'),
  ('ssienkiewicz@peoplegro.com',    'Steve',   'Sienkiewicz', 'PeopleGro',  6.0,  2.0, 23.0, 19.0, 'HA', 'RI', 'Perfector',   '2026-08-14'),
  ('vrever@peoplegro.com',          'Vincent', 'Rever',       'PeopleGro',  2.0, 20.5, 21.0,  6.5, 'HA', 'LP', 'Conservator', '2026-08-14'),
  ('ww@wendywarrington.com',        'Wendy',   'Warrington',  'PeopleGro',  4.0,  1.0,  6.0, 39.0, 'RI', 'HA', 'Perfector',   '2026-08-14'),
  ('fmurdock@fkmconsultingllc.com', 'Frank',   'Murdock',     'PeopleGro',  6.0, 14.5, 23.0,  6.5, 'HA', 'LP', 'Conservator', '2026-09-16')
on conflict (email) do update set
  first_name = excluded.first_name, last_name = excluded.last_name, team = excluded.team,
  rs = excluded.rs, lp = excluded.lp, ha = excluded.ha, ri = excluded.ri,
  dominant = excluded.dominant, secondary = excluded.secondary, pattern = excluded.pattern,
  report_date = excluded.report_date;
