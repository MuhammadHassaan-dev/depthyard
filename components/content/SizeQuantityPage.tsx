import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VolumeTool } from "@/components/calculator/VolumeTool";
import { sizePage, sizePages, type SizeMaterial } from "@/content/sizes";
import { pageMetadata } from "@/lib/seo";
import { QuantityPage } from "./QuantityPage";
import { SizeTable } from "./SizeTable";

export function sizeParams(material: SizeMaterial) {
  return sizePages.filter((page) => page.material === material).map((page) => ({ size: page.slug }));
}

export async function sizeMetadata(material: SizeMaterial, params: Promise<{ size: string }>): Promise<Metadata> {
  const page = sizePage(material, (await params).size);
  return page ? pageMetadata(page) : {};
}

export async function SizeQuantityPage({
  material,
  params,
}: {
  material: SizeMaterial;
  params: Promise<{ size: string }>;
}) {
  const page = sizePage(material, (await params).size);
  if (!page) notFound();

  return (
    <QuantityPage page={page}>
      <VolumeTool
        material={material}
        emphasis="yards"
        initial={{ lengthFeet: page.lengthFt, widthFeet: page.widthFt, thicknessInches: page.depthIn }}
      />
      <SizeTable table={page.table} />
    </QuantityPage>
  );
}
