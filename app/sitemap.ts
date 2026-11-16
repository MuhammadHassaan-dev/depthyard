import type { MetadataRoute } from "next";
import { publicPaths, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: path === "/" ? site.url : new URL(path, site.url).toString(),
    lastModified: site.contentUpdated,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : path === "/about" || path === "/privacy" || path === "/terms" || path === "/contact" ? 0.3 : 0.8,
  }));
}
