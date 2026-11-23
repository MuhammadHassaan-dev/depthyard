import { SizeQuantityPage, sizeMetadata, sizeParams } from "@/components/content/SizeQuantityPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return sizeParams("concrete");
}

export function generateMetadata({ params }: PageProps<"/concrete-slab-calculator/[size]">) {
  return sizeMetadata("concrete", params);
}

export default function Page({ params }: PageProps<"/concrete-slab-calculator/[size]">) {
  return <SizeQuantityPage material="concrete" params={params} />;
}
