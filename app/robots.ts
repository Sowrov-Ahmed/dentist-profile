import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/api/config";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`
  };
}
