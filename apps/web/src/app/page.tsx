import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { ServiceCard } from "@/components/service-card";
import { StatCounter } from "@/components/stat-counter";
import { TestimonialCard } from "@/components/testimonial-card";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects, services, stats, team, testimonials } from "@/lib/data";

const problemAreas = [
  {
    title: "Your website does not convert",
    text: "We rebuild unclear pages into fast, professional experiences with stronger messaging, better structure, and clearer calls to action."
  },
  {
    title: "Your idea needs a real product",
    text: "We turn app, dashboard, and software ideas into practical MVP plans, polished interfaces, and build-ready systems."
  },
  {
    title: "Your workflow is too manual",
    text: "We design automations, admin panels, and internal tools that reduce repeated work and make daily operations easier."
  },
  {
    title: "Your design feels inconsistent",
    text: "We create UI systems, page layouts, brand visuals, and customer journeys that make the business feel more credible."
  }
];

const deliveryStandards = [
  "Responsive design for mobile, tablet, and desktop",
  "Fast loading pages with SEO-friendly structure",
  "Clean UI/UX for websites, apps, and dashboards",
  "Clear project scope, milestones, and launch support",
  "Contact forms, lead flows, admin panels, and integrations",
  "Practical guidance before, during, and after launch"
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <AnimatedSection className="section-shell">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Services"
            title="A development agency for websites, apps, design, and business systems."
          >
            Hire one focused team to plan, design, build, launch, and improve the digital parts of your business.
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-shell bg-[#080b10] grid-surface">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Featured Work"
              title="Startup-ready portfolio work built around real business outcomes."
            >
              Explore website, mobile app, UI/UX, software, consulting, and marketing work designed to help customers take action.
            </SectionHeading>
            <LinkButton href="/portfolio" variant="secondary">
              View portfolio <ArrowRight size={16} aria-hidden="true" />
            </LinkButton>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-shell">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Problems We Solve"
            title="We do more than make pages look good."
          >
            A professional website or app should solve a business problem: getting customers, saving time, building trust, or making work easier.
          </SectionHeading>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {problemAreas.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
                <h3 className="text-xl font-semibold text-white-text">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-shell">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-shell bg-[#080808]">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Client Signal"
            title="Trusted by teams that need clear thinking and clean execution."
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-shell">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <SectionHeading
              eyebrow="What Clients Get"
              title="Professional delivery from first idea to launch."
            >
              Every project is shaped around useful deliverables, not vague activity. You know what is being built, why it matters, and how it will help customers.
            </SectionHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {deliveryStandards.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.045] p-5 text-sm leading-6 text-white/70">
                  <span className="mr-3 text-yellow-accent">/</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-shell bg-[#080b10]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              eyebrow="Team Preview"
              title="A compact team focused on clear digital delivery."
            >
              We keep strategy, web development, editing, marketing, and customer communication close to the work so projects stay aligned.
            </SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2">
              {team.slice(0, 4).map((member) => (
                <article
                  key={member.name}
                  className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-4"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-navy-blue">
                    <Image src={member.image} alt={`${member.name} portrait`} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white-text">{member.name}</h3>
                    <p className="mt-1 text-sm text-yellow-accent">{member.role}</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">{member.focus}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-shell">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(30,144,255,0.20),rgba(124,58,237,0.16)_45%,rgba(255,212,0,0.10))] p-8 md:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-yellow-accent">Start Your Project</p>
            <h2 className="mt-4 text-3xl font-semibold text-white-text md:text-5xl">
              Ready to build a website, app, design system, or custom solution?
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              Tell us what you want to build or fix. We will map a practical path from idea to design, development, and launch.
            </p>
            <LinkButton href="/contact" className="mt-8">
              Start the conversation <ArrowRight size={17} aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
