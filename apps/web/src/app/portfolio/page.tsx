import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { PortfolioFilter } from "@/components/portfolio-filter";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore DURON portfolio work across websites, mobile apps, UI/UX, software, consulting, and marketing for startup-stage businesses."
};

export default function PortfolioPage() {
  return (
    <div className="pt-24">
      <AnimatedSection className="section-shell">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Portfolio"
            title="Startup-stage work across website, app, design, software, consulting, and marketing."
          >
            Filter by project type and explore how a focused digital team can help an intermediate startup build trust, launch faster, and run cleaner.
          </SectionHeading>
          <div className="mt-10">
            <PortfolioFilter projects={projects} />
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
