import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  imageClassName?: string;
  /** White header / light surfaces → dark wordmark. Transparent/dark → light wordmark. */
  onLight?: boolean;
};

export function Logo({ className, imageClassName, onLight = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={onLight ? "/images/rsi/logo-light-bg.png" : "/images/rsi/logo-hero.png"}
        alt="Red Sea International"
        width={160}
        height={96}
        priority
        className={cn("h-[62px] w-auto", imageClassName)}
      />
    </span>
  );
}
