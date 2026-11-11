"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
};

export const ScrollScene = forwardRef<HTMLElement, Props>(function ScrollScene(
  { id, className, children, labelledBy },
  ref,
) {
  return (
    <section id={id} ref={ref} aria-labelledby={labelledBy} className={cn("relative", className)}>
      {children}
    </section>
  );
});
