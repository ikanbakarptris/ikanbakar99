import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles.current = [];
      const particleCount = Math.floor((width * height) / 12000);
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
          baseAlpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x -= dx * force * 0.03;
          p.y -= dy * force * 0.03;
          p.alpha = Math.min(p.baseAlpha + force * 0.5, 1);
        } else {
          p.alpha = Math.max(p.alpha - 0.02, p.baseAlpha);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 160, 180, ${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i];
          const p2 = particles.current[j];
          const dx = p1!.x - p2!.x;
          const dy = p1!.y - p2!.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1!.x, p1!.y);
            ctx.lineTo(p2!.x, p2!.y);
            const lineAlpha = (1 - dist / 100) * 0.15;
            ctx.strokeStyle = `rgba(150, 160, 180, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      if (isVisible) {
        animationFrameId.current = requestAnimationFrame(drawParticles);
      }
    };

    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    resize();

    // PERFORMANCE OPTIMIZATION: Intersection Observer to pause animation
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? false;
      if (isVisible) {
        drawParticles();
      } else if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    });
    observer.observe(canvas);

    // Initial draw if visible (or just start it)
    drawParticles();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] bg-gradient-to-br from-background via-background/95 to-muted/50 overflow-hidden">
      <div className="absolute -top-1/4 -right-1/4 w-[80vh] h-[80vh] rounded-full bg-primary/5 blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-[60vh] h-[60vh] rounded-full bg-primary/10 blur-3xl opacity-50 pointer-events-none"></div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-plus-lighter"
      />
    </div>
  );
}
