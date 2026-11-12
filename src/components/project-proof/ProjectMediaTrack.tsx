"use client";

import { forwardRef } from "react";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { rsiProjects } from "@/data/rsiProjects";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export const ProjectMediaTrack = forwardRef<HTMLDivElement, Props>(function ProjectMediaTrack(
  { className },
  ref,
) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div
        ref={ref}
        data-media-track
        className="absolute inset-x-0 top-0 will-change-transform"
      >
        {rsiProjects.map((project, index) => (
          <div
            key={project.id}
            data-media-panel
            className="relative w-full overflow-hidden bg-transparent"
          >
            <div
              data-media-image
              className="absolute inset-0 overflow-hidden grayscale will-change-transform"
              style={{ transform: index === 0 ? "scale(1)" : "scale(1.04)" }}
            >
              <AssetFrame
                id={project.asset}
                sizes="65vw"
                priority={index === 0}
                className="bg-transparent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
