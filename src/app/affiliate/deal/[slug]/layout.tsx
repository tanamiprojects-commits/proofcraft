import type { Metadata } from "next";
import { resolveDealSeo } from "@/lib/seo-resolver";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const deal = await resolveDealSeo(slug);
  const priceTag = deal.price ? ` (${deal.price})` : "";
  const title = `${deal.title}${priceTag} | ProofCraft Verified Deal`;
  const description = deal.summary;
  const ogImg = `/api/og?title=${encodeURIComponent(deal.title)}&subtitle=${encodeURIComponent(description)}&badge=${encodeURIComponent(`VERIFIED ${deal.network} DEAL`)}`;

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogImg, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImg] },
  };
}

export default function AffiliateDealSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}