"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ProjectContent } from "@/components/project-proof/ProjectContent";
import { ProjectDetailOverlay } from "@/components/project-proof/ProjectDetailOverlay";
import { ProjectMediaTrack } from "@/components/project-proof/ProjectMediaTrack";
import { ProjectProgress } from "@/components/project-proof/ProjectProgress";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { ScrollScene } from "@/components/motion/ScrollScene";
import { projectProofCopy, rsiProjects, type RsiProject } from "@/data/rsiProjects";
import { DESKTOP_MOTION, gsap, registerMotion, ScrollTrigger } from "@/lib/motion";

const HOLD = 0.28;
const TRANSITION_END = 0.78;

function segmentProgress(totalProgress: number, count: number) {
  const scaled = Math.min(count - 0.0001, Math.max(0, totalProgress) * count);
  const index = Math.floor(scaled);
  const local = scaled - index;
  return { index, local };
}

function mapTransition(local: number) {
  if (local <= HOLD) return 0;
  if (local >= TRANSITION_END) return 1;
  return (local - HOLD) / (TRANSITION_END - HOLD);
}

export function ProjectProof() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const mediaViewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const copyRoot = useRef<HTMLDivElement>(null);
  const progressRoot = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [detail, setDetail] = useState<RsiProject | null>(null);
  const indexRef = useRef(0);

  const openDetail = useCallback((project: RsiProject) => {
    setDetail(project);
  }, []);

  const closeDetail = useCallback(() => {
    setDetail(null);
  }, []);

  useLayoutEffect(() => {
    const pinned = pin.current;
    const viewport = mediaViewport.current;
    const mediaTrack = track.current;
    const copy = copyRoot.current;
    const progress = progressRoot.current;
    if (!pinned || !viewport || !mediaTrack || !copy || !progress) return;

    registerMotion();
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      const panels = Array.from(mediaTrack.querySelectorAll<HTMLElement>("[data-media-panel]"));
      const images = Array.from(mediaTrack.querySelectorAll<HTMLElement>("[data-media-image]"));
      const layers = Array.from(copy.querySelectorAll<HTMLElement>("[data-project-copy]"));
      const fill = progress.querySelector<HTMLElement>("[data-progress-fill]");
      const count = panels.length;
      if (!count) return;

      let step = 0;

      const layoutPanels = () => {
        const viewportH = viewport.clientHeight;
        if (!viewportH) return;
        const panelH = viewportH;
        const gap = Math.round(viewportH * 0.04);
        panels.forEach((panel, i) => {
          panel.style.height = `${panelH}px`;
          panel.style.marginBottom = i === count - 1 ? "0px" : `${gap}px`;
        });
        step = panelH + gap;
      };

      const apply = (totalProgress: number) => {
        if (!step) layoutPanels();
        if (!step) return;
        const { index: current, local } = segmentProgress(totalProgress, count);
        const t = mapTransition(local);
        const canAdvance = current < count - 1;
        const travel = canAdvance ? t : 0;
        const maxY = Math.max(0, (count - 1) * step);

        gsap.set(mediaTrack, {
          y: -Math.min(maxY, Math.max(0, current * step + travel * step)),
          force3D: true,
        });

        panels.forEach((_, i) => {
          const image = images[i];
          if (!image) return;

          if (i === current && canAdvance) {
            gsap.set(image, {
              scale: gsap.utils.interpolate(1, 1.025, travel),
              yPercent: travel * -4,
              filter: `brightness(${gsap.utils.interpolate(1, 0.88, travel)})`,
            });
          } else if (i === current + 1 && canAdvance) {
            gsap.set(image, {
              scale: gsap.utils.interpolate(1.04, 1, travel),
              yPercent: gsap.utils.interpolate(4, 0, travel),
              filter: "brightness(1)",
            });
          } else if (i < current) {
            gsap.set(image, { scale: 1.025, yPercent: -4, filter: "brightness(0.88)" });
          } else if (i === current) {
            gsap.set(image, { scale: 1, yPercent: 0, filter: "brightness(1)" });
          } else {
            gsap.set(image, { scale: 1.04, yPercent: 4, filter: "brightness(1)" });
          }
        });

        const readable = canAdvance && t > 0.55 ? current + 1 : current;

        layers.forEach((layer, i) => {
          const parts = Array.from(layer.querySelectorAll<HTMLElement>("[data-copy-part]"));
          if (i === current && canAdvance) {
            const opacity = 1 - t;
            const y = -24 * t;
            gsap.set(layer, {
              autoAlpha: opacity,
              y,
              pointerEvents: opacity > 0.4 ? "auto" : "none",
            });
            parts.forEach((part, partIndex) => {
              gsap.set(part, { y: y * (0.7 + partIndex * 0.08), autoAlpha: opacity });
            });
          } else if (i === current + 1 && canAdvance) {
            const opacity = t;
            gsap.set(layer, {
              autoAlpha: opacity,
              y: 24 * (1 - t),
              pointerEvents: opacity > 0.55 ? "auto" : "none",
            });
            parts.forEach((part, partIndex) => {
              const delay = partIndex * 0.08;
              const localT = gsap.utils.clamp(0, 1, (t - delay) / Math.max(0.001, 1 - delay));
              gsap.set(part, { y: 24 * (1 - localT), autoAlpha: localT });
            });
          } else if (i === readable || (i === current && !canAdvance)) {
            gsap.set(layer, { autoAlpha: 1, y: 0, pointerEvents: "auto" });
            parts.forEach((part) => gsap.set(part, { y: 0, autoAlpha: 1 }));
          } else {
            gsap.set(layer, {
              autoAlpha: 0,
              y: i < readable ? -24 : 24,
              pointerEvents: "none",
            });
            parts.forEach((part) => gsap.set(part, { autoAlpha: 0 }));
          }
        });

        if (fill) gsap.set(fill, { scaleX: totalProgress });

        if (indexRef.current !== readable) {
          indexRef.current = readable;
          setIndex(readable);
        }
      };

      layoutPanels();

      const story = ScrollTrigger.create({
        trigger: pinned,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 4)}`,
        pin: true,
        scrub: 0.3,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          layoutPanels();
          apply(self.progress);
        },
        onUpdate: (self) => apply(self.progress),
      });

      apply(story.progress);
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        story.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <ScrollScene
      id="projects"
      ref={root}
      labelledBy="projects-title"
      className="bg-white text-charcoal"
    >
      <div ref={pin} className="pin-layout hidden lg:block">
        <div className="shell flex h-[100svh] flex-col py-24 xl:py-28">
          <div className="flex w-full shrink-0 flex-col gap-[6px]">
            <Eyebrow rule={false}>{projectProofCopy.eyebrow}</Eyebrow>
            <h2
              id="projects-title"
              className="hero-headline font-display font-normal whitespace-nowrap"
              style={{ fontSize: "clamp(2rem, 3.2vw, 3.25rem)", marginTop: 0, marginBottom: 0 }}
            >
              {projectProofCopy.title}
            </h2>
            <p
              className="type-body w-full max-w-none font-body leading-relaxed text-graphite"
              style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
            >
              {projectProofCopy.body}
            </p>
          </div>

          {/* Single stack: copy half + reduced image half */}
          <div className="mt-8 grid min-h-0 flex-1 grid-cols-2 gap-8 xl:gap-10">
            <div className="flex min-h-0 flex-col justify-center gap-5">
              <ProjectProgress ref={progressRoot} activeIndex={index} />
              <ProjectContent
                ref={copyRoot}
                activeIndex={index}
                onExplore={openDetail}
                className="h-auto min-h-[14rem] flex-1"
              />
            </div>

            <div className="relative min-h-0 h-full">
              <div
                ref={mediaViewport}
                className="absolute inset-0 overflow-hidden border border-charcoal/10"
              >
                <ProjectMediaTrack ref={track} sizes="42vw" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flow-layout lg:hidden">
        <div className="shell py-20 md:py-28">
          <div className="flex w-full flex-col gap-[6px]">
            <Eyebrow rule={false}>{projectProofCopy.eyebrow}</Eyebrow>
            <h2
              className="hero-headline font-display font-normal"
              style={{ fontSize: "clamp(2rem, 6vw, 2.6rem)", marginTop: 0, marginBottom: 0 }}
            >
              {projectProofCopy.title}
            </h2>
            <p
              className="type-body w-full max-w-none font-body leading-relaxed text-graphite"
              style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
            >
              {projectProofCopy.body}
            </p>
          </div>
        </div>

        <div>
          {rsiProjects.map((project, itemIndex) => (
            <article key={project.id} className="border-t border-charcoal/15 px-6 py-10 md:px-10">
              <p className="text-xs tracking-[0.18em] text-graphite">
                {project.number} / {String(rsiProjects.length).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.8rem,6vw,2.8rem)] font-normal leading-[0.95] tracking-[-0.03em]">
                {project.name}
              </h3>
              <div className="relative mt-6 aspect-[16/11] overflow-hidden border border-charcoal/10">
                <AssetFrame id={project.asset} sizes="100vw" />
              </div>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite">
                {project.description}
              </p>
              <button
                type="button"
                onClick={() => openDetail(project)}
                className="group mt-6 inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-charcoal"
              >
                <span className="relative pb-1">
                  {projectProofCopy.exploreLabel}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-rsi transition-transform duration-500 group-hover:scale-x-100"
                  />
                </span>
                <span
                  aria-hidden
                  className="block h-px w-6 bg-rsi transition-transform duration-500 group-hover:translate-x-1.5"
                />
              </button>
              <span className="sr-only">
                Project {itemIndex + 1} of {rsiProjects.length}
              </span>
            </article>
          ))}
        </div>
      </div>

      <ProjectDetailOverlay project={detail} onClose={closeDetail} />
    </ScrollScene>
  );
}
