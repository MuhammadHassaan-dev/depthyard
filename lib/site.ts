function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const url = configured && configured.length > 0 ? configured : "https://depthyard.com";
  return url.replace(/\/$/, "");
}

export const site = {
  name: "Depthyard",
  url: resolveSiteUrl(),
  description:
    "Planning quantities for concrete, gravel, mulch, and paint. Type a size and read cubic yards, bags, tons, or gallons.",
  contactEmail: "contact@depthyard.com",
  /**
   * Replace this with a real mailing address before launch.
   * An empty list keeps the contact page from inventing a street.
   */
  mailingAddress: [] as readonly string[],
  contentUpdated: "2026-11-16",
};

export const publicPaths = [
  "/",
  "/concrete-calculator",
  "/concrete-slab-calculator",
  "/concrete-pad-calculator",
  "/concrete-bag-calculator",
  "/gravel-calculator",
  "/mulch-calculator",
  "/paint-calculator",
  "/about",
  "/privacy",
  "/terms",
  "/contact",
] as const;

export function adsenseClient(): string | null {
  const value = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  return value ? value : null;
}

/** AdSense display ad unit "depthyard-below". The env var can override it. */
const defaultAdsenseSlot = "4156133665";

export function adsenseSlot(): string | null {
  const value = process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim() || defaultAdsenseSlot;
  return value ? value : null;
}
