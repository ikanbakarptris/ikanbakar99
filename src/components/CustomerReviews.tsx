import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import type { CustomerReview } from "@/lib/reviews";

/** 5-star graphic using inline SVG so it scales crisply and stays themed. */
function StarRating({ stars }: { stars: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Rating ${stars} dari 5 bintang`}
    >
      <svg width="0" height="0" className="hidden">
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>
      </svg>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`size-4 drop-shadow-sm transition-transform hover:scale-110 ${i < stars ? "" : "text-foreground/10"}`}
          fill={i < stars ? "url(#gold-gradient)" : "currentColor"}
        >
          <path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.8 5.9 20.5l1.5-6.8L2.2 9l6.9-.7L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/** "Google Local Guide" badge — shown only when the reviewer qualifies. */
function getRelativeTime(dateString?: string) {
  if (!dateString) return null;
  const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" });
  const daysDifference = Math.round(
    (new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysDifference > -1) return "Hari ini";
  if (daysDifference > -7) return rtf.format(daysDifference, "day");
  if (daysDifference > -30) return rtf.format(Math.round(daysDifference / 7), "week");
  if (daysDifference > -365) return rtf.format(Math.round(daysDifference / 30), "month");
  return rtf.format(Math.round(daysDifference / 365), "year");
}

function LocalGuideBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3" fill="currentColor">
        <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
      </svg>
      Google Local Guide
    </span>
  );
}

/** Single review card. Pure / presentational — easy to reuse or map over. */

/** Deterministic hash for SSR hydration safety (avoids React Error #418) */
function getHelpfulSeed(id?: string, name?: string): number {
  const str = (id || "") + (name || "review");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 12) + 3; // Deterministic count between 3 and 14
}

function ReviewCard({ review }: { review: CustomerReview }) {
  const [helpfulCount, setHelpfulCount] = useState(() => getHelpfulSeed(review.id, review.name));
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (hasVoted) return;
    setHelpfulCount((c) => c + 1);
    setHasVoted(true);
  };

  const handleShare = async () => {
    const text = `Lihat ulasan dari ${review.name} untuk Ikanbakar99: "${review.text}"`;
    const url = window.location.origin + "/ulasan";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ulasan Ikanbakar99",
          text: text,
          url: url,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Tautan ulasan disalin ke clipboard!");
    }
  };

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-4 shadow-lift hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 transition-all duration-300 will-change-transform">
      <div className="flex items-center justify-between gap-2">
        <StarRating stars={review.stars} />
        <div className="flex items-center gap-2">
          {review.isLocalGuide ? <LocalGuideBadge /> : null}
          {review.date ? (
            <span className="text-[11px] font-medium text-muted-foreground">
              <span suppressHydrationWarning>{getRelativeTime(review.date)}</span>
            </span>
          ) : null}
        </div>
      </div>

      <blockquote className="mt-3 grow text-sm leading-relaxed text-card-foreground">
        “{review.text}”
      </blockquote>

      {review.mediaUrl ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-border/50 bg-muted/20 flex-shrink-0">
          {review.mediaUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ||
          review.mediaUrl.includes(".mp4") ||
          review.mediaUrl.includes(".webm") ||
          review.mediaUrl.includes(".mov") ? (
            <video
              src={review.mediaUrl}
              controls
              className="w-full max-h-[300px] object-contain bg-black"
              preload="metadata"
            />
          ) : (
            <a
              href={review.reviewerUrl || review.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
              aria-label="Lihat foto ulasan asli"
            >
              <img
                src={review.mediaUrl}
                alt={"Foto hidangan ikan bakar oleh pelanggan " + review.name}
                width={400}
                height={300}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </a>
          )}
        </div>
      ) : null}
      <footer className="mt-3 flex min-w-0 items-center gap-3 border-t border-border/60 pt-3">
        <div
          className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/10 to-primary/30 font-display text-sm font-bold text-primary shadow-inner"
          aria-hidden="true"
        >
          {review.avatarUrl ? (
            <img
              src={review.avatarUrl}
              alt={review.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = "grid";
                }
              }}
            />
          ) : null}
          <div
            className="grid h-full w-full place-items-center"
            style={{ display: review.avatarUrl ? "none" : "grid" }}
          >
            {review.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="min-w-0">
          {review.reviewerUrl ? (
            <a
              href={review.reviewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm font-semibold text-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1"
            >
              {review.name}{" "}
              <span aria-hidden="true" className="text-[10px] opacity-70">
                ↗
              </span>
            </a>
          ) : (
            <p className="truncate text-sm font-semibold text-foreground">{review.name}</p>
          )}
          {review.role ? (
            <p className="truncate text-xs text-muted-foreground">{review.role}</p>
          ) : null}
        </div>
      </footer>
    </article>
  );
}

/** Skeleton card matching ReviewCard dimensions to avoid layout shift. */
function ReviewCardSkeleton() {
  return (
    <div
      className="flex h-full min-w-0 animate-pulse flex-col rounded-2xl border border-border bg-card p-4 shadow-lift"
      aria-hidden="true"
    >
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-4 grow space-y-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-[92%] rounded bg-muted" />
        <div className="h-3 w-[80%] rounded bg-muted" />
        <div className="h-3 w-[60%] rounded bg-muted" />
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-border/60 pt-3">
        <div className="size-9 shrink-0 rounded-full bg-muted" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-2.5 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export interface CustomerReviewsProps {
  /** Reviews to render. */
  reviews: CustomerReview[];
  /** True while reviews are being fetched — renders skeleton cards. */
  isLoading?: boolean;
  /** Optional heading override. */
  heading?: string;
  /** Optional subheading / description override. */
  description?: string;
  /** Media (carousel/gallery) rendered inside the same section, above the reviews. */
  media?: ReactNode;
  /** Limit the number of reviews displayed. */
  limit?: number;
  /** Show 'View All' button at the bottom if true. */
  showViewAll?: boolean;
}

/**
 * CMS-ready Customer Reviews section, fed by the database.
 *
 * Layout: horizontal scroll-snap cards on mobile (thumb-zone friendly),
 * responsive grid on md+ screens. Stays above the sticky mobile CTA
 * (the page adds bottom padding to clear it).
 */
export function CustomerReviews({
  reviews,
  isLoading = false,
  heading = "Galeri & ulasan pelanggan",
  description = "Dokumentasi masakan harian dan ulasan asli pelanggan di Puri Delta, Sidoarjo.",
  media,
  limit,
  showViewAll = false,
}: CustomerReviewsProps) {
  const [filterMediaOnly, setFilterMediaOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [starFilter, setStarFilter] = useState<number | null>(null);

  if (!isLoading && reviews.length === 0 && !media) return null;

  let filteredReviews = reviews.filter((r) => {
    if (filterMediaOnly && !r.mediaUrl) return false;
    if (starFilter && r.stars !== starFilter) return false;
    if (
      searchTerm &&
      !r.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });
  if (limit && limit > 0) {
    filteredReviews = filteredReviews.slice(0, limit);
  }

  return (
    <section aria-labelledby="reviews-heading" className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 id="reviews-heading" className="text-2xl font-bold md:text-3xl">
            {heading}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2 select-none bg-card border border-border px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors">
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={filterMediaOnly}
                onChange={(e) => setFilterMediaOnly(e.target.checked)}
              />
              <div className="w-8 h-4 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
            </div>
            <span>Hanya foto/video</span>
          </label>
        </div>
      </div>

      {media ? <div className="mt-5">{media}</div> : null}

      {/* Mobile: horizontal scroll-snap. Desktop: grid. */}
      <div
        className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 cursor-grab active:cursor-grabbing hide-scrollbar"
        role="list"
        aria-busy={isLoading}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                role="listitem"
                className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-auto"
              >
                <ReviewCardSkeleton />
              </div>
            ))
          : filteredReviews.map((review) => (
              <div
                key={review.id}
                role="listitem"
                className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-auto"
              >
                <ReviewCard review={review} />
              </div>
            ))}
      </div>

      {/* Mobile scroll hint */}
      <p className="mt-2 text-center text-xs text-muted-foreground md:hidden">
        Geser untuk lihat ulasan lainnya →
      </p>
    </section>
  );
}


