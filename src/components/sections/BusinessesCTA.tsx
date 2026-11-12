"use client";

import { useLayoutEffect, useRef } from "react";
import { CTAContent } from "@/components/cta/CTAContent";
import { ParallaxBrand } from "@/components/cta/ParallaxBrand";
import { DESKTOP_MOTION, gsap, registerMotion, ScrollTrigger } from "@/lib/motion";

export function BusinessesCTA() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const brand = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    const pinned = pin.current;
    const mark = brand.current;
    const copy = content.current;
    if (!section || !pinned || !mark || !copy) return;

    registerMotion();
    const parts = Array.from(copy.querySelectorAll<HTMLElement>("[data-cta-part]"));
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      gsap.set(mark, { y: 18, opacity: 0.12 });
      gsap.set(parts, { autoAlpha: 0, y: 24 });

      const story = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pinned,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 1.7)}`,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      story.to(mark, { y: 10, opacity: 0.14, duration: 0.25 }, 0);
      story.to(mark, { y: -4, opacity: 0.15, duration: 0.25 }, 0.25);
      story.to(mark, { y: -12, opacity: 0.16, duration: 0.25 }, 0.5);
      parts.forEach((part, index) => {
        const fromY = index === 0 ? 15 : index === 1 ? 35 : index === 2 ? 20 : 16;
        story.fromTo(
          part,
          { autoAlpha: 0, y: fromY },
          { autoAlpha: 1, y: 0, duration: 0.14 },
          0.5 + index * 0.045,
        );
      });
      story.to(mark, { y: -18, opacity: 0.15, duration: 0.25 }, 0.75);
      story.set(parts, { autoAlpha: 1, y: 0 }, 0.72);

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        story.scrollTrigger?.kill();
        story.kill();
      };
    });

    mm.add(
      "(max-width: 1023px), (prefers-reduced-motion: reduce), (hover: none), (pointer: coarse)",
      () => {
        gsap.set(mark, { clearProps: "all", opacity: 0.12 });
        gsap.set(parts, { clearProps: "all", autoAlpha: 1, y: 0 });
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={root}
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-charcoal text-white"
    >
      <div ref={pin} className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-[#161616]"
        />
        <ParallaxBrand ref={brand} />
        <CTAContent ref={content} />
      </div>
    </section>
  );
}
