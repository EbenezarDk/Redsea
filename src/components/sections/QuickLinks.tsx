"use client";

import { useLayoutEffect, useRef } from "react";
import {
  CalendarDays,
  ChartNoAxesCombined,
  Coins,
  FileText,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/motion";

const LINKS: readonly {
  id: string;
  title: string;
  Icon: LucideIcon;
}[] = [
  { id: "share-information", title: "Share Information", Icon: ChartNoAxesCombined },
  { id: "dividends", title: "Dividends", Icon: Coins },
  { id: "fact-sheet", title: "Fact Sheet", Icon: FileText },
  { id: "ir-calendar", title: "IR Calendar", Icon: CalendarDays },
] as const;

const HOVER_EASE = "power3.out";
const HOVER_DURATION = 0.45;

function QuickLinkCard({
  title,
  Icon,
  className,
}: {
  title: string;
  Icon: LucideIcon;
  className?: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const icon = iconRef.current;
    const titleEl = titleRef.current;
    const arrow = arrowRef.current;
    const line = lineRef.current;
    if (!card || !icon || !titleEl || !arrow || !line) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
    gsap.set([icon, titleEl, arrow], { x: 0, y: 0, rotation: 0 });

    const playIn = () => {
      tweenRef.current?.kill();
      if (reduced) {
        gsap.set(line, { scaleX: 1 });
        gsap.set(icon, { y: -5, rotation: 5 });
        gsap.set(titleEl, { y: -3 });
        gsap.set(arrow, { x: 5, y: -5 });
        return;
      }
      tweenRef.current = gsap
        .timeline({ defaults: { duration: HOVER_DURATION, ease: HOVER_EASE } })
        .to(icon, { y: -5, rotation: 5 }, 0)
        .to(titleEl, { y: -3 }, 0)
        .to(arrow, { x: 5, y: -5 }, 0)
        .to(line, { scaleX: 1 }, 0);
    };

    const playOut = () => {
      tweenRef.current?.kill();
      if (reduced) {
        gsap.set(line, { scaleX: 0 });
        gsap.set([icon, titleEl, arrow], { x: 0, y: 0, rotation: 0 });
        return;
      }
      tweenRef.current = gsap
        .timeline({ defaults: { duration: HOVER_DURATION, ease: HOVER_EASE } })
        .to(icon, { y: 0, rotation: 0 }, 0)
        .to(titleEl, { y: 0 }, 0)
        .to(arrow, { x: 0, y: 0 }, 0)
        .to(line, { scaleX: 0 }, 0);
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
    <article
      ref={cardRef}
      tabIndex={0}
      aria-label={title}
      className={cn(
        "group relative flex h-auto min-h-[9.5rem] flex-col justify-between bg-[#292B2F] p-5 text-white outline-none transition-colors duration-[450ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] hover:bg-rsi focus-visible:bg-rsi sm:p-6",
        className,
      )}
    >
      <span
        ref={lineRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-white/80"
      />

      <span ref={iconRef} className="inline-flex w-fit will-change-transform">
        <Icon size={28} strokeWidth={1.5} aria-hidden className="text-white" />
      </span>

      <div className="mt-10 flex items-end justify-between gap-4">
        <span
          ref={titleRef}
          className="font-display text-[1.15rem] font-normal leading-[1.1] tracking-[-0.02em] text-white will-change-transform md:text-[1.25rem]"
        >
          {title}
        </span>
        <span
          ref={arrowRef}
          aria-hidden
          className="inline-flex shrink-0 will-change-transform text-white/80"
        >
          <ArrowUpRight size={18} strokeWidth={1.5} />
        </span>
      </div>
    </article>
  );
}

export function QuickLinks() {
  return (
    <section
      id="quick-links"
      aria-labelledby="quick-links-title"
      className="h-auto bg-[#171717] text-white"
    >
      <div className="shell py-16 md:py-20 lg:py-24">
        <SectionHeading light title="Quick Links" titleId="quick-links-title" />

        <div className="mt-10 grid grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {LINKS.map((link, index) => (
            <QuickLinkCard
              key={link.id}
              title={link.title}
              Icon={link.Icon}
              className={cn(
                "border-white/10",
                index % 2 === 0 && "border-r",
                index < 2 && "border-b lg:border-b-0",
                index !== 3 && "lg:border-r",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
