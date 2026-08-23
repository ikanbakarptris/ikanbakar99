ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewer_avatar_url TEXT;
NOTIFY pgrst, 'reload schema';
