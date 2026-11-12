"use client";

import { forwardRef } from "react";
import { officialContactUrl } from "@/data/site-content";
import { cn } from "@/lib/cn";

const copy = {
  eyebrow: "Let’s Work Together",
  title: "Let’s Build the Right Solution.",
  body: "Connect with Red Sea International to discuss your project requirements and explore the right integrated solution.",
  primary: "Discuss Your Project",
  secondary: "Contact Our Team",
} as const;

export const CTAContent = forwardRef<HTMLDivElement, { className?: string }>(function CTAContent(
  { className },
  ref,
) {
  return (
    <div ref={ref} className={cn("shell relative z-10 flex h-full items-end pb-20 md:pb-24 lg:pb-28", className)}>
      <div className="max-w-3xl text-white">
        <p data-cta-part className="type-eyebrow font-body text-white/80">
          {copy.eyebrow}
        </p>
        <h2
          id="contact-title"
          data-cta-part
          className="mt-4 font-display text-[clamp(2.6rem,5.5vw,5rem)] font-normal leading-[0.92] tracking-[-0.04em]"
        >
          {copy.title}
        </h2>
        <p
          data-cta-part
          className="mt-5 max-w-xl font-body text-[0.95rem] leading-relaxed text-white/80 md:text-base"
        >
          {copy.body}
        </p>
        <div data-cta-part className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={officialContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 items-center justify-center gap-3 bg-rsi px-7 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-white transition-[background-color,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-rsi-deep"
          >
            {copy.primary}
            <span
              aria-hidden
              className="inline-block transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[5px]"
            >
              →
            </span>
            <span className="sr-only"> (opens the official Red Sea International website)</span>
          </a>
          <a
            href={officialContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 items-center justify-center gap-3 border border-white bg-transparent px-7 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-white transition-[background-color,color] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-charcoal"
          >
            {copy.secondary}
            <span
              aria-hidden
              className="inline-block transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[5px]"
            >
              →
            </span>
            <span className="sr-only"> (opens the official Red Sea International website)</span>
          </a>
        </div>
      </div>
    </div>
  );
});
