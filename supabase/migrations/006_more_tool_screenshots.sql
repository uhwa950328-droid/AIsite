-- public/screenshots/*.png 과 id가 맞는 툴에 히어로·목록 썸네일 경로 부여 (행이 없으면 영향 없음)

update public.tools set screenshot_src = '/screenshots/adobe-firefly.png' where id = 'adobe-firefly';
update public.tools set screenshot_src = '/screenshots/antigravity.png' where id = 'antigravity';
update public.tools set screenshot_src = '/screenshots/cursor.png' where id = 'cursor';
update public.tools set screenshot_src = '/screenshots/gemini.png' where id = 'gemini';
update public.tools set screenshot_src = '/screenshots/gemini-image.png' where id = 'gemini-image';
update public.tools set screenshot_src = '/screenshots/github-copilot.png' where id = 'github-copilot';
update public.tools set screenshot_src = '/screenshots/grammarly.png' where id = 'grammarly';
update public.tools set screenshot_src = '/screenshots/leonardo-ai.png' where id = 'leonardo-ai';
update public.tools set screenshot_src = '/screenshots/perplexity.png' where id = 'perplexity';
update public.tools set screenshot_src = '/screenshots/replit.png' where id = 'replit';
update public.tools set screenshot_src = '/screenshots/stable-diffusion.png' where id = 'stable-diffusion';
