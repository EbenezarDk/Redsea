"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { lenisRef } from "@/lib/lenis";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";

function jumpToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  lenisRef.current?.scrollTo(0, { immediate: true, force: true });
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const initialLoad = useRef(true);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
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

    // Always open a fresh page load at the top.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    jumpToTop();

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
    const refresh = () => {
      jumpToTop();
      ScrollTrigger.refresh();
    };
    const frame = window.requestAnimationFrame(refresh);
    const timer = window.setTimeout(() => {
      jumpToTop();
      ScrollTrigger.refresh();
    }, 250);
    document.fonts?.ready.then(() => {
      jumpToTop();
      ScrollTrigger.refresh();
    }).catch(() => undefined);

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
    // First paint after a full load: stay at the top (already handled above).
    if (initialLoad.current) {
      initialLoad.current = false;
      jumpToTop();
      ScrollTrigger.refresh();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hash = window.location.hash;
    const timer = window.setTimeout(() => {
      if (hash) {
        const target = document.querySelector(hash);
        if (target instanceof HTMLElement) {
          if (lenisRef.current && !reduced) {
            lenisRef.current.scrollTo(target, { offset: -88 });
          } else {
            target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
          }
        }
      } else {
        jumpToTop();
      }
      ScrollTrigger.refresh();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
