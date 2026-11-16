import { VolumeTool } from "@/components/calculator/VolumeTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { gravelPage } from "@/content/gravel";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(gravelPage);

export default function GravelCalculatorPage() {
  return (
    <QuantityPage page={gravelPage}>
      <VolumeTool material="gravel" emphasis="yards" initial={{ lengthFeet: 10, widthFeet: 20, thicknessInches: 3 }} />
    </QuantityPage>
  );
}
