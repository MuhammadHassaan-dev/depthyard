import { TrustPage } from "@/components/content/TrustPage";
import { pageMetadata } from "@/lib/seo";
import { adsenseClient, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Privacy — ${site.name}`,
  description: `${site.name} does not store the sizes you type. A theme preference stays in this browser. Advertising cookies load only when an ad client is configured.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  const ads = Boolean(adsenseClient());

  return (
    <TrustPage
      path="/privacy"
      title="Privacy"
      lede="The sizes you type stay in the browser. Refreshing the page restores the defaults."
    >
      <p>
        There is no account and no database. The calculator does not post your numbers anywhere. The explanation and the worked example are ordinary HTML.
      </p>
      <p>
        A theme choice is written to localStorage under the key theme, on this device, after you use the theme button. Before that click, the page uses the light theme. Clearing site data removes the choice.
      </p>
      {ads ? (
        <p>
          This build loads Google AdSense, which can set advertising cookies and measure the ad. The ad sits below the tool or beside the article, never inside the result and never beside an input. The slot keeps its height so the result does not jump when an ad arrives.
        </p>
      ) : (
        <p>
          This build does not load an advertising script, and it does not set advertising cookies. An ad slot is added only after an AdSense client id is configured and the site is rebuilt. Until then the slot is not in the page and takes no space.
        </p>
      )}
      <p>
        Questions about this policy can go to {site.contactEmail}.
      </p>
    </TrustPage>
  );
}
