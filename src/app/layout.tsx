import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "ProofCraft Studio | Global AI Product Engineering & Verified Portfolio OS",
  description: "Build, verify, and showcase production AI systems (v1.0 to v4.0). Start free with Track 1, prove real engineering artifacts, and launch your public verified portfolio.",
  openGraph: {
    title: "ProofCraft Studio — Verified AI Builder Portfolio & Production OS",
    description: "Proof-of-execution engineering studio for self-taught and professional AI builders worldwide.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0b0e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
