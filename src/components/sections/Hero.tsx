"use client";

import { useLayoutEffect, useRef } from "react";
import { hero } from "@/data/site-content";
import { Button } from "@/components/ui/Button";
import { TextAnimate } from "@/registry/magicui/text-animate";

/** Original upload is preserved. Settled frame matches the lit modular floor behind hero copy. */
const HERO_VIDEO_SRC = "/videos/hero-approach-scrub.mp4";
const SETTLE_RATIO = 3.35 / 7.85;

function setHeaderTone(tone: "hero" | null) {
  const root = document.documentElement;
  const current = root.dataset.headerTone ?? null;
  if (current === tone) return;
  if (tone) root.dataset.headerTone = tone;
  else delete root.dataset.headerTone;
  window.dispatchEvent(new Event("rsi-header-tone"));
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.pause();

    const showSettle = () => {
      video.pause();
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = Math.min(
        video.duration * SETTLE_RATIO,
        Math.max(0, video.duration - 0.05),
      );
    };

    const blockPlay = () => {
      requestAnimationFrame(() => {
        if (!video.paused) video.pause();
      });
    };

    if (video.readyState >= 1) showSettle();
    else video.addEventListener("loadedmetadata", showSettle, { once: true });
    video.addEventListener("play", blockPlay);

    setHeaderTone("hero");
    const onScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop;
      setHeaderTone(top < window.innerHeight * 0.55 ? "hero" : null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      video.removeEventListener("loadedmetadata", showSettle);
      video.removeEventListener("play", blockPlay);
      window.removeEventListener("scroll", onScroll);
      setHeaderTone(null);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative z-10 h-[100svh] overflow-hidden bg-charcoal text-white"
    >
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={HERO_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/25 to-charcoal/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/88 via-charcoal/30 to-charcoal/15" />
        </div>
      </div>

      <div className="relative z-10 flex h-full min-h-[100svh] flex-col items-center justify-center pt-28 pb-24">
        <div className="shell flex w-full flex-col items-center text-center">
          <div className="flex flex-col items-center gap-[6px]">
            <TextAnimate
              animation="fadeIn"
              by="line"
              as="p"
              once
              className="type-eyebrow font-body text-white/80"
            >
              {hero.eyebrow}
            </TextAnimate>
            <TextAnimate
              animation="fadeIn"
              by="text"
              as="h1"
              once
              delay={0.08}
              className="hero-headline font-display font-normal md:whitespace-nowrap"
              style={{ marginTop: 0, marginBottom: 0 }}
            >
              {hero.title.join(" ")}
            </TextAnimate>
            <TextAnimate
              animation="fadeIn"
              by="line"
              as="p"
              once
              delay={0.16}
              className="type-body max-w-xl font-body leading-relaxed text-white/80"
              style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
            >
              {hero.body}
            </TextAnimate>
          </div>
          <div
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            style={{ marginTop: 40 }}
          >
            <Button href={hero.primary.href} variant="primary">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary">
              {hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 right-[var(--shell-gutter)] z-20 flex flex-col items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/80"
      >
        Scroll
        <span className="scroll-line block h-12 w-px bg-gradient-to-b from-rsi to-transparent" />
      </a>
    </section>
  );
}
