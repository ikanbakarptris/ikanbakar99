UPDATE public.site_settings
SET
  shop_name = 'Ikan Bakar P. Tris',
  shop_address = 'Puri Delta, Ungaran Timur, Semarang',
  whatsapp_number = '6282227459399',
  hero_badge = 'Spesialis Ikan & Ayam Bakar',
  hero_title = 'Sajian Ikan Bakar Lezat & Praktis untuk Keluarga Anda',
  hero_desc_1 = 'Nikmati lele bakar, nila, ayam bule, dan gurameh dengan bumbu meresap khas P. Tris.',
  hero_desc_2 = 'Pesan antar area Puri Delta, Ungaran Timur, Ungaran Barat.',
  hero_image = 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=800',
  hero_stats = '[
     {"label": "Rating", "value": "4.9/5"},
     {"label": "Pesanan Sukses", "value": "100+"},
     {"label": "Gratis Ongkir", "value": "Puri Delta"}
  ]'::jsonb,
  header_subtitle = 'Rumah makan ikan bakar di Ungaran',
  services_title = 'Menu Spesial Kami',
  services_subtitle = 'Bumbu meresap sempurna, dibakar mendadak setelah pesanan masuk.',
  trust_pickup_title = 'Layanan Pesan Antar',
  trust_pickup_desc = 'Layanan pesan antar untuk area Puri Delta dan sekitarnya. Mudah, praktis, langsung sampai depan rumah.',
  trust_rating_text = 'ulasan pelanggan',
  services = '[
    {"title": "Lele Bakar", "desc": "Lele segar bumbu rempah, dibakar garing. Gratis sambal.", "price": "Rp 10.000", "icon": "??"},
    {"title": "Ayam Bule Bakar", "desc": "Ayam empuk dengan bumbu bakar manis gurih.", "price": "Rp 10.000", "icon": "??"},
    {"title": "Nila Bakar", "desc": "Nila ukuran besar, daging tebal bumbu meresap.", "price": "Rp 17.000", "icon": "??"},
    {"title": "Gurameh Bakar", "desc": "Menu keluarga. Gurameh dibakar utuh, porsi untuk 2-3 orang.", "price": "Rp 30.000", "icon": "?"}
  ]'::jsonb,
  carousel_images = ARRAY[
    'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1627308595229-7830b5c91f15?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1598511726623-d34fb0d0bc6c?auto=format&fit=crop&q=80&w=800'
  ]::text[]
WHERE id IS NOT NULL;
