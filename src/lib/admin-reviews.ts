/** Admin CRUD helpers for the public `reviews` table. */

import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export interface ReviewRow {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  reviewer_role: string | null;
  is_local_guide: boolean;
  media_url?: string | null;
  reviewer_avatar_url?: string | null;
  reviewer_url?: string | null;
  bike_type?: string | null;
  sort_order?: number;
  owner_reply?: string | null;
  created_at: string;
}

export type ReviewInput = Omit<ReviewRow, "id" | "created_at">;

export const EMPTY_REVIEW: ReviewInput = {
  reviewer_name: "",
  rating: 5,
  review_text: "",
  reviewer_role: "",
  is_local_guide: false,
  media_url: null,
  reviewer_avatar_url: null,
  reviewer_url: null,
  bike_type: null,
  sort_order: 0,
  owner_reply: null,
};

const COLUMNS = "id, reviewer_name, rating, review_text, reviewer_role, is_local_guide, media_url, reviewer_avatar_url, reviewer_url, bike_type, owner_reply, sort_order, created_at";

export async function listReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(COLUMNS)
    .order("sort_order", { ascending: true }).order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ReviewRow[];
}

export async function createReview(input: ReviewInput): Promise<void> {
  const { error } = await supabase.from("reviews").insert({
    ...input,
    reviewer_role: input.reviewer_role?.trim() ? input.reviewer_role.trim() : null,
  });
  if (error) throw new Error(error.message);
}

export async function updateReview(id: string, input: ReviewInput): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .update({
      ...input,
      reviewer_role: input.reviewer_role?.trim() ? input.reviewer_role.trim() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export const adminReviewsQueryOptions = queryOptions({
  queryKey: ["admin", "reviews"],
  queryFn: listReviews,
});

export async function updateReviewSortOrder(id: string, sort_order: number): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .update({ sort_order })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
