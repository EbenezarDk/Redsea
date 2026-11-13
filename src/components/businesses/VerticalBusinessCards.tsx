"use client";

import { useLayoutEffect, useRef } from "react";
import { businesses, businessesPage } from "@/data/site-content";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { gsap, registerMotion, ScrollTrigger } from "@/lib/motion";

export function VerticalBusinessCards() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panels = Array.from(section.querySelectorAll<HTMLElement>("[data-business-panel]"));

    if (reduced) {
      gsap.set(section.querySelectorAll("[data-panel-image], [data-panel-copy]"), {
        clearProps: "all",
      });
      return;
    }

    registerMotion();
    const ctx = gsap.context(() => {
      panels.forEach((panel) => {
        const image = panel.querySelector<HTMLElement>("[data-panel-image]");
        const copyParts = panel.querySelectorAll<HTMLElement>("[data-panel-copy]");

        if (image) gsap.set(image, { scale: 1.06 });
        gsap.set(copyParts, { autoAlpha: 0, y: 25 });

        const story = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
            once: true,
            toggleActions: "play none none none",
          },
        });

        if (image) {
          story.to(image, { scale: 1, duration: 0.9, ease: "power3.out" }, 0);
        }
        story.to(
          copyParts,
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
          0.12,
        );
      });
    }, section);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-label="Five businesses"
      className="bg-paper text-charcoal"
    >
      <div className="shell section-pad">
        <div className="flex flex-col">
          {businesses.map((business, index) => {
            const imageLeft = index % 2 === 0;

            return (
              <article
                key={business.id}
                id={business.id}
                data-business-panel
                className={cn(
                  "group grid grid-cols-1 lg:grid-cols-12",
                  index > 0 &&
                    index < businesses.length - 1 &&
                    "border-y border-charcoal/15",
                )}
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden sm:min-h-[20rem] lg:col-span-5 lg:aspect-auto lg:min-h-[clamp(26rem,42vw,31.25rem)]",
                    imageLeft ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  <div
                    data-panel-image
                    className="absolute inset-0 origin-center will-change-transform"
                  >
                    <AssetFrame
                      id={business.asset}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      priority={index === 0}
                      className="h-full w-full [&_img]:duration-[400ms] [&_img]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_img]:group-hover:!scale-[1.035]"
                    />
                  </div>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-rsi transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                  />
                </div>

                <div
                  className={cn(
                    "flex flex-col justify-center px-5 py-8 sm:px-8 md:px-10 lg:col-span-7 lg:px-12 xl:px-16",
                    imageLeft ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <p
                    data-panel-copy
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-rsi"
                  >
                    {business.label}
                  </p>
                  <h3
                    data-panel-copy
                    className="mt-3 font-display font-normal leading-[0.95] tracking-[-0.03em] text-charcoal"
                    style={{ fontSize: "clamp(30px, 3.2vw, 58px)" }}
                  >
                    {business.title}
                  </h3>
                  <p
                    data-panel-copy
                    className="type-body mt-5 max-w-[36rem] font-body leading-relaxed text-graphite"
                  >
                    {business.paragraph}
                  </p>
                  <div data-panel-copy className="mt-7 self-start">
                    <Button
                      href={`#${business.serviceAnchor}`}
                      variant="primary"
                    >
                      {businessesPage.exploreLabel}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
