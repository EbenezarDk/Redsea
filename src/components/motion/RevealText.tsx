"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerMotion } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function RevealText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const inner = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerMotion();
    const ctx = gsap.context(() => {
      gsap.from(el, {
        yPercent: 46,
        duration: 1.05,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span ref={inner} className={className ? `block ${className}` : "block"}>
        {children}
      </span>
    </span>
  );
}
