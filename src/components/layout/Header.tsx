"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/data/site-content";
import { lenisRef } from "@/lib/lenis";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { AnimatedNavLink } from "@/components/navigation/AnimatedNavLink";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { ContactOverlay } from "@/components/navigation/ContactOverlay";
import { usePageTransition } from "@/components/transitions/PageTransition";
import { ScrollTrigger } from "@/lib/motion";

function sectionIdFromHref(href: string) {
  if (!href.includes("#")) return null;
  return href.split("#")[1] || null;
}

function parseRgba(color: string) {
  const match = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?/i);
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function isLightBackground(color: string) {
  const rgba = parseRgba(color);
  if (!rgba || rgba.a < 0.2) return null;
  const luminance = (0.2126 * rgba.r + 0.7152 * rgba.g + 0.0722 * rgba.b) / 255;
  return luminance >= 0.72;
}

const LIGHT_SECTION_IDS = new Set([
  "about",
  "capabilities",
  "projects",
  "newsroom",
  "services",
  "delivery",
  "contact",
]);
const HERO_SECTION_IDS = new Set(["top", "businesses-intro"]);
const DARK_SECTION_IDS = new Set(["businesses", "at-a-glance"]);

function findSectionUnderHeader(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const samplePoints = [
    Math.min(window.innerWidth - 12, Math.max(12, window.innerWidth * 0.2)),
    Math.min(window.innerWidth - 12, Math.max(12, window.innerWidth * 0.5)),
    Math.min(window.innerWidth - 12, Math.max(12, window.innerWidth * 0.8)),
  ];
  const y = 56;

  for (const x of samplePoints) {
    const stack = document.elementsFromPoint(x, y);
    for (const node of stack) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.closest("header") || node.closest('[role="dialog"]') || node.closest("#mobile-nav")) {
        continue;
      }
      const section = node.closest("section[id]");
      if (section instanceof HTMLElement && section.id) return section;
    }
  }

  return null;
}

function sampleSurfaceTone(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  const x = Math.min(window.innerWidth - 12, Math.max(12, window.innerWidth * 0.2));
  const y = 56;
  const stack = document.elementsFromPoint(x, y);

  for (const node of stack) {
    if (!(node instanceof HTMLElement)) continue;
    if (node.closest("header") || node.closest('[role="dialog"]') || node.closest("#mobile-nav")) {
      continue;
    }

    let current: HTMLElement | null = node;
    while (current && current !== document.documentElement) {
      const bg = getComputedStyle(current).backgroundColor;
      const light = isLightBackground(bg);
      if (light !== null) return light ? "light" : "dark";
      current = current.parentElement;
    }
  }

  return "dark";
}

function resolveHeaderSurface(): HeaderSurface {
  const forced = document.documentElement.dataset.headerTone;
  if (forced === "hero" || forced === "light" || forced === "dark") return forced;

  const section = findSectionUnderHeader();
  if (section) {
    if (HERO_SECTION_IDS.has(section.id)) return "hero";
    if (DARK_SECTION_IDS.has(section.id)) return "dark";
    if (LIGHT_SECTION_IDS.has(section.id)) return "light";
    return "dark";
  }
  return sampleSurfaceTone() === "light" ? "light" : "dark";
}

type HeaderSurface = "hero" | "light" | "dark";

export function Header() {
  const pathname = usePathname();
  const transition = usePageTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [surface, setSurface] = useState<HeaderSurface>("hero");
  const [hashState, setHashState] = useState<string | null>(null);
  const [menuPath, setMenuPath] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contactCloseRef = useRef<(() => void) | null>(null);

  // Close mobile menu when the route changes (render-time sync, not an effect).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  const activeHash = pathname === "/" ? hashState : null;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (menuOpen || contactOpen) {
        setSurface("hero");
        return;
      }
      setSurface(resolveHeaderSurface());
    };
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("rsi-header-tone", schedule);
    document.addEventListener("scroll", schedule, { passive: true, capture: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("rsi-header-tone", schedule);
      document.removeEventListener("scroll", schedule, true);
    };
  }, [pathname, menuOpen, contactOpen]);

  useEffect(() => {
    if (pathname !== "/") return;

    const syncHash = () => {
      const hash = window.location.hash.replace("#", "") || null;
      setHashState(hash === "top" ? null : hash);
    };
    syncHash();

    const sectionIds = ["about", "projects", "contact", "capabilities", "businesses"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          const id = visible[0].target.id;
          if (id === "about" || id === "projects" || id === "contact") {
            setHashState(id);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    window.addEventListener("hashchange", syncHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, [pathname]);

  const isActive = useCallback(
    (href: string, opensContact?: boolean) => {
      if (contactOpen) return Boolean(opensContact);
      if (opensContact) return false;
      if (href === "/") return pathname === "/" && !activeHash;
      if (href === "/businesses") return pathname.startsWith("/businesses");
      const section = sectionIdFromHref(href);
      if (section) return pathname === "/" && activeHash === section;
      return false;
    },
    [activeHash, contactOpen, pathname],
  );

  const scrollToTop = useCallback(() => {
    window.history.replaceState(null, "", "/");
    setHashState(null);
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { force: true, duration: 1.05 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.setTimeout(() => ScrollTrigger.refresh(), 120);
  }, []);

  const scrollToHash = useCallback((href: string) => {
    const id = sectionIdFromHref(href);
    if (!id || id === "top") {
      scrollToTop();
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -88, force: true });
    else el.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `/#${id}`);
    setHashState(id);
  }, [scrollToTop]);

  const handleNavigate = useCallback(
    (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
      const item = nav.find((entry) => entry.href === href);
      if (item && "dummy" in item && item.dummy) {
        event.preventDefault();
        return;
      }
      if (item && "opensContact" in item && item.opensContact) {
        event.preventDefault();
        setMenuOpen(false);
        setContactOpen(true);
        return;
      }

      const path = href.split("#")[0] || "/";
      const hash = sectionIdFromHref(href);
      const hasHash = Boolean(hash);
      const toHome = path === "/" || path === "";

      // Already on home — never remount; smooth-scroll to top or section.
      if (pathname === "/" && toHome) {
        event.preventDefault();
        setMenuOpen(false);
        setContactOpen(false);
        if (!hasHash || hash === "top") scrollToTop();
        else scrollToHash(href);
        return;
      }

      // From Our Businesses → Home: hard reload for a fresh homepage start.
      if (pathname.startsWith("/businesses") && toHome) {
        event.preventDefault();
        setMenuOpen(false);
        setContactOpen(false);
        window.location.assign("/");
        return;
      }

      // Home → Businesses keeps the cinematic transition.
      if (pathname === "/" && path.startsWith("/businesses") && transition) {
        event.preventDefault();
        setMenuOpen(false);
        setContactOpen(false);
        transition.navigate(href);
        return;
      }

      setContactOpen(false);
    },
    [pathname, scrollToHash, scrollToTop, transition],
  );

  const openContact = useCallback(() => {
    setMenuOpen(false);
    setContactOpen(true);
  }, []);

  const closeContact = useCallback(() => setContactOpen(false), []);

  const onLight = surface === "light" && !menuOpen && !contactOpen;

  const mobileItems = useMemo(
    () =>
      nav.map((item) => ({
        href: item.href,
        label: item.label,
        opensContact: "opensContact" in item && item.opensContact,
        dummy: "dummy" in item && item.dummy,
      })),
    [],
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,backdrop-filter,box-shadow] duration-300",
          (menuOpen || contactOpen || surface === "hero") && "bg-transparent text-white",
          !menuOpen &&
            !contactOpen &&
            surface === "light" &&
            "bg-white text-charcoal shadow-[0_1px_0_rgba(22,22,22,0.08)]",
          !menuOpen &&
            !contactOpen &&
            surface === "dark" &&
            "bg-[#171717]/80 text-white shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md",
        )}
      >
        <div className="flex h-24 items-center justify-between px-[clamp(24px,4vw,80px)]">
          <Link
            href="/"
            scroll={false}
            aria-label="Red Sea International, home"
            className="relative z-[60]"
            onClick={(event) => handleNavigate("/", event)}
          >
            <Logo onLight={onLight} />
          </Link>

          <nav
            aria-label="Primary"
            className={cn(
              "hidden items-center gap-[clamp(1rem,1.5vw,2rem)] lg:flex",
              contactOpen && "pointer-events-none opacity-0",
            )}
            aria-hidden={contactOpen || undefined}
          >
            {nav.map((item) => {
              const opensContact = "opensContact" in item && item.opensContact;
              const dummy = "dummy" in item && item.dummy;
              return (
                <AnimatedNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActive(item.href, opensContact)}
                  dummy={dummy}
                  tone={onLight ? "light" : "dark"}
                  onNavigate={handleNavigate}
                />
              );
            })}
          </nav>

          <button
            ref={buttonRef}
            type="button"
            className={cn(
              "relative z-[60] inline-flex h-11 min-w-11 items-center justify-center text-[0.72rem] font-medium uppercase tracking-[0.16em]",
              onLight ? "text-charcoal" : "text-white",
              !contactOpen && "lg:hidden",
            )}
            aria-expanded={contactOpen ? true : menuOpen}
            aria-controls={contactOpen ? undefined : "mobile-nav"}
            aria-label={contactOpen || menuOpen ? "Close" : "Open menu"}
            onClick={() => {
              if (contactOpen) {
                if (contactCloseRef.current) contactCloseRef.current();
                else closeContact();
                return;
              }
              setMenuOpen((current) => !current);
            }}
          >
            {contactOpen || menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        <MobileMenu
          open={menuOpen}
          items={mobileItems}
          onClose={() => setMenuOpen(false)}
          onContact={openContact}
          onNavigate={handleNavigate}
        />
      </header>

      <ContactOverlay
        open={contactOpen}
        onClose={closeContact}
        registerCloseRef={contactCloseRef}
      />
    </>
  );
}
