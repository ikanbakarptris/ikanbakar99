import { useCallback, useEffect, useState } from "react";
import { SocialLightbox } from "@/components/SocialLightbox";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SLIDER_IMAGES } from "@/lib/shop-data";
import { Maximize2, X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { createPortal } from "react-dom";

export function WorkshopSlider({ images }: { images?: string[] }) {
  const slides = images && images.length > 0 ? images : SLIDER_IMAGES;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true }),
  ]);
  const [selected, setSelected] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, slides.length]);

  return (
    <>
      <div className="relative group">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {slides.map((src, i) => {
              const isVideo = src.match(/\.(mp4|webm|ogg)$/i);
              return (
                <div
                  key={`${src}-${i}`}
                  className="relative min-w-0 shrink-0 grow-0 basis-full pr-2 last:pr-0 md:basis-1/2 cursor-pointer group/slide"
                  onClick={() => setLightboxIndex(i)}
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
                    {isVideo ? (
                      <video
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full bg-muted object-cover transition-transform duration-700 group-hover/slide:scale-105"
                      />
                    ) : (
                      <img
                        src={src}
                        alt={`Dokumentasi dapur Ikan Bakar P. Tris ${i + 1}`}
                        loading={i === 0 ? "eager" : "lazy"}
                        className="w-full h-full bg-muted object-cover transition-transform duration-700 group-hover/slide:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover/slide:bg-black/10 transition-colors duration-300" />
                    <button
                      className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover/slide:translate-y-0 shadow-lg"
                      aria-label="Tampilkan layar penuh"
                    >
                      <Maximize2 className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((src, i) => (
            <button
              key={`dot-${src}-${i}`}
              type="button"
              aria-label={`Ke slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === selected ? "w-5 bg-primary" : "w-1.5 bg-foreground/25"
              }`}
            />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && typeof document !== "undefined" && (
        <SocialLightbox 
          photo={{
            id: `gallery-slider-${lightboxIndex}`,
            mediaUrl: slides[lightboxIndex],
            name: "Dokumentasi Galeri",
            stars: 5,
            text: "Cuplikan hidangan spesial dari dapur Ikan Bakar P. Tris."
          }}
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </>
  );
}


