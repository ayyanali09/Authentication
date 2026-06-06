"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { LinkButton } from "./ui/button";

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-deep-black/78 backdrop-blur-2xl">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="group flex items-center gap-3" aria-label="DURON home">
          <span className="relative block h-12 w-[3.6rem] shrink-0">
            <Image
              src="/images/duron-logo-transparent.png"
              alt=""
              fill
              priority
              sizes="58px"
              className="object-contain transition duration-300 group-hover:scale-105"
            />
          </span>
          <span>
            <span className="block text-base font-semibold text-white-text">DURON</span>
            <span className="block text-xs uppercase text-white/45">Built Fast. Built Right.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium text-white/68 transition hover:bg-white/[0.08] hover:text-white-text",
                  active && "bg-white/10 text-white-text"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <LinkButton href="/contact" className="px-4">
            Start a Project <ArrowRight size={16} aria-hidden="true" />
          </LinkButton>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-md border border-white/15 bg-white/5 text-white-text lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-deep-black/96 px-4 py-5 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-white/75 hover:bg-white/10 hover:text-white-text"
              >
                {item.label}
              </Link>
            ))}
            <LinkButton href="/contact" onClick={() => setOpen(false)} className="mt-2 w-full">
              Start a Project <ArrowRight size={16} aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
