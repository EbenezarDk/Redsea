"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { projectsSection } from "@/data/site-content";
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

export function ProjectProof() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const panels = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [index, setIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const count = projectsSection.items.length;
  const project = projectsSection.items[index];

  useLayoutEffect(() => {
    const pinned = pin.current;
    const stage = panels.current;
    if (!pinned || !stage) return;
    registerMotion();
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      const frames = Array.from(stage.querySelectorAll<HTMLElement>("[data-panel]"));
      setEnhanced(true);
      const story = ScrollTrigger.create({
        trigger: pinned,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = applyWipe(self.progress, frames);
          setIndex((current) => (current === next ? current : next));
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
    const wrapped = (next + count) % count;
    if (trigger.current && scrollToProgress(trigger.current, (wrapped + 0.08) / count)) return;
    setIndex(wrapped);
  }

  return (
    <ScrollScene id="projects" ref={root} className="bg-charcoal text-white">
      <div ref={pin} className="pin-layout hidden lg:block">
        <div className="grid h-[100svh] grid-cols-12">
          <div className="col-span-5 flex min-h-0 flex-col justify-between overflow-y-auto px-10 py-28 xl:px-14">
            <div>
              <Eyebrow light>{projectsSection.eyebrow}</Eyebrow>
              <h2
                id="projects-title"
                className="mt-4 font-display text-[clamp(2.2rem,3.6vw,4rem)] font-normal leading-[0.92] tracking-[-0.035em]"
              >
                {projectsSection.title}
              </h2>
              <p className="type-body mt-5 max-w-md font-body leading-relaxed text-white/75">{projectsSection.body}</p>
            </div>
            <div>
              <p className="font-display text-sm tracking-[0.18em] text-white/60">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-[clamp(2rem,3vw,3.4rem)] font-normal leading-[0.95] tracking-[-0.03em]">
                {project.title}
              </h3>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-white/80">{project.description}</p>
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => select(index - 1)}
                  className="min-h-11 border border-white/30 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => select(index + 1)}
                  className="min-h-11 border border-white/30 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
                >
                  Next
                </button>
              </div>
              <div className="mt-6 flex gap-2">
                {projectsSection.items.map((item, itemIndex) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Show ${item.title}`}
                    aria-pressed={itemIndex === index}
                    onClick={() => select(itemIndex)}
                    className={cn("h-8 w-8", itemIndex === index ? "bg-rsi" : "bg-white/25")}
                  />
                ))}
              </div>
            </div>
          </div>
          <div ref={panels} className="relative col-span-7 overflow-hidden">
            {projectsSection.items.map((item, itemIndex) => (
              <div
                key={item.title}
                data-panel
                className={cn("absolute inset-0", !enhanced && itemIndex !== index && "opacity-0")}
              >
                <AssetFrame id={item.asset} sizes="58vw" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flow-layout lg:hidden">
        <div className="shell py-24 md:py-32">
          <Eyebrow light>{projectsSection.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,8vw,4.5rem)] font-normal leading-[0.92] tracking-[-0.035em]">
            {projectsSection.title}
          </h2>
          <p className="type-body mt-5 max-w-2xl font-body leading-relaxed text-white/80">{projectsSection.body}</p>
        </div>
        <div>
          {projectsSection.items.map((item, itemIndex) => (
            <article key={item.title} className="relative min-h-[78vw] border-t border-white/10">
              <div className="absolute inset-0">
                <AssetFrame id={item.asset} sizes="100vw" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-transparent" />
              <div className="relative flex min-h-[78vw] flex-col justify-end p-6 md:p-10">
                <p className="text-xs tracking-[0.18em] text-white/75">
                  {String(itemIndex + 1).padStart(2, "0")} / 04
                </p>
                <h3 className="mt-3 font-display text-4xl font-normal leading-none tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-lg text-base text-white/80">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ScrollScene>
  );
}
