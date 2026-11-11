"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { businesses, businessPreview } from "@/data/site-content";
import { DESKTOP_MOTION, gsap, registerMotion } from "@/lib/motion";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollScene } from "@/components/motion/ScrollScene";

export function BusinessPreview() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const pinned = pin.current;
    const track = row.current;
    if (!pinned || !track) return;
    registerMotion();
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 48),
        ease: "none",
        scrollTrigger: {
          trigger: pinned,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
            const next = Math.min(
              businesses.length - 1,
              Math.floor(self.progress * businesses.length * 0.999),
            );
            setActive((current) => (current === next ? current : next));
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <ScrollScene id="businesses" ref={root} className="bg-paper">
      <div ref={pin} className="pin-layout hidden h-[100svh] flex-col lg:flex">
        <div className="shell flex items-end justify-between gap-8 pt-28">
          <SectionHeading
            eyebrow={businessPreview.eyebrow}
            title={businessPreview.title}
            titleId="businesses-title"
          >
            {businessPreview.intro}
          </SectionHeading>
          <p className="pb-2 font-display text-4xl font-normal tracking-[-0.04em] text-charcoal/70">
            0{active + 1}
            <span className="text-xl"> / 05</span>
          </p>
        </div>
        <div className="relative mt-8 min-h-0 flex-1 overflow-hidden">
          <div ref={row} className="flex h-full items-stretch gap-5 pr-[var(--shell-gutter)] pl-[var(--shell-gutter)] will-change-transform">
            {businesses.map((business) => (
              <Link
                key={business.id}
                href={`/businesses#${business.id}`}
                className="group relative block h-full w-[34vw] min-w-[320px] shrink-0 overflow-hidden bg-charcoal text-white"
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105">
                  <AssetFrame id={business.asset} sizes="34vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                <span className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-rsi transition-transform duration-500 group-hover:scale-y-100 group-focus-visible:scale-y-100" />
                <span className="absolute bottom-0 flex flex-col p-6">
                  <span className="text-xs tracking-[0.18em] text-white/75">{business.number}</span>
                  <span className="mt-3 font-display text-4xl font-normal leading-[0.95] tracking-[-0.03em]">
                    {business.title}
                  </span>
                  <span className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                    {business.preview}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="shell py-6">
          <div className="h-px bg-charcoal/15">
            <span ref={bar} className="block h-px origin-left scale-x-0 bg-rsi" />
          </div>
        </div>
      </div>

      <div className="flow-layout shell py-24 md:py-32 lg:hidden">
        <SectionHeading
          eyebrow={businessPreview.eyebrow}
          title={businessPreview.title}
          titleId="businesses-title-flow"
        >
          {businessPreview.intro}
        </SectionHeading>
        <div className="mt-12 border-t border-charcoal/15">
          {businesses.map((business) => (
            <Link
              key={business.id}
              href={`/businesses#${business.id}`}
              className="grid gap-5 border-b border-charcoal/15 py-6 md:grid-cols-12 md:items-center"
            >
              <div className="aspect-[16/10] md:col-span-5">
                <AssetFrame id={business.asset} sizes="(min-width: 768px) 40vw, 100vw" />
              </div>
              <span className="md:col-span-7">
                <span className="text-xs tracking-[0.18em] text-[#3f3d3a]">{business.number}</span>
                <span className="mt-2 block font-display text-4xl font-normal leading-none tracking-[-0.03em]">
                  {business.title}
                </span>
                <span className="mt-3 block max-w-xl text-base leading-relaxed text-graphite">
                  {business.preview}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </ScrollScene>
  );
}
