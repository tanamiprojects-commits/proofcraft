import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ProofCraft Fintech OS",
    short_name: "ProofCraft",
    description: "AI Product Engineering Studio, Verified Builder Portfolio & Smart Affiliate Hub.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b0e",
    theme_color: "#0a0b0e",
    orientation: "any",
    categories: ["business", "finance", "productivity", "developer"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
    ],
  };
}
