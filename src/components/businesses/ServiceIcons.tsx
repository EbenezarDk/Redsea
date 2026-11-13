"use client";

import { useRef, type PointerEvent } from "react";
import { cn } from "@/lib/cn";

type IconProps = {
  active?: boolean;
  className?: string;
};

const ICON_BOX = "block size-11 shrink-0 overflow-hidden";

function strokeClass(active?: boolean, extra?: string) {
  return cn("service-icon-stroke", extra, active && "service-icon-stroke-active");
}

export function ModularIcon({ active, className }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" width={44} height={44} className={cn(ICON_BOX, className)} aria-hidden>
      <rect x="14" y="44" width="24" height="20" className={strokeClass(active)} />
      <rect x="42" y="44" width="24" height="20" className={strokeClass(active, "service-icon-mod-b")} />
      <rect x="28" y="18" width="24" height="20" className={strokeClass(active, "service-icon-mod-c")} />
      <path d="M28 38h24M24 54h8M48 54h8" className={strokeClass(active)} />
    </svg>
  );
}

export function FacilitiesIcon({ active, className }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" width={44} height={44} className={cn(ICON_BOX, className)} aria-hidden>
      <path d="M18 64V30l22-14 22 14v34H18Z" className={strokeClass(active)} />
      <path d="M34 64V48h12v16" className={strokeClass(active)} />
      <g className={cn("origin-[56px_24px]", active ? "service-icon-spin" : "service-icon-spin-slow")}>
        <circle cx="56" cy="24" r="9" className={strokeClass(active)} />
        <path
          d="M56 17v3.5M56 27.5V31M49 24h3.5M59.5 24H63M51.1 19.1l2.5 2.5M58.4 26.4l2.5 2.5M51.1 28.9l2.5-2.5M58.4 21.6l2.5-2.5"
          className={strokeClass(active)}
        />
      </g>
    </svg>
  );
}

export function MepIcon({ active, className }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" width={44} height={44} className={cn(ICON_BOX, className)} aria-hidden>
      <path d="M16 28h16v24H16" className={strokeClass(active, "service-icon-draw")} />
      <path d="M32 40h16" className={strokeClass(active, "service-icon-pulse")} />
      <path d="M48 20v40h16" className={strokeClass(active, "service-icon-draw-delay")} />
      <circle cx="20" cy="28" r="3" className={cn("service-icon-fill service-icon-blink", active && "service-icon-fill-active")} />
      <circle cx="64" cy="60" r="3" className={cn("service-icon-fill service-icon-blink-delay", active && "service-icon-fill-active")} />
      <path d="M40 28v-8M40 52v8" className={strokeClass(active)} />
    </svg>
  );
}

export function RealEstateIcon({ active, className }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" width={44} height={44} className={cn(ICON_BOX, className)} aria-hidden>
      <path d="M16 64V30L40 16l24 14v34H16Z" className={strokeClass(active)} />
      <path d="M32 64V48h16v16" className={strokeClass(active)} />
      <g className={active ? "service-icon-windows" : undefined}>
        <rect x="26" y="32" width="8" height="8" className="service-icon-window" />
        <rect x="36" y="32" width="8" height="8" className="service-icon-window service-icon-window-2" />
        <rect x="46" y="32" width="8" height="8" className="service-icon-window service-icon-window-3" />
      </g>
    </svg>
  );
}

export function InvestmentIcon({ active, className }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" width={44} height={44} className={cn(ICON_BOX, className)} aria-hidden>
      <circle cx="24" cy="46" r="8" className={strokeClass(active)} />
      <circle cx="56" cy="24" r="8" className={strokeClass(active)} />
      <circle cx="56" cy="56" r="8" className={strokeClass(active)} />
      <path d="M31 42l18-12M31 50l18 6" className={strokeClass(active, "service-icon-draw")} />
      <path d="M18 66h44" className={strokeClass(active)} />
      <path d="M24 62v-6M36 62V48M50 62V36M62 62V28" className={strokeClass(active, "service-icon-bars")} />
    </svg>
  );
}

const ICONS = {
  modular: ModularIcon,
  "facilities-ops": FacilitiesIcon,
  mep: MepIcon,
  "real-estate-dev": RealEstateIcon,
  "investment-partnerships": InvestmentIcon,
} as const;

export function ServiceIcon({
  id,
  active,
  className,
}: {
  id: string;
  active?: boolean;
  className?: string;
}) {
  const Icon = ICONS[id as keyof typeof ICONS] ?? ModularIcon;
  return <Icon active={active} className={className} />;
}

export function InteractiveServiceIcon({
  id,
  active,
  className,
}: {
  id: string;
  active?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);

  function onPointerMove(event: PointerEvent<HTMLSpanElement>) {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translate3d(${x * 6}px, ${y * 6}px, 0) rotate(${x * 8}deg)`;
  }

  function onPointerLeave() {
    const el = root.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0) rotate(0deg)";
  }

  return (
    <span
      ref={root}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center overflow-hidden transition-transform duration-200 ease-out will-change-transform",
        className,
      )}
    >
      <ServiceIcon id={id} active={active} />
    </span>
  );
}
