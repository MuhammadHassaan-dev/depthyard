import type { CalculatorPage } from "@/content/pages";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MaterialArt, materialFromPath } from "@/components/visual/MaterialArt";

export function PageHero({ page }: { page: Pick<CalculatorPage, "path" | "crumbs" | "h1" | "intro"> }) {
  const material = materialFromPath(page.path);

  return (
    <header>
      <Breadcrumbs items={page.crumbs} />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <h1 className="min-w-0 font-serif text-[clamp(1.85rem,4vw,2.6rem)] leading-[1.12] text-ink">{page.h1}</h1>
        {material ? (
          <MaterialArt
            material={material}
            labeled
            className="aspect-[16/9] w-full rounded-2xl border border-line sm:aspect-[4/3] sm:w-56 sm:shrink-0 lg:w-72"
          />
        ) : null}
      </div>
      <p className="mt-4 max-w-[65ch] text-lg leading-8 text-muted">
        {page.intro[0]} {page.intro[1]}
      </p>
    </header>
  );
}
