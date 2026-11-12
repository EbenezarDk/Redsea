"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { businessesPage } from "@/data/site-content";
import { gsap, registerMotion } from "@/lib/motion";
import { TextAnimate } from "@/registry/magicui/text-animate";

const BANNER_SRC = "/images/rsi/luxury-glass-office-sunset.png";

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
      <Image
        src={BANNER_SRC}
        alt="Luxury glass-walled office interior overlooking a city skyline at sunset."
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/35"
      />

      <div className="shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-32">
        <div className="flex flex-col gap-[6px]">
          <TextAnimate
            animation="fadeIn"
            by="line"
            as="p"
            once
            className="type-eyebrow font-body text-white/80"
          >
            {businessesPage.eyebrow}
          </TextAnimate>
          <TextAnimate
            animation="fadeIn"
            by="text"
            as="h1"
            once
            delay={0.08}
            className="hero-headline font-display font-normal"
            style={{ fontSize: 52, marginTop: 0, marginBottom: 0 }}
          >
            {businessesPage.title.join(" ")}
          </TextAnimate>
          <TextAnimate
            animation="fadeIn"
            by="line"
            as="p"
            once
            delay={0.16}
            className="type-body w-full max-w-none font-body leading-relaxed text-white/80"
            style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
          >
            {businessesPage.body}
          </TextAnimate>
        </div>
      </div>
      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-28 w-full"
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
