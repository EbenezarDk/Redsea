"use client";

import { useLayoutEffect, useRef } from "react";
import {
  Blocks,
  Building2,
  Handshake,
  Settings2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/motion";

const ICONS: Record<string, LucideIcon> = {
  modular: Blocks,
  "facilities-ops": Settings2,
  mep: Wrench,
  "real-estate-dev": Building2,
  "investment-partnerships": Handshake,
};

const HOVER_DURATION = 0.35;
const HOVER_EASE = "power3.out";

export function InteractiveServiceIcon({
  id,
  className,
}: {
  id: string;
  active?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);
  const Icon = ICONS[id] ?? Blocks;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const card = el.closest(".group");
    if (!(card instanceof HTMLElement)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(el, { y: 0, scale: 1, transformOrigin: "center center" });

    const playIn = () => {
      tweenRef.current?.kill();
      if (reduced) {
        gsap.set(el, { y: -4, scale: 1.05 });
        return;
      }
      tweenRef.current = gsap.to(el, {
        y: -4,
        scale: 1.05,
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
        overwrite: "auto",
      });
    };

    const playOut = () => {
      tweenRef.current?.kill();
      if (reduced) {
        gsap.set(el, { y: 0, scale: 1 });
        return;
      }
      tweenRef.current = gsap.to(el, {
        y: 0,
        scale: 1,
        duration: HOVER_DURATION,
        ease: HOVER_EASE,
        overwrite: "auto",
      });
    };

    card.addEventListener("pointerenter", playIn);
    card.addEventListener("pointerleave", playOut);
    card.addEventListener("focusin", playIn);
    card.addEventListener("focusout", playOut);

    return () => {
      tweenRef.current?.kill();
      card.removeEventListener("pointerenter", playIn);
      card.removeEventListener("pointerleave", playOut);
      card.removeEventListener("focusin", playIn);
      card.removeEventListener("focusout", playOut);
    };
  }, []);

  return (
    <span
      ref={root}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center overflow-visible will-change-transform",
        className,
      )}
      aria-hidden
    >
      <Icon
        strokeWidth={1.75}
        aria-hidden
        className="size-6 text-[#777777] transition-colors duration-[350ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:text-white group-focus-visible:text-white md:size-[26px] lg:size-7"
      />
    </span>
  );
}
