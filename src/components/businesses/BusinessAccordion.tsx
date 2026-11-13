"use client";

import { useEffect, useState } from "react";
import { businesses, businessesPage } from "@/data/site-content";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type BusinessAccordionProps = {
  exploreBase?: string;
  className?: string;
};

export function BusinessAccordion({
  exploreBase = "/businesses",
  className,
}: BusinessAccordionProps) {
  const [active, setActive] = useState<string>(businesses[0]?.id ?? "housing");

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace("#", "");
      if (businesses.some((business) => business.id === id)) setActive(id);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <ul
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 lg:flex-row lg:gap-1",
        className,
      )}
      role="list"
      aria-label="Five businesses"
    >
      {businesses.map((business) => {
        const open = active === business.id;
        const exploreHref = `${exploreBase}#${business.serviceAnchor}`;

        return (
          <li
            key={business.id}
            id={business.id}
            className={cn(
              "vcard relative min-w-0 overflow-hidden border border-white/10 bg-charcoal lg:h-full lg:border-0",
              "lg:basis-0 lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(0.77,0,0.18,1)]",
              open ? "lg:grow-[3.1]" : "lg:grow",
              open ? "min-h-[28rem]" : "min-h-[4.5rem] lg:min-h-0",
            )}
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                setActive(business.id);
              }
            }}
          >
            <div className="absolute inset-0">
              <div
                className={cn(
                  "h-full w-full transition-transform duration-700",
                  open && "scale-[1.04]",
                )}
              >
                <AssetFrame
                  id={business.asset}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  priority={business.id === businesses[0].id}
                />
              </div>
              <div
                className={cn(
                  "absolute inset-0 transition-colors duration-500",
                  open
                    ? "bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/10"
                    : "bg-charcoal/60",
                )}
              />
            </div>

            <div className="relative z-10 flex h-full min-h-[inherit] flex-col lg:min-h-0">
              {!open ? (
                <button
                  type="button"
                  aria-expanded={false}
                  aria-controls={`${business.id}-details`}
                  onClick={() => setActive(business.id)}
                  className="relative z-10 flex min-h-[4.5rem] w-full items-center px-5 py-4 text-left text-white outline-none lg:absolute lg:inset-0 lg:min-h-0 lg:items-end lg:justify-start lg:px-5 lg:pb-7 lg:pt-8"
                >
                  <span className="whitespace-nowrap font-display text-[clamp(0.98rem,1.15vw,1.2rem)] font-normal leading-none tracking-[-0.03em] lg:[writing-mode:vertical-rl] lg:rotate-180">
                    {business.title}
                  </span>
                </button>
              ) : null}

              <div
                id={`${business.id}-details`}
                className={cn(
                  "relative z-10 flex h-full flex-col justify-end p-6 transition-[opacity,transform] duration-500 md:p-8 lg:p-10",
                  open
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none absolute inset-0 opacity-0 lg:translate-y-2",
                )}
                aria-hidden={!open}
                inert={open ? undefined : true}
              >
                <h3 className="max-w-xl font-display text-[clamp(1.15rem,2.4vw,2.4rem)] font-normal leading-[0.95] tracking-[-0.03em] text-white">
                  {business.title}
                </h3>
                <p
                  className="mt-4 max-w-xl font-body leading-relaxed text-white/85"
                  style={{ fontSize: 14 }}
                >
                  {business.body}
                </p>
                <ul className="mt-5 flex max-w-2xl flex-wrap gap-2">
                  {business.tags.slice(0, 4).map((tag) => (
                    <li
                      key={tag}
                      className="border border-white/30 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/90"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button href={exploreHref} variant="primary">
                    {businessesPage.exploreLabel}
                  </Button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
