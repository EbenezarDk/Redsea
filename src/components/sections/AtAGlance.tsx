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

export function AtAGlance() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const statsArmed = useRef(false);
  const [region, setRegion] = useState<FootprintRegionId>("all");
  const [statsActive, setStatsActive] = useState(false);
  const [mapReveal, setMapReveal] = useState(0);
  const [mapInteractive, setMapInteractive] = useState(false);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const section = root.current;
    const pinned = pin.current;
    const intro = introRef.current;
    const stats = statsRef.current;
    const map = mapRef.current;
    if (!section || !pinned || !intro || !stats || !map) return;

    registerMotion();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduceMotion);

    if (reduceMotion) {
      statsArmed.current = true;
      setStatsActive(true);
      setMapReveal(1);
      setMapInteractive(true);
      gsap.set([intro, stats, map], { clearProps: "all" });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      gsap.set(intro, { autoAlpha: 0, y: 28 });
      gsap.set(stats, { autoAlpha: 0, y: 36 });
      gsap.set(map, { autoAlpha: 0, y: 24 });

      const story = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pinned,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p >= 0.2 && !statsArmed.current) {
              statsArmed.current = true;
              setStatsActive(true);
            }
            setMapReveal(gsap.utils.clamp(0, 1, (p - 0.4) / 0.35));
            setMapInteractive(p >= 0.75);
          },
          onLeave: () => {
            statsArmed.current = true;
            setStatsActive(true);
            setMapReveal(1);
            setMapInteractive(true);
          },
        },
      });

      story
        .to(intro, { autoAlpha: 1, y: 0, duration: 0.2 }, 0)
        .to(stats, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.18)
        .to(map, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.38)
        .to(map, { y: -12, duration: 0.35 }, 0.55)
        .to({}, { duration: 0.25 }, 0.75);

      return () => {
        story.scrollTrigger?.kill();
        story.kill();
      };
    });

    mm.add(
      "(max-width: 1023px) and (prefers-reduced-motion: no-preference), (hover: none) and (pointer: coarse) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.set([intro, stats, map], { clearProps: "all" });

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          once: true,
          onEnter: () => {
            statsArmed.current = true;
            setStatsActive(true);
            setMapReveal(1);
            setMapInteractive(true);
          },
        });

        const parallax = gsap.fromTo(
          map,
          { y: 18 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: map,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        return () => {
          trigger.kill();
          parallax.scrollTrigger?.kill();
          parallax.kill();
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <ScrollScene
      id="at-a-glance"
      ref={root}
      labelledBy="at-a-glance-title"
      className="bg-charcoal text-white"
    >
      <div
        ref={pin}
        className={cn(
          "lg:min-h-[100svh]",
          reduced ? "py-16 md:py-20" : "lg:flex lg:h-[100svh] lg:flex-col lg:justify-center",
        )}
      >
        <div className="shell flex flex-col gap-10 py-16 md:py-20 lg:gap-12 lg:py-24">
          {/* Top stack: intro + region filters, full container width */}
          <div
            ref={introRef}
            className="flex w-full flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="flex w-full max-w-3xl flex-col gap-[6px] lg:flex-1">
              <Eyebrow light rule={false}>
                {atAGlanceCopy.eyebrow}
              </Eyebrow>
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
                className="type-body w-full font-body leading-relaxed text-white/70"
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

          {/* Lower stack: stats + flat map */}
          <div className="grid w-full gap-10 lg:grid-cols-10 lg:gap-12">
            <div
              ref={statsRef}
              className="grid grid-cols-2 items-stretch gap-x-8 gap-y-8 lg:col-span-4"
            >
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

            <div ref={mapRef} className="flex flex-col lg:col-span-6">
              <div className="relative min-h-[320px] w-full flex-1 sm:min-h-[400px] lg:min-h-[480px]">
                <WorldFootprintMap
                  region={region}
                  revealProgress={mapReveal}
                  interactive={mapInteractive || reduced}
                />
              </div>
              <p className="mt-3 text-right text-[0.68rem] leading-relaxed text-white/40">
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
