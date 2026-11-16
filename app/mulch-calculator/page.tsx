import { VolumeTool } from "@/components/calculator/VolumeTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { mulchPage } from "@/content/mulch";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(mulchPage);

export default function MulchCalculatorPage() {
  return (
    <QuantityPage page={mulchPage}>
      <VolumeTool material="mulch" emphasis="yards" initial={{ lengthFeet: 8, widthFeet: 12, thicknessInches: 3 }} />
    </QuantityPage>
  );
}
