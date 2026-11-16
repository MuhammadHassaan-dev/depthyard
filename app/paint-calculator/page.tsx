import { PaintTool } from "@/components/calculator/PaintTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { paintPage } from "@/content/paint";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(paintPage);

export default function PaintCalculatorPage() {
  return (
    <QuantityPage page={paintPage}>
      <PaintTool initial={{ lengthFeet: 12, heightFeet: 8, walls: 4, openingSqFt: 21 }} />
    </QuantityPage>
  );
}
