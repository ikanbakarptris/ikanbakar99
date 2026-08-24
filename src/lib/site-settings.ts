/**
 * Global site settings (single-row config table `site_settings`).
 *
 * The generated Supabase types are managed elsewhere and do not yet include
 * this table, so queries go through a deliberately loose client handle while
 * the app-facing shape stays strictly typed below.
 */

import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_MEDIA_BASE_URL } from "@/lib/media";

export interface SiteSettings {
  id: string;
  whatsapp_number: string;
  maps_url: string;
  theme_color: string;
  font_family: string;
  carousel_images: string[];
  shop_name: string;
  shop_address: string;
  shop_hours: string;
  shop_rating: number;
  shop_reviews_count: number;
  hero_badge: string;
  hero_title: string;
  hero_desc_1: string;
  hero_desc_2: string;
  hero_image?: string | null;
  hero_stats: { value: string; label: string }[];
  services: { title: string; desc: string; price: string; icon: string }[];
  header_subtitle: string;
  services_title: string;
  services_subtitle: string;
  trust_rating_text: string;
  trust_pickup_title: string;
  trust_pickup_desc: string;
  address_title: string;
  cta_whatsapp_text: string;
  cta_maps_text: string;
  social_facebook?: string | null;
  social_instagram?: string | null;
  social_tiktok?: string | null;
  contact_email?: string | null;
  active_template?: string | null;
  advanced_json_ld?: string | null;
  advanced_css?: string | null;
  advanced_head_scripts?: string | null;
  kuesioner_promo_image?: string | null;
  updated_at?: string;
}

export type SiteSettingsInput = Omit<SiteSettings, "id" | "updated_at">;

export const DEFAULT_SETTINGS: SiteSettingsInput = {
  whatsapp_number: "6282227459399",
  maps_url:
    "https://www.google.com/maps/search/?api=1&query=Ikan+Bakar+P.+Tris+Puri+Delta+Sidoarjo",
  theme_color: "#DC2626",
  font_family: "Inter",
  carousel_images: [],
  shop_name: "Ikan Bakar P. Tris",
  shop_address: "Perumahan Puri Delta Sidoarjo",
  shop_hours: "Setiap hari - 10.00-21.00 WIB",
  shop_rating: 4.9,
  shop_reviews_count: 87,
  hero_badge: "Puri Delta & sekitarnya",
  hero_title: "Ikan bakar bumbu meresap, dibakar dadakan begitu pesanan masuk.",
  hero_desc_1:
    "Ikan segar pilihan, dibumbui sejak dini hari, lalu dibakar di atas bara sampai wangi dan tidak amis.",
  hero_desc_2:
    "Pesan lewat WhatsApp, kami antar hangat ke rumah Anda di area Puri Delta dan sekitarnya. Lengkap dengan sambal terasi atau sambal bawang.",
  hero_image: null,
  hero_stats: [
    { value: "Rp 10rb", label: "mulai dari" },
    { value: "30 menit", label: "siap diantar" },
    { value: "Gratis", label: "antar area Puri Delta" },
  ],
  services: [
    {
      title: "Lele Bakar",
      desc: "Menu Boom. Lele segar bumbu rempah, dibakar garing di luar lembut di dalam. Gratis sambal pilihan.",
      price: "Rp 10.000",
      icon: "🐟",
    },
    {
      title: "Ayam Bule Bakar",
      desc: "Ayam empuk dengan bumbu bakar manis gurih, cocok untuk yang tidak makan ikan.",
      price: "Rp 10.000",
      icon: "🍗",
    },
    {
      title: "Nila Bakar",
      desc: "Nila ukuran besar, daging tebal dan bumbu meresap sampai ke tulang.",
      price: "Rp 17.000",
      icon: "🐟",
    },
    {
      title: "Gurameh Bakar",
      desc: "Menu spesial untuk keluarga. Gurameh pilihan dibakar utuh, porsi puas untuk 2-3 orang.",
      price: "Rp 30.000",
      icon: "🐡",
    },
    {
      title: "Sambal Terasi & Sambal Bawang",
      desc: "Sambal ulek dadakan, bisa pilih terasi atau bawang. Pedasnya bisa diatur sesuai selera.",
      price: "Gratis tiap porsi",
      icon: "🌶️",
    },
  ],
  header_subtitle: "Rumah makan ikan bakar · Puri Delta",
  services_title: "Menu Spesial Kami",
  services_subtitle: "Bumbu meresap sempurna, dibakar mendadak setelah pesanan masuk.",
  trust_rating_text: "ulasan pelanggan",
  trust_pickup_title: "Antar & Ambil Sendiri",
  trust_pickup_desc:
    "Gratis ongkir untuk area Perumahan Puri Delta. Di luar itu ada tambahan ongkir ringan. Bisa juga ambil sendiri ke rumah makan.",
  address_title: "Alamat rumah makan",
  cta_whatsapp_text: "Pesan via WhatsApp",
  cta_maps_text: "Petunjuk Arah",
  social_facebook: null,
  social_instagram: null,
  social_tiktok: null,
  contact_email: null,
  active_template: "modern",
  kuesioner_promo_image: null,
};

/** Untyped table handle — `site_settings` is absent from the generated types. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = () => (supabase as any).from("site_settings");

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await table()
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("[site-settings] fetch failed:", error.message);
    return null;
  }
  return (data as SiteSettings | null) ?? null;
}

export async function saveSiteSettings(
  id: string | null,
  values: SiteSettingsInput,
): Promise<SiteSettings> {
  // Hard-strip deprecated fields that might be stuck in browser cache / React Query
  const { media_base_url, ...safeValues } = values as any;
  const payload = { ...safeValues, updated_at: new Date().toISOString() };

  const query = id
    ? table().update(payload).eq("id", id).select().single()
    : table().insert(payload).select().single();

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as SiteSettings;
}

export const siteSettingsQueryOptions = queryOptions({
  queryKey: ["site-settings"],
  queryFn: fetchSiteSettings,
  staleTime: 60_000,
});
