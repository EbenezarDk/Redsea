"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TransitionContextValue = {
  navigate: (href: string) => void;
  isTransitioning: boolean;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  return useContext(TransitionContext);
}

function normalizePath(href: string) {
  const path = href.split("#")[0] || "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path || "/";
}

function isCinematicPair(from: string, to: string) {
  const a = normalizePath(from);
  const b = normalizePath(to);
  const home = a === "/";
  const businesses = a.startsWith("/businesses");
  const toHome = b === "/";
  const toBusinesses = b.startsWith("/businesses");
  return (home && toBusinesses) || (businesses && toHome);
}

function getContent() {
  return document.getElementById("content");
}

function clearContentStyles() {
  const content = getContent();
  if (!content) return;
  gsap.set(content, { clearProps: "opacity,transform,visibility" });
  content.style.opacity = "";
  content.style.visibility = "";
  content.style.transform = "";
}

/**
 * Home ↔ Businesses must hard-navigate. Soft App Router swaps leave Lenis/GSAP
 * pin-spacers and #content opacity/transform in a broken state on large/2K screens
 * (black page until reload, crushed sections, white gaps).
 */
function hardNavigate(href: string) {
  window.location.assign(href);
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const lockRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const revealContent = useCallback(() => {
    clearContentStyles();
    lockRef.current = false;
    setIsTransitioning(false);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  // Always ensure #content is visible after route paints (soft nav + hydration).
  useEffect(() => {
    clearContentStyles();
    lockRef.current = false;
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  // Failsafe if something locks the shell mid-transition.
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = window.setTimeout(() => {
      revealContent();
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [isTransitioning, revealContent]);

  const navigate = useCallback(
    (href: string) => {
      const targetPath = normalizePath(href);
      const current = normalizePath(pathname);

      if (lockRef.current) return;

      if (targetPath === current) {
        if (href.includes("#")) {
          const id = href.split("#")[1];
          const el = id ? document.getElementById(id) : null;
          el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
        }
        return;
      }

      if (isCinematicPair(current, targetPath)) {
        lockRef.current = true;
        setIsTransitioning(true);
        hardNavigate(href);
        return;
      }

      router.push(href);
    },
    [pathname, reduced, router],
  );

  const value = useMemo(
    () => ({ navigate, isTransitioning }),
    [navigate, isTransitioning],
  );

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}
