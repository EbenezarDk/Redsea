"use client";

import { cn } from "@/lib/cn";

type CountryTooltipProps = {
  name: string;
  x: number;
  y: number;
  visible: boolean;
};

export function CountryTooltip({ name, x, y, visible }: CountryTooltipProps) {
  return (
    <div
      role="tooltip"
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none absolute z-20 border border-white/15 bg-[#171717] px-3 py-2 transition-[opacity,transform] duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        left: x,
        top: y,
        transform: visible ? "translate(-50%, calc(-100% - 10px))" : "translate(-50%, calc(-100% - 2px))",
      }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-rsi" />
      <p className="text-[0.72rem] font-semibold tracking-[0.04em] text-white">{name}</p>
      <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-white/55">
        RSI Project Experience
      </p>
    </div>
  );
}
