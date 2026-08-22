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
    name: "Sofia",
    stars: 5,
    text: "Service excellent..sepeda bs diambl dirumah (area ungaran) dan diantar lagi kl sdh seleaai service. pengerjaan sangat cepat dan baik.",
    isLocalGuide: true,
  },
  {
    id: "fallback-2",
    name: "Sofian Hadi",
    stars: 5,
    text: "Solutif, biaya terjangkau sesuai pekerjaan, part yg masih bisa dibenerin gak perlu asal ganti. Hasil maksimal. Bahkan kalau dekat beliau mau anterin sepedanya ke rumah.",
    role: "Fiandigital",
    isLocalGuide: false,
  },
  {
    id: "fallback-3",
    name: "Titik Suryani",
    stars: 5,
    text: "Alhamdulillah fast respon banget & biayanya juga bisa dibilang murah banget. Itu rumahku di Dampu, tapi bapaknya mau dateng. Pelayanannya juga ramah banget.",
    isLocalGuide: true,
  },
];

/** Fetches published reviews, oldest first. Public read (RLS allows anon SELECT). */
export async function fetchReviews(): Promise<CustomerReview[]> {
  const { data, error } = await (supabase as any)
    .from("reviews")
    .select("id, reviewer_name, rating, review_text, reviewer_role, is_local_guide, media_url, reviewer_avatar_url, reviewer_url, bike_type, owner_reply, sort_order, created_at")
    .order("sort_order", { ascending: true }).order("created_at", { ascending: false });

  if (error) {
    console.warn("[reviews] Supabase fetch failed, using fallback content:", error.message);
    return FALLBACK_REVIEWS;
  }

  if (!data || data.length === 0) return FALLBACK_REVIEWS;

  return data.map((row) => ({
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
