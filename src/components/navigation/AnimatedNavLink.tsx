"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type AnimatedNavLinkProps = {
  href: string;
  label: string;
  active?: boolean;
  /** dark = white underline; light = RSI red underline */
  tone?: "dark" | "light";
  className?: string;
  onNavigate?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function AnimatedNavLink({
  href,
  label,
  active = false,
  tone = "dark",
  className,
  onNavigate,
}: AnimatedNavLinkProps) {
  const primaryRef = useRef<HTMLSpanElement>(null);
  const secondaryRef = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    if (!primary || !secondary) return;

    gsap.set(primary, { yPercent: 0 });
    gsap.set(secondary, { yPercent: 100 });
  }, []);

  useEffect(() => {
    const line = underlineRef.current;
    if (!line) return;
    gsap.to(line, {
      scaleX: active ? 1 : 0,
      duration: reduced ? 0 : 0.35,
      ease: "power3.out",
      overwrite: true,
    });
  }, [active, reduced]);

  const resetReel = useCallback(() => {
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    if (!primary || !secondary) return;
    gsap.to(primary, {
      yPercent: 0,
      duration: reduced ? 0 : 0.5,
      ease: "power3.inOut",
      overwrite: true,
    });
    gsap.to(secondary, {
      yPercent: 100,
      duration: reduced ? 0 : 0.5,
      ease: "power3.inOut",
      overwrite: true,
    });
  }, [reduced]);

  const rollReel = useCallback(() => {
    if (reduced) return;
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    if (!primary || !secondary) return;
    gsap.to(primary, {
      yPercent: -100,
      duration: 0.52,
      ease: "power3.inOut",
      overwrite: true,
    });
    gsap.to(secondary, {
      yPercent: 0,
      duration: 0.52,
      ease: "power3.inOut",
      overwrite: true,
    });
  }, [reduced]);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={(event) => onNavigate?.(href, event)}
      onPointerEnter={rollReel}
      onPointerLeave={resetReel}
      onFocus={rollReel}
      onBlur={resetReel}
      className={cn(
        "group relative inline-flex items-center py-2 text-[0.8125rem] font-medium tracking-[0.01em] text-current",
        className,
      )}
    >
      <span className="relative block h-[1.05em] overflow-hidden leading-none">
        <span ref={primaryRef} className="block will-change-transform">
          {label}
        </span>
        <span
          ref={secondaryRef}
          aria-hidden
          className="absolute inset-x-0 top-0 block will-change-transform"
        >
          {label}
        </span>
      </span>
      <span
        ref={underlineRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-colors duration-300",
          tone === "light" ? "bg-rsi" : "bg-white",
        )}
      />
    </Link>
  );
}
