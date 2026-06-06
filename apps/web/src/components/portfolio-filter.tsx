"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Project } from "@vantanova/shared";
import { projectCategories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";

type PortfolioCategory = Exclude<(typeof projectCategories)[number], "All">;

const visualCategories = projectCategories.filter(
  (category): category is PortfolioCategory => category !== "All"
);

const categoryVisuals: Record<
  PortfolioCategory,
  { image: string; text: string }
> = {
  Website: {
    image: "/images/portfolio-website.jpg",
    text: "Conversion-ready pages, business websites, and ecommerce flows."
  },
  "Mobile App": {
    image: "/images/portfolio-mobile-app.jpg",
    text: "Mobile-first MVPs, customer portals, and app experiences."
  },
  "UI/UX": {
    image: "/images/portfolio-ui-ux.jpg",
    text: "Product screens, clean user journeys, and polished design systems."
  },
  Software: {
    image: "/images/portfolio-software-development.jpg",
    text: "Dashboards, automation tools, admin panels, and integrations."
  },
  Consulting: {
    image: "/images/portfolio-business-consulting.jpg",
    text: "Technical audits, solution planning, and practical roadmaps."
  },
  Marketing: {
    image: "/images/portfolio-digital-marketing.jpg",
    text: "Lead funnels, launch pages, offer messaging, and sales assets."
  }
};

export function PortfolioFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof projectCategories)[number]>("All");

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((project) => project.category === active);
  }, [active, projects]);

  const categoryCounts = useMemo(() => {
    return visualCategories.reduce<Record<PortfolioCategory, number>>((acc, category) => {
      acc[category] = projects.filter((project) => project.category === category).length;
      return acc;
    }, {} as Record<PortfolioCategory, number>);
  }, [projects]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Project categories">
        <button
          type="button"
          role="tab"
          aria-selected={active === "All"}
          onClick={() => setActive("All")}
          className={cn(
            "rounded-md border px-4 py-2 text-sm font-semibold transition",
            active === "All"
              ? "border-yellow-accent bg-yellow-accent text-deep-black"
              : "border-white/12 bg-white/5 text-white/65 hover:border-electric-blue/70 hover:text-white-text"
          )}
        >
          All Work
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="tablist" aria-label="Portfolio visuals">
        {visualCategories.map((category) => {
          const visual = categoryVisuals[category];
          const selected = active === category;

          return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => setActive(category)}
            className={cn(
              "group relative aspect-[16/10] min-h-[220px] overflow-hidden rounded-lg border text-left transition duration-300 hover:-translate-y-1",
              selected
                ? "border-yellow-accent shadow-[0_0_32px_rgba(255,212,0,0.18)]"
                : "border-white/10 hover:border-yellow-accent/60"
            )}
          >
            <Image
              src={visual.image}
              alt={`${category} portfolio category visual`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/58 to-deep-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-white-text">{category}</h2>
                <span
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-semibold",
                    selected
                      ? "border-yellow-accent bg-yellow-accent text-deep-black"
                      : "border-white/15 bg-deep-black/70 text-yellow-accent"
                  )}
                >
                  {categoryCounts[category]}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/68">{visual.text}</p>
            </div>
          </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
