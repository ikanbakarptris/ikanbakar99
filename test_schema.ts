import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://aaaafvtvofunzelublak.supabase.co";
const SUPABASE_KEY = "sb_publishable_ckYtrYIVvHQXzG_12UushA_7ADMdQu7";

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: { fetch: createSupabaseFetch(SUPABASE_KEY) },
});

async function run() {
  const { data: fetchRes, error: fetchErr } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  if (fetchErr) {
    console.error("Fetch Error:", fetchErr);
    return;
  }
  
  const columnsToCheck = [
    "whatsapp_number", "maps_url", "theme_color", "font_family", "carousel_images",
    "shop_name", "shop_address", "shop_hours", "shop_rating", "shop_reviews_count",
    "hero_badge", "hero_title", "hero_desc_1", "hero_desc_2", "hero_image", "hero_stats",
    "services", "header_subtitle", "services_title", "services_subtitle",
    "trust_rating_text", "trust_pickup_title", "trust_pickup_desc", "address_title",
    "cta_whatsapp_text", "cta_maps_text"
  ];

  const actualColumns = Object.keys(fetchRes || {});
  const missing = columnsToCheck.filter(c => !actualColumns.includes(c));
  console.log("Missing columns:", missing);
}

run();
