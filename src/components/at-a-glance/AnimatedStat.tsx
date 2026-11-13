"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import type { AtAGlanceStat } from "@/data/rsiStatistics";
import { cn } from "@/lib/cn";

type AnimatedStatProps = {
  stat: AtAGlanceStat;
  active: boolean;
  reduced: boolean;
  className?: string;
  index?: number;
};

function formatQuantity(stat: AtAGlanceStat, value: number) {
  const rounded = Math.round(value);
  const core = stat.pad
    ? String(rounded).padStart(stat.pad, "0")
    : stat.comma
      ? rounded.toLocaleString("en-US")
      : String(rounded);
  return `${stat.prefix ?? ""}${core}${stat.suffix ?? ""}`;
}

export function AnimatedStat({
  stat,
  active,
  reduced,
  className,
  index = 0,
}: AnimatedStatProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;

    if (reduced) {
      el.textContent = formatQuantity(stat, stat.value);
      return;
    }

    if (!active || ran.current) {
      if (ran.current) el.textContent = formatQuantity(stat, stat.value);
      return;
    }

    ran.current = true;
    const state = { value: 0 };
    const tween = gsap.to(state, {
      value: stat.value,
      duration: 1.9,
      delay: index * 0.15,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatQuantity(stat, state.value);
      },
      onComplete: () => {
        el.textContent = formatQuantity(stat, stat.value);
      },
    });

    return () => {
      tween.kill();
    };
  }, [active, index, reduced, stat]);

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col justify-center border-t border-charcoal/15 pt-5",
        className,
      )}
    >
      <span className="sr-only">{stat.srLabel}</span>
      <p
        aria-hidden
        className="font-display font-normal leading-none tracking-[-0.03em] text-rsi tabular-nums"
        style={{ fontSize: 52 }}
      >
        <span ref={valueRef}>{reduced ? formatQuantity(stat, stat.value) : formatQuantity(stat, 0)}</span>
      </p>
      <p aria-hidden className="type-body mt-3 font-body font-medium leading-snug text-charcoal">
        {stat.label}
      </p>
      <p aria-hidden className="type-body mt-1 font-body leading-snug text-graphite">
        {stat.support}
      </p>
    </div>
  );
}
