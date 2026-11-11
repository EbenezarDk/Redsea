"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/data/site-content";
import { lenisRef } from "@/lib/lenis";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [overHero, setOverHero] = useState(true);
  const open = menuPath === pathname;
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = pathname.startsWith("/businesses") ? "businesses-intro" : "top";
    const hero = document.getElementById(id);
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOverHero(Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.12));
      },
      { threshold: [0, 0.12, 0.35] },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    lenisRef.current?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>("a, button"))
      : [];
    const closeButton = buttonRef.current;
    const frame = window.requestAnimationFrame(() => focusables[0]?.focus());

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      lenisRef.current?.start();
      closeButton?.focus();
    };
  }, [open]);

  const solid = !overHero && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        open && "bg-charcoal text-white",
        !open && solid && "border-b border-charcoal/10 bg-paper/95 text-charcoal backdrop-blur-md",
        !open && !solid && "bg-transparent text-white",
      )}
    >
      <div className="shell flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link href="/#top" aria-label="Red Sea International, home" className="relative z-[60]">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const current = item.href === "/businesses" && pathname.startsWith("/businesses");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className="text-[0.74rem] font-semibold uppercase tracking-[0.16em]"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          ref={buttonRef}
          type="button"
          className="relative z-[60] inline-flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setMenuPath((current) => (current === pathname ? null : pathname))}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="relative block h-3 w-6">
            <span
              className={cn(
                "absolute left-0 h-px w-6 bg-current transition-transform",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 h-px w-6 bg-current transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 h-px w-6 bg-current transition-transform",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </div>
      <div
        id="mobile-nav"
        ref={panelRef}
        inert={open ? undefined : true}
        className={cn(
          "fixed inset-0 z-40 bg-charcoal text-white transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex h-full flex-col justify-center gap-2 px-6 pt-16">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuPath(null)}
              className="border-b border-white/15 py-4 font-display text-[clamp(2.4rem,12vw,3.5rem)] font-normal leading-none tracking-[-0.03em]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
