import type { Metadata } from "next";
import { resolveCreatorSeo } from "@/lib/seo-resolver";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const info = await resolveCreatorSeo(slug);
  const title = `${info.name} - Verified AI Systems Portfolio (v${info.tier}.0) | ProofCraft`;
  const description = info.headline;
  const badge = info.verified ? `CERTIFIED GRADUATE v${info.tier}.0` : `VERIFIED AI BUILDER v${info.tier}.0`;
  const ogImg = `/api/og?title=${encodeURIComponent(info.name)}&subtitle=${encodeURIComponent(description)}&badge=${encodeURIComponent(badge)}`;

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogImg, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImg] },
  };
}

export default function PortfolioSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}