import { VolumeTool } from "@/components/calculator/VolumeTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { slabPage } from "@/content/concrete";
import { SizeLinks } from "@/components/content/SizeLinks";
import { concreteSizeLinks } from "@/content/sizes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(slabPage);

export default function ConcreteSlabPage() {
  return (
    <QuantityPage page={slabPage} after={<SizeLinks links={concreteSizeLinks} />}>
      <VolumeTool material="concrete" emphasis="yards" initial={{ lengthFeet: 10, widthFeet: 10, thicknessInches: 4 }} />
    </QuantityPage>
  );
}
