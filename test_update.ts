import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://aaaafvtvofunzelublak.supabase.co";
const SUPABASE_KEY = "sb_publishable_ckYtrYIVvHQXzG_12UushA_7ADMdQu7";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }
    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: { fetch: createSupabaseFetch(SUPABASE_KEY) },
});

async function run() {
  // 1. Fetch current row
  const { data: fetchRes, error: fetchErr } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  if (fetchErr) {
    console.error("Fetch Error:", fetchErr);
    return;
  }
  
  if (!fetchRes) {
    console.log("No row found.");
    return;
  }
  
  console.log("Fetched row id:", fetchRes.id);
  
  const DEFAULT_SETTINGS = {
  whatsapp_number: "62895382966573",
  maps_url:
    "https://www.google.com/maps/search/?api=1&query=Jl.+Bima+Panorama+Asri+blok+C22,+Bandungan",
  theme_color: "#F59E0B",
  font_family: "Inter",
  carousel_images: [],
  shop_name: "Agung Bike Station",
  shop_address: "Jl. Bima Panorama Asri blok C22, Bandungan",
  shop_hours: "Senin-Minggu - 08.00-20.00 WIB",
  shop_rating: 5.0,
  shop_reviews_count: 130,
  hero_badge: "Bandungan & sekitarnya",
  hero_title: "Rem blong di turunan bukan soal sial - itu soal servis asal-asalan.",
  hero_desc_1: "Rantai loncat, velg goyang, gigi susah masuk. Dibiarkan seminggu, biaya perbaikan bisa berlipat - dan risikonya kamu bawa ke jalan menurun Bandungan.",
  hero_desc_2: "Di Agung Bike Station, setiap sepeda diperiksa menyeluruh, dikerjakan dengan alat ukur yang benar, dan kondisinya dilaporkan sebelum dieksekusi. Bisa antar-jemput.",
  hero_image: null,
  hero_stats: [
    { value: "5.0", label: "130 ulasan" },
    { value: "1 hari", label: "servis ringan" },
    { value: "Gratis", label: "antar-jemput*" }
  ],
  services: [
    {
      title: "Servis Ringan",
      desc: "Setel rem, oper gigi, pelumasan rantai, dan cek tekanan ban. Sepeda enteng lagi dalam hitungan jam.",
      price: "Mulai Rp 50.000",
      icon: "🛠️"
    }
  ],
  header_subtitle: "Bengkel sepeda - Bandungan",
  services_title: "Layanan kami",
  services_subtitle: "Harga transparan, dikonfirmasi dulu sebelum dikerjakan.",
  trust_rating_text: "ulasan pelanggan",
  trust_pickup_title: "Pickup & Drop-off",
  trust_pickup_desc: "Sepeda kami jemput di rumah kamu dan diantar kembali setelah selesai. Gratis untuk radius 5 km dari bengkel, di luar itu ada biaya ringan.",
  address_title: "Alamat bengkel",
  cta_whatsapp_text: "Konsultasi via WhatsApp",
  cta_maps_text: "Petunjuk Arah"
};

  const payload = { ...DEFAULT_SETTINGS, updated_at: new Date().toISOString() };
  
  // 2. Try to update using default settings
  const { error: updateErr } = await supabase.from('site_settings').update(payload).eq('id', fetchRes.id);
  
  if (updateErr) {
    console.error("Update Error:", updateErr);
  } else {
    console.log("Update Success!");
  }
}

run();
