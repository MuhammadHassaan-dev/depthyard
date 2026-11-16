"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/visual/MaterialArt";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  {
    href: "/concrete-calculator",
    label: "Concrete",
    match: [
      "/concrete-calculator",
      "/concrete-slab-calculator",
      "/concrete-pad-calculator",
      "/concrete-bag-calculator",
    ],
  },
  { href: "/gravel-calculator", label: "Gravel", match: ["/gravel-calculator"] },
  { href: "/mulch-calculator", label: "Mulch", match: ["/mulch-calculator"] },
  { href: "/paint-calculator", label: "Paint", match: ["/paint-calculator"] },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="shell flex flex-wrap items-center gap-x-3 py-2">
        <Link href="/" className="order-1 inline-flex items-center gap-2 font-serif text-2xl tracking-tight text-ink">
          <Wordmark />
          {site.name}
        </Link>
        <div className="order-2 ml-auto md:order-3">
          <ThemeToggle />
        </div>
        <nav
          aria-label="Materials"
          className="no-scrollbar order-3 -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 py-1 md:order-2 md:mx-0 md:w-auto md:flex-1 md:overflow-visible md:px-0 md:py-0"
        >
          {links.map((link) => {
            const active = link.match.some((path) => pathname === path);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "inline-flex h-12 shrink-0 items-center rounded-full bg-accent px-4 text-sm font-semibold text-paper"
                    : "inline-flex h-12 shrink-0 items-center rounded-full border border-line bg-field px-4 text-sm font-semibold text-ink"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
