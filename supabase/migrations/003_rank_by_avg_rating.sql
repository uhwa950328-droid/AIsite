-- 순위(rank)를 평균 별점·리뷰 수 기준으로 재계산 (동점: id 오름차순)

create or replace function public.refresh_all_tool_ranks()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tools t
  set rank = s.new_rank
  from (
    select
      id,
      row_number() over (
        order by avg_rating desc, review_count desc, id asc
      )::int as new_rank
    from public.tools
  ) s
  where t.id = s.id;
end;
$$;

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

  perform public.refresh_all_tool_ranks();

  return coalesce(new, old);
end;
$$;

-- 기존 DB에도 즉시 반영
select public.refresh_all_tool_ranks();
