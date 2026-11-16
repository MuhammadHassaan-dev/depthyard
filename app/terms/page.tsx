import { TrustPage } from "@/components/content/TrustPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Terms — ${site.name}`,
  description: `${site.name} quantities are planning estimates, not a contractor’s bid and not a supplier’s order.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <TrustPage
      path="/terms"
      title="Terms"
      lede="These figures are planning quantities. They are not a contractor’s bid and not a supplier’s order."
    >
      <p>
        A cubic yard, a bag count, a tonnage, or a gallon figure is an estimate from the size you typed and the yield you left in the form. It is not a structural design, a mix design, or a promise that a plant will load that exact amount.
      </p>
      <p>
        Ready-mix is often sold in steps, such as a quarter yard. That step belongs to the plant and it changes. {site.name} shows the calculated order to two decimals and does not round it up to a step it does not know.
      </p>
      <p>
        Bag yield, mulch volume, gravel density, and paint coverage are starting values with a source and a date. The bag, the scale ticket, and the can win when they disagree. A porous wall uses more paint than the smooth-surface number on a data sheet.
      </p>
      <p>
        Use the result to plan. Check it against the product in front of you and against whoever is selling the material before you buy or pour.
      </p>
    </TrustPage>
  );
}
