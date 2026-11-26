import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ProofCraft & Tanami360 Zero-Knowledge Vault",
    short_name: "ProofCraft Vault",
    description: "Zero-Knowledge AES-256 Encrypted Context & Crypto Seed Vault",
    start_url: "/vault",
    display: "standalone",
    background_color: "#05070a",
    theme_color: "#05070a",
    icons: [
      { src: "/vault/vault-context.png", sizes: "512x512", type: "image/png" },
      { src: "/vault/vault-hero.png", sizes: "512x512", type: "image/png" }
    ],
    share_target: {
      action: "/vault",
      method: "GET",
      params: { title: "title", text: "text", url: "url" }
    }
  };
}
