const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function queryRest<T>(path: string): Promise<T[]> {
  if (!SUPA_URL || !SUPA_KEY) return [];
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

export async function resolveCreatorSeo(rawSlug: string) {
  const clean = decodeURIComponent(rawSlug || "").trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
  const filter = isUuid ? `id=eq.${encodeURIComponent(clean)}` : `public_slug=eq.${encodeURIComponent(clean)}`;
  const rows = await queryRest<{ full_name?: string; headline?: string; purchased_track_level?: number; admin_verified?: boolean }>(
    `profiles?select=full_name,headline,purchased_track_level,admin_verified&${filter}&limit=1`
  );
  const p = rows.at(0);
  return {
    name: p?.full_name || (isUuid ? "Verified ProofCraft Builder" : clean.replace(/[-_]+/g, " ")),
    headline: p?.headline || "Verified AI Product Engineer & Execution Portfolio",
    tier: p?.purchased_track_level || 1,
    verified: Boolean(p?.admin_verified),
  };
}

export async function resolveDealSeo(rawSlug: string) {
  const clean = decodeURIComponent(rawSlug || "").trim();
  const rows = await queryRest<{ product_title?: string; product_summary?: string; price_display?: string; network_slug?: string }>(
    `aff_links?select=product_title,product_summary,price_display,network_slug&slug=eq.${encodeURIComponent(clean)}&limit=1`
  );
  const d = rows.at(0);
  return {
    title: d?.product_title || clean.replace(/[-_]+/g, " "),
    summary: d?.product_summary || "Verified partner offer with full transparency disclosure on ProofCraft Fintech OS.",
    price: d?.price_display || "",
    network: (d?.network_slug || "PARTNER").toUpperCase(),
  };
}