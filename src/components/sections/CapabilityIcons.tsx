import {
  Blocks,
  Handshake,
  HardHat,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

const CAPABILITY_ICONS: readonly LucideIcon[] = [
  Blocks,
  HardHat,
  Settings2,
  Handshake,
];

export function CapabilityIcon({ index, className }: { index: number; className?: string }) {
  const Icon = CAPABILITY_ICONS[index] ?? Blocks;

  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-start overflow-visible will-change-transform",
        "transition-transform duration-[350ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
        "group-hover:-translate-y-1 group-hover:scale-105 group-focus-visible:-translate-y-1 group-focus-visible:scale-105",
        className,
      )}
      aria-hidden
    >
      <Icon
        strokeWidth={1.75}
        aria-hidden
        className="size-6 text-[#777777] transition-colors duration-[350ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:text-white group-focus-visible:text-white md:size-[26px] lg:size-7"
      />
    </span>
  );
}
