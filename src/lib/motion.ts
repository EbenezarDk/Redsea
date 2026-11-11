"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisRef } from "@/lib/lenis";

let registered = false;

export const DESKTOP_MOTION =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function registerMotion() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export function scrollToProgress(trigger: ScrollTrigger | null, progress: number) {
  if (!trigger) return false;
  const clamped = Math.min(1, Math.max(0, progress));
  const y = trigger.start + clamped * (trigger.end - trigger.start);
  if (lenisRef.current) {
    lenisRef.current.scrollTo(y);
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
  return true;
}

/** Scrubbed image wipe across equal story segments. Returns the readable active index. */
export function applyWipe(progress: number, panels: HTMLElement[]) {
  const count = panels.length;
  if (!count) return 0;
  const scaled = Math.min(count - 0.0001, Math.max(0, progress) * count);
  const base = Math.floor(scaled);
  const frac = scaled - base;

  panels.forEach((panel, index) => {
    if (index < base) {
      gsap.set(panel, { autoAlpha: 0, zIndex: index });
    } else if (index === base) {
      gsap.set(panel, {
        autoAlpha: 1,
        zIndex: index,
        clipPath: "inset(0% 0% 0% 0%)",
      });
    } else if (index === base + 1) {
      gsap.set(panel, {
        autoAlpha: 1,
        zIndex: index + 1,
        clipPath: `inset(0% ${(1 - frac) * 100}% 0% 0%)`,
      });
    } else {
      gsap.set(panel, {
        autoAlpha: 0,
        zIndex: index,
        clipPath: "inset(0% 100% 0% 0%)",
      });
    }
  });

  if (frac > 0.55 && base < count - 1) return base + 1;
  return base;
}

export { gsap, ScrollTrigger };
