import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";
import { navItems, services } from "@/lib/data";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/duron.media/",
    Icon: InstagramIcon
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590709226690",
    Icon: FacebookIcon
  },
  {
    label: "X",
    href: "https://x.com/duron8com",
    Icon: XIcon
  }
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070707]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="DURON home">
            <span className="relative block h-12 w-[3.6rem] shrink-0">
              <Image src="/images/duron-logo-transparent.png" alt="" fill sizes="58px" className="object-contain" />
            </span>
            <span className="text-lg font-semibold text-white-text">DURON</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/58">
            Professional websites, mobile app experiences, UI/UX design, custom software, and practical digital problem solving.
          </p>
          <div className="mt-6 flex items-center gap-3" aria-label="DURON social links">
            {socialLinks.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={`DURON on ${label}`}
                title={label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.045] text-white/70 transition hover:border-yellow-accent/60 hover:bg-yellow-accent hover:text-deep-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-accent"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-white/45">Navigation</h2>
          <div className="mt-4 grid gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/65 hover:text-yellow-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-white/45">Services</h2>
          <div className="mt-4 grid gap-3">
            {services.slice(0, 4).map((service) => (
              <Link
                key={service.title}
                href="/services"
                className="text-sm text-white/65 hover:text-yellow-accent"
              >
                {service.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/40">
        Copyright {new Date().getFullYear()} DURON. All rights reserved.
      </div>
    </footer>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.2 8.2V6.7c0-.7.5-.9.9-.9h2.1V2.2L14.1 2c-3.1 0-4.8 1.9-4.8 5.1v1.1H6.8v3.9h2.5V22h4.1v-9.9h3.1l.5-3.9h-3.8Z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.9 10.5 21.5 2h-1.8l-6.5 7.4L7.9 2H2l8 11.3L2 22h1.8l7-7.9 5.6 7.9H22l-8.1-11.5Zm-2.5 2.8-.8-1.1L4.2 3.3h3l5.1 7.1.8 1.1 6.7 9.3h-3l-5.4-7.5Z" />
    </svg>
  );
}
