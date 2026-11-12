"use client";

import { useLayoutEffect, useRef } from "react";
import { businessesPage } from "@/data/site-content";
import { gsap, registerMotion } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const phases = businessesPage.delivery.phases;

export function IntegratedDelivery() {
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const dots = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    const section = root.current;
    const fill = line.current;
    const nodes = dots.current.filter(Boolean);
    if (!section || !fill || !nodes.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(fill, { scaleX: 1 });
      gsap.set(nodes, { backgroundColor: "#d71932", opacity: 1, clearProps: "opacity" });
      return;
    }

    registerMotion();
    const ctx = gsap.context(() => {
      gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(nodes, { backgroundColor: "#E59EA5", opacity: 1 });

      const apply = (progress: number) => {
        gsap.set(fill, { scaleX: progress });
        nodes.forEach((node, index) => {
          const threshold = index / (nodes.length - 1);
          const active = progress >= threshold - 0.001;
          gsap.set(node, {
            opacity: 1,
            backgroundColor: active ? "#d71932" : "#E59EA5",
          });
        });
      };

      const story = gsap.to(
        {},
        {
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            end: "bottom 62%",
            scrub: true,
            onUpdate: (self) => apply(self.progress),
            onRefresh: (self) => apply(self.progress),
          },
        },
      );

      apply(story.scrollTrigger?.progress ?? 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="delivery" aria-labelledby="delivery-title" className="blueprint">
      <div className="shell py-20">
        <SectionHeading title={businessesPage.delivery.title} titleId="delivery-title">
          <span className="block">{businessesPage.delivery.body}</span>
          <span className="mt-[6px] block">{businessesPage.delivery.bodySecondary}</span>
        </SectionHeading>

        <div className="mt-10 w-full" role="img" aria-label="Design, Build, Operate, Maintain">
          <div className="relative h-4 w-full">
            <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rsi/25" />
            <span
              ref={line}
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 bg-rsi"
            />
            <ol className="absolute inset-0 grid grid-cols-4">
              {phases.map((phase, index) => (
                <li
                  key={phase}
                  className={
                    index === 0
                      ? "flex items-center justify-start"
                      : index === phases.length - 1
                        ? "flex items-center justify-end"
                        : "flex items-center justify-center"
                  }
                >
                  <span
                    ref={(node) => {
                      if (node) dots.current[index] = node;
                    }}
                    aria-hidden
                    className="block size-3.5 rounded-full"
                    style={{ backgroundColor: "#E59EA5" }}
                  />
                </li>
              ))}
            </ol>
          </div>

          <ol className="mt-3 grid grid-cols-4 gap-2">
            {phases.map((phase, index) => (
              <li
                key={phase}
                className={
                  index === 0
                    ? "text-left"
                    : index === phases.length - 1
                      ? "text-right"
                      : "text-center"
                }
              >
                <span className="font-display text-[clamp(1.2rem,2.4vw,2.4rem)] font-normal tracking-[-0.03em]">
                  {phase}
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-graphite">
            {businessesPage.delivery.metaphor}
          </p>
        </div>
      </div>
    </section>
  );
}
