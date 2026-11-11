import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "light";

const variants: Record<Variant, string> = {
  primary: "bg-rsi text-white hover:bg-rsi-deep",
  secondary: "border border-current bg-transparent hover:bg-white/10",
  light: "bg-paper text-charcoal hover:bg-white",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center px-6 text-center text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors",
    variants[variant],
    className,
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens the official Red Sea International website)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
