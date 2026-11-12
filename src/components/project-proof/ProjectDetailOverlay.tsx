"use client";

import { useEffect, useId, useRef } from "react";
import type { RsiProject } from "@/data/rsiProjects";
import { AssetFrame } from "@/components/ui/AssetFrame";

type Props = {
  project: RsiProject | null;
  onClose: () => void;
};

export function ProjectDetailOverlay({ project, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-4 sm:items-center sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="grid w-full max-w-4xl overflow-hidden border border-white/10 bg-[#12151a] text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:grid-cols-[1.1fr_0.9fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative min-h-[220px] md:min-h-[360px]">
          <AssetFrame id={project.asset} sizes="(max-width: 768px) 100vw, 45vw" />
        </div>
        <div className="flex flex-col p-6 md:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/50">
            {project.number} / 04
          </p>
          <h3 id={titleId} className="mt-3 font-display text-3xl font-normal tracking-[-0.03em]">
            {project.name}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-white/75">{project.description}</p>
          <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-white/70">
            {project.details.map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-rsi" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="mt-auto inline-flex min-h-11 w-fit items-center border border-white/25 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-rsi hover:text-rsi"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
