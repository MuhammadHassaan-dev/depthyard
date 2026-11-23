import { SizeQuantityPage, sizeMetadata, sizeParams } from "@/components/content/SizeQuantityPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return sizeParams("mulch");
}

export function generateMetadata({ params }: PageProps<"/mulch-calculator/[size]">) {
  return sizeMetadata("mulch", params);
}

export default function Page({ params }: PageProps<"/mulch-calculator/[size]">) {
  return <SizeQuantityPage material="mulch" params={params} />;
}
