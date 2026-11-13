import { businessPreview } from "@/data/site-content";
import { BusinessAccordion } from "@/components/businesses/BusinessAccordion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollScene } from "@/components/motion/ScrollScene";

export function BusinessPreview() {
  return (
    <ScrollScene
      id="businesses"
      labelledBy="businesses-title"
      className="relative flex flex-col bg-charcoal text-white"
    >
      <div className="shell section-pad flex flex-col">
        <div className="shrink-0 pb-3 md:pb-4">
          <div className="flex max-w-4xl flex-col gap-[6px]">
            <Eyebrow light rule={false}>
              {businessPreview.eyebrow}
            </Eyebrow>
            <h2
              id="businesses-title"
              className="hero-headline font-display font-normal"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", marginTop: 0, marginBottom: 0 }}
            >
              {businessPreview.title}
            </h2>
            <p
              className="type-body max-w-xl font-body leading-relaxed text-white/80"
              style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
            >
              {businessPreview.intro}
            </p>
          </div>
        </div>
        <BusinessAccordion className="mt-2" />
      </div>
    </ScrollScene>
  );
}
