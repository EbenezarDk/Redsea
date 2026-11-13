"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type InViewRevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay before the reveal starts once in view (ms). */
  delay?: number;
  /** When false, content is shown immediately (useful for above-the-fold). */
  enabled?: boolean;
};

/**
 * Lightweight viewport enter: fades and rises content once, then stays.
 * Respects prefers-reduced-motion.
 */
export function InViewReveal({
  children,
  className,
  delay = 0,
  enabled = true,
}: InViewRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);
  const visible = !enabled || reduced || inView;

  useEffect(() => {
    if (!enabled || reduced) return;

    const node = ref.current;
    if (!node) return;

    let timer = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        if (delay > 0) {
          timer = window.setTimeout(() => setInView(true), delay);
        } else {
          setInView(true);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [delay, enabled, reduced]);

  return (
    <div ref={ref} className={cn("reveal-on-view", visible && "is-inview", className)}>
      {children}
    </div>
  );
}
