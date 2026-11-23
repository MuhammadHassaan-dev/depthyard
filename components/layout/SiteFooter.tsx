import Link from "next/link";
import { MaterialArt, type Material } from "@/components/visual/MaterialArt";
import { site } from "@/lib/site";

const links = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="shell grid gap-6 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="font-serif text-2xl text-ink">{site.name}</p>
          <p className="mt-2 max-w-[42ch] text-sm leading-6 text-muted">
            These figures are planning quantities, not a contractor’s order.
          </p>
          <p className="mt-2 max-w-[42ch] text-sm leading-6 text-muted">
            Sister site:{" "}
            <a href="https://basefigure.com" className="text-ink underline underline-offset-4">
              Basefigure
            </a>{" "}
            — VAT, sales tax, loan, and everyday calculators.
          </p>
          <ul className="mt-4 flex gap-2" aria-hidden="true">
            {(["concrete", "gravel", "mulch", "paint"] as const satisfies readonly Material[]).map((material) => (
              <li key={material} className="h-10 w-14 overflow-hidden rounded-lg border border-line">
                <MaterialArt material={material} className="h-full w-full" />
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="inline-flex h-12 items-center underline-offset-4 hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
