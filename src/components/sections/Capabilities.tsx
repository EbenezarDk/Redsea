import { capabilities } from "@/data/site-content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollScene } from "@/components/motion/ScrollScene";

export function Capabilities() {
  return (
    <ScrollScene id="capabilities" labelledBy="capabilities-title" className="bg-white">
      <div className="shell py-16 md:py-20 lg:py-24">
        <div className="flex max-w-4xl flex-col gap-[6px]">
          <Eyebrow rule={false}>{capabilities.eyebrow}</Eyebrow>
          <h2
            id="capabilities-title"
            className="hero-headline font-display font-normal md:whitespace-nowrap"
            style={{ fontSize: "clamp(2rem, 3.4vw, 3.25rem)", marginTop: 0, marginBottom: 0 }}
          >
            {capabilities.title.join(" ")}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 border border-charcoal/15 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {capabilities.pillars.map((pillar, pillarIndex) => (
            <article
              key={pillar.title}
              className="group flex h-full flex-col border-b border-charcoal/15 bg-white p-6 text-charcoal outline-none transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] last:border-b-0 hover:bg-rsi hover:text-white sm:odd:border-r sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <span className="type-eyebrow font-body text-[#3f3d3a] transition-colors duration-500 group-hover:text-white/70">
                0{pillarIndex + 1}
              </span>
              <h3 className="mt-[6px] font-display text-[1.65rem] font-normal leading-[1.05] tracking-[-0.03em] transition-colors duration-500 md:text-[1.85rem]">
                {pillar.title}
              </h3>
              <p
                className="mt-[6px] type-body max-w-sm font-body leading-relaxed text-graphite transition-colors duration-500 group-hover:text-white/75"
                style={{ fontSize: 14 }}
              >
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </ScrollScene>
  );
}
