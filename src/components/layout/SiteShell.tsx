import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <SmoothScroll>
        <PageTransition>
          <main id="content">{children}</main>
        </PageTransition>
        <Footer />
      </SmoothScroll>
    </>
  );
}
