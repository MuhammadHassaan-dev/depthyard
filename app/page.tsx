import Link from "next/link";
import { JsonLd } from "@/components/content/JsonLd";
import { MaterialArt, type Material } from "@/components/visual/MaterialArt";
import { pageMetadata, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${site.name} — Concrete, Gravel, Mulch, and Paint Quantities`,
  description: site.description,
  path: "/",
});

const plates = [
  { material: "concrete", label: "Concrete" },
  { material: "gravel", label: "Gravel" },
  { material: "mulch", label: "Mulch" },
  { material: "paint", label: "Paint" },
] as const satisfies readonly { material: Material; label: string }[];

const featured = [
  {
    href: "/gravel-calculator",
    material: "gravel",
    kicker: "Gravel",
    title: "Gravel calculator",
    text: "Cubic yards and tons for a rectangular path or bed. Density stays in the form.",
  },
  {
    href: "/concrete-slab-calculator",
    material: "concrete",
    kicker: "Slab",
    title: "Concrete slab calculator",
    text: "A patio, floor, or shed slab in cubic yards and whole bags.",
  },
  {
    href: "/paint-calculator",
    material: "paint",
    kicker: "Paint",
    title: "Paint calculator",
    text: "Gallons from the walls, the coats, and the number on the can.",
  },
] as const satisfies readonly {
  href: string;
  material: Material;
  kicker: string;
  title: string;
  text: string;
}[];

const also = [
  { href: "/concrete-calculator", material: "concrete", title: "Concrete calculator" },
  { href: "/concrete-pad-calculator", material: "concrete", title: "Concrete pad calculator" },
  { href: "/concrete-bag-calculator", material: "concrete", title: "Concrete bag calculator" },
  { href: "/mulch-calculator", material: "mulch", title: "Mulch calculator" },
] as const satisfies readonly { href: string; material: Material; title: string }[];

export default function HomePage() {
  return (
    <div className="shell py-10 sm:py-14 lg:py-16">
      <JsonLd data={websiteJsonLd()} />
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(16rem,0.95fr)] lg:gap-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Planning quantities</p>
          <h1 className="mt-3 max-w-[14ch] font-serif text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.02] text-ink">
            Concrete, gravel, mulch, and paint quantities
          </h1>
          <p className="mt-5 max-w-[42ch] text-lg leading-8 text-muted">
            Type a size and read the amount: cubic yards, bags, tons, or gallons. The pages do not show a price, a supplier, or a city.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4">
          {plates.map((plate) => (
            <li key={plate.material} className="overflow-hidden rounded-2xl border border-line shadow-[0_16px_40px_-28px_rgba(28,25,21,0.7)]">
              <MaterialArt material={plate.material} labeled className="aspect-[4/3] w-full" />
              <p className="bg-field px-3 py-2 text-sm font-semibold text-ink">{plate.label}</p>
            </li>
          ))}
        </ul>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {featured.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-line bg-field motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-accent/50"
            >
              <MaterialArt material={item.material} className="aspect-[4/3] w-full" />
              <span className="flex flex-1 flex-col p-5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{item.kicker}</span>
                <span className="mt-3 font-serif text-[clamp(1.6rem,3vw,2rem)] leading-tight text-ink">{item.title}</span>
                <span className="mt-3 text-sm leading-6 text-muted">{item.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,65ch)_minmax(16rem,1fr)] lg:items-start">
        <div>
          <h2 className="font-serif text-[clamp(1.5rem,3vw,2rem)] text-ink">A concrete calculator, among others</h2>
          <p className="mt-4 text-base leading-7 text-ink">
            The <Link href="/concrete-calculator" className="underline decoration-line underline-offset-4">concrete calculator</Link> is here for a rectangle: a floor, a pad, or a bag count. It is not the only concrete calculator, and it does not pretend to be. Waste and bag yield stay visible. A plant may sell in quarter-yard steps. This site does not invent that step, and it does not publish one URL per city.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {also.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-field p-2 pr-4 font-semibold text-ink"
              >
                <MaterialArt material={item.material} className="h-12 w-20 shrink-0 rounded-xl" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
