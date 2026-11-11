"use client";

import { useLayoutEffect, useRef } from "react";
import { contact } from "@/data/site-content";
import { gsap, registerMotion } from "@/lib/motion";
import { Button } from "@/components/ui/Button";

type Action = {
  label: string;
  href: string;
  external?: boolean;
};

export function CTA({
  id = "contact",
  primary,
  secondary,
}: {
  id?: string;
  primary: Action;
  secondary?: Action;
}) {
  const root = useRef<HTMLElement>(null);
  const shape = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    const block = shape.current;
    if (!section || !block) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        block,
        { scale: 0.72 },
        {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id={id} aria-labelledby={`${id}-title`} ref={root} className="relative overflow-hidden bg-charcoal text-white">
      <div
        ref={shape}
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-1/2 h-[140%] w-[46%] -translate-y-1/2 border border-rsi/80"
      >
        <div className="absolute inset-[12%] bg-rsi" />
      </div>
      <div className="shell relative grid gap-10 py-24 md:py-32 lg:grid-cols-12 lg:py-40">
        <div className="lg:col-span-7">
          <h2
            id={`${id}-title`}
            className="max-w-[12ch] font-display text-[clamp(2.8rem,6vw,5.4rem)] font-normal leading-[0.9] tracking-[-0.04em]"
          >
            {contact.title}
          </h2>
          <p className="type-body mt-6 max-w-xl font-body leading-relaxed text-white/80">
            <span className="type-eyebrow mb-2 block tracking-[0.18em] text-white">
              {contact.supportNote}
            </span>
            {contact.support}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">{contact.handoff}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {secondary ? (
              <Button href={secondary.href} variant="secondary" external={secondary.external}>
                {secondary.label}
              </Button>
            ) : null}
            <Button href={primary.href} external={primary.external} variant={secondary ? "light" : "primary"}>
              {primary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
