import type { MetadataRoute } from "next";
import { sizePages } from "@/content/sizes";
import { publicPaths, site } from "@/lib/site";

const trustPaths = new Set(["/about", "/privacy", "/terms", "/contact"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = publicPaths.map((path) => ({
    url: path === "/" ? site.url : new URL(path, site.url).toString(),
    lastModified: site.contentUpdated,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : trustPaths.has(path) ? 0.3 : 0.8,
  }));

  const sizes: MetadataRoute.Sitemap = sizePages.map((page) => ({
    url: new URL(page.path, site.url).toString(),
    lastModified: site.contentUpdated,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...sizes];
}
