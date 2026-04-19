-- 툴 상단 히어로용 스크린샷 (nullable; 정적 경로 예: /screenshots/chatgpt.png)
alter table public.tools
  add column if not exists screenshot_src text;

comment on column public.tools.screenshot_src is 'Public URL path or absolute URL for tool hero screenshot';

-- 시드 스크린샷 경로(public/screenshots/*.png)
update public.tools set screenshot_src = '/screenshots/chatgpt.png' where id = 'chatgpt';
update public.tools set screenshot_src = '/screenshots/midjourney.png' where id = 'midjourney';
update public.tools set screenshot_src = '/screenshots/dall-e.png' where id = 'dall-e';
update public.tools set screenshot_src = '/screenshots/claude.png' where id = 'claude';
update public.tools set screenshot_src = '/screenshots/notion-ai.png' where id = 'notion-ai';
