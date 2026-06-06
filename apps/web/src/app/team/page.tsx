import type { Metadata } from "next";
import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { team } from "@/lib/data";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the leadership, development, editing, and marketing team behind DURON."
};

export default function TeamPage() {
  return (
    <div className="pt-24">
      <AnimatedSection className="section-shell">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Team"
            title="A focused team for strategy, web development, editing, and marketing."
          >
            Leadership, development, editing, and marketing work together so every digital project has clear direction and polished delivery.
          </SectionHeading>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045]"
              >
                <div className="relative aspect-[4/5] bg-navy-blue">
                  <Image src={member.image} alt={`${member.name} portrait`} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-white-text">{member.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-yellow-accent">{member.role}</p>
                  <p className="mt-4 text-sm leading-7 text-white/62">{member.focus}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
