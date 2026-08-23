ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS media_url TEXT;
NOTIFY pgrst, 'reload schema';
