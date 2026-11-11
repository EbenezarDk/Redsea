"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { brandStatement, nav, officialContactUrl } from "@/data/site-content";
import { gsap, registerMotion } from "@/lib/motion";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLParagraphElement>(null);
  const year = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (year.current) year.current.textContent = String(new Date().getFullYear());
  }, []);

  useLayoutEffect(() => {
    const scope = root.current;
    const mark = word.current;
    if (!scope || !mark) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerMotion();
    const ctx = gsap.context(() => {
      gsap.from(mark, {
        xPercent: -6,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top 92%",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="overflow-hidden bg-[#101010] text-white">
      <div className="shell grid gap-12 py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Logo />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/75">{brandStatement}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-3 lg:col-span-3">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-white/80 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="lg:col-span-3">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/60">
            Contact
          </p>
          <a
            href={officialContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm text-white underline decoration-rsi underline-offset-4"
          >
            Official contact page
            <span className="sr-only"> (opens the official Red Sea International website)</span>
          </a>
        </div>
      </div>
      <p
        ref={word}
        aria-hidden
        className="shell select-none font-display text-[clamp(6rem,22vw,16rem)] font-normal leading-[0.8] tracking-[-0.06em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.16)" }}
      >
        RSI
      </p>
      <div className="shell flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <span ref={year} className="inline-block min-w-[4ch]" /> Red Sea International.
        </p>
        <p>Modular studies stand in for approved photography.</p>
      </div>
    </footer>
  );
}
