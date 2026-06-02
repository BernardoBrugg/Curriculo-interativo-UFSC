"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [revealState, setRevealState] = useState<"visible" | "hidden">("visible");

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setRevealState("visible");
      return;
    }

    setRevealState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealState("visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${revealState === "hidden" ? "is-hidden" : "is-visible"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
