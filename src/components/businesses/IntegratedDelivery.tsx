"use client";

import { useLayoutEffect, useRef } from "react";
import { businessesPage } from "@/data/site-content";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";
import { InViewReveal } from "@/components/motion/InViewReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const phases = businessesPage.delivery.phases;

export function IntegratedDelivery() {
  const root = useRef<HTMLElement>(null);
  const lineH = useRef<HTMLSpanElement>(null);
  const lineV = useRef<HTMLSpanElement>(null);
  const dotsH = useRef<HTMLSpanElement[]>([]);
  const dotsV = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)");

    const paint = (progress: number, horizontal: boolean) => {
      const fill = horizontal ? lineH.current : lineV.current;
      const nodes = (horizontal ? dotsH.current : dotsV.current).filter(Boolean);
      if (!fill || !nodes.length) return;

      if (horizontal) gsap.set(fill, { scaleX: progress, scaleY: 1 });
      else gsap.set(fill, { scaleY: progress, scaleX: 1 });

      nodes.forEach((node, index) => {
        const threshold = nodes.length <= 1 ? 0 : index / (nodes.length - 1);
        const active = progress >= threshold - 0.001;
        gsap.set(node, {
          opacity: 1,
          backgroundColor: active ? "#d71932" : "#E59EA5",
        });
      });
    };

    if (reduced) {
      const sync = () => paint(1, desktop.matches);
      sync();
      desktop.addEventListener("change", sync);
      return () => desktop.removeEventListener("change", sync);
    }

    registerMotion();
    let trigger: ScrollTrigger | null = null;

    const setup = () => {
      trigger?.kill();
      trigger = null;

      const horizontal = desktop.matches;
      const fill = horizontal ? lineH.current : lineV.current;
      const nodes = (horizontal ? dotsH.current : dotsV.current).filter(Boolean);
      if (!fill || !nodes.length) return;

      if (horizontal) {
        gsap.set(fill, { scaleX: 0, scaleY: 1, transformOrigin: "left center" });
      } else {
        gsap.set(fill, { scaleY: 0, scaleX: 1, transformOrigin: "center top" });
      }
      gsap.set(nodes, { backgroundColor: "#E59EA5", opacity: 1 });

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 72%",
        end: "bottom 62%",
        scrub: true,
        onUpdate: (self) => paint(self.progress, horizontal),
        onRefresh: (self) => paint(self.progress, horizontal),
      });

      paint(trigger.progress, horizontal);
    };

    const ctx = gsap.context(setup, section);
    desktop.addEventListener("change", setup);

    return () => {
      desktop.removeEventListener("change", setup);
      trigger?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="delivery" aria-labelledby="delivery-title" className="blueprint">
      <InViewReveal>
        <div className="shell section-pad">
          <SectionHeading title={businessesPage.delivery.title} titleId="delivery-title">
            <span className="block">{businessesPage.delivery.body}</span>
            <span className="mt-[6px] block">{businessesPage.delivery.bodySecondary}</span>
          </SectionHeading>

          <div className="mt-10 w-full" role="img" aria-label="Design, Build, Operate, Maintain">
            {/* Mobile / tablet: vertical timeline */}
            <div className="relative lg:hidden" aria-hidden="true">
              <span
                className="absolute top-1.5 bottom-1.5 left-[6px] w-px -translate-x-1/2 bg-rsi/25"
              />
              <span
                ref={lineV}
                className="absolute top-1.5 bottom-1.5 left-[6px] w-0.5 origin-top -translate-x-1/2 bg-rsi"
              />
              <ol className="relative grid gap-8">
                {phases.map((phase, index) => (
                  <li key={phase.label} className="relative grid grid-cols-[12px_minmax(0,1fr)] gap-4">
                    <span className="relative z-10 flex justify-center pt-1.5">
                      <span
                        ref={(node) => {
                          if (node) dotsV.current[index] = node;
                        }}
                        className="block size-3.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "#E59EA5" }}
                      />
                    </span>
                    <div className="min-w-0">
                      <span className="font-display text-[clamp(1.35rem,5vw,2rem)] font-normal tracking-[-0.03em]">
                        {phase.label}
                      </span>
                      <p className="type-body mt-1.5 max-w-md font-body leading-relaxed text-graphite">
                        {phase.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Desktop: horizontal timeline */}
            <div className="hidden lg:block" aria-hidden="true">
              <div className="relative h-4 w-full">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rsi/25" />
                <span
                  ref={lineH}
                  className="absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 bg-rsi"
                />
                <ol className="absolute inset-0 grid grid-cols-4">
                  {phases.map((phase, index) => (
                    <li
                      key={phase.label}
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
                          if (node) dotsH.current[index] = node;
                        }}
                        className="block size-3.5 rounded-full"
                        style={{ backgroundColor: "#E59EA5" }}
                      />
                    </li>
                  ))}
                </ol>
              </div>

              <ol className="mt-3 grid grid-cols-4 gap-4">
                {phases.map((phase, index) => (
                  <li
                    key={phase.label}
                    className={
                      index === 0
                        ? "text-left"
                        : index === phases.length - 1
                          ? "text-right"
                          : "text-center"
                    }
                  >
                    <span className="whitespace-nowrap font-display text-[clamp(1.2rem,2.4vw,2.4rem)] font-normal tracking-[-0.03em]">
                      {phase.label}
                    </span>
                    <p className="type-body mt-2 font-body leading-relaxed text-graphite">
                      {phase.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </InViewReveal>
    </section>
  );
}
