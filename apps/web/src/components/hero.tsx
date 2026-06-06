"use client";

import { ArrowRight, Play, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LinkButton } from "./ui/button";

export function Hero() {
  return (
    <section className="relative isolate min-h-[82svh] overflow-hidden pt-32">
      <Image
        src="/images/hero-command-center.png"
        alt="Professional development agency workspace with websites, apps, and dashboards"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0A0A_0%,rgba(10,10,10,0.86)_38%,rgba(10,10,10,0.46)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(30,144,255,0.28),transparent_34%),linear-gradient(135deg,rgba(124,58,237,0.24),transparent_45%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-deep-black to-transparent" />

      <motion.div
        aria-hidden="true"
        className="absolute right-0 top-28 hidden h-[460px] w-[42vw] border-y border-electric-blue/20 bg-[linear-gradient(90deg,transparent,rgba(30,144,255,0.08),transparent)] lg:block"
        animate={{ x: [24, -18, 24] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.08] px-3 py-2 text-sm text-white/78 backdrop-blur-xl"
          >
            <ShieldCheck size={16} className="text-yellow-accent" aria-hidden="true" />
            Websites, apps, design, and problem solving for growing businesses.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-4xl text-5xl font-semibold leading-[1.04] text-white-text sm:text-6xl lg:text-7xl"
          >
            DURON
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-white/72 md:text-xl"
          >
            We build professional websites, mobile app experiences, UI/UX designs,
            dashboards, automations, and digital systems that help customers trust your business faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <LinkButton href="/contact">
              Start a Project <ArrowRight size={17} aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/portfolio" variant="secondary">
              View Work <Play size={17} aria-hidden="true" />
            </LinkButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
