import { VolumeTool } from "@/components/calculator/VolumeTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { concretePage } from "@/content/concrete";
import { SizeLinks } from "@/components/content/SizeLinks";
import { concreteSizeLinks } from "@/content/sizes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(concretePage);

export default function ConcreteCalculatorPage() {
  return (
    <QuantityPage page={concretePage} after={<SizeLinks links={concreteSizeLinks} />}>
      <VolumeTool material="concrete" emphasis="yards" initial={{ lengthFeet: 15, widthFeet: 20, thicknessInches: 5 }} />
    </QuantityPage>
  );
}
