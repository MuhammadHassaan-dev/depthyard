import { VolumeTool } from "@/components/calculator/VolumeTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { mulchPage } from "@/content/mulch";
import { SizeLinks } from "@/components/content/SizeLinks";
import { mulchSizeLinks } from "@/content/sizes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(mulchPage);

export default function MulchCalculatorPage() {
  return (
    <QuantityPage page={mulchPage} after={<SizeLinks links={mulchSizeLinks} />}>
      <VolumeTool material="mulch" emphasis="yards" initial={{ lengthFeet: 8, widthFeet: 12, thicknessInches: 3 }} />
    </QuantityPage>
  );
}
