"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  rsiNewsSection,
  visibleRsiNews,
  type RsiNewsItem,
} from "@/data/rsiNews";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";

const DESKTOP_PARALLAX =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function NewsPreviewDrawer({
  article,
  onClose,
}: {
  article: RsiNewsItem | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const open = Boolean(article);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (!open) {
      gsap.set(panel, { autoAlpha: 0, x: 40, pointerEvents: "none" });
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    gsap.fromTo(
      panel,
      { autoAlpha: 0, x: 48 },
      { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", pointerEvents: "auto" },
    );

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-[60]", !open && "pointer-events-none")} aria-hidden={!open}>
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-charcoal/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        aria-label="Close story preview"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-paper text-charcoal"
      >
        {article ? (
          <>
            <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-72">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 36rem"
                className="object-cover"
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6 md:p-8">
              <p className="type-eyebrow text-rsi">{article.category}</p>
              <h3
                id={titleId}
                className="mt-4 font-display text-[clamp(1.5rem,3vw,2.2rem)] font-normal leading-[0.95] tracking-[-0.03em]"
              >
                {article.title}
              </h3>
              <p className="type-body mt-4 font-body leading-relaxed text-graphite">{article.excerpt}</p>
              <p className="mt-6 border-t border-charcoal/15 pt-4 text-[0.72rem] leading-relaxed text-graphite">
                {rsiNewsSection.previewNote}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 inline-flex min-h-12 items-center justify-center border border-charcoal px-6 text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-charcoal hover:text-white"
              >
                Close Preview
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function NewsCard({
  item,
  featured = false,
  onOpen,
}: {
  item: RsiNewsItem;
  featured?: boolean;
  onOpen: (item: RsiNewsItem) => void;
}) {
  return (
    <article
      className={cn(
        "group flex h-full min-h-0 w-full overflow-hidden border border-charcoal/15 bg-white text-charcoal",
        featured ? "flex-col" : "flex-col sm:flex-row",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          featured
            ? "h-[240px] w-full sm:h-[300px] lg:h-[360px]"
            : "aspect-[16/10] w-full sm:aspect-auto sm:h-full sm:w-[38%] lg:w-[36%]",
        )}
      >
        <div data-news-parallax className="absolute inset-[-12px] will-change-transform">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 18vw, 100vw"}
            className="object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />
        </div>
        {featured ? (
          <p className="absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-charcoal md:left-4 md:top-4">
            Placeholder imagery
          </p>
        ) : null}
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          featured ? "justify-start p-5 md:p-6" : "justify-center p-4 md:px-5 md:py-3",
        )}
      >
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-graphite transition-colors duration-[400ms] group-hover:text-rsi">
          {item.category}
        </p>
        <h3
          className={cn(
            "mt-2 font-display font-normal leading-[1.05] tracking-[-0.03em] text-charcoal transition-colors duration-[400ms] group-hover:text-rsi-deep",
            featured
              ? "text-[clamp(1.2rem,2vw,1.85rem)]"
              : "line-clamp-2 text-[clamp(1rem,1.35vw,1.25rem)]",
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "type-body mt-2 font-body leading-relaxed text-graphite",
            !featured && "line-clamp-2",
          )}
        >
          {item.excerpt}
        </p>
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="group/cta mt-4 inline-flex w-fit items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-charcoal outline-none"
        >
          <span className="relative pb-1">
            Preview
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-rsi transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:scale-x-100 group-focus-visible/cta:scale-x-100"
            />
          </span>
          <span
            aria-hidden
            className="block h-px w-6 bg-rsi transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-1.5 group-focus-visible/cta:translate-x-1.5"
          />
        </button>
      </div>
    </article>
  );
}

export function Newsroom() {
  const root = useRef<HTMLElement>(null);
  const [preview, setPreview] = useState<RsiNewsItem | null>(null);

  const items = visibleRsiNews.slice(0, rsiNewsSection.initialCount);
  const primary = items[0];
  const side = items.slice(1, 4);
  const more = items.slice(4);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || !primary) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const eyebrow = section.querySelector<HTMLElement>("[data-news-eyebrow]");
    const heading = section.querySelector<HTMLElement>("[data-news-heading]");
    const description = section.querySelector<HTMLElement>("[data-news-description]");
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-news-card]"));
    const parallaxNodes = Array.from(section.querySelectorAll<HTMLElement>("[data-news-parallax]"));

    if (reduced) {
      gsap.set([eyebrow, heading, description, ...cards], { clearProps: "all" });
      return;
    }

    registerMotion();
    const ctx = gsap.context(() => {
      gsap.set(eyebrow, { autoAlpha: 0, y: 18 });
      gsap.set(heading, { autoAlpha: 0, y: 35 });
      gsap.set(description, { autoAlpha: 0, y: 18 });
      gsap.set(cards, { autoAlpha: 0, y: 45 });

      const story = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
          toggleActions: "play none none none",
        },
      });

      story.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0);
      story.to(heading, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.08);
      story.to(description, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.18);
      story.to(cards, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12, ease: "power3.out" }, 0.28);

      if (window.matchMedia(DESKTOP_PARALLAX).matches) {
        parallaxNodes.forEach((node) => {
          gsap.fromTo(
            node,
            { y: 12 },
            {
              y: -12,
              ease: "none",
              scrollTrigger: {
                trigger: node.parentElement ?? section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.4,
              },
            },
          );
        });
      }
    }, section);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [primary]);

  if (!primary) return null;

  return (
    <>
      <section
        ref={root}
        id="newsroom"
        aria-labelledby="newsroom-title"
        className="relative bg-paper text-charcoal"
      >
        <div className="shell section-pad">
          <div className="flex max-w-3xl shrink-0 flex-col gap-[6px]">
            <div data-news-eyebrow>
              <Eyebrow rule={false}>{rsiNewsSection.eyebrow}</Eyebrow>
            </div>
            <h2
              id="newsroom-title"
              data-news-heading
              className="overflow-hidden font-display font-normal leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: "clamp(1.7rem, 3vw, 2.6rem)" }}
            >
              {rsiNewsSection.title}
            </h2>
            <p
              data-news-description
              className="type-body max-w-xl font-body leading-relaxed text-graphite"
              style={{ fontSize: 14 }}
            >
              {rsiNewsSection.description}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:mt-5 lg:grid-cols-12 lg:gap-4">
            <div data-news-card className="md:col-span-2 lg:col-span-7">
              <NewsCard item={primary} featured onOpen={setPreview} />
            </div>
            <div className="flex min-h-0 flex-col gap-4 md:col-span-2 lg:col-span-5">
              {side.map((item) => (
                <div key={item.id} data-news-card className="min-h-0 flex-1">
                  <NewsCard item={item} onOpen={setPreview} />
                </div>
              ))}
            </div>
          </div>

          {more.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
              {more.map((item) => (
                <div key={item.id} data-news-card>
                  <NewsCard item={item} onOpen={setPreview} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <NewsPreviewDrawer article={preview} onClose={() => setPreview(null)} />
    </>
  );
}
