import { about } from "@/data/site-content";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollScene } from "@/components/motion/ScrollScene";

export function About() {
  return (
    <ScrollScene id="about" labelledBy="about-title" className="bg-paper">
      <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-[6px]">
            <Eyebrow rule={false}>{about.eyebrow}</Eyebrow>
            <h2
              id="about-title"
              className="hero-headline font-display font-normal"
              style={{ marginTop: 0, marginBottom: 0 }}
            >
              {about.title}
            </h2>
            <p
              className="type-body max-w-xl font-body leading-relaxed text-graphite"
              style={{ fontSize: 14, marginTop: 0, marginBottom: 0 }}
            >
              {about.body}
            </p>
            <p
              className="type-body max-w-xl font-body !font-bold leading-relaxed text-rsi"
              style={{ marginTop: 0, marginBottom: 0 }}
            >
              {about.support}
            </p>
          </div>
          <div className="mt-8">
            <Button href={about.cta.href} variant="primary">
              {about.cta.label}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal sm:aspect-[16/10]">
            <iframe
              title="Red Sea International — About"
              src={`https://www.youtube.com/embed/${about.videoId}?rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <ul className="mt-10 grid grid-cols-1 divide-y divide-charcoal/15 border-y border-charcoal/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {about.stats.map((stat) => (
              <li
                key={stat.full}
                className="flex flex-col gap-2 px-0 py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0"
              >
                <span className="sr-only">{stat.full}</span>
                <span
                  aria-hidden
                  className="hero-headline font-display font-normal tabular-nums"
                >
                  {stat.figure}
                </span>
                <span aria-hidden className="type-body font-body leading-snug text-graphite">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollScene>
  );
}
