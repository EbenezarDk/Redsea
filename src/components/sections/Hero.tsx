"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { hero } from "@/data/site-content";
import { Button } from "@/components/ui/Button";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { lenisRef } from "@/lib/lenis";
import { cn } from "@/lib/cn";

/** Original upload is preserved. Settled frame matches the lit modular floor behind hero copy. */
const HERO_VIDEO_SRC = "/videos/hero-approach-scrub.mp4";
const SETTLE_RATIO = 3.35 / 7.85;
/** Wall-clock budget for the opening approach. */
const INTRO_PLAY_MS = 2000;
const INTRO_PLAYBACK_RATE = 2;
/** Video-seconds before settle where playback eases down (avoids a hard cut). */
const INTRO_SLOW_WINDOW = 0.55;

function setHeaderTone(tone: "hero" | null) {
  const root = document.documentElement;
  const current = root.dataset.headerTone ?? null;
  if (current === tone) return;
  if (tone) root.dataset.headerTone = tone;
  else delete root.dataset.headerTone;
  window.dispatchEvent(new Event("rsi-header-tone"));
}

function lockScroll() {
  const html = document.documentElement;
  html.dataset.heroIntro = "1";
  html.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);
  lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  lenisRef.current?.stop();
}

function unlockScroll() {
  const html = document.documentElement;
  delete html.dataset.heroIntro;
  html.style.overflow = "";
  document.body.style.overflow = "";
  lenisRef.current?.start();
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCopy, setShowCopy] = useState(false);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const seekSettle = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = Math.min(
        video.duration * SETTLE_RATIO,
        Math.max(0, video.duration - 0.05),
      );
    };

    setHeaderTone("hero");

    const onScroll = () => {
      if (document.documentElement.dataset.heroIntro === "1") return;
      const top = window.scrollY || document.documentElement.scrollTop;
      setHeaderTone(top < window.innerHeight * 0.55 ? "hero" : null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduced) {
      const ready = () => {
        video.pause();
        seekSettle();
        setShowCopy(true);
      };
      if (video.readyState >= 1) ready();
      else video.addEventListener("loadedmetadata", ready, { once: true });
      onScroll();
      return () => {
        video.removeEventListener("loadedmetadata", ready);
        window.removeEventListener("scroll", onScroll);
        setHeaderTone(null);
      };
    }

    let cancelled = false;
    let unlockTimer = 0;
    let failsafeTimer = 0;
    let raf = 0;
    let finishing = false;

    const settleTime = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return 0;
      return Math.min(video.duration * SETTLE_RATIO, Math.max(0, video.duration - 0.05));
    };

    const revealCopy = () => {
      if (cancelled) return;
      setShowCopy(true);
      unlockTimer = window.setTimeout(() => {
        if (cancelled) return;
        unlockScroll();
        onScroll();
      }, 420);
    };

    const softStop = () => {
      if (cancelled || finishing) return;
      finishing = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      window.clearTimeout(failsafeTimer);

      const settle = settleTime();
      video.pause();
      video.playbackRate = 1;
      // Only nudge if we're more than a frame off — never hard-jump from far away.
      if (settle > 0 && Math.abs(video.currentTime - settle) > 1 / 24) {
        video.currentTime = settle;
      }
      revealCopy();
    };

    const startIntro = () => {
      if (cancelled) return;
      lockScroll();
      finishing = false;
      video.currentTime = 0;
      video.playbackRate = INTRO_PLAYBACK_RATE;

      const play = video.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {
          softStop();
        });
      }

      const tick = () => {
        if (cancelled || finishing) return;
        const settle = settleTime();
        if (settle <= 0) {
          raf = requestAnimationFrame(tick);
          return;
        }

        const remaining = settle - video.currentTime;
        if (remaining <= 0.03) {
          softStop();
          return;
        }

        if (remaining < INTRO_SLOW_WINDOW) {
          // Ease rate 2 → ~0.28 so the last approach eases into the settle frame.
          const p = Math.max(0, Math.min(1, remaining / INTRO_SLOW_WINDOW));
          const eased = p * p;
          video.playbackRate = 0.28 + (INTRO_PLAYBACK_RATE - 0.28) * eased;
        } else {
          video.playbackRate = INTRO_PLAYBACK_RATE;
        }

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
      // Safety: never leave scroll locked if rAF/metadata stalls.
      failsafeTimer = window.setTimeout(softStop, INTRO_PLAY_MS + 800);
    };

    if (video.readyState >= 2) startIntro();
    else {
      const onReady = () => startIntro();
      video.addEventListener("loadeddata", onReady, { once: true });
      video.addEventListener("canplay", onReady, { once: true });
    }

    const blockScrollKeys = (event: KeyboardEvent) => {
      if (document.documentElement.dataset.heroIntro !== "1") return;
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"];
      if (keys.includes(event.key)) event.preventDefault();
    };
    window.addEventListener("keydown", blockScrollKeys, { passive: false });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(failsafeTimer);
      window.clearTimeout(unlockTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", blockScrollKeys);
      unlockScroll();
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
        <div
          className={cn(
            "shell flex w-full flex-col items-center text-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            showCopy ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
          )}
        >
          {showCopy ? (
            <>
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
            </>
          ) : (
            <h1 className="sr-only">{hero.title.join(" ")}</h1>
          )}
        </div>
      </div>
    </section>
  );
}
