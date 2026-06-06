import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ServiceCard } from "@/components/service-card";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore DURON services across website development, mobile app development, UI/UX design, problem solving, custom software, and sales support."
};

const engagementModels = [
  {
    title: "Website Build",
    text: "For businesses that need a professional website, landing page, ecommerce front, booking flow, or customer-facing web experience."
  },
  {
    title: "App or MVP Sprint",
    text: "For founders and teams that need a mobile app concept, customer portal, product prototype, or build-ready MVP plan."
  },
  {
    title: "Support & Growth Retainer",
    text: "For companies that need ongoing improvements, new pages, integrations, design support, automation, and launch help."
  }
];

export default function ServicesPage() {
  return (
    <div className="pt-24">
      <AnimatedSection className="section-shell">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Services"
            title="Development, design, and problem solving for modern businesses."
          >
            Choose one focused service or combine website, app, design, software, and launch support into one practical project scope.
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-shell bg-[#080b10]">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <SectionHeading
            eyebrow="Engagement Model"
            title="Flexible ways to work with a professional development team."
          >
            Every engagement includes clear deliverables, a practical timeline, review points, and support around the customer outcome.
          </SectionHeading>
          <div className="grid gap-4">
            {engagementModels.map((model) => (
              <div key={model.title} className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
                <h3 className="text-xl font-semibold text-white-text">{model.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  {model.text}
                </p>
              </div>
            ))}
          </div>
          <LinkButton href="/contact" className="lg:col-span-2 lg:w-fit">
            Build your scope
          </LinkButton>
        </div>
      </AnimatedSection>
    </div>
  );
}
