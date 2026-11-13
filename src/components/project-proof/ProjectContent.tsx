"use client";

import { forwardRef } from "react";
import type { RsiProject } from "@/data/rsiProjects";
import { projectProofCopy, rsiProjects } from "@/data/rsiProjects";
import { cn } from "@/lib/cn";

type Props = {
  activeIndex: number;
  onExplore: (project: RsiProject) => void;
  className?: string;
};

export const ProjectContent = forwardRef<HTMLDivElement, Props>(function ProjectContent(
  { activeIndex, onExplore, className },
  ref,
) {
  return (
    <div ref={ref} className={cn("relative min-h-[17.5rem]", className)}>
      {rsiProjects.map((project, index) => {
        const active = index === activeIndex;
        return (
          <div
            key={project.id}
            data-project-copy
            aria-hidden={!active}
            className={cn(
              "absolute inset-0 flex flex-col justify-start text-charcoal",
              active ? "pointer-events-auto" : "pointer-events-none",
            )}
            style={{ opacity: active ? 1 : 0 }}
          >
            <p
              data-copy-part
              className="font-display text-sm tracking-[0.18em] text-graphite"
            >
              {project.number} / {String(rsiProjects.length).padStart(2, "0")}
            </p>
            <h3
              data-copy-part
              className="mt-3 font-display text-[clamp(1.15rem,2.4vw,2.4rem)] font-normal leading-[0.95] tracking-[-0.03em]"
            >
              {project.name}
            </h3>
            <p
              data-copy-part
              className="mt-4 w-full max-w-none text-base leading-relaxed text-graphite"
              style={{ fontSize: 14 }}
            >
              {project.description}
            </p>
            <button
              type="button"
              data-copy-part
              data-explore
              onClick={() => onExplore(project)}
              className="group mt-7 inline-flex w-fit items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-charcoal outline-none"
            >
              <span className="relative pb-1">
                {projectProofCopy.exploreLabel}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-rsi transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </span>
              <span
                aria-hidden
                className="block h-px w-6 bg-rsi transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
});
