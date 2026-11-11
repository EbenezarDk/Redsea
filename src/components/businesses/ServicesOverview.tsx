"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { businesses, businessesPage } from "@/data/site-content";
import { DESKTOP_MOTION, registerMotion, ScrollTrigger } from "@/lib/motion";
import { lenisRef } from "@/lib/lenis";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const groups = businessesPage.services.groups;

function holdSelection(lock: { current: number }) {
  lock.current = Date.now() + 900;
}

function tagsFor(anchor: string) {
  return businesses.find((business) => business.serviceAnchor === anchor)?.tags ?? [];
}

export function ServicesOverview() {
  const [active, setActive] = useState<string>(groups[0].id);
  const lock = useRef(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    registerMotion();
    const media = window.matchMedia(DESKTOP_MOTION);
    const triggers: ScrollTrigger[] = [];

    const mount = () => {
      triggers.splice(0, triggers.length).forEach((item) => item.kill());
      if (!media.matches) return;
      groups.forEach((group) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: `#${group.anchor}`,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (!self.isActive || Date.now() < lock.current) return;
              setActive(group.id);
            },
          }),
        );
      });
    };

    mount();
    media.addEventListener("change", mount);
    return () => {
      media.removeEventListener("change", mount);
      triggers.forEach((item) => item.kill());
    };
  }, []);

  function choose(index: number, scroll: boolean) {
    const group = groups[index];
    if (!group) return;
    holdSelection(lock);
    setActive(group.id);
    buttons.current[index]?.focus();
    if (!scroll) return;
    const target = document.getElementById(group.anchor);
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -100 });
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = groups.length - 1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      choose((index + 1) % groups.length, true);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      choose((index - 1 + groups.length) % groups.length, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      choose(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      choose(last, true);
    }
  }

  return (
    <section id="services" aria-labelledby="services-title" className="bg-paper">
      <div className="shell py-24 md:py-32 lg:py-40">
        <SectionHeading
          eyebrow={businessesPage.services.eyebrow}
          title={businessesPage.services.title}
          titleId="services-title"
        />
        <div className="mt-14 lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28" role="tablist" aria-orientation="vertical" aria-label="Service categories">
              {groups.map((group, index) => {
                const selected = active === group.id;
                return (
                  <button
                    key={group.id}
                    ref={(node) => {
                      buttons.current[index] = node;
                    }}
                    id={`tab-${group.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`panel-${group.id}`}
                    tabIndex={active === "" ? (index === 0 ? 0 : -1) : selected ? 0 : -1}
                    onClick={() => choose(index, true)}
                    onKeyDown={(event) => onTabKey(event, index)}
                    className="flex w-full items-center gap-4 border-t border-charcoal/15 py-5 text-left text-charcoal"
                  >
                    <span className={cn("h-px w-8", selected ? "bg-rsi" : "bg-charcoal/25")} />
                    <span className="font-display text-2xl font-normal leading-none tracking-[-0.03em]">
                      {group.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-8">
            {groups.map((group) => {
              const open = active === group.id;
              const tags = tagsFor(group.anchor);
              return (
                <article
                  key={group.id}
                  id={group.anchor}
                  data-service={group.id}
                  className="scroll-mt-28 border-t border-charcoal/15 py-8 lg:min-h-[72vh] lg:py-14"
                >
                  <h3 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-normal leading-none tracking-[-0.03em]">
                    <button
                      type="button"
                      className="w-full text-left lg:hidden"
                      aria-expanded={open}
                      aria-controls={`panel-${group.id}`}
                      onClick={() => setActive((current) => (current === group.id ? "" : group.id))}
                    >
                      <span>{open ? "– " : "+ "}</span>
                      {group.title}
                    </button>
                    <span className="hidden lg:block">{group.title}</span>
                  </h3>
                  <div id={`panel-${group.id}`} role="region" className={cn(open ? "block" : "max-lg:hidden", "lg:block")}>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <ul>
                        {tags.map((tag) => (
                          <li key={tag} className="border-b border-charcoal/15 py-3 text-sm">
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <div className="aspect-[4/5] min-h-64">
                        <AssetFrame id={group.asset} sizes="(min-width: 1024px) 30vw, 100vw" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
