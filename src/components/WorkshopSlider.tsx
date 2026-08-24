import { useCallback, useEffect, useState } from "react";
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

      {lightboxIndex !== null && (
        <Lightbox 
          slides={slides} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </>
  );
}

function Lightbox({ slides, initialIndex, onClose }: { slides: string[], initialIndex: number, onClose: () => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: initialIndex }, [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      emblaApi.plugins()?.autoplay?.stop();
      setIsPlaying(false);
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      emblaApi.plugins()?.autoplay?.stop();
      setIsPlaying(false);
    }
  }, [emblaApi]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, scrollPrev, scrollNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute top-0 inset-x-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-white/90 text-sm font-semibold px-2 tracking-wider">
          {selected + 1} / {slides.length}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleAutoplay}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
            title={isPlaying ? "Jeda (Pause)" : "Putar (Play)"}
          >
            {isPlaying ? <Pause className="size-5 fill-white" /> : <Play className="size-5 fill-white" />}
          </button>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
            aria-label="Tutup galeri"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="w-full h-full overflow-hidden flex items-center" ref={emblaRef}>
        <div className="flex touch-pan-y h-full items-center">
          {slides.map((src, i) => {
            const isVideo = src.match(/\.(mp4|webm|ogg)$/i);
            return (
              <div key={i} className="relative min-w-0 shrink-0 grow-0 basis-full flex items-center justify-center h-full p-2 md:p-12">
                {isVideo ? (
                  <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="max-w-full max-h-full rounded-xl object-contain drop-shadow-2xl"
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Galeri layar penuh ${i + 1}`}
                    className="max-w-full max-h-[85vh] rounded-xl object-contain drop-shadow-2xl"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={scrollPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all shadow-lg hidden sm:block"
        aria-label="Sebelumnya"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button 
        onClick={scrollNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all shadow-lg hidden sm:block"
        aria-label="Selanjutnya"
      >
        <ChevronRight className="size-6" />
      </button>
      
      <div className="absolute bottom-8 inset-x-0 flex justify-center z-50 pointer-events-none">
        <div className="px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-xs font-medium flex items-center gap-2 shadow-xl animate-bounce">
          <span>Geser untuk melihat lainnya</span>
          <div className="flex gap-0.5 items-center opacity-70">
            <ChevronLeft className="size-3" />
            <ChevronRight className="size-3" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
