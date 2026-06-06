import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how DURON builds websites, apps, UI/UX design, dashboards, automations, and practical digital solutions for growing businesses."
};

const values = [
  "Business problems before features",
  "Clean design customers can trust",
  "Fast, responsive, reliable builds",
  "Support after launch"
];

const process = [
  {
    step: "01",
    title: "Discover",
    text: "We understand the business, customer journey, current problems, technical limits, and the outcome the project needs to create."
  },
  {
    step: "02",
    title: "Design",
    text: "We plan the structure, user flow, interface direction, content priorities, and the features that matter most."
  },
  {
    step: "03",
    title: "Develop",
    text: "We build responsive websites, app experiences, dashboards, integrations, and automations with clean execution."
  },
  {
    step: "04",
    title: "Launch & Improve",
    text: "We test, polish, launch, and help improve the product so it keeps working for customers after delivery."
  }
];

export default function AboutPage() {
  return (
    <div className="pt-24">
      <AnimatedSection className="section-shell">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="About Us"
            title="A professional development agency for businesses that need useful digital work."
          >
            DURON builds websites, mobile app experiences, UI/UX designs, dashboards, automations, and digital systems that solve real business problems.
          </SectionHeading>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-7">
              <h2 className="text-2xl font-semibold text-white-text">How we think</h2>
              <p className="mt-4 text-base leading-8 text-white/64">
                The most effective digital work is not only a good-looking screen. It is a useful system: clear information, easy actions, fast performance, reliable technology, and a design that helps customers trust the business.
              </p>
              <p className="mt-4 text-base leading-8 text-white/64">
                Our team combines development, design, editing, marketing, and sales thinking so the final website or app is not just built, but built to support growth.
              </p>
            </div>
            <div className="grid gap-3">
              {values.map((value) => (
                <div
                  key={value}
                  className="rounded-lg border border-white/10 bg-white/[0.045] p-5 text-lg font-semibold text-white-text"
                >
                  <span className="mr-3 text-yellow-accent">/</span>
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-shell bg-[#080b10] grid-surface">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Process" title="A clear operating model from idea to launch." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <article key={item.step} className="rounded-lg border border-white/10 bg-deep-black/65 p-6">
                <p className="text-sm font-semibold text-yellow-accent">{item.step}</p>
                <h3 className="mt-5 text-xl font-semibold text-white-text">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
