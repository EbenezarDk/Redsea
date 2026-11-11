"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { businesses, businessesPage } from "@/data/site-content";
import { AssetFrame } from "@/components/ui/AssetFrame";
import { cn } from "@/lib/cn";

export function VerticalBusinessCards() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace("#", "");
      if (businesses.some((business) => business.id === id)) setActive(id);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  function activate(id: string) {
    setActive(id);
  }

  return (
    <section aria-label="Five businesses" className="bg-charcoal text-white">
      <div className="shell py-6 lg:py-10">
        <ul className="flex flex-col gap-3 lg:h-[min(88vh,920px)] lg:min-h-[680px] lg:flex-row lg:gap-1">
          {businesses.map((business) => {
            const open = active === business.id;
            return (
              <li
                key={business.id}
                id={business.id}
                className={cn(
                  "vcard relative min-w-0 overflow-hidden border border-white/10 bg-charcoal lg:h-full lg:basis-0 lg:border-0 lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(0.77,0,0.18,1)]",
                  open ? "lg:grow-[2.85]" : "lg:grow",
                )}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                    setActive(business.id);
                  }
                }}
              >
                <div className="absolute inset-0">
                  <div className={cn("h-full w-full transition-transform duration-700", open && "scale-[1.04]")}>
                    <AssetFrame id={business.asset} sizes="(min-width: 1024px) 42vw, 100vw" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/10" />
                </div>
                <div className="relative z-10 flex min-h-[28rem] flex-col lg:h-full lg:min-h-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${business.id}-details`}
                    onClick={() => activate(business.id)}
                    onFocus={() => activate(business.id)}
                    className={cn(
                      "z-10 flex w-full text-left",
                      open ? "relative items-start gap-4 p-5 md:p-6" : "absolute inset-0 items-end p-5 lg:items-center lg:justify-end lg:p-6",
                    )}
                  >
                    <span
                      className={cn(
                        "flex gap-3",
                        !open && "lg:h-full lg:flex-col lg:items-center lg:justify-between",
                      )}
                    >
                      <span className="text-xs tracking-[0.18em] text-white/75">{business.number}</span>
                      <span
                        className={cn(
                          "font-display text-[clamp(1.7rem,2.1vw,2.6rem)] font-normal leading-[0.95] tracking-[-0.03em]",
                          !open && "lg:[writing-mode:vertical-rl]",
                        )}
                      >
                        {business.title}
                      </span>
                    </span>
                  </button>
                  <div
                    id={`${business.id}-details`}
                    inert={open ? undefined : true}
                    className={cn(
                      "mt-auto grid transition-[grid-template-rows,opacity] duration-500",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-4 px-5 pb-6 md:px-6">
                        <p className="max-w-md text-sm leading-relaxed text-white/85">{business.body}</p>
                        <ul className="flex flex-wrap gap-2">
                          {business.tags.map((tag) => (
                            <li
                              key={tag}
                              className="border border-white/30 px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`#${business.serviceAnchor}`}
                          className="inline-flex min-h-11 items-center self-start border border-white px-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] hover:bg-white hover:text-charcoal"
                        >
                          {businessesPage.exploreLabel}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
