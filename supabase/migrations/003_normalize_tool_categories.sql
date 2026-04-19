-- Align legacy category labels with chip filters (생산성 / 이미지 / 영상 / 코딩)
update public.tools
set category = '생산성'
where category = '대화·생산성';
