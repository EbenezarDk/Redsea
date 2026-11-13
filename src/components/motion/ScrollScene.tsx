"use client";

import { forwardRef, type ReactNode } from "react";
import { InViewReveal } from "@/components/motion/InViewReveal";
import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  /** Soft fade/rise when the section enters the viewport. Default on. */
  reveal?: boolean;
};

export const ScrollScene = forwardRef<HTMLElement, Props>(function ScrollScene(
  { id, className, children, labelledBy, reveal = true },
  ref,
) {
  return (
    <section id={id} ref={ref} aria-labelledby={labelledBy} className={cn("relative", className)}>
      {reveal ? <InViewReveal>{children}</InViewReveal> : children}
    </section>
  );
});
