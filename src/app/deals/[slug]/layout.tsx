import type { Metadata } from "next";
import { resolveCreatorSeo } from "@/lib/seo-resolver";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const info = await resolveCreatorSeo(slug);
  const title = `${info.name} - Verified Deal Storefront | ProofCraft`;
  const description = `Curated deals, AI tools, and transparent partner recommendations by ${info.name}.`;
  const ogImg = `/api/og?title=${encodeURIComponent(info.name + " - Storefront")}&subtitle=${encodeURIComponent(description)}&badge=${encodeURIComponent("VERIFIED DEAL STOREFRONT")}`;

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogImg, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImg] },
  };
}

export default function DealsSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}