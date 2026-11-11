"use client";

import { useLayoutEffect, useRef } from "react";
import { hero } from "@/data/site-content";
import { DESKTOP_MOTION, gsap, registerMotion } from "@/lib/motion";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollScene } from "@/components/motion/ScrollScene";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section || !media.current || !copy.current || !frame.current) return;
    registerMotion();
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=210%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      timeline
        .to(media.current, { scale: 1.12, ease: "none", duration: 1 }, 0)
        .to(copy.current, { y: -80, ease: "none", duration: 0.65 }, 0)
        .to(cue.current, { autoAlpha: 0, ease: "none", duration: 0.25 }, 0)
        .to(copy.current, { autoAlpha: 0.2, ease: "none", duration: 0.3 }, 0.5)
        .fromTo(
          media.current,
          { clipPath: "inset(0% 0% 0% 0%)" },
          { clipPath: "inset(10% 8% 12% 8%)", ease: "none", duration: 0.45 },
          0.42,
        )
        .to(frame.current, { autoAlpha: 1, ease: "none", duration: 0.4 }, 0.4);

      const glow = section.querySelector("[data-layer='glow']");
      if (glow) {
        gsap.to(glow, {
          x: 30,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to(media.current, {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <ScrollScene id="top" ref={root} className="bg-charcoal text-white">
      <div className="relative min-h-[100svh] overflow-hidden lg:h-[100svh]">
        <div ref={media} className="absolute inset-0 origin-center will-change-transform">
          <AssetFrame id="hero" priority sizes="100vw" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/35 to-charcoal/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-charcoal/20" />
        <div aria-hidden className="pointer-events-none absolute inset-3 text-white/70 md:inset-5">
          <span className="absolute left-0 top-0 h-5 w-5 border-l border-t" />
          <span className="absolute right-0 top-0 h-5 w-5 border-r border-t" />
          <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l" />
          <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r" />
        </div>
        <div
          ref={frame}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] opacity-0"
        >
          <div className="absolute inset-[8%] border border-white/50" />
          <div className="absolute inset-[8%] grid grid-cols-4 grid-rows-3 gap-2 p-2 opacity-80 md:gap-3 md:p-3">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} className="border border-white/25" />
            ))}
          </div>
        </div>
        <div ref={copy} className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-24 pt-28 lg:h-[100svh] lg:min-h-0">
          <div className="shell flex flex-col items-center text-center">
            <Eyebrow light rule={false}>
              {hero.eyebrow}
            </Eyebrow>
            <h1
              className="hero-headline font-display font-normal md:whitespace-nowrap"
              style={{ fontSize: 52, marginTop: 0 }}
            >
              {hero.title.join(" ")}
            </h1>
            <p
              className="type-body max-w-xl font-body leading-relaxed text-white/80"
              style={{ fontSize: 14, marginTop: 0 }}
            >
              {hero.body}
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center" style={{ marginTop: 40 }}>
              <Button href={hero.primary.href}>{hero.primary.label}</Button>
              <Button href={hero.secondary.href} variant="secondary">
                {hero.secondary.label}
              </Button>
            </div>
          </div>
        </div>
        <a
          ref={cue}
          href="#about"
          className="absolute bottom-6 right-[var(--shell-gutter)] z-20 flex flex-col items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/80"
        >
          Scroll
          <span className="scroll-line block h-12 w-px bg-gradient-to-b from-rsi to-transparent" />
        </a>
      </div>
    </ScrollScene>
  );
}
