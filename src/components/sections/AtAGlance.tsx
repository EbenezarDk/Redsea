"use client";

import { useEffect, useRef, useState } from "react";
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

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AtAGlance() {
  const root = useRef<HTMLElement>(null);
  const [reduced] = useState(prefersReducedMotion);
  const [region, setRegion] = useState<FootprintRegionId>("all");
  const [statsActive, setStatsActive] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const section = root.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <ScrollScene
      id="at-a-glance"
      ref={root}
      labelledBy="at-a-glance-title"
      className="bg-paper text-charcoal"
    >
      <div className="shell section-pad flex flex-col gap-10 lg:gap-12">
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
              <WorldFootprintMap region={region} revealProgress={1} interactive />
            </div>
            <p className="mt-3 text-right text-[0.68rem] leading-relaxed text-charcoal/45">
              Highlighted markets reflect documented geographical project experience — not a map of
              current RSI offices.
            </p>
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}
