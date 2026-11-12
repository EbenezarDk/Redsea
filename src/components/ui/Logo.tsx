import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/images/rsi/logo.png"
        alt=""
        width={120}
        height={72}
        priority
        className="h-10 w-auto md:h-12"
      />
    </span>
  );
}
