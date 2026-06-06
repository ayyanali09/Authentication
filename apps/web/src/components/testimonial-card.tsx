import { Quote } from "lucide-react";
import type { Testimonial } from "@vantanova/shared";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="h-full rounded-lg border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
      <Quote className="text-yellow-accent" size={28} aria-hidden="true" />
      <blockquote className="mt-5 text-base leading-8 text-white/74">
        "{testimonial.quote}"
      </blockquote>
      <figcaption className="mt-6 border-t border-white/10 pt-5">
        <p className="font-semibold text-white-text">{testimonial.clientName}</p>
        <p className="mt-1 text-sm text-white/50">
          {testimonial.role}, {testimonial.company}
        </p>
      </figcaption>
    </figure>
  );
}
