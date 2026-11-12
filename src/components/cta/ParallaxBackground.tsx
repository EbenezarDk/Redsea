"use client";

import Image from "next/image";
import { forwardRef } from "react";

type Props = {
  src: string;
  alt: string;
};

export const ParallaxBackground = forwardRef<HTMLDivElement, Props>(function ParallaxBackground(
  { src, alt },
  ref,
) {
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden will-change-transform" aria-hidden>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_42%]"
      />
    </div>
  );
});
