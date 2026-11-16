import { VolumeTool } from "@/components/calculator/VolumeTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { padPage } from "@/content/concrete";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(padPage);

export default function ConcretePadPage() {
  return (
    <QuantityPage page={padPage}>
      <VolumeTool material="concrete" emphasis="yards" initial={{ lengthFeet: 12, widthFeet: 16, thicknessInches: 4 }} />
    </QuantityPage>
  );
}
