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
import { gsap } from "@/lib/motion";
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

const CLIP_CLOSED = "inset(0 0 100% 0)";
const CLIP_OPEN = "inset(0 0 0 0)";
const CLIP_EXIT = "inset(100% 0 0 0)";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const pendingPath = useRef<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const playEnter = useCallback(() => {
    const overlay = overlayRef.current;
    const content = getContent();
    if (!overlay) return;

    if (reduced) {
      gsap.set(overlay, {
        autoAlpha: 0,
        clipPath: CLIP_CLOSED,
        pointerEvents: "none",
      });
      if (content) gsap.set(content, { clearProps: "opacity,transform" });
      lockRef.current = false;
      pendingPath.current = null;
      setIsTransitioning(false);
      return;
    }

    const heading = content?.querySelector<HTMLElement>("h1");
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        lockRef.current = false;
        pendingPath.current = null;
        setIsTransitioning(false);
        gsap.set(overlay, { pointerEvents: "none", autoAlpha: 0, clipPath: CLIP_CLOSED });
      },
    });

    gsap.set(overlay, { autoAlpha: 1, clipPath: CLIP_OPEN, pointerEvents: "auto" });
    if (content) gsap.set(content, { opacity: 0, y: 0 });
    if (heading) gsap.set(heading, { opacity: 0, y: 45 });

    tl.to(overlay, {
      clipPath: CLIP_EXIT,
      duration: 0.55,
      ease: "power3.inOut",
    }).set(overlay, { autoAlpha: 0, clipPath: CLIP_CLOSED });

    if (content) {
      tl.to(
        content,
        {
          opacity: 1,
          duration: 0.4,
        },
        "-=0.15",
      );
    }

    if (heading) {
      tl.to(
        heading,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
        },
        "-=0.35",
      );
    }
  }, [reduced]);

  useEffect(() => {
    if (!pendingPath.current) return;
    if (normalizePath(pathname) !== normalizePath(pendingPath.current)) return;
    // Wait a frame so the new route content is mounted.
    const frame = window.requestAnimationFrame(() => playEnter());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, playEnter]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.set(overlay, {
      autoAlpha: 0,
      clipPath: CLIP_CLOSED,
      pointerEvents: "none",
    });
  }, []);

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

      if (!isCinematicPair(current, targetPath) || reduced) {
        router.push(href);
        return;
      }

      const overlay = overlayRef.current;
      const content = getContent();
      if (!overlay || !content) {
        router.push(href);
        return;
      }

      lockRef.current = true;
      pendingPath.current = targetPath;
      setIsTransitioning(true);

      gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          router.push(href);
        },
      })
        .to(content, {
          opacity: 0,
          y: -35,
          duration: 0.35,
        })
        .fromTo(
          overlay,
          {
            autoAlpha: 1,
            clipPath: CLIP_CLOSED,
            pointerEvents: "auto",
          },
          {
            clipPath: CLIP_OPEN,
            duration: 0.5,
          },
          "-=0.05",
        );
    },
    [pathname, reduced, router],
  );

  const value = useMemo(
    () => ({ navigate, isTransitioning }),
    [navigate, isTransitioning],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] bg-[#171717] opacity-0"
      />
    </TransitionContext.Provider>
  );
}
