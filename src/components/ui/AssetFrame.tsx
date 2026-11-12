import Image from "next/image";
import { assets, type AssetId } from "@/data/assets";
import { cn } from "@/lib/cn";
import { ModularStudy } from "@/components/ui/ModularStudy";

export function AssetFrame({
  id,
  sizes = "100vw",
  priority = false,
  className,
}: {
  id: AssetId;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const asset = assets[id];

  return (
    <div className={cn("group relative h-full w-full overflow-hidden bg-charcoal", className)}>
      {asset.src ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-105"
          style={{ objectFit: "cover", objectPosition: "center center" }}
        />
      ) : (
        <ModularStudy variant={asset.variant} alt={asset.alt} />
      )}
    </div>
  );
}
