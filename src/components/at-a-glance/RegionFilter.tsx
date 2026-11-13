"use client";

import type { FootprintRegionId, RegionFilterOption } from "@/data/rsiGeographicExperience";
import { cn } from "@/lib/cn";

type RegionFilterProps = {
  options: readonly RegionFilterOption[];
  value: FootprintRegionId;
  onChange: (id: FootprintRegionId) => void;
  className?: string;
};

export function RegionFilter({ options, value, onChange, className }: RegionFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Geographic regions"
      className={cn(
        "flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "shrink-0 border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
              active
                ? "border-rsi bg-rsi text-white"
                : "border-charcoal/20 bg-transparent text-charcoal/65 hover:border-charcoal/40 hover:text-charcoal",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
