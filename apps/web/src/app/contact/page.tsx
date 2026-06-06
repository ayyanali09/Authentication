import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact DURON to scope a website, app, UI/UX design, custom software, automation, or digital problem-solving project."
};

export default function ContactPage() {
  return (
    <div className="pt-24">
      <AnimatedSection className="section-shell">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="Contact"
              title="Tell us what you want to build or fix."
            >
              Share your idea, business problem, timeline, and custom USD budget. We will reply with the cleanest path to a useful first project conversation.
            </SectionHeading>
            <div className="mt-8 grid gap-4">
              {[
                "Website, app, design, and automation scopes",
                "Clear proposal with timeline and deliverables",
                "Practical advice before development starts"
              ].map((item) => (
                <div key={item} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.045] p-5 text-white/72">
                  <span className="mr-3 text-yellow-accent">/</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </AnimatedSection>
    </div>
  );
}
