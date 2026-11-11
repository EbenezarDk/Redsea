import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  light = false,
  rule = true,
}: {
  children: React.ReactNode;
  light?: boolean;
  /** Red accent line before the label. Off for section headers. */
  rule?: boolean;
}) {
  return (
    <p
      className={cn(
        "type-eyebrow flex items-center gap-3 font-body",
        light ? "text-white/80" : "text-[#3f3d3a]",
      )}
    >
      {rule ? <span aria-hidden className="h-px w-8 shrink-0 bg-rsi" /> : null}
      {children}
    </p>
  );
}
