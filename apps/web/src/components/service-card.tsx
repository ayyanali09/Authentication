import {
  Blocks,
  Code2,
  Palette,
  Rocket,
  Sparkles,
  Smartphone,
  Wrench,
  type LucideIcon
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Blocks,
  Code2,
  Palette,
  Rocket,
  Sparkles,
  Smartphone,
  Wrench
};

type ServiceCardProps = {
  service: {
    title: string;
    icon: string;
    summary: string;
    outcomes: readonly string[];
    pricing: {
      startingAt: string;
      range: string;
      note: string;
    };
  };
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = icons[service.icon] ?? Sparkles;

  return (
    <article className="group h-full rounded-lg border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-electric-blue/55 hover:bg-electric-blue/[0.08]">
      <div className="mb-6 flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-md border border-electric-blue/30 bg-navy-blue/70 text-electric-blue shadow-[0_0_24px_rgba(30,144,255,0.12)]">
          <Icon size={22} aria-hidden="true" />
        </span>
        <span className="h-px w-16 bg-gradient-to-r from-electric-blue to-transparent transition group-hover:w-24" />
      </div>
      <h3 className="text-xl font-semibold text-white-text">{service.title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/62">{service.summary}</p>
      <div className="mt-5 border-t border-white/10 pt-5">
        <p className="text-xs font-semibold uppercase text-white/42">Starting price</p>
        <p className="mt-1 text-2xl font-semibold text-yellow-accent">{service.pricing.startingAt}</p>
        <p className="mt-2 text-xs leading-6 text-white/54">
          Typical range: {service.pricing.range} for {service.pricing.note}.
        </p>
      </div>
      <ul className="mt-6 grid gap-2">
        {service.outcomes.map((outcome) => (
          <li key={outcome} className="flex items-center gap-2 text-sm text-white/68">
            <span className="size-1.5 rounded-full bg-yellow-accent" />
            {outcome}
          </li>
        ))}
      </ul>
    </article>
  );
}
