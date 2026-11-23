import { SizeQuantityPage, sizeMetadata, sizeParams } from "@/components/content/SizeQuantityPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return sizeParams("gravel");
}

export function generateMetadata({ params }: PageProps<"/gravel-calculator/[size]">) {
  return sizeMetadata("gravel", params);
}

export default function Page({ params }: PageProps<"/gravel-calculator/[size]">) {
  return <SizeQuantityPage material="gravel" params={params} />;
}
