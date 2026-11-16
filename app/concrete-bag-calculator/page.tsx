import { VolumeTool } from "@/components/calculator/VolumeTool";
import { QuantityPage } from "@/components/content/QuantityPage";
import { bagPage } from "@/content/concrete";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(bagPage);

export default function ConcreteBagPage() {
  return (
    <QuantityPage page={bagPage}>
      <VolumeTool material="concrete" emphasis="bags" initial={{ lengthFeet: 6, widthFeet: 8, thicknessInches: 4 }} />
    </QuantityPage>
  );
}
