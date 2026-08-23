ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS social_facebook text,
ADD COLUMN IF NOT EXISTS social_instagram text,
ADD COLUMN IF NOT EXISTS social_tiktok text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS active_template text DEFAULT 'modern',
ADD COLUMN IF NOT EXISTS advanced_json_ld text,
ADD COLUMN IF NOT EXISTS advanced_css text,
ADD COLUMN IF NOT EXISTS advanced_head_scripts text;

-- Also pastikan schema cache postgrest langsung refresh
NOTIFY pgrst, 'reload schema';
