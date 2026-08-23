import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SLIDER_IMAGES } from "@/lib/shop-data";

export function WorkshopSlider({ images }: { images?: string[] }) {
  const slides = images && images.length > 0 ? images : SLIDER_IMAGES;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selected, setSelected] = useState(0);

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
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((src, i) => {
            const isVideo = src.match(/\.(mp4|webm|ogg)$/i);
            return (
              <div
                key={`${src}-${i}`}
                className="min-w-0 shrink-0 grow-0 basis-full pr-2 last:pr-0 md:basis-1/2"
              >
                {isVideo ? (
                  <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="aspect-4/3 w-full rounded-2xl bg-muted object-cover"
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Dokumentasi dapur Ikanbakar99 ${i + 1}`}
                    width={800}
                    height={600}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="aspect-4/3 w-full rounded-2xl bg-muted object-cover"
                  />
                )}
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
  );
}
