"use client";

import { useLayoutEffect, useRef } from "react";
import { businessesPage } from "@/data/site-content";
import { gsap, registerMotion } from "@/lib/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function BusinessesHero() {
  const path = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const line = path.current;
    if (!line) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerMotion();
    const length = line.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 1.7,
        ease: "power2.inOut",
        delay: 0.25,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="businesses-intro" className="relative overflow-hidden bg-charcoal text-white">
      <div className="shell flex min-h-[100svh] flex-col justify-end pb-28 pt-32">
        <Eyebrow light>{businessesPage.eyebrow}</Eyebrow>
        <h1 className="mt-5 font-display text-[clamp(2.05rem,5.6vw,6rem)] font-normal leading-[0.95] tracking-[-0.02em]">
          {businessesPage.title.map((line, index) => (
            <span key={line} className="block overflow-hidden">
              <span className="hero-reveal block" style={{ animationDelay: `${0.08 + index * 0.12}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className="type-body mt-6 max-w-2xl font-body leading-relaxed text-white/80">
          {businessesPage.body}
        </p>
      </div>
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-28 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          ref={path}
          d="M120 0 V48 H1440"
          fill="none"
          stroke="#d71932"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
}
