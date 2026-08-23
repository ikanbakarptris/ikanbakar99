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
  updated_at?: string;
}

export type SiteSettingsInput = Omit<SiteSettings, "id" | "updated_at">;

export const DEFAULT_SETTINGS: SiteSettingsInput = {
  whatsapp_number: "62895382966573",
  maps_url:
    "https://www.google.com/maps/search/?api=1&query=Jl.+Bima+Panorama+Asri+blok+C22,+Ungaran",
  theme_color: "#F59E0B",
  font_family: "Inter",
  carousel_images: [],
  shop_name: "Ikanbakar99",
  shop_address: "Jl. Bima Panorama Asri blok C22, Ungaran",
  shop_hours: "Senin-Minggu - 08.00-20.00 WIB",
  shop_rating: 5.0,
  shop_reviews_count: 130,
  hero_badge: "Ungaran & sekitarnya",
  hero_title: "Rem blong di turunan bukan soal sial - itu soal servis asal-asalan.",
  hero_desc_1: "Rantai loncat, velg goyang, gigi susah masuk. Dibiarkan seminggu, biaya perbaikan bisa berlipat - dan risikonya kamu bawa ke jalan menurun Ungaran.",
  hero_desc_2: "Di Ikanbakar99, setiap pesanan diperiksa menyeluruh, dikerjakan dengan alat ukur yang benar, dan kondisinya dilaporkan sebelum dieksekusi. Bisa antar-jemput.",
  hero_image: null,
  hero_stats: [
    { value: "5.0", label: "130 ulasan" },
    { value: "1 hari", label: "servis ringan" },
    { value: "Gratis", label: "antar-jemput*" }
  ],
  services: [
    {
      title: "Servis Ringan",
      desc: "Setel rem, oper gigi, pelumasan rantai, dan cek tekanan ban. pesanan enteng lagi dalam hitungan jam.",
      price: "Mulai Rp 50.000",
      icon: "🔧"
    },
    {
      title: "Setel Velg / Jari-jari",
      desc: "Velg peyang atau jari-jari kendor kami setel presisi pakai truing stand, bukan kira-kira.",
      price: "Mulai Rp 75.000",
      icon: "⚙️"
    }
  ],
  header_subtitle: "Ikan Bakar · Ungaran",
  services_title: "Layanan kami",
  services_subtitle: "Harga transparan, dikonfirmasi dulu sebelum dikerjakan.",
  trust_rating_text: "ulasan pelanggan",
  trust_pickup_title: "Pickup & Drop-off",
  trust_pickup_desc: "pesanan kami jemput di rumah kamu dan diantar kembali setelah selesai. Gratis untuk radius 5 km dari dapur, di luar itu ada biaya ringan.",
  address_title: "Alamat dapur",
  cta_whatsapp_text: "Konsultasi via WhatsApp",
  cta_maps_text: "Petunjuk Arah",
  social_facebook: "https://facebook.com/ikanbakar99",
  social_instagram: "https://instagram.com/ikanbakar99",
  social_tiktok: "https://tiktok.com/@ikanbakar99",
  contact_email: "info@hkebike.com",
  active_template: "modern"
};

/** Untyped table handle — `site_settings` is absent from the generated types. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = () => (supabase as any).from("site_settings");

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await table()
    .select("*")
    .order('updated_at', { ascending: false }).limit(1)
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
