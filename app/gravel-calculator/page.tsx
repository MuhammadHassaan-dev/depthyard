import { VolumeTool } from "@/components/calculator/VolumeTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { gravelPage } from "@/content/gravel";
import { SizeLinks } from "@/components/content/SizeLinks";
import { gravelSizeLinks } from "@/content/sizes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(gravelPage);

export default function GravelCalculatorPage() {
  return (
    <QuantityPage page={gravelPage} after={<SizeLinks links={gravelSizeLinks} />}>
      <VolumeTool material="gravel" emphasis="yards" initial={{ lengthFeet: 10, widthFeet: 20, thicknessInches: 3 }} />
    </QuantityPage>
  );
}
