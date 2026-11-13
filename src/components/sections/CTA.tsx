"use client";

import { useLayoutEffect, useRef } from "react";
import { contact } from "@/data/site-content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";

const CTA_VIDEO_SRC = "/videos/cta-workers.mp4";

type Action = {
  label: string;
  href: string;
  external?: boolean;
};

export function CTA({
  id = "contact",
  primary,
  secondary,
  padTop = false,
  title = contact.title,
  supportNote = contact.supportNote,
  support = `${contact.support} ${contact.handoff}`,
  showSupportNote = true,
}: {
  id?: string;
  primary: Action;
  secondary?: Action;
  /** Match bottom padding on top — used on /businesses */
  padTop?: boolean;
  title?: string;
  supportNote?: string;
  support?: string;
  showSupportNote?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const media = video.current;
    if (!media) return;

    const tryPlay = () => {
      media.muted = true;
      media.playsInline = true;
      void media.play().catch(() => undefined);
    };

    tryPlay();
    media.addEventListener("loadeddata", tryPlay);
    media.addEventListener("canplay", tryPlay);

    return () => {
      media.removeEventListener("loadeddata", tryPlay);
      media.removeEventListener("canplay", tryPlay);
    };
  }, []);

  useLayoutEffect(() => {
    const section = root.current;
    const panel = drawer.current;
    const copy = content.current;
    if (!section || !panel || !copy) return;

    registerMotion();
    const parts = Array.from(copy.querySelectorAll<HTMLElement>("[data-cta-part]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(panel, { autoAlpha: 1, y: 0 });
      gsap.set(parts, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(panel, { autoAlpha: 0, y: 48 });
      gsap.set(parts, { autoAlpha: 0, y: 18 });

      const story = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          end: "top 42%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      story.to(panel, { autoAlpha: 1, y: 0, duration: 0.55, ease: "none" }, 0);

      parts.forEach((part, index) => {
        story.to(
          part,
          { autoAlpha: 1, y: 0, duration: 0.22, ease: "none" },
          0.28 + index * 0.04,
        );
      });
    }, section);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={root}
      aria-labelledby={`${id}-title`}
      className="relative bg-white text-charcoal"
    >
      <div className={cn("shell w-full pb-20", padTop && "pt-20")}>
        <div
          ref={drawer}
          className="relative w-full overflow-hidden will-change-transform"
        >
          <div ref={content} className="relative z-10 overflow-hidden px-6 py-[120px] text-white md:px-10">
            <video
              ref={video}
              className="absolute -inset-px h-[calc(100%+2px)] w-[calc(100%+2px)] max-w-none object-cover object-center"
              src={CTA_VIDEO_SRC}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              aria-hidden
              tabIndex={-1}
            />
            <div aria-hidden className="pointer-events-none absolute -inset-px bg-black/40" />

            <div className="relative z-10 flex w-full flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
              <div className="max-w-3xl text-left">
                <h2
                  id={`${id}-title`}
                  data-cta-part
                  className="font-display text-[clamp(1.9rem,4vw,3.25rem)] font-normal leading-[0.95] tracking-[-0.04em] [text-shadow:0_1px_18px_rgba(0,0,0,0.35)]"
                >
                  {title}
                </h2>
                {showSupportNote ? (
                  <p
                    data-cta-part
                    className="type-eyebrow mt-4 tracking-[0.18em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.3)]"
                  >
                    {supportNote}
                  </p>
                ) : null}
                <p
                  data-cta-part
                  className={cn(
                    "type-body w-full font-body leading-relaxed text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.28)]",
                    showSupportNote ? "mt-3" : "mt-4",
                  )}
                  style={{ fontSize: 14 }}
                >
                  {support}
                </p>
              </div>
              <div
                data-cta-part
                className={cn(
                  "flex w-full shrink-0 flex-col gap-3 sm:w-auto",
                  secondary ? "md:min-w-[16.5rem]" : "sm:flex-row md:justify-end",
                )}
              >
                <Button
                  href={primary.href}
                  variant="primary"
                  external={primary.external}
                  className={secondary ? "w-full" : undefined}
                >
                  {primary.label}
                </Button>
                {secondary ? (
                  <Button
                    href={secondary.href}
                    variant="secondary"
                    external={secondary.external}
                    className="w-full"
                  >
                    {secondary.label}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
