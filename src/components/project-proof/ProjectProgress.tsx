"use client";

import { forwardRef } from "react";
import { rsiProjects } from "@/data/rsiProjects";
import { cn } from "@/lib/cn";

type Props = {
  activeIndex: number;
  className?: string;
};

export const ProjectProgress = forwardRef<HTMLDivElement, Props>(function ProjectProgress(
  { activeIndex, className },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("h-px bg-charcoal/15", className)}
      role="progressbar"
      aria-label="Project progress"
      aria-valuemin={1}
      aria-valuemax={rsiProjects.length}
      aria-valuenow={activeIndex + 1}
    >
      <span data-progress-fill className="block h-px origin-left scale-x-0 bg-rsi" />
    </div>
  );
});
