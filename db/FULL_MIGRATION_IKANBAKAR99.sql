-- Global site settings for Agung Bike Station (single-row config table).
-- Run this in your own Supabase project's SQL editor.

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT NOT NULL DEFAULT '6282227459399',
  maps_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/search/?api=1&query=Puri+Delta,+Ungaran+Timur',
  theme_color TEXT NOT NULL DEFAULT '#DC2626',
  font_family TEXT NOT NULL DEFAULT 'Inter',
  carousel_images TEXT[] NOT NULL DEFAULT ARRAY['https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1627308595229-7830b5c91f15?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1598511726623-d34fb0d0bc6c?auto=format&fit=crop&q=80&w=800'],
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
SELECT '6282227459399',
       'https://www.google.com/maps/search/?api=1&query=Puri+Delta,+Ungaran+Timur',
       '#DC2626', 'Inter', ARRAY['https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1627308595229-7830b5c91f15?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1598511726623-d34fb0d0bc6c?auto=format&fit=crop&q=80&w=800']::text[]
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
-- Media hosting moves to Vercel (project prj_oETTvWqge0llrDluPUDQA7ILTpWI).
-- Store the base URL so the admin can enter plain file names in the CMS.

alter table public.site_settings
  add column if not exists media_base_url text
  default 'https://agung-bike-media.vercel.app';

update public.site_settings
set media_base_url = coalesce(media_base_url, 'https://agung-bike-media.vercel.app');
-- Extend site_settings to support a full CMS landing page

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS shop_name text DEFAULT 'Ikanbakar99',
ADD COLUMN IF NOT EXISTS shop_address text DEFAULT 'Jl. Bima Panorama Asri blok C22, Bandungan',
ADD COLUMN IF NOT EXISTS shop_hours text DEFAULT 'Senin–Minggu — 08.00–20.00 WIB',
ADD COLUMN IF NOT EXISTS shop_rating numeric DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS shop_reviews_count integer DEFAULT 130,
ADD COLUMN IF NOT EXISTS hero_badge text DEFAULT 'Bandungan & sekitarnya',
ADD COLUMN IF NOT EXISTS hero_title text DEFAULT 'Rem blong di turunan bukan soal sial — itu soal servis asal-asalan.',
ADD COLUMN IF NOT EXISTS hero_desc_1 text DEFAULT 'Rantai loncat, velg goyang, gigi susah masuk. Dibiarkan seminggu, biaya perbaikan bisa berlipat — dan risikonya kamu bawa ke jalan menurun Bandungan.',
ADD COLUMN IF NOT EXISTS hero_desc_2 text DEFAULT 'Di Agung Bike Station, setiap sepeda diperiksa menyeluruh, dikerjakan dengan alat ukur yang benar, dan kondisinya dilaporkan sebelum dieksekusi. Bisa antar-jemput.',
ADD COLUMN IF NOT EXISTS hero_image text,
ADD COLUMN IF NOT EXISTS hero_stats jsonb DEFAULT '[{"value":"5.0", "label":"130 ulasan"}, {"value":"1 hari", "label":"servis ringan"}, {"value":"Gratis", "label":"antar-jemput*"}]'::jsonb,
ADD COLUMN IF NOT EXISTS services jsonb DEFAULT '[
  {
    "title": "Servis Ringan",
    "desc": "Setel rem, oper gigi, pelumasan rantai, dan cek tekanan ban. Sepeda enteng lagi dalam hitungan jam.",
    "price": "Mulai Rp 50.000",
    "icon": "🔧"
  },
  {
    "title": "Setel Velg / Jari-jari",
    "desc": "Velg peyang atau jari-jari kendor kami setel presisi pakai truing stand, bukan kira-kira.",
    "price": "Mulai Rp 75.000",
    "icon": "⚙️"
  }
]'::jsonb,
ADD COLUMN IF NOT EXISTS header_subtitle text DEFAULT 'Bengkel sepeda · Bandungan',
ADD COLUMN IF NOT EXISTS services_title text DEFAULT 'Layanan kami',
ADD COLUMN IF NOT EXISTS services_subtitle text DEFAULT 'Harga transparan, dikonfirmasi dulu sebelum dikerjakan.',
ADD COLUMN IF NOT EXISTS trust_rating_text text DEFAULT 'ulasan pelanggan',
ADD COLUMN IF NOT EXISTS trust_pickup_title text DEFAULT 'Pickup & Drop-off',
ADD COLUMN IF NOT EXISTS trust_pickup_desc text DEFAULT 'Sepeda kami jemput di rumah kamu dan diantar kembali setelah selesai. Gratis untuk radius 5 km dari bengkel, di luar itu ada biaya ringan.',
ADD COLUMN IF NOT EXISTS address_title text DEFAULT 'Alamat Warung',
ADD COLUMN IF NOT EXISTS cta_whatsapp_text text DEFAULT 'Konsultasi via WhatsApp',
ADD COLUMN IF NOT EXISTS cta_maps_text text DEFAULT 'Petunjuk Arah';
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS media_url TEXT;
NOTIFY pgrst, 'reload schema';
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewer_avatar_url TEXT;
NOTIFY pgrst, 'reload schema';
-- Migration to add sort_order to reviews
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Optional: set initial sort_order to reflect current created_at order
-- But DEFAULT 0 is fine, they can reorder in UI.

