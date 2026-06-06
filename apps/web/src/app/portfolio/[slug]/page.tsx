import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/ui/button";
import { projects, site } from "@/lib/data";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${site.name}`,
      description: project.summary,
      images: [project.coverImage]
    }
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="pt-24">
      <section className="section-shell">
        <div className="mx-auto max-w-7xl">
          <LinkButton href="/portfolio" variant="secondary">
            <ArrowLeft size={16} aria-hidden="true" /> Back to portfolio
          </LinkButton>
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-yellow-accent">
                {project.category} / {project.year}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white-text md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/68">{project.summary}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
                  <p className="text-3xl font-semibold text-white-text">{metric.value}</p>
                  <p className="mt-2 text-sm text-white/50">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-lg border border-white/10 bg-navy-blue">
            <Image
              src={project.heroImage ?? project.coverImage}
              alt={`${project.title} product interface`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section-shell bg-[#080b10]">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-xl font-semibold text-white-text">Challenge</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">{project.challenge}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-xl font-semibold text-white-text">Solution</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">{project.solution}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-xl font-semibold text-white-text">Results</h2>
            <ul className="mt-4 grid gap-3">
              {project.results.map((result) => (
                <li key={result} className="flex gap-3 text-sm leading-7 text-white/62">
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-yellow-accent" />
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </article>
  );
}
