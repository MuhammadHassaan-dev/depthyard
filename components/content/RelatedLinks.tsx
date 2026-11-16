import Link from "next/link";
import type { RelatedLink } from "@/content/pages";
import { MaterialArt, materialFromPath } from "@/components/visual/MaterialArt";

export function RelatedLinks({ links }: { links: readonly RelatedLink[] }) {
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-serif text-2xl text-ink">
        Related tools
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => {
          const material = materialFromPath(link.href);
          return (
            <li key={link.href}>
              <Link href={link.href} className="flex h-full gap-3 rounded-2xl border border-line bg-field p-3">
                {material ? <MaterialArt material={material} className="h-16 w-20 shrink-0 rounded-xl" /> : null}
                <span className="min-w-0">
                  <span className="font-semibold text-ink">{link.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted">{link.summary}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
