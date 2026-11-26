import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tanami360.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ProofCraft OS & Tanami360 | סטודיו AI, כספת מוצפנת ומרכז שותפים",
    template: "%s | ProofCraft & Tanami360",
  },
  description:
    "פלטפורמת ProofCraft מבית Tanami360: סטודיו חבילות הקשר לצ׳אט חכם, כספת Zero-Knowledge מוצפנת, שיטת בניית מוצרים מאומתת ומרכז שותפים חכם בעברית ובאנגלית.",
  keywords: [
    "ProofCraft", "Tanami360", "AI Context Studio", "Zero Knowledge Vault",
    "פיתוח מערכות AI", "כספת מוצפנת", "סטודיו פרומפטים", "שיווק שותפים חכם"
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ProofCraft OS & Tanami360 — פלטפורמת AI, כספת מוצפנת וסטודיו בנייה",
    description:
      "כלים פתוחים לשימוש מיידי: סטודיו חבילות הקשר לצ׳אט חכם, כספת AES-GCM מוצפנת בדפדפן, ותיק עבודות מאומת.",
    url: SITE_URL,
    siteName: "ProofCraft & Tanami360",
    type: "website",
    images: [
      {
        url: "/api/og?title=ProofCraft%20%26%20Tanami360&badge=VERIFIED%20AI%20ECOSYSTEM",
        width: 1200,
        height: 630,
        alt: "ProofCraft OS & Tanami360",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofCraft OS & Tanami360",
    description: "Smart AI Context Studio, Zero-Knowledge Vault & Verified Builder Hub.",
    images: ["/api/og?title=ProofCraft%20%26%20Tanami360&badge=VERIFIED%20AI%20ECOSYSTEM"],
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
  name: "ProofCraft OS & Tanami360",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android, Windows, macOS",
  inLanguage: ["he", "en"],
  url: SITE_URL,
  isPartOf: {
    "@type": "Organization",
    name: "Tanami360 Studio",
    url: "https://tanami360.com",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Smart AI Context Packet Studio (/context-studio)",
    "Zero-Knowledge Browser Encrypted Vault (/vault)",
    "12-Stage Verified AI Methodology & Prompt Vault (/method)",
    "Verified Builder Portfolio & Smart Affiliate Hub (/affiliate)",
  ],
  description:
    "Bilingual AI engineering studio, browser-encrypted Zero-Knowledge vault, smart context packet generator, and verified affiliate ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
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