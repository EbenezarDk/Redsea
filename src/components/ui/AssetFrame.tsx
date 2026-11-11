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
    <div className={cn("relative h-full w-full overflow-hidden bg-charcoal", className)}>
      {asset.src ? (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <ModularStudy variant={asset.variant} alt={asset.alt} />
      )}
    </div>
  );
}
