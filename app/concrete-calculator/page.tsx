import { VolumeTool } from "@/components/calculator/VolumeTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { concretePage } from "@/content/concrete";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(concretePage);

export default function ConcreteCalculatorPage() {
  return (
    <QuantityPage page={concretePage}>
      <VolumeTool material="concrete" emphasis="yards" initial={{ lengthFeet: 15, widthFeet: 20, thicknessInches: 5 }} />
    </QuantityPage>
  );
}
