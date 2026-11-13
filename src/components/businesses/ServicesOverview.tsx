"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { businesses, businessesPage } from "@/data/site-content";
import { InteractiveServiceIcon } from "@/components/businesses/ServiceIcons";
import { InViewReveal } from "@/components/motion/InViewReveal";
import { cn } from "@/lib/cn";

const groups = businessesPage.services.groups;

function tagsFor(anchor: string) {
  return businesses.find((business) => business.serviceAnchor === anchor)?.tags ?? [];
}

export function ServicesOverview() {
  const [active, setActive] = useState<string>(groups[0].id);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace("#", "");
      const match = groups.find((group) => group.anchor === id || group.id === id);
      if (match) setActive(match.id);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  function choose(index: number) {
    const group = groups[index];
    if (!group) return;
    setActive(group.id);
    buttons.current[index]?.focus();
    const next = `${window.location.pathname}${window.location.search}#${group.anchor}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
      window.history.replaceState(null, "", next);
    }
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = groups.length - 1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      choose((index + 1) % groups.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      choose((index - 1 + groups.length) % groups.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      choose(0);
    } else if (event.key === "End") {
      event.preventDefault();
      choose(last);
    }
  }

  return (
    <section id="services" aria-labelledby="services-title" className="bg-white text-charcoal">
      <InViewReveal>
      <div className="shell section-pad">
        <div className="border-b border-charcoal/15 pb-5">
          <p className="type-eyebrow font-body text-[#3f3d3a]">{businessesPage.services.eyebrow}</p>
          <h2
            id="services-title"
            className="hero-headline font-display font-normal leading-none"
            style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.4rem)", marginTop: 4, marginBottom: 0 }}
          >
            {businessesPage.services.title}
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Service categories"
          className="grid grid-cols-1 border-x border-b border-charcoal/15 sm:grid-cols-2 lg:grid-cols-5"
        >
          {groups.map((group, index) => {
            const selected = active === group.id;
            const tags = tagsFor(group.anchor);
            return (
              <button
                key={group.id}
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                id={group.anchor}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => choose(index)}
                onKeyDown={(event) => onTabKey(event, index)}
                className={cn(
                  "group flex h-full flex-col items-start bg-white p-5 text-left text-charcoal transition-colors duration-500 hover:bg-rsi hover:text-white focus-visible:bg-rsi focus-visible:text-white lg:p-6",
                  "border-b border-charcoal/15 sm:border-r lg:border-b-0",
                  index === groups.length - 1 && "border-b-0 sm:border-r-0",
                  (index === 1 || index === 3) && "sm:border-r-0 lg:border-r",
                )}
              >
                <h3 className="flex items-start gap-3 font-display text-[clamp(1.15rem,1.4vw,1.45rem)] font-normal leading-[1.1] tracking-[-0.03em]">
                  <InteractiveServiceIcon id={group.id} />
                  <span>{group.title}</span>
                </h3>
                <ul className="mt-3 w-full list-disc border-t border-charcoal/15 pt-3 pl-4 group-hover:border-white/25 group-focus-visible:border-white/25">
                  {tags.slice(0, 4).map((tag) => (
                    <li
                      key={tag}
                      className="py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-graphite group-hover:text-white/85 group-focus-visible:text-white/85"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>
      </InViewReveal>
    </section>
  );
}
