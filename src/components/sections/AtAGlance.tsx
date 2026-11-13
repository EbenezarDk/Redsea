"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatedStat } from "@/components/at-a-glance/AnimatedStat";
import { RegionFilter } from "@/components/at-a-glance/RegionFilter";
import { WorldFootprintMap } from "@/components/at-a-glance/WorldFootprintMap";
import { ScrollScene } from "@/components/motion/ScrollScene";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  regionFilters,
  type FootprintRegionId,
} from "@/data/rsiGeographicExperience";
import { atAGlanceCopy, atAGlanceStats } from "@/data/rsiStatistics";
import { DESKTOP_MOTION, gsap, registerMotion, ScrollTrigger } from "@/lib/motion";
import { cn } from "@/lib/cn";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AtAGlance() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [reduced] = useState(prefersReducedMotion);
  const statsArmed = useRef(reduced);
  const [region, setRegion] = useState<FootprintRegionId>("all");
  const [statsActive, setStatsActive] = useState(reduced);
  const [mapReveal, setMapReveal] = useState(reduced ? 1 : 0);
  const [mapInteractive, setMapInteractive] = useState(reduced);

  useLayoutEffect(() => {
    const section = root.current;
    const pinned = pin.current;
    if (!section || !pinned || reduced) return;

    registerMotion();

    const armStats = () => {
      if (statsArmed.current) return;
      statsArmed.current = true;
      setStatsActive(true);
    };

    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      // Content stays painted under Businesses; pin scrub fills the map 0 → 1.
      const approach = ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        once: true,
        onEnter: armStats,
      });

      const reveal = { value: 0 };
      // Fill every market on the first scrub beat, then a short hold before unpin.
      const story = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pinned,
          start: "top top",
          end: "+=75%",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: armStats,
          onUpdate: () => {
            armStats();
            const p = reveal.value;
            setMapReveal(p);
            setMapInteractive(p >= 0.98);
          },
          onLeave: () => {
            armStats();
            reveal.value = 1;
            setMapReveal(1);
            setMapInteractive(true);
          },
          onLeaveBack: () => {
            setMapInteractive(false);
          },
        },
      });

      story
        .to(reveal, { value: 1, duration: 0.55 }, 0)
        .to({}, { duration: 0.2 }, 0.55);

      return () => {
        approach.kill();
        story.scrollTrigger?.kill();
        story.kill();
      };
    });

    // Narrow screens only — do not also match coarse pointers on wide desktops
    // (that was snapping the map to fully filled on enter).
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        once: true,
        onEnter: () => {
          armStats();
          setMapReveal(1);
          setMapInteractive(true);
        },
      });

      return () => {
        trigger.kill();
      };
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <ScrollScene
      id="at-a-glance"
      ref={root}
      labelledBy="at-a-glance-title"
      className="bg-paper text-charcoal"
    >
      <div
        ref={pin}
        className={cn(
          "lg:min-h-[100svh]",
          reduced ? "py-16 md:py-20" : "lg:flex lg:h-[100svh] lg:flex-col lg:justify-center",
        )}
      >
        <div className="shell flex flex-col gap-10 py-16 md:py-20 lg:gap-12 lg:py-24">
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="flex w-full max-w-3xl flex-col gap-[6px] lg:flex-1">
              <Eyebrow rule={false}>{atAGlanceCopy.eyebrow}</Eyebrow>
              <h2
                id="at-a-glance-title"
                className="hero-headline font-display font-normal"
                style={{ fontSize: "clamp(2rem, 3.2vw, 3.25rem)", marginTop: 0, marginBottom: 0 }}
              >
                Built on Experience.
                <br />
                Connected Worldwide.
              </h2>
              <p
                className="type-body w-full font-body leading-relaxed text-graphite"
                style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
              >
                {atAGlanceCopy.body}
              </p>
            </div>
            <RegionFilter
              options={regionFilters}
              value={region}
              onChange={setRegion}
              className="w-full shrink-0 lg:w-auto lg:justify-end"
            />
          </div>

          <div className="grid w-full gap-10 lg:grid-cols-10 lg:gap-12">
            <div className="grid grid-cols-2 items-stretch gap-x-8 gap-y-8 lg:col-span-4">
              {atAGlanceStats.map((stat, index) => (
                <AnimatedStat
                  key={stat.id}
                  stat={stat}
                  index={index}
                  active={statsActive}
                  reduced={reduced}
                />
              ))}
            </div>

            <div className="flex flex-col lg:col-span-6">
              <div className="relative min-h-[320px] w-full flex-1 sm:min-h-[400px] lg:min-h-[480px]">
                <WorldFootprintMap
                  region={region}
                  revealProgress={mapReveal}
                  interactive={mapInteractive || reduced}
                />
              </div>
              <p className="mt-3 text-right text-[0.68rem] leading-relaxed text-charcoal/45">
                Highlighted markets reflect documented geographical project experience — not a map of
                current RSI offices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}
