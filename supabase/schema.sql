-- ============================================================
-- Love Tickets — schema do Supabase
-- Rode este script no SQL Editor do seu projeto Supabase.
-- Idempotente: seguro de rodar de novo (usa IF NOT EXISTS / DROP antes de CREATE).
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.tickets (
  id           uuid primary key default gen_random_uuid(),
  codigo       text not null unique,
  titulo       text not null,
  descricao    text,
  imagem       text,
  -- tema define qual "mundo" a página pública do ticket vai mostrar
  tema         text not null default 'generico',
  status       text not null default 'disponivel' check (status in ('disponivel', 'utilizado')),
  utilizado_em timestamptz,
  created_at   timestamptz not null default now(),
  -- dono do ticket: preenchido automaticamente com auth.uid() na criação.
  -- só esse usuário pode editar, excluir ou mudar o status deste ticket.
  user_id      uuid references auth.users(id) on delete cascade
);

-- Caso a tabela já existisse sem a coluna user_id, adiciona agora.
alter table public.tickets add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists tickets_codigo_idx on public.tickets (codigo);
create index if not exists tickets_user_id_idx on public.tickets (user_id);

-- Row Level Security -------------------------------------------------------
alter table public.tickets enable row level security;

-- Remove políticas antigas (de versões anteriores deste schema), se existirem.
drop policy if exists "tickets_select_public" on public.tickets;
drop policy if exists "tickets_insert_public" on public.tickets;
drop policy if exists "tickets_update_public" on public.tickets;
drop policy if exists "tickets_delete_public" on public.tickets;
drop policy if exists "tickets_insert_auth" on public.tickets;
drop policy if exists "tickets_update_auth" on public.tickets;
drop policy if exists "tickets_delete_auth" on public.tickets;
drop policy if exists "tickets_select_own_or_public_page" on public.tickets;
drop policy if exists "tickets_insert_owner" on public.tickets;
drop policy if exists "tickets_update_owner" on public.tickets;
drop policy if exists "tickets_delete_owner" on public.tickets;

-- SELECT: qualquer pessoa pode ler um ticket (necessário pra página pública
-- /ticket/[codigo] funcionar tanto pra quem não tem conta quanto pra outro
-- usuário autenticado que não seja o dono — ambos só podem VER, nunca alterar).
create policy "tickets_select_public"
  on public.tickets for select
  using (true);

-- INSERT: só usuário autenticado pode criar, e só em nome dele mesmo
-- (user_id enviado tem que ser igual ao auth.uid() de quem está logado).
create policy "tickets_insert_owner"
  on public.tickets for insert
  to authenticated
  with check (auth.uid() = user_id);

-- UPDATE: só o dono do ticket pode editar, mudar status, etc.
create policy "tickets_update_owner"
  on public.tickets for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: só o dono do ticket pode excluir.
create policy "tickets_delete_owner"
  on public.tickets for delete
  to authenticated
  using (auth.uid() = user_id);

-- Storage --------------------------------------------------------------
-- Bucket público para as imagens de capa (precisa ser público pra imagem
-- aparecer na página do ticket, que é visível a qualquer pessoa).
insert into storage.buckets (id, name, public)
values ('tickets', 'tickets', true)
on conflict (id) do nothing;

drop policy if exists "tickets_bucket_read" on storage.objects;
drop policy if exists "tickets_bucket_write" on storage.objects;
drop policy if exists "tickets_bucket_update" on storage.objects;
drop policy if exists "tickets_bucket_delete" on storage.objects;

create policy "tickets_bucket_read"
  on storage.objects for select
  using (bucket_id = 'tickets');

create policy "tickets_bucket_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tickets');

create policy "tickets_bucket_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'tickets');

create policy "tickets_bucket_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'tickets');
