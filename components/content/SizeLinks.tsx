import Link from "next/link";
import type { RelatedLink } from "@/content/pages";

export function SizeLinks({ links }: { links: readonly RelatedLink[] }) {
  return (
    <section aria-labelledby="sizes-heading">
      <h2 id="sizes-heading" className="font-serif text-2xl text-ink">
        Common sizes
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="block h-full rounded-2xl border border-line bg-field p-3">
              <span className="font-semibold text-ink">{link.title}</span>
              <span className="mt-1 block text-sm leading-6 text-muted">{link.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
