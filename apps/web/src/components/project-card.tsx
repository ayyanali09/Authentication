import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@vantanova/shared";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-yellow-accent/60">
      <Link href={`/portfolio/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-navy-blue">
          <Image
            src={project.coverImage}
            alt={`${project.title} case study visual`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-md border border-white/15 bg-deep-black/70 px-3 py-1 text-xs font-semibold text-yellow-accent backdrop-blur">
            {project.category}
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-5">
            <h3 className="text-xl font-semibold text-white-text">{project.title}</h3>
            <ArrowUpRight
              size={20}
              className="mt-1 shrink-0 text-white/45 transition group-hover:text-yellow-accent"
              aria-hidden="true"
            />
          </div>
          <p className="mt-3 text-sm leading-7 text-white/62">{project.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/58"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
