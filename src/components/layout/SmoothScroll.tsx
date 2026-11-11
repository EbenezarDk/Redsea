"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { lenisRef } from "@/lib/lenis";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    registerMotion();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;

    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    if (!reduced && fine && !saveData) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (event: MouseEvent) => {
      if (!lenisRef.current) return;
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.getAttribute("target") === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!(target instanceof HTMLElement)) return;
      event.preventDefault();
      lenisRef.current.scrollTo(target, { offset: -88 });
      window.history.pushState(null, "", `${url.pathname}${url.hash}`);
    };

    document.addEventListener("click", onClick);
    const refresh = () => ScrollTrigger.refresh();
    const frame = window.requestAnimationFrame(refresh);
    const timer = window.setTimeout(refresh, 250);
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      document.removeEventListener("click", onClick);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      if (ticker) gsap.ticker.remove(ticker);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!(target instanceof HTMLElement)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      if (lenisRef.current && !reduced) {
        lenisRef.current.scrollTo(target, { offset: -88 });
      } else {
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
      ScrollTrigger.refresh();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
