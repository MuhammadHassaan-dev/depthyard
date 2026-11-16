import { TrustPage } from "@/components/content/TrustPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `About — ${site.name}`,
  description: `${site.name} publishes planning quantities for concrete, gravel, mulch, and paint. No prices, no city pages, and no accounts.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <TrustPage
      path="/about"
      title="About"
      lede={`${site.name} publishes four quantity calculators. Each one answers a size with a number you can check.`}
    >
      <p>
        The concrete, gravel, mulch, and paint pages are static. The heading, the formula, the worked example, and the questions are in the HTML. The form recalculates in the browser as you type. Nothing you type is sent to a server, and a dead third-party service cannot blank a result.
      </p>
      <p>
        Waste, bag yield, gravel density, and paint coverage start from labeled defaults. The sources and the date they were checked are on each calculator. If the bag or the can prints a different number, that number wins. Change the field and the result uses yours.
      </p>
      <p>
        This site does not show a price, a supplier, or a city. A city URL that repeats one national formula is a doorway page, so there is not one. It does not round an order up to the next quarter yard and call that a supplier’s rule. It does not share a navigation or a domain with any other project.
      </p>
      <p>
        {site.name} is published at {site.url.replace(/^https:\/\//, "")}. A mailing address will be listed when one is confirmed. Until then, write to {site.contactEmail}.
      </p>
    </TrustPage>
  );
}
