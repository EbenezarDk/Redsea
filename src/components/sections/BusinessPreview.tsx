import Link from "next/link";
import { businesses, businessPreview } from "@/data/site-content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollScene } from "@/components/motion/ScrollScene";

export function BusinessPreview() {
  return (
    <ScrollScene id="businesses" className="bg-paper">
      <div className="shell py-16 md:py-20 lg:py-24">
        <div className="flex max-w-4xl flex-col gap-[6px]">
          <Eyebrow rule={false}>{businessPreview.eyebrow}</Eyebrow>
          <h2
            id="businesses-title"
            className="hero-headline font-display font-normal"
            style={{ fontSize: 52, marginTop: 0, marginBottom: 0 }}
          >
            {businessPreview.title}
          </h2>
          <p
            className="type-body max-w-xl font-body leading-relaxed text-graphite"
            style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
          >
            {businessPreview.intro}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 border border-charcoal/15 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5">
          {businesses.map((business) => (
            <Link
              key={business.id}
              href={`/businesses#${business.id}`}
              className="group flex h-full flex-col border-b border-charcoal/15 bg-paper p-6 text-charcoal outline-none transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] last:border-b-0 hover:bg-charcoal hover:text-white focus-visible:bg-charcoal focus-visible:text-white sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <span className="type-eyebrow font-body text-[#3f3d3a] transition-colors duration-500 group-hover:text-white/70 group-focus-visible:text-white/70">
                {business.number}
              </span>
              <span className="mt-[6px] font-display text-[1.65rem] font-normal leading-[1.05] tracking-[-0.03em] transition-colors duration-500 md:text-[1.85rem]">
                {business.title}
              </span>
              <span className="mt-[6px] type-body max-w-sm font-body leading-relaxed text-graphite transition-colors duration-500 group-hover:text-white/75 group-focus-visible:text-white/75">
                {business.preview}
              </span>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-rsi transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1">
                Explore
                <span
                  aria-hidden
                  className="block h-px w-6 bg-rsi transition-colors duration-500 group-hover:bg-white group-focus-visible:bg-white"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </ScrollScene>
  );
}
