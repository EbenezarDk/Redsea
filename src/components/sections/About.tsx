"use client";

import { useLayoutEffect, useRef } from "react";
import { about } from "@/data/site-content";
import { gsap, registerMotion } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollScene } from "@/components/motion/ScrollScene";

function parseStatFigure(figure: string) {
  const match = figure.match(/^(\d+)(.*)$/);
  if (!match) return { value: 0, suffix: figure };
  return { value: Number(match[1]), suffix: match[2] ?? "" };
}

export function About() {
  const root = useRef<HTMLElement>(null);
  const stats = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    const list = stats.current;
    if (!section || !list) return;
    registerMotion();
    const mm = gsap.matchMedia();
    const figures = () => list.querySelectorAll<HTMLElement>("[data-stat-figure]");

    const paintFinal = () => {
      figures().forEach((el) => {
        const target = el.dataset.value ?? "0";
        const suffix = el.dataset.suffix ?? "";
        el.textContent = `${target}${suffix}`;
      });
    };

    mm.add("(prefers-reduced-motion: reduce)", () => {
      paintFinal();
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = list.querySelectorAll<HTMLElement>("li");
      const nodes = figures();
      if (!items.length || !nodes.length) return;

      nodes.forEach((el) => {
        const suffix = el.dataset.suffix ?? "";
        el.textContent = `0${suffix}`;
      });

      const runCounters = () => {
        nodes.forEach((el, index) => {
          const target = Number(el.dataset.value ?? 0);
          const suffix = el.dataset.suffix ?? "";
          // Years run a nearby window so the tick is readable; small figures count from 0.
          const from = target >= 1000 ? Math.max(0, target - 140) : 0;
          const state = { value: from };
          el.textContent = `${from}${suffix}`;
          gsap.to(state, {
            value: target,
            duration: target >= 1000 ? 2.2 : 1.8,
            delay: index * 0.15,
            ease: "power1.out",
            onUpdate: () => {
              el.textContent = `${Math.round(state.value)}${suffix}`;
            },
            onComplete: () => {
              el.textContent = `${target}${suffix}`;
            },
          });
        });
      };

      gsap.from(items, {
        y: 20,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: list,
          start: "top 80%",
          once: true,
          onEnter: runCounters,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <ScrollScene id="about" ref={root} labelledBy="about-title" className="bg-paper">
      <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <div className="flex flex-col gap-[6px]">
            <Eyebrow rule={false}>{about.eyebrow}</Eyebrow>
            <h2
              id="about-title"
              className="hero-headline font-display font-normal"
              style={{ marginTop: 0, marginBottom: 0 }}
            >
              {about.title}
            </h2>
            <p
              className="type-body max-w-xl font-body leading-relaxed text-graphite"
              style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
            >
              {about.body}
            </p>
            <p
              className="type-body max-w-xl font-body !font-bold leading-relaxed text-rsi"
              style={{ marginTop: 0, marginBottom: 0 }}
            >
              {about.support}
            </p>
          </div>
          <div className="mt-8">
            <Button href={about.cta.href} variant="primary">
              {about.cta.label}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal sm:aspect-[16/10]">
            <iframe
              title="Red Sea International — About"
              src={`https://www.youtube.com/embed/${about.videoId}?rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <ul
            ref={stats}
            className="mt-10 grid grid-cols-1 divide-y divide-charcoal/15 border-y border-charcoal/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          >
            {about.stats.map((stat) => {
              const { value, suffix } = parseStatFigure(stat.figure);
              return (
                <li key={stat.full} className="flex flex-col gap-2 px-0 py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                  <span className="sr-only">{stat.full}</span>
                  <span
                    aria-hidden
                    data-stat-figure
                    data-value={value}
                    data-suffix={suffix}
                    className="hero-headline font-display font-normal tabular-nums"
                  >
                    0{suffix}
                  </span>
                  <span aria-hidden className="type-body font-body leading-snug text-graphite">
                    {stat.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </ScrollScene>
  );
}
