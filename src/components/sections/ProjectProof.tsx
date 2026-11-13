"use client";

import { useCallback, useState } from "react";
import { ProjectDetailOverlay } from "@/components/project-proof/ProjectDetailOverlay";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { ScrollScene } from "@/components/motion/ScrollScene";
import { projectProofCopy, rsiProjects, type RsiProject } from "@/data/rsiProjects";

export function ProjectProof() {
  const [detail, setDetail] = useState<RsiProject | null>(null);

  const openDetail = useCallback((project: RsiProject) => {
    setDetail(project);
  }, []);

  const closeDetail = useCallback(() => {
    setDetail(null);
  }, []);

  return (
    <ScrollScene id="projects" labelledBy="projects-title" className="bg-white text-charcoal">
      <div className="shell py-16 md:py-20 lg:py-24">
        <div className="flex w-full flex-col gap-[6px]">
          <Eyebrow rule={false}>{projectProofCopy.eyebrow}</Eyebrow>
          <h2
            id="projects-title"
            className="hero-headline font-display font-normal"
            style={{ fontSize: 52, marginTop: 0, marginBottom: 0 }}
          >
            {projectProofCopy.title}
          </h2>
          <p
            className="type-body w-full max-w-3xl font-body leading-relaxed text-graphite"
            style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
          >
            {projectProofCopy.body}
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-4 xl:gap-5">
          {rsiProjects.map((project) => (
            <li key={project.id} className="flex h-full flex-col border border-charcoal/15 bg-white">
              <div className="relative aspect-[16/11] w-full overflow-hidden border-b border-charcoal/10">
                <AssetFrame id={project.asset} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" />
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="font-display text-[clamp(1.25rem,1.8vw,1.65rem)] font-normal leading-[1.05] tracking-[-0.03em]">
                  {project.name}
                </h3>
                <p className="type-body mt-3 flex-1 font-body leading-relaxed text-graphite">
                  {project.description}
                </p>
                <button
                  type="button"
                  onClick={() => openDetail(project)}
                  className="group mt-6 inline-flex w-fit items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-charcoal outline-none"
                >
                  <span className="relative pb-1">
                    {projectProofCopy.exploreLabel}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-rsi transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </span>
                  <span
                    aria-hidden
                    className="block h-px w-6 bg-rsi transition-transform duration-500 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ProjectDetailOverlay project={detail} onClose={closeDetail} />
    </ScrollScene>
  );
}
