import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

const SITE_URL = "https://vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ProofCraft Fintech OS | AI Product Engineering & Affiliate Hub",
    template: "%s | ProofCraft Fintech OS",
  },
  description:
    "Build, verify, and monetize production AI systems and smart affiliate storefronts. Backed by live execution proof, RLS security, and multi-channel ad automation.",
  openGraph: {
    title: "ProofCraft Fintech OS — Verified AI Builder & Smart Affiliate Hub",
    description:
      "Proof-of-execution engineering studio, verified deal storefronts, and multi-channel affiliate automation.",
    url: SITE_URL,
    siteName: "ProofCraft Fintech OS",
    type: "website",
    images: [
      {
        url: "/api/og?title=ProofCraft%20Fintech%20OS&badge=VERIFIED%20PRODUCTION%20STUDIO",
        width: 1200,
        height: 630,
        alt: "ProofCraft Fintech OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofCraft Fintech OS",
    description: "Verified AI Product Engineering & Smart Affiliate Hub.",
    images: ["/api/og?title=ProofCraft%20Fintech%20OS&badge=VERIFIED%20PRODUCTION%20STUDIO"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0b0e",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ProofCraft Fintech OS",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "Full-stack AI product engineering studio, verified portfolio system, and smart affiliate link hub.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
