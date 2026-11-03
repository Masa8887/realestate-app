-- 物件テーブルの作成
-- Supabase ダッシュボードの SQL Editor に貼り付けて実行する

create table public.properties (
  id         bigint generated always as identity primary key,
  -- 登録したユーザー（未指定ならログイン中のユーザーが自動で入る）
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) > 0),   -- 物件名
  rent       integer not null check (rent >= 0),             -- 家賃（円）
  area       text not null check (char_length(area) > 0),   -- エリア名
  layout     text not null check (char_length(layout) > 0), -- 間取り（例：1LDK）
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ユーザーごとの絞り込みを速くするためのインデックス
create index properties_user_id_idx on public.properties (user_id);

-- 更新時に updated_at を自動で現在時刻にする
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ログイン済みユーザーに操作を許可する（実際に触れる行は下の RLS で制限する）
grant select, insert, update, delete on public.properties to authenticated;

-- RLS（行レベルセキュリティ）を有効にする
alter table public.properties enable row level security;

-- 自分が登録した物件のみ表示できる
create policy "自分の物件を表示できる"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 自分の物件としてのみ登録できる（他人の user_id では登録できない）
create policy "自分の物件を登録できる"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 自分が登録した物件のみ編集できる（所有者の付け替えも禁止）
create policy "自分の物件を編集できる"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 自分が登録した物件のみ削除できる
create policy "自分の物件を削除できる"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
