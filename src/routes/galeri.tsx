import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { reviewsQueryOptions } from "@/lib/reviews";
import { siteSettingsQueryOptions } from "@/lib/site-settings";
import { AnimateIn } from "@/components/AnimateIn";
import { Share2, MessageCircle, MapPin } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/galeri")({
  component: GaleriPage,
  head: () => ({
    meta: [
      {
        title: "Galeri & Momen Pelanggan — Ikan Bakar P. Tris",
      },
      {
        name: "description",
        content: "Lihat momen kebersamaan dan hidangan lezat kami melalui jepretan pelanggan.",
      },
    ],
  }),
});

function GaleriPage() {
  const { data: reviewsData = [] } = useQuery(reviewsQueryOptions);
  const { data: settings } = useQuery(siteSettingsQueryOptions);
  
  // Only reviews that have media
  const galleryItems = reviewsData.filter(r => !!r.mediaUrl);

  const shopName = settings?.shop_name || "Ikanbakar99";

  // Share functionality
  const handleShare = async (review: any) => {
    const url = new URL(window.location.href);
    url.hash = review.id;
    const shareUrl = url.toString();
    const shareText = `Lihat ulasan ${review.name} untuk menu Ikan Bakar P. Tris! 🐟🔥`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Galeri Ikan Bakar P. Tris",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Gagal membagikan:", err);
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast.success("Tautan berhasil disalin ke clipboard!");
    }
  };

  // Scroll to hash on load
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <p className="truncate font-display text-xl font-bold tracking-tight text-foreground">
                {shopName}
              </p>
              <p className="truncate text-xs text-muted-foreground">Galeri Pelanggan</p>
            </Link>
          </div>
          <div>
            <Link to="/" className="text-sm font-semibold text-primary hover:underline">
              ← Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <section className="bg-gradient-to-b from-primary/5 via-primary/5 to-background py-12 border-b border-border/50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <AnimateIn className="mx-auto max-w-5xl px-4 text-center relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl font-display text-foreground mb-4">
              Galeri Hidangan
            </h1>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto leading-relaxed">
              Jelajahi momen lezat yang dibagikan langsung oleh pelanggan kami. Bagikan foto favorit Anda ke teman atau keluarga!
            </p>
          </AnimateIn>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="flex flex-col gap-12">
            {galleryItems.map((review, i) => {
              const isVideo = review.mediaUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) || 
                              review.mediaUrl.includes(".mp4") || 
                              review.mediaUrl.includes(".webm") || 
                              review.mediaUrl.includes(".mov");

              return (
                <AnimateIn key={review.id} delay={i < 3 ? i * 150 : 0}>
                  <div 
                    id={review.id} 
                    className="group relative flex flex-col overflow-hidden rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-2xl transition-all duration-300 ease-out will-change-transform scroll-mt-24"
                  >
                    {/* Image/Video section: Full width, visually distinct */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] bg-muted/30 overflow-hidden">
                      {isVideo ? (
                        <video
                          src={review.mediaUrl}
                          controls
                          className="w-full h-full object-contain bg-black"
                          preload="metadata"
                        />
                      ) : (
                        <a href={review.mediaUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={review.mediaUrl}
                            alt={`Foto hidangan oleh ${review.name}`}
                            loading={i < 2 ? "eager" : "lazy"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </a>
                      )}
                    </div>
                    
                    {/* Review text section below the image */}
                    <div className="flex flex-col gap-4 p-6 md:p-8 bg-card/80 backdrop-blur-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col">
                          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                            {review.name}
                            <span className="text-gold text-sm tracking-widest" aria-hidden="true">
                              {Array.from({ length: review.stars || 5 }).map(() => "★").join("")}
                            </span>
                          </h3>
                        </div>
                        <button 
                          onClick={() => handleShare(review)}
                          className="flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm shrink-0"
                          title="Bagikan foto ini"
                          aria-label="Bagikan foto"
                        >
                          <Share2 className="size-5" />
                        </button>
                      </div>
                      
                      <div className="relative">
                        <MessageCircle className="absolute -left-1 -top-1 size-8 text-primary/10 -z-10" />
                        <p className="text-muted-foreground leading-relaxed italic z-10 relative">
                          "{review.text}"
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}

            {galleryItems.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                Belum ada foto galeri yang diunggah pelanggan.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
