-- Edit/delete own reviews via token stored out of band (not on reviews row → Realtime INSERT payload stays safe).
-- Direct INSERT on reviews is revoked for anon; use insert_review RPC.

create table if not exists public.review_edit_secrets (
  review_id uuid primary key references public.reviews (id) on delete cascade,
  edit_token uuid not null
);

create index if not exists review_edit_secrets_token_idx
  on public.review_edit_secrets (edit_token);

alter table public.review_edit_secrets enable row level security;

create or replace function public.insert_review(
  p_tool_id text,
  p_nickname text,
  p_rating smallint,
  p_body text,
  p_edit_token uuid
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  rid uuid;
begin
  if p_tool_id is null or length(trim(p_tool_id)) = 0 then
    raise exception 'invalid tool_id';
  end if;
  if not (char_length(trim(p_nickname)) between 1 and 40) then
    raise exception 'invalid nickname';
  end if;
  if not (char_length(trim(p_body)) between 1 and 500) then
    raise exception 'invalid body';
  end if;
  if not (p_rating between 1 and 5) then
    raise exception 'invalid rating';
  end if;
  if p_edit_token is null then
    raise exception 'invalid token';
  end if;

  insert into public.reviews (tool_id, nickname, rating, body)
  values (p_tool_id, trim(p_nickname), p_rating, trim(p_body))
  returning id into rid;

  insert into public.review_edit_secrets (review_id, edit_token)
  values (rid, p_edit_token);

  return rid;
end;
$$;

create or replace function public.update_review_by_token(
  p_review_id uuid,
  p_edit_token uuid,
  p_nickname text,
  p_rating smallint,
  p_body text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  if p_review_id is null or p_edit_token is null then
    return false;
  end if;
  if not (char_length(trim(p_nickname)) between 1 and 40) then
    return false;
  end if;
  if not (char_length(trim(p_body)) between 1 and 500) then
    return false;
  end if;
  if not (p_rating between 1 and 5) then
    return false;
  end if;

  update public.reviews r
  set
    nickname = trim(p_nickname),
    rating = p_rating,
    body = trim(p_body)
  from public.review_edit_secrets s
  where r.id = p_review_id
    and r.id = s.review_id
    and s.edit_token = p_edit_token;

  get diagnostics n = row_count;
  return n = 1;
end;
$$;

create or replace function public.delete_review_by_token(
  p_review_id uuid,
  p_edit_token uuid
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  if p_review_id is null or p_edit_token is null then
    return false;
  end if;

  delete from public.reviews r
  using public.review_edit_secrets s
  where r.id = p_review_id
    and r.id = s.review_id
    and s.edit_token = p_edit_token;

  get diagnostics n = row_count;
  return n = 1;
end;
$$;

revoke all on function public.insert_review(text, text, smallint, text, uuid) from public;
grant execute on function public.insert_review(text, text, smallint, text, uuid) to anon, authenticated;

revoke all on function public.update_review_by_token(uuid, uuid, text, smallint, text) from public;
grant execute on function public.update_review_by_token(uuid, uuid, text, smallint, text) to anon, authenticated;

revoke all on function public.delete_review_by_token(uuid, uuid) from public;
grant execute on function public.delete_review_by_token(uuid, uuid) to anon, authenticated;

revoke insert on table public.reviews from anon, authenticated;
