/**
 * Customer reviews data + types.
 *
 * Data now lives in the `reviews` table and is fetched through the
 * public (anon-readable) client. The presentation layer stays unchanged.
 */

import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export interface CustomerReview {
  /** Stable id — maps to the DB row id. */
  id: string;
  /** Display name of the reviewer. */
  name: string;
  /** Star rating, 1–5. */
  stars: number;
  /** Verbatim review text. */
  text: string;
  /** Optional role / location label shown under the name. */
  role?: string;
  /** True when the reviewer is a Google "Local Guide". */
  isLocalGuide?: boolean;
  /** ISO date string of the review. */
  date?: string;
  mediaUrl?: string;
  avatarUrl?: string;
  reviewerUrl?: string;
  bikeType?: string;
  ownerReply?: string;
}

/**
 * Shown if the `reviews` table has not been created in the Supabase project
 * yet (run supabase/migrations/*.sql in the SQL editor). Keeps the landing
 * page's trust section populated instead of rendering an empty strip.
 */
const FALLBACK_REVIEWS: CustomerReview[] = [
  {
    id: "fallback-1",
    name: "Dewi Kurnia",
    stars: 5,
    text: "Lele bakarnya juara, bumbunya meresap dan sambal terasinya mantap. Sepuluh ribu dapat seporsi lengkap, worth it banget.",
    role: "Puri Delta",
    isLocalGuide: true,
  },
  {
    id: "fallback-2",
    name: "Andi Prasetyo",
    stars: 5,
    text: "Pesan gurameh bakar buat keluarga, ikannya besar dan matangnya pas. Diantar masih hangat, fast response di WhatsApp.",
    role: "Sidoarjo",
    isLocalGuide: false,
  },
  {
    id: "fallback-3",
    name: "Rina Ayu",
    stars: 5,
    text: "Nila bakarnya tidak amis sama sekali, sambal bawangnya pedas nagih. Sekarang jadi langganan tiap akhir pekan.",
    role: "Puri Delta",
    isLocalGuide: false,
  },
];

/** Fetches published reviews, oldest first. Public read (RLS allows anon SELECT). */
export async function fetchReviews(): Promise<CustomerReview[]> {
  const { data, error } = await (supabase as any)
    .from("reviews")
    .select(
      "id, reviewer_name, rating, review_text, reviewer_role, is_local_guide, media_url, reviewer_avatar_url, reviewer_url, sort_order, created_at",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[reviews] Supabase fetch failed, using fallback content:", error.message);
    return FALLBACK_REVIEWS;
  }

  if (!data || data.length === 0) return FALLBACK_REVIEWS;

  return (data as any[]).map((row: any) => ({
    id: row.id,
    name: row.reviewer_name,
    stars: row.rating,
    text: row.review_text,
    ...(row.reviewer_role ? { role: row.reviewer_role } : {}),
    isLocalGuide: row.is_local_guide,
    ...(row.media_url ? { mediaUrl: row.media_url } : {}),
    ...(row.reviewer_avatar_url ? { avatarUrl: row.reviewer_avatar_url } : {}),
    ...(row.reviewer_url ? { reviewerUrl: row.reviewer_url } : {}),
    ...(row.bike_type ? { bikeType: row.bike_type } : {}),
    ...(row.owner_reply ? { ownerReply: row.owner_reply } : {}),
    date: row.created_at,
  }));
}

export const reviewsQueryOptions = queryOptions({
  queryKey: ["reviews"],
  queryFn: fetchReviews,
  staleTime: 5 * 60_000,
});
