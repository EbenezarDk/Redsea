"use client";

import Image from "next/image";
import { businessesPage } from "@/data/site-content";
import { TextAnimate } from "@/registry/magicui/text-animate";

const BANNER_SRC = "/images/rsi/luxury-glass-office-sunset.png";

export function BusinessesHero() {
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

      <div className="shell relative z-10 flex min-h-[min(100svh,920px)] w-full min-w-0 flex-col items-center justify-end pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] pb-14 sm:pb-20 md:pb-28 lg:min-h-[100svh] lg:pb-[200px]">
        <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col items-center gap-[6px] text-center">
          <TextAnimate
            animation="fadeIn"
            by="line"
            as="p"
            once
            accessible={false}
            className="type-eyebrow font-body text-white/80"
          >
            {businessesPage.eyebrow}
          </TextAnimate>
          <TextAnimate
            animation="fadeIn"
            by="word"
            as="h1"
            once
            delay={0.08}
            accessible={false}
            className="hero-headline w-full max-w-full font-display font-normal"
            segmentClassName="!inline !whitespace-normal"
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            {businessesPage.title.join(" ")}
          </TextAnimate>
          <TextAnimate
            animation="fadeIn"
            by="line"
            as="p"
            once
            delay={0.16}
            accessible={false}
            className="type-body w-full max-w-2xl font-body leading-relaxed text-white"
            style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
          >
            {businessesPage.body}
          </TextAnimate>
        </div>
      </div>
    </section>
  );
}
