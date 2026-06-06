import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left"
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl min-w-0", align === "center" && "mx-auto text-center")}>
      <p className="mb-3 text-sm font-semibold uppercase text-yellow-accent">
        {eyebrow}
      </p>
      <h2 className="break-words text-3xl font-semibold leading-tight text-white-text md:text-5xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-5 break-words text-base leading-8 text-white/68 md:text-lg">{children}</p>
      ) : null}
    </div>
  );
}
