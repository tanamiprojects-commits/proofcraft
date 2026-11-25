import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vercel.app";
  const now = new Date();
  const routes = ["", "/affiliate", "/feed", "/toolkit", "/method", "/workspace", "/portfolio/live", "/creators", "/legal"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/feed" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/affiliate" || route === "/feed" ? 0.9 : 0.8,
  }));
}
