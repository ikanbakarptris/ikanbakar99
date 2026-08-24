import { useState, useRef } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Sebelum servis",
  afterAlt = "Sesudah servis",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    if (!touch) return;
    handleMove(touch.clientX);
  };

  return (
    <div
      className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl shadow-xl select-none group"
      ref={containerRef}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Base Layer) */}
      <img
        src={afterImage}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute bottom-4 right-4 bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm z-10 pointer-events-none">
        SESUDAH
      </div>

      {/* Before Image (Top Layer clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: "100%", height: "100%" }}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute bottom-4 left-4 bg-background/90 text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm z-10 pointer-events-none">
          SEBELUM
        </div>
      </div>

      {/* Slider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center group-hover:bg-primary transition-colors pointer-events-none"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)] flex items-center justify-center text-primary transition-transform group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M8 14V10H4v4h4zm8 0h4v-4h-4v4zM2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2 2 6.48 2 12zm18 0c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8 8 3.58 8 8z" />
          </svg>
        </div>
      </div>

      {/* Invisible range input for accessibility and fallback */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        aria-label="Geser untuk melihat perbandingan sebelum dan sesudah"
      />
    </div>
  );
}
