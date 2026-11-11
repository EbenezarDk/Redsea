"use client";

import { useLayoutEffect, useRef } from "react";
import { about } from "@/data/site-content";
import { DESKTOP_MOTION, gsap, registerMotion } from "@/lib/motion";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollScene } from "@/components/motion/ScrollScene";

export function About() {
  const root = useRef<HTMLElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);
  const stats = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    registerMotion();
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      if (first.current) {
        gsap.to(first.current, {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (second.current) {
        gsap.to(second.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = stats.current?.querySelectorAll("li");
      if (!items?.length) return;
      gsap.from(items, {
        y: 24,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: stats.current,
          start: "top 85%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <ScrollScene id="about" ref={root} labelledBy="about-title" className="bg-paper">
      <div className="shell grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-16 lg:py-40">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <SectionHeading eyebrow={about.eyebrow} title={about.title} titleId="about-title">
            <p>{about.body}</p>
            <p className="mt-4">{about.support}</p>
          </SectionHeading>
          <div className="mt-8">
            <Button href={about.cta.href} variant="secondary" className="border-charcoal">
              {about.cta.label}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="grid gap-6 sm:grid-cols-2">
            <div ref={first} className="sm:mt-16">
              <div className="aspect-[4/5]">
                <AssetFrame id={about.images[0]} sizes="(min-width: 1024px) 28vw, 90vw" />
              </div>
            </div>
            <div ref={second}>
              <div className="aspect-[4/5]">
                <AssetFrame id={about.images[1]} sizes="(min-width: 1024px) 28vw, 90vw" />
              </div>
            </div>
          </div>
          <ul ref={stats} className="mt-10 divide-y divide-charcoal/15 border-y border-charcoal/15">
            {about.stats.map((stat) => (
              <li key={stat.full} className="flex items-baseline justify-between gap-6 py-5">
                <span className="sr-only">{stat.full}</span>
                <span aria-hidden className="font-display text-5xl font-normal leading-none tracking-[-0.04em] md:text-6xl">
                  {stat.figure}
                </span>
                <span aria-hidden className="max-w-[14rem] text-right text-sm text-graphite">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollScene>
  );
}
