-- Media hosting moves to Vercel (project prj_oETTvWqge0llrDluPUDQA7ILTpWI).
-- Store the base URL so the admin can enter plain file names in the CMS.

alter table public.site_settings
  add column if not exists media_base_url text
  default 'https://agung-bike-media.vercel.app';

update public.site_settings
set media_base_url = coalesce(media_base_url, 'https://agung-bike-media.vercel.app');
