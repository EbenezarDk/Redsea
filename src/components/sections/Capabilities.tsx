"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { capabilities } from "@/data/site-content";
import {
  applyWipe,
  DESKTOP_MOTION,
  gsap,
  registerMotion,
  scrollToProgress,
  ScrollTrigger,
} from "@/lib/motion";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollScene } from "@/components/motion/ScrollScene";
import { cn } from "@/lib/cn";

export function Capabilities() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [index, setIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);

  useLayoutEffect(() => {
    const section = root.current;
    const pinned = pin.current;
    const stage = panels.current;
    if (!section || !pinned || !stage) return;
    registerMotion();
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      const frames = Array.from(stage.querySelectorAll<HTMLElement>("[data-panel]"));
      setEnhanced(true);
      const story = ScrollTrigger.create({
        trigger: pinned,
        start: "top top",
        end: "+=280%",
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = applyWipe(self.progress, frames);
          setIndex((current) => (current === next ? current : next));
          if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
        },
      });
      trigger.current = story;
      applyWipe(story.progress, frames);
      return () => {
        trigger.current = null;
        setEnhanced(false);
      };
    });

    return () => mm.revert();
  }, []);

  function select(next: number) {
    const story = trigger.current;
    if (story && scrollToProgress(story, (next + 0.08) / capabilities.pillars.length)) return;
    setIndex(next);
  }

  return (
    <ScrollScene id="capabilities" ref={root} className="bg-charcoal text-white">
      <div ref={pin} className="pin-layout hidden lg:block">
        <div className="grid h-[100svh] grid-cols-12">
          <div className="col-span-6 flex min-h-0 flex-col justify-between overflow-y-auto py-28 pl-[var(--shell-gutter)] pr-10 xl:pr-14">
            <div className="flex flex-col gap-[6px]">
              <Eyebrow light rule={false}>
                {capabilities.eyebrow}
              </Eyebrow>
              <h2
                id="capabilities-title"
                className="hero-headline font-display font-normal"
                style={{ fontSize: 52, marginTop: 0, marginBottom: 0 }}
              >
                {capabilities.title[0]}
                <br />
                {capabilities.title[1]}
              </h2>
            </div>
            <ul
              className="mt-8"
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  select(Math.min(capabilities.pillars.length - 1, index + 1));
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  select(Math.max(0, index - 1));
                }
              }}
            >
              {capabilities.pillars.map((pillar, pillarIndex) => {
                const active = index === pillarIndex;
                return (
                  <li key={pillar.title}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => select(pillarIndex)}
                    className={cn(
                      "flex w-full gap-4 border-t border-white/15 py-[20px] text-left",
                      active ? "text-white" : "text-white/75",
                    )}
                  >
                    <span className="flex items-start gap-3 pt-1">
                      <span className={cn("mt-1 h-4 w-px", active ? "bg-rsi" : "bg-white/30")} />
                      <span className="font-display text-sm text-white">0{pillarIndex + 1}</span>
                    </span>
                    <span>
                      <span className="block font-display text-2xl font-normal leading-none tracking-[-0.03em]">
                        {pillar.title}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed">{pillar.body}</span>
                    </span>
                  </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 h-px bg-white/15">
              <span ref={bar} className="block h-px origin-left scale-x-0 bg-rsi" />
            </div>
          </div>
          <div ref={panels} className="relative col-span-6 overflow-hidden">
            {capabilities.pillars.map((pillar, pillarIndex) => (
              <div
                key={pillar.title}
                data-panel
                className={cn(
                  "absolute inset-0 h-full w-full",
                  !enhanced && pillarIndex !== index && "opacity-0",
                )}
              >
                <AssetFrame
                  id={pillar.asset}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="absolute inset-0 h-full w-full"
                  priority={pillarIndex === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flow-layout shell py-24 md:py-32 lg:hidden">
        <div className="flex flex-col gap-[6px]">
          <Eyebrow light rule={false}>
            {capabilities.eyebrow}
          </Eyebrow>
          <h2
            className="hero-headline font-display font-normal"
            style={{ fontSize: 52, marginTop: 0, marginBottom: 0 }}
          >
            {capabilities.title[0]}
            <br />
            {capabilities.title[1]}
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {capabilities.pillars.map((pillar, pillarIndex) => (
            <article key={pillar.title} className="border border-white/15">
              <div className="aspect-[16/10]">
                <AssetFrame id={pillar.asset} sizes="(min-width: 768px) 45vw, 100vw" />
              </div>
              <div className="p-6">
                <p className="flex items-center gap-3 font-display text-sm text-white">
                  <span aria-hidden className="h-px w-6 bg-rsi" />
                  0{pillarIndex + 1}
                </p>
                <h3 className="mt-3 font-display text-3xl font-normal leading-none tracking-[-0.03em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{pillar.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ScrollScene>
  );
}
