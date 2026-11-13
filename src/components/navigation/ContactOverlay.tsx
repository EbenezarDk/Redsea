"use client";

import { useEffect, useId, useRef } from "react";
import { contact, officialContactUrl } from "@/data/site-content";
import { gsap } from "@/lib/motion";
import { lenisRef } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type ContactOverlayProps = {
  open: boolean;
  onClose: () => void;
  registerCloseRef?: React.MutableRefObject<(() => void) | null>;
};

const CLIP_CLOSED = "inset(0 0 100% 0)";
const CLIP_OPEN = "inset(0 0 0 0)";

export function ContactOverlay({ open, onClose, registerCloseRef }: ContactOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const closingRef = useRef(false);
  const animateCloseRef = useRef<() => void>(() => onClose());
  const reduced = useReducedMotion();
  const titleId = useId();
  const descriptionId = useId();

  const getLines = () =>
    headlineRef.current
      ? Array.from(headlineRef.current.querySelectorAll<HTMLElement>("[data-line]"))
      : [];

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    gsap.set(overlay, {
      autoAlpha: 0,
      clipPath: CLIP_CLOSED,
      pointerEvents: "none",
    });
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (!open) {
      if (!closingRef.current) {
        gsap.set(overlay, {
          autoAlpha: 0,
          clipPath: CLIP_CLOSED,
          pointerEvents: "none",
        });
      }
      closingRef.current = false;
      return;
    }

    closingRef.current = false;
    previousFocus.current = document.activeElement as HTMLElement | null;
    lenisRef.current?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const lines = getLines();
    timelineRef.current?.kill();

    const animateClose = () => {
      if (closingRef.current) return;
      if (reduced) {
        onClose();
        return;
      }
      closingRef.current = true;
      timelineRef.current?.kill();
      const closeLines = getLines();
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
          onClose();
        },
      });
      timelineRef.current = tl;
      tl.to([ctaRef.current, bodyRef.current], {
        y: 16,
        opacity: 0,
        duration: 0.28,
        stagger: 0.04,
      })
        .to(
          closeLines,
          {
            yPercent: -40,
            opacity: 0,
            duration: 0.32,
            stagger: 0.04,
          },
          "-=0.12",
        )
        .to(
          overlay,
          {
            clipPath: CLIP_CLOSED,
            duration: 0.55,
          },
          "-=0.1",
        );
    };
    animateCloseRef.current = animateClose;
    if (registerCloseRef) registerCloseRef.current = animateClose;

    if (reduced) {
      gsap.set(overlay, {
        autoAlpha: 1,
        clipPath: CLIP_OPEN,
        pointerEvents: "auto",
      });
      gsap.set([...lines, bodyRef.current, ctaRef.current], { clearProps: "all" });
      closeButtonRef.current?.focus();
    } else {
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      gsap.set([bodyRef.current, ctaRef.current], { y: 28, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      timelineRef.current = tl;
      tl.fromTo(
        overlay,
        {
          autoAlpha: 1,
          clipPath: CLIP_CLOSED,
          pointerEvents: "auto",
        },
        {
          clipPath: CLIP_OPEN,
          duration: 0.7,
          ease: "power3.inOut",
        },
      )
        .to(
          lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
          },
          "-=0.28",
        )
        .to(
          bodyRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
          },
          "-=0.35",
        )
        .to(
          ctaRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          "-=0.28",
        )
        .add(() => closeButtonRef.current?.focus(), "-=0.2");
    }

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        animateClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
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
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      lenisRef.current?.start();
      timelineRef.current?.kill();
      previousFocus.current?.focus?.();
      if (registerCloseRef) registerCloseRef.current = null;
    };
  }, [open, onClose, reduced, registerCloseRef]);

  const headlineLines = (() => {
    const title = contact.title.replace(/\.$/, "");
    const pivot = title.toLowerCase().indexOf(" the ");
    if (pivot === -1) return [title];
    return [title.slice(0, pivot), `${title.slice(pivot + 1)}.`];
  })();

  return (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-[45] bg-[#171717] text-[#F7F6F3]",
        !open && "pointer-events-none",
      )}
      aria-hidden={!open}
      inert={open ? undefined : true}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative flex h-full w-full flex-col px-[clamp(24px,4vw,80px)] pb-16 pt-28"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => animateCloseRef.current()}
          className="sr-only"
          aria-label="Close contact panel"
        >
          Close
        </button>

        <div className="mt-auto max-w-4xl">
          <p className="mb-6 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-rsi">
            Contact
          </p>
          <h2
            id={titleId}
            ref={headlineRef}
            className="font-display text-[clamp(2.6rem,8vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.03em]"
          >
            {headlineLines.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.05em]">
                <span data-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h2>
          <p
            id={descriptionId}
            ref={bodyRef}
            className="type-body mt-8 max-w-xl font-body leading-relaxed text-[#B8B8B8]"
          >
            {contact.support}
          </p>
          <a
            ref={ctaRef}
            href={officialContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex min-h-12 items-center border border-rsi bg-rsi px-7 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-rsi-deep"
          >
            {contact.teamLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
