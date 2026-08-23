CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 5,
  review_text TEXT NOT NULL,
  reviewer_role TEXT,
  is_local_guide BOOLEAN NOT NULL DEFAULT false,
  media_url TEXT,
  reviewer_avatar_url TEXT,
  reviewer_url TEXT,
  bike_type TEXT,
  owner_reply TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update reviews" ON public.reviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (true);

CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT NOT NULL DEFAULT '6282227459399',
  maps_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/search/?api=1&query=Ikan+Bakar+P.+Tris+Puri+Delta+Sidoarjo',
  theme_color TEXT NOT NULL DEFAULT '#DC2626',
  font_family TEXT NOT NULL DEFAULT 'Inter',
  carousel_images TEXT[] NOT NULL DEFAULT '{}',
  shop_name TEXT NOT NULL DEFAULT 'Ikan Bakar P. Tris',
  shop_address TEXT NOT NULL DEFAULT 'Perumahan Puri Delta Sidoarjo',
  shop_hours TEXT NOT NULL DEFAULT 'Setiap hari - 10.00-21.00 WIB',
  shop_rating NUMERIC NOT NULL DEFAULT 4.9,
  shop_reviews_count INTEGER NOT NULL DEFAULT 87,
  hero_badge TEXT NOT NULL DEFAULT 'Puri Delta & sekitarnya',
  hero_title TEXT NOT NULL DEFAULT 'Ikan bakar bumbu meresap, dibakar dadakan begitu pesanan masuk.',
  hero_desc_1 TEXT NOT NULL DEFAULT 'Ikan segar pilihan, dibumbui sejak dini hari, lalu dibakar di atas bara sampai wangi dan tidak amis.',
  hero_desc_2 TEXT NOT NULL DEFAULT 'Pesan lewat WhatsApp, kami antar hangat ke rumah Anda di area Puri Delta dan sekitarnya. Lengkap dengan sambal terasi atau sambal bawang.',
  hero_image TEXT,
  hero_stats JSONB NOT NULL DEFAULT '[{"value":"Rp 10rb","label":"mulai dari"},{"value":"30 menit","label":"siap diantar"},{"value":"Gratis","label":"antar area Puri Delta"}]'::jsonb,
  services JSONB NOT NULL DEFAULT '[
    {"title":"Lele Bakar","desc":"Menu Boom. Lele segar bumbu rempah, dibakar garing di luar lembut di dalam. Gratis sambal pilihan.","price":"Rp 10.000","icon":"\u0001"},
    {"title":"Ayam Bule Bakar","desc":"Ayam empuk dengan bumbu bakar manis gurih, cocok untuk yang tidak makan ikan.","price":"Rp 10.000","icon":"\u0001"},
    {"title":"Nila Bakar","desc":"Nila ukuran besar, daging tebal dan bumbu meresap sampai ke tulang.","price":"Rp 17.000","icon":"\u0001"},
    {"title":"Gurameh Bakar","desc":"Menu spesial untuk keluarga. Gurameh pilihan dibakar utuh, porsi puas untuk 2-3 orang.","price":"Rp 30.000","icon":"\u0001"},
    {"title":"Sambal Terasi & Sambal Bawang","desc":"Sambal ulek dadakan, bisa pilih terasi atau bawang. Pedasnya bisa diatur sesuai selera.","price":"Gratis tiap porsi","icon":"\u0001"}
  ]'::jsonb,
  header_subtitle TEXT NOT NULL DEFAULT 'Rumah makan ikan bakar - Puri Delta',
  services_title TEXT NOT NULL DEFAULT 'Menu kami',
  services_subtitle TEXT NOT NULL DEFAULT 'Harga jujur, porsi mengenyangkan, dibakar setelah pesanan masuk.',
  trust_rating_text TEXT NOT NULL DEFAULT 'ulasan pelanggan',
  trust_pickup_title TEXT NOT NULL DEFAULT 'Antar & Ambil Sendiri',
  trust_pickup_desc TEXT NOT NULL DEFAULT 'Gratis ongkir untuk area Perumahan Puri Delta. Di luar itu ada tambahan ongkir ringan. Bisa juga ambil sendiri ke rumah makan.',
  address_title TEXT NOT NULL DEFAULT 'Alamat rumah makan',
  cta_whatsapp_text TEXT NOT NULL DEFAULT 'Pesan via WhatsApp',
  cta_maps_text TEXT NOT NULL DEFAULT 'Petunjuk Arah',
  social_facebook TEXT,
  social_instagram TEXT,
  social_tiktok TEXT,
  contact_email TEXT,
  active_template TEXT DEFAULT 'modern',
  advanced_json_ld TEXT,
  advanced_css TEXT,
  advanced_head_scripts TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.site_settings DEFAULT VALUES;

INSERT INTO public.reviews (reviewer_name, rating, review_text, reviewer_role, is_local_guide, sort_order) VALUES
('Dewi Kurnia', 5, 'Lele bakarnya juara, bumbunya meresap dan sambal terasinya mantap. Sepuluh ribu dapat seporsi lengkap, worth it banget.', 'Puri Delta', true, 1),
('Andi Prasetyo', 5, 'Pesan gurameh bakar buat keluarga, ikannya besar dan matangnya pas. Diantar masih hangat, fast response di WhatsApp.', 'Sidoarjo', false, 2),
('Rina Ayu', 5, 'Nila bakarnya tidak amis sama sekali, sambal bawangnya pedas nagih. Sekarang jadi langganan tiap akhir pekan.', 'Puri Delta', false, 3),
('Bagus Setiawan', 5, 'Ayam bule bakarnya empuk, anak-anak suka. Pelayanan ramah dan pesanan datang tepat waktu.', 'Buduran', false, 4);