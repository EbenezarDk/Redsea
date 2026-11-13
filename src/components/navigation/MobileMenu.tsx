"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/motion";
import { lenisRef } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

export type MobileNavItem = {
  href: string;
  label: string;
  opensContact?: boolean;
  dummy?: boolean;
};

type MobileMenuProps = {
  open: boolean;
  items: readonly MobileNavItem[];
  onClose: () => void;
  onContact: () => void;
  onNavigate?: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function MobileMenu({
  open,
  items,
  onClose,
  onContact,
  onNavigate,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const onCloseRef = useRef(onClose);
  const reduced = useReducedMotion();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    const links = listRef.current
      ? Array.from(listRef.current.querySelectorAll<HTMLElement>("[data-mobile-link]"))
      : [];
    if (!panel) return;

    timelineRef.current?.kill();

    if (!open) {
      gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(links, { y: 36, opacity: 0 });
      return;
    }

    lenisRef.current?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (reduced) {
      gsap.set(panel, { autoAlpha: 1, pointerEvents: "auto", clipPath: "none" });
      gsap.set(links, { y: 0, opacity: 1 });
    } else {
      gsap.set(panel, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(links, { y: 48, opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      timelineRef.current = tl;
      tl.fromTo(
        panel,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0 0)", duration: 0.55, ease: "power3.inOut" },
      ).to(
        links,
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.06,
        },
        "-=0.22",
      );
    }

    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>("a, button"));

    const closeAnimated = () => {
      if (reduced) {
        onCloseRef.current();
        return;
      }
      timelineRef.current?.kill();
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => onCloseRef.current(),
      });
      timelineRef.current = tl;
      tl.to(links, {
        y: -24,
        opacity: 0,
        duration: 0.28,
        stagger: 0.03,
      }).to(
        panel,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.45,
        },
        "-=0.05",
      );
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAnimated();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = focusables();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const frame = window.requestAnimationFrame(() => focusables()[0]?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      lenisRef.current?.start();
      timelineRef.current?.kill();
    };
  }, [open, reduced]);

  return (
    <div
      id="mobile-nav"
      ref={panelRef}
      className={cn(
        "fixed inset-0 z-40 bg-[#171717] text-[#F7F6F3] lg:hidden",
        !open && "pointer-events-none",
      )}
      aria-hidden={!open}
      inert={open ? undefined : true}
    >
      <nav
        ref={listRef}
        aria-label="Mobile"
        className="flex h-full flex-col justify-center gap-1 px-[clamp(24px,4vw,80px)] pt-16"
      >
        {items.map((item) => {
          if (item.opensContact) {
            return (
              <button
                key={item.label}
                type="button"
                data-mobile-link
                onClick={() => {
                  onClose();
                  window.setTimeout(onContact, 40);
                }}
                className="border-b border-white/15 py-4 text-left font-display text-[clamp(2.4rem,12vw,3.5rem)] font-normal leading-none tracking-[-0.03em]"
              >
                {item.label}
              </button>
            );
          }

          if (item.dummy) {
            return (
              <span
                key={item.href}
                data-mobile-link
                aria-disabled="true"
                className="border-b border-white/15 py-4 font-display text-[clamp(2.4rem,12vw,3.5rem)] font-normal leading-none tracking-[-0.03em] text-white/55"
              >
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              scroll={false}
              data-mobile-link
              onClick={(event) => {
                onNavigate?.(item.href, event);
                onClose();
              }}
              className="border-b border-white/15 py-4 font-display text-[clamp(2.4rem,12vw,3.5rem)] font-normal leading-none tracking-[-0.03em]"
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
