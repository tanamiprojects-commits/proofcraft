import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/affiliate", "/feed", "/toolkit", "/method", "/portfolio/", "/deals/", "/legal"],
        disallow: ["/admin", "/api/", "/auth"],
      },
    ],
    sitemap: "https://vercel.app/sitemap.xml",
  };
}
