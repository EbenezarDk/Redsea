import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { BusinessPreview } from "@/components/sections/BusinessPreview";
import { Capabilities } from "@/components/sections/Capabilities";
import { CTA } from "@/components/sections/CTA";
import { Hero } from "@/components/sections/Hero";
import { ProjectProof } from "@/components/sections/ProjectProof";
import { contact, officialContactUrl, organizationJsonLd, seo } from "@/data/site-content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: seo.home.title,
    description: seo.home.description,
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Hero>
        <About />
      </Hero>
      <Capabilities />
      <BusinessPreview />
      <ProjectProof />
      <CTA
        primary={{
          label: contact.homeLabel,
          href: officialContactUrl,
          external: true,
        }}
      />
    </>
  );
}
