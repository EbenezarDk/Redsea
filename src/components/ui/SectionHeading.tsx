import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";

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
    <div className={cn("flex w-full flex-col gap-[6px]", className)}>
      {eyebrow ? (
        <Eyebrow light={light} rule={false}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Tag
        id={titleId}
        className={cn(
          "hero-headline w-full font-display font-normal",
          light ? "text-white" : "text-charcoal",
        )}
        style={{ fontSize: 52, marginTop: 0, marginBottom: 0 }}
      >
        {title}
      </Tag>
      {children ? (
        <div
          className={cn(
            "type-body w-full font-body leading-relaxed",
            light ? "text-white/80" : "text-graphite",
          )}
          style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
