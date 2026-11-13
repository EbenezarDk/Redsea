"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { hero } from "@/data/site-content";
import { gsap, registerMotion } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { TextAnimate } from "@/registry/magicui/text-animate";

/** Original upload is preserved. This copy is all-intra so scroll seeks land on the real frame. */
const HERO_VIDEO_SRC = "/videos/hero-approach-scrub.mp4";

/**
 * Scroll progress → fraction of the real video duration.
 * Approach lands on the centered building frame, then About reveals
 * immediately on continued scroll (no empty hold gap).
 */
/** Lit modular floor centered behind hero copy — matches the settle screenshot. */
const SETTLE_RATIO = 3.35 / 7.85;

const STAGE_MARKS = [
  { p: 0, ratio: 0 },
  { p: 0.38, ratio: SETTLE_RATIO },
  { p: 1, ratio: SETTLE_RATIO },
] as const;

/** About starts as soon as the hero has settled — no dummy mid-scroll. */
const REVEAL_START = 0.42;

function timeForProgress(progress: number, duration: number) {
  const p = Math.min(1, Math.max(0, progress));
  for (let i = 1; i < STAGE_MARKS.length; i++) {
    const prev = STAGE_MARKS[i - 1];
    const next = STAGE_MARKS[i];
    if (p <= next.p || i === STAGE_MARKS.length - 1) {
      const span = next.p - prev.p || 1;
      const local = Math.min(1, Math.max(0, (p - prev.p) / span));
      const ratio = prev.ratio + (next.ratio - prev.ratio) * local;
      const end = Math.max(0, duration - 1 / 24);
      return Math.min(end, Math.max(0, ratio * duration));
    }
  }
  return Math.max(0, duration - 1 / 24);
}

function power2Out(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) * (1 - x);
}

function attachSeeker(video: HTMLVideoElement) {
  const frame = 1 / 24;
  let target = 0;
  let raf = 0;

  const flush = () => {
    raf = 0;
    if (Math.abs(video.currentTime - target) < frame) return;
    video.currentTime = target;
  };

  return {
    seek(time: number) {
      const limit = Number.isFinite(video.duration) ? Math.max(0, video.duration - frame) : time;
      target = Math.min(Math.max(0, time), limit);
      if (!raf) raf = requestAnimationFrame(flush);
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

function setHeaderTone(tone: "light" | "hero" | null) {
  const root = document.documentElement;
  const current = root.dataset.headerTone ?? null;
  const next = tone;
  if (current === next) return;
  if (next) root.dataset.headerTone = next;
  else delete root.dataset.headerTone;
  window.dispatchEvent(new Event("rsi-header-tone"));
}

export function Hero({ children }: { children?: ReactNode }) {
  const storyRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);
  const aboutSlotRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const video = videoRef.current;
    const videoLayer = videoLayerRef.current;
    const copy = copyRef.current;
    const shell = shellRef.current;
    const cue = cueRef.current;
    const scrim = scrimRef.current;
    const aboutSlot = aboutSlotRef.current;
    if (!pin || !video || !videoLayer || !copy || !shell || !cue || !scrim || !aboutSlot) return;

    registerMotion();
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.pause();

    const seeker = attachSeeker(video);
    const holdLastFrame = () => {
      video.pause();
      if (!Number.isFinite(video.duration)) return;
      const last = Math.max(0, video.duration - 1 / 24);
      if (Math.abs(video.currentTime - last) > 1 / 48) video.currentTime = last;
    };
    const onPlay = () => {
      requestAnimationFrame(() => {
        if (!video.paused) video.pause();
      });
    };
    video.addEventListener("ended", holdLastFrame);
    video.addEventListener("play", onPlay);

    const mm = gsap.matchMedia();

    const paintFrame = () => {
      video.pause();
      if (video.currentTime < 0.001) video.currentTime = 0.001;
    };

    const bindStory = (end: string) => {
      // Match negative pull to the real pin height (svh can drift on 2K/scaled displays).
      const pullAbout = () => {
        aboutSlot.style.marginTop = `${-Math.round(pin.getBoundingClientRect().height)}px`;
      };
      pullAbout();
      gsap.set(aboutSlot, { opacity: 0, y: 0, pointerEvents: "none" });
      gsap.set(videoLayer, { autoAlpha: 1 });
      pin.style.backgroundColor = "";

      const sync = (progress: number) => {
        const duration = video.duration;
        if (Number.isFinite(duration) && duration > 0) {
          seeker.seek(timeForProgress(progress, duration));
        }

        if (progress < REVEAL_START) {
          gsap.set(aboutSlot, { opacity: 0, y: 0, pointerEvents: "none" });
          gsap.set(videoLayer, { autoAlpha: 1 });
          pin.style.backgroundColor = "";
          setHeaderTone(null);
          return;
        }

        const t = (progress - REVEAL_START) / (1 - REVEAL_START);
        const eased = power2Out(t);
        const currentY = Number(gsap.getProperty(aboutSlot, "y")) || 0;
        const layoutTop = aboutSlot.getBoundingClientRect().top - currentY;
        const targetTop = 35 * (1 - eased);
        const correction = progress >= 0.999 ? 0 : targetTop - layoutTop;

        gsap.set(aboutSlot, {
          opacity: progress >= 0.999 ? 1 : eased,
          y: correction,
          pointerEvents: eased > 0.85 ? "auto" : "none",
        });
        gsap.set(videoLayer, { autoAlpha: eased >= 0.98 ? 0 : 1 });
        pin.style.backgroundColor = eased > 0.15 ? "#f6f4f1" : "";
        setHeaderTone("light");
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end,
          pin: true,
          // transform pins play better with Lenis on large/2K viewports than fixed
          pinType: "transform",
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: pullAbout,
          onUpdate: (self) => sync(self.progress),
          onRefresh: (self) => {
            pullAbout();
            sync(self.progress);
          },
          onLeave: () => {
            gsap.set(aboutSlot, { y: 0, opacity: 1, pointerEvents: "auto" });
            gsap.set(videoLayer, { autoAlpha: 0 });
            pin.style.backgroundColor = "#f6f4f1";
            setHeaderTone(null);
          },
          onLeaveBack: () => {
            gsap.set(aboutSlot, { y: 0, opacity: 0, pointerEvents: "none" });
            gsap.set(videoLayer, { autoAlpha: 1 });
            pin.style.backgroundColor = "";
            setHeaderTone(null);
          },
        },
      });

      const bottomPad = 96; // matches prior pb-24 resting position
      const placeAtBottom = () => {
        const pinH = pin.clientHeight;
        const shellH = shell.offsetHeight;
        const centeredTop = (pinH - shellH) / 2;
        const bottomTop = pinH - bottomPad - shellH;
        return Math.max(0, bottomTop - centeredTop);
      };

      // Rise to settle, then clear straight into About — no empty hold scroll.
      timeline
        .to(cue, { autoAlpha: 0, duration: 0.06 }, 0.02)
        .fromTo(
          shell,
          { y: () => placeAtBottom() },
          { y: 0, duration: 0.38, ease: "none" },
          0,
        )
        .to(copy, { autoAlpha: 0, duration: 0.1 }, 0.4)
        .to(scrim, { autoAlpha: 0, duration: 0.12 }, 0.4)
        .set({}, {}, 1);

      const arm = () => {
        paintFrame();
        sync(timeline.scrollTrigger?.progress ?? 0);
      };
      if (video.readyState >= 1) arm();
      else video.addEventListener("loadedmetadata", arm, { once: true });

      return () => {
        video.removeEventListener("loadedmetadata", arm);
        aboutSlot.style.marginTop = "";
        pin.style.backgroundColor = "";
        gsap.set(aboutSlot, { clearProps: "all" });
        gsap.set([shell, copy, cue, scrim, videoLayer], { clearProps: "all" });
        setHeaderTone(null);
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    };

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () =>
      bindStory("+=120%"),
    );

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () =>
      bindStory("+=100%"),
    );

    mm.add("(prefers-reduced-motion: reduce)", () => {
      aboutSlot.style.marginTop = "";
      gsap.set(aboutSlot, { clearProps: "all" });
      gsap.set([copy, shell, cue, videoLayer], { clearProps: "all" });
      const show = () => {
        video.pause();
        if (Number.isFinite(video.duration)) {
          video.currentTime = Math.min(
            video.duration * SETTLE_RATIO,
            Math.max(0, video.duration - 0.05),
          );
        }
      };
      if (video.readyState >= 1) show();
      else video.addEventListener("loadedmetadata", show, { once: true });
      return () => video.removeEventListener("loadedmetadata", show);
    });

    return () => {
      video.removeEventListener("ended", holdLastFrame);
      video.removeEventListener("play", onPlay);
      seeker.destroy();
      mm.revert();
      setHeaderTone(null);
    };
  }, []);

  return (
    <div ref={storyRef} className="relative bg-paper">
      <section
        id="top"
        ref={pinRef}
        className="relative z-10 h-[100svh] overflow-hidden bg-charcoal text-white"
      >
        <div ref={videoLayerRef} className="absolute inset-0">
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
          <div ref={scrimRef} className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/25 to-charcoal/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/88 via-charcoal/30 to-charcoal/15" />
          </div>
        </div>
        <div
          ref={copyRef}
          className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center pt-28 pb-24 lg:h-[100svh] lg:min-h-0"
        >
          <div ref={shellRef} className="shell flex w-full flex-col items-center text-center will-change-transform">
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
                style={{ fontSize: 52, marginTop: 0, marginBottom: 0 }}
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
          ref={cueRef}
          href="#about"
          className="absolute bottom-6 right-[var(--shell-gutter)] z-20 flex flex-col items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/80"
        >
          Scroll
          <span className="scroll-line block h-12 w-px bg-gradient-to-b from-rsi to-transparent" />
        </a>
      </section>
      <div ref={aboutSlotRef} className="relative z-30 bg-paper">
        {children}
      </div>
    </div>
  );
}
