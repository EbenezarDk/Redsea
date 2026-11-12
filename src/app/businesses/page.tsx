import type { Metadata } from "next";
import { BusinessesHero } from "@/components/businesses/BusinessesHero";
import { IntegratedDelivery } from "@/components/businesses/IntegratedDelivery";
import { ServicesOverview } from "@/components/businesses/ServicesOverview";
import { VerticalBusinessCards } from "@/components/businesses/VerticalBusinessCards";
import { CTA } from "@/components/sections/CTA";
import { contact, officialContactUrl, seo } from "@/data/site-content";

export const metadata: Metadata = {
  title: "Our Businesses",
  description: seo.businesses.description,
  alternates: { canonical: "/businesses" },
  openGraph: {
    title: seo.businesses.title,
    description: seo.businesses.description,
    url: "/businesses",
  },
};

export default function BusinessesPage() {
  return (
    <>
      <BusinessesHero />
      <VerticalBusinessCards />
      <ServicesOverview />
      <IntegratedDelivery />
      <CTA
        padTop
        primary={{
          label: contact.homeLabel,
          href: officialContactUrl,
          external: true,
        }}
      />
    </>
  );
}
