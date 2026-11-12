import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/transitions/PageTransition";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <SmoothScroll>
        <main id="content">{children}</main>
        <Footer />
      </SmoothScroll>
    </PageTransition>
  );
}
