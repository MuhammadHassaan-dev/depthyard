import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/content/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function TrustPage({
  path,
  title,
  lede,
  children,
}: {
  path: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: title },
  ];

  return (
    <article className="shell max-w-[65ch] py-10 sm:py-14">
      <JsonLd data={breadcrumbJsonLd(crumbs, path)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 font-serif text-4xl leading-tight text-ink">{title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{lede}</p>
      <div className="mt-8 space-y-4 text-base leading-7 text-ink">{children}</div>
    </article>
  );
}
