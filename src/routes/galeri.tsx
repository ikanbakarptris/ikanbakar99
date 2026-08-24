import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { reviewsQueryOptions } from "@/lib/reviews";
import { siteSettingsQueryOptions } from "@/lib/site-settings";
import { AnimateIn } from "@/components/AnimateIn";
import { Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { SocialLightbox } from "@/components/SocialLightbox";

export const Route = createFileRoute("/galeri")({
  component: GaleriPage,
});

function GaleriPage() {
  const { data: reviewsData = [] } = useQuery(reviewsQueryOptions);
  const { data: settings } = useQuery(siteSettingsQueryOptions);
  
  const galleryItems = reviewsData.filter(r => !!r.mediaUrl);
  const shopName = settings?.shop_name || "Ikanbakar99";

  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "center" }), 500);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="hover:opacity-80 transition-opacity min-w-0">
            <p className="truncate font-display text-xl font-bold tracking-tight text-foreground">{shopName}</p>
            <p className="truncate text-xs text-muted-foreground">Galeri Pelanggan</p>
          </Link>
          <Link to="/" className="text-sm font-semibold text-primary hover:underline">
            ← Kembali
          </Link>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <section className="bg-gradient-to-b from-primary/5 via-primary/5 to-background py-10 border-b border-border/50 relative overflow-hidden">
          <AnimateIn className="mx-auto max-w-5xl px-4 text-center relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl font-display text-foreground mb-4">
              Galeri Hidangan
            </h1>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto leading-relaxed">
              Jelajahi momen lezat yang dibagikan langsung oleh pelanggan kami. Bagikan foto favorit Anda ke teman atau keluarga!
            </p>
          </AnimateIn>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryItems.map((review, i) => {
              const isVideo = review.mediaUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i);
              const likeCount = review.name.length * 3 + 12;

              return (
                <AnimateIn key={review.id} delay={i < 6 ? i * 100 : 0} className="group h-full">
                  <div 
                    id={review.id} 
                    className="relative flex flex-col h-full overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer will-change-transform"
                    onClick={() => setSelectedPhoto(review)}
                  >
                    <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                      {isVideo ? (
                        <video src={review.mediaUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                      ) : (
                        <img src={review.mediaUrl} loading={i < 4 ? "eager" : "lazy"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center gap-3 font-semibold text-sm">
                          <span className="flex items-center gap-1 drop-shadow-md"><Heart className="size-4 fill-white" /> {likeCount}</span>
                          <span className="flex items-center gap-1 drop-shadow-md"><MessageCircle className="size-4 fill-white" /> 2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </main>

      {selectedPhoto && typeof document !== "undefined" && (
        <SocialLightbox 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} 
        />
      )}
    </div>
  );
}
