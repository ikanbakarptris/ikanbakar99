-- Extend site_settings to support a full CMS landing page

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS shop_name text DEFAULT 'Agung Bike Station',
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
ADD COLUMN IF NOT EXISTS address_title text DEFAULT 'Alamat bengkel',
ADD COLUMN IF NOT EXISTS cta_whatsapp_text text DEFAULT 'Konsultasi via WhatsApp',
ADD COLUMN IF NOT EXISTS cta_maps_text text DEFAULT 'Petunjuk Arah';
