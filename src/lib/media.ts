/**
 * Media helpers.
 *
 * Workshop photos are hosted on Vercel (project `prj_oETTvWqge0llrDluPUDQA7ILTpWI`).
 * The admin can store either full URLs or plain file paths; plain paths are
 * resolved against the configured Vercel base URL.
 */

/** Default Vercel deployment that serves the workshop media files. */
export const DEFAULT_MEDIA_BASE_URL = "https://agung-bike-media.vercel.app";

/** Vercel project that hosts the media (for reference in the admin UI). */
export const VERCEL_PROJECT_ID = "prj_oETTvWqge0llrDluPUDQA7ILTpWI";

export function resolveMediaUrl(value: string, baseUrl?: string): string {
  const v = (value ?? "").trim();
  if (!v) return "";
  if (/^(https?:)?\/\//i.test(v) || v.startsWith("data:")) return v;

  const base = (baseUrl?.trim() || DEFAULT_MEDIA_BASE_URL).replace(/\/+$/, "");
  return `${base}/${v.replace(/^\/+/, "")}`;
}

export function resolveMediaUrls(values: string[], baseUrl?: string): string[] {
  return (values ?? []).map((v) => resolveMediaUrl(v, baseUrl)).filter(Boolean);
}
