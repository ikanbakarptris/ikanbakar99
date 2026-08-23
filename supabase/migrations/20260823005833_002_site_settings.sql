-- Global site settings for Agung Bike Station (single-row config table).
-- Run this in your own Supabase project's SQL editor.

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT NOT NULL DEFAULT '62895382966573',
  maps_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/search/?api=1&query=Jl.+Bima+Panorama+Asri+blok+C22,+Bandungan',
  theme_color TEXT NOT NULL DEFAULT '#F59E0B',
  font_family TEXT NOT NULL DEFAULT 'Inter',
  carousel_images TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated can insert site settings" ON public.site_settings;
CREATE POLICY "Authenticated can insert site settings"
  ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update site settings" ON public.site_settings;
CREATE POLICY "Authenticated can update site settings"
  ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.site_settings (whatsapp_number, maps_url, theme_color, font_family, carousel_images)
SELECT '62895382966573',
       'https://www.google.com/maps/search/?api=1&query=Jl.+Bima+Panorama+Asri+blok+C22,+Bandungan',
       '#F59E0B', 'Inter', '{}'::text[]
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Reviews management (CRUD) for signed-in admins.
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;

DROP POLICY IF EXISTS "Authenticated can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated can insert reviews"
  ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update reviews" ON public.reviews;
CREATE POLICY "Authenticated can update reviews"
  ON public.reviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete reviews" ON public.reviews;
CREATE POLICY "Authenticated can delete reviews"
  ON public.reviews FOR DELETE TO authenticated USING (true);
