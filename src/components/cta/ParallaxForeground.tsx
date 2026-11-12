"use client";

import Image from "next/image";
import { forwardRef } from "react";

type Props = {
  src: string;
};

/** Lower architectural band — same approved plate, masked for depth (not a fake cutout). */
export const ParallaxForeground = forwardRef<HTMLDivElement, Props>(function ParallaxForeground(
  { src },
  ref,
) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] overflow-hidden will-change-transform"
      aria-hidden
      style={{
        WebkitMaskImage: "linear-gradient(to top, #000 55%, transparent 100%)",
        maskImage: "linear-gradient(to top, #000 55%, transparent 100%)",
      }}
    >
      <div className="relative h-[210%] w-full">
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_88%]"
        />
      </div>
    </div>
  );
});
