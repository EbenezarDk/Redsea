import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealText } from "@/components/motion/RevealText";

export function SectionHeading({
  eyebrow,
  title,
  titleId,
  children,
  light = false,
  as = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  titleId?: string;
  children?: React.ReactNode;
  light?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  const Tag = as;

  return (
    <div className={cn("max-w-4xl", className)}>
      {eyebrow ? <Eyebrow light={light}>{eyebrow}</Eyebrow> : null}
      <Tag
        id={titleId}
        className={cn(
          "font-display text-[clamp(2.5rem,5.2vw,4.8rem)] font-normal leading-[0.92] tracking-[-0.035em]",
          eyebrow && "mt-4",
          light ? "text-white" : "text-charcoal",
        )}
      >
        <RevealText>{title}</RevealText>
      </Tag>
      {children ? (
        <div
          className={cn(
            "type-body mt-6 max-w-2xl font-body leading-[1.65]",
            light ? "text-white/80" : "text-graphite",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
