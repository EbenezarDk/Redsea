"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!bar.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0, transformOrigin: "0% 50%" },
        { scaleX: 1, duration: 0.45, ease: "power2.out" },
      );
      gsap.to(bar.current, {
        scaleX: 0,
        transformOrigin: "100% 50%",
        duration: 0.4,
        delay: 0.45,
        ease: "power2.in",
      });
    });
    return () => ctx.revert();
  }, [pathname, reduced]);

  return (
    <>
      <div
        ref={bar}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 origin-left scale-x-0 bg-rsi"
      />
      {children}
    </>
  );
}
