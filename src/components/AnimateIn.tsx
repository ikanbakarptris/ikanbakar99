import { useEffect, useRef, useState, type ReactNode } from "react";

export function AnimateIn({ children, className = "", delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        if (delay > 0) {
          setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(true);
        }
        observer.disconnect();
      }
    }, { rootMargin: "0px 0px -50px 0px" });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`}
    >
      {children}
    </div>
  );
}
