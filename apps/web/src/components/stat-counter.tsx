"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type StatCounterProps = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

export function StatCounter({ label, value, prefix = "", suffix = "" }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: "easeOut"
    });
    return controls.stop;
  }, [inView, motionValue, value]);

  return (
    <div ref={ref} className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-white-text">
        {prefix}
        <motion.span>{rounded}</motion.span>
        {suffix}
      </p>
    </div>
  );
}
