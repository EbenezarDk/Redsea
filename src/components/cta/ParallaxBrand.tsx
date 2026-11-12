"use client";

import Image from "next/image";
import { forwardRef } from "react";

export const ParallaxBrand = forwardRef<HTMLDivElement>(function ParallaxBrand(_, ref) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[28%] w-[min(52vw,520px)] -translate-x-1/2 opacity-[0.14] will-change-transform"
    >
      <Image
        src="/images/rsi/logo.png"
        alt=""
        width={520}
        height={312}
        className="h-auto w-full max-w-none"
        priority
      />
    </div>
  );
});
