-- AI Rank: tools + reviews, RLS, realtime, stats trigger
-- Run in Supabase SQL Editor (or supabase db push) once per project.

create table if not exists public.tools (
  id text primary key,
  name text not null,
  tagline text not null,
  description text not null,
  category text not null,
  rank int not null,
  avg_rating numeric(4, 2) not null default 0,
  review_count int not null default 0
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  tool_id text not null references public.tools (id) on delete cascade,
  nickname text not null,
  rating smallint not null,
  body text not null,
  created_at timestamptz not null default now(),
  constraint reviews_rating_range check (rating >= 1 and rating <= 5),
  constraint reviews_nickname_len check (char_length(trim(nickname)) between 1 and 40),
  constraint reviews_body_len check (char_length(trim(body)) between 1 and 500)
);

create index if not exists reviews_tool_id_created_at_idx
  on public.reviews (tool_id, created_at desc);

alter table public.tools enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "tools_select_anon" on public.tools;
create policy "tools_select_anon" on public.tools
  for select to anon, authenticated using (true);

drop policy if exists "reviews_select_anon" on public.reviews;
create policy "reviews_select_anon" on public.reviews
  for select to anon, authenticated using (true);

drop policy if exists "reviews_insert_anon" on public.reviews;
create policy "reviews_insert_anon" on public.reviews
  for insert to anon, authenticated
  with check (
    char_length(trim(nickname)) between 1 and 40
    and char_length(trim(body)) between 1 and 500
    and rating between 1 and 5
  );

-- Realtime: new rows broadcast to subscribers
alter publication supabase_realtime add table public.reviews;

-- Keep tools.avg_rating / review_count in sync
create or replace function public.refresh_tool_review_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  tid text;
begin
  tid := coalesce(new.tool_id, old.tool_id);
  update public.tools
  set
    review_count = coalesce(
      (select count(*)::int from public.reviews r where r.tool_id = tid),
      0
    ),
    avg_rating = coalesce(
      (select round(avg(rating::numeric), 2) from public.reviews r where r.tool_id = tid),
      0
    )
  where id = tid;
  return coalesce(new, old);
end;
$$;

drop trigger if exists tr_reviews_stats on public.reviews;
create trigger tr_reviews_stats
  after insert or delete or update on public.reviews
  for each row
  execute function public.refresh_tool_review_stats();

-- Seed tools (ids must match src/data/tools.ts)
insert into public.tools (id, name, tagline, description, category, rank, avg_rating, review_count) values
  (
    'chatgpt',
    'ChatGPT',
    '대화형 AI의 기준',
    'OpenAI의 GPT 기반 챗봇으로, 코딩·글쓰기·요약·번역 등 다양한 작업을 자연어로 처리할 수 있습니다. 플러그인과 맞춤 GPT로 워크플로를 확장할 수 있습니다.',
    '대화·생산성',
    1,
    4.80,
    0
  ),
  (
    'midjourney',
    'Midjourney',
    '디스코드 기반 이미지 생성',
    '텍스트 프롬프트만으로 고품질 일러스트·컨셉 아트를 생성합니다. Discord 봇으로 동작하며, 스타일과 구도를 세밀하게 조정할 수 있습니다.',
    '이미지',
    2,
    4.70,
    0
  ),
  (
    'dall-e',
    'DALL·E',
    'OpenAI 이미지 생성',
    'ChatGPT와 통합된 이미지 생성 모델로, 자연어 설명에서 독창적인 이미지를 만듭니다. 편집·변형 기능으로 반복 작업에 유리합니다.',
    '이미지',
    3,
    4.50,
    0
  ),
  (
    'claude',
    'Claude',
    '긴 문맥에 강한 AI',
    'Anthropic의 AI 어시스턴트로, 긴 문서 분석·코드 리뷰·안전한 답변에 강점이 있습니다. 아티팩트로 코드·문서 미리보기가 가능합니다.',
    '대화·생산성',
    4,
    4.60,
    0
  ),
  (
    'notion-ai',
    'Notion AI',
    '노트 안에서 바로',
    'Notion 워크스페이스에 내장된 AI로, 페이지 요약·초안 작성·번역·표 정리 등을 문맥 안에서 바로 수행할 수 있습니다.',
    '생산성',
    5,
    4.30,
    0
  )
on conflict (id) do nothing;
