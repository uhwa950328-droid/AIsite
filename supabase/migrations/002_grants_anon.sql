-- API(anon 키)로 SELECT/INSERT 가 막혀 있을 때 보강
-- SQL Editor에서 한 번 실행 (001 이후)

grant usage on schema public to anon, authenticated;

grant select on table public.tools to anon, authenticated;
grant select, insert on table public.reviews to anon, authenticated;
