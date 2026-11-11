"use client";

import { useLayoutEffect, useRef } from "react";
import { businessesPage } from "@/data/site-content";
import { gsap, registerMotion } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function IntegratedDelivery() {
  const root = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    const line = path.current;
    if (!section || !line) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerMotion();
    const length = line.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          end: "bottom 62%",
          scrub: true,
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="delivery" aria-labelledby="delivery-title" className="blueprint">
      <div className="shell py-24 md:py-32 lg:py-40">
        <SectionHeading title={businessesPage.delivery.title} titleId="delivery-title">
          {businessesPage.delivery.body}
        </SectionHeading>
        <div className="mt-16">
          <svg viewBox="0 0 1200 80" className="h-16 w-full" role="img" aria-label="Design, Build, Operate, Maintain">
            <path
              ref={path}
              d="M40 40 H1160"
              fill="none"
              stroke="#d71932"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {businessesPage.delivery.phases.map((phase, index) => {
              const x = 40 + index * ((1160 - 40) / (businessesPage.delivery.phases.length - 1));
              return <circle key={phase} cx={x} cy="40" r="7" fill="#d71932" />;
            })}
          </svg>
          <ol className="mt-2 grid grid-cols-4 gap-2">
            {businessesPage.delivery.phases.map((phase, index) => (
              <li
                key={phase}
                className={
                  index === 0 ? "text-left" : index === businessesPage.delivery.phases.length - 1 ? "text-right" : "text-center"
                }
              >
                <span className="font-display text-[clamp(1.2rem,2.4vw,2.4rem)] font-normal tracking-[-0.03em]">
                  {phase}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-graphite">{businessesPage.delivery.metaphor}</p>
        </div>
      </div>
    </section>
  );
}
