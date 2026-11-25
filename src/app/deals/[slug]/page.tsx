"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExternalLink, ShieldCheck, Sparkles, Tag, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AffLink } from "@/lib/affiliate-store";
import { useStudioLang } from "@/lib/i18n-engine";
import ViralShareBar from "@/components/ViralShareBar";

export default function PublicCuratorDealsPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params?.slug || "");
  const [curatorId, setCuratorId] = useState<string>("");
  const { isHe, dir } = useStudioLang();
  const [curatorName, setCuratorName] = useState<string>("");
  const [links, setLinks] = useState<AffLink[]>([]);
  const [folder, setFolder] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorefront = async () => {
      let targetUserId = slug;
      let displayName = slug;

      const { data: profBySlug } = await supabase
        .from("profiles")
        .select("id, full_name, public_slug")
        .or(`public_slug.eq.${slug},id.eq.${slug}`)
        .limit(1)
        .single();

      if (profBySlug) {
        targetUserId = profBySlug.id;
        displayName = profBySlug.full_name || profBySlug.public_slug || "Verified Curator";
      }

      const { data: linkRows } = await supabase
        .from("aff_links")
        .select("*")
        .eq("user_id", targetUserId)
        .eq("health_status", "active")
        .order("boost_score", { ascending: false })
        .order("created_at", { ascending: false });

      setCuratorId(targetUserId);
      setCuratorName(displayName);
      setLinks((linkRows || []) as AffLink[]);
      setLoading(false);
    };
    if (slug) loadStorefront();
    const onSync = () => { if (slug) loadStorefront(); };
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [slug]);
  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
        {isHe ? "טוען חנות דילים מאומתת..." : "Loading Verified Deal Storefront..."}
      </div>
    );
  }

  const folders = ["ALL", ...Array.from(new Set(links.map((l) => l.folder_name)))];
  const visible = links.filter((l) => folder === "ALL" || l.folder_name === folder);

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      <div className="card-hero" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 11 }}>
            <ShieldCheck size={13} /> {isHe ? "לוח דילים והמלצות מאומת" : "VERIFIED CURATOR DEAL STOREFRONT"}
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {curatorId && <Link href={`/portfolio/${curatorId}`} className="btn-ghost" style={{ height: 34, fontSize: 12 }}>{isHe ? "\u05DC\u05E4\u05D5\u05E8\u05D8\u05E4\u05D5\u05DC\u05D9\u05D5 \u05D4\u05D9\u05D5\u05E6\u05E8" : "Creator Portfolio"}</Link>}
          <ViralShareBar
            title={isHe ? `הדילים הנבחרים של ${curatorName}` : `${curatorName}'s Verified Deals`}
            isHe={isHe}
            compact
          />
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
          {isHe ? `הדילים וההמלצות הנבחרות של ${curatorName}` : `${curatorName}'s Curated Deals & Smart Picks`}
        </h1>
        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 12 }}>
          {isHe
            ? "גילוי נאות: כשותף אמזון ורשתות מסחר מאומתות, מפרסם הלוח עשוי לקבל עמלה מרכישות מזכות ללא כל עלות נוספת עבורך."
            : "Affiliate Disclosure: As an Amazon Associate and verified partner, this curator may earn a commission from qualifying purchases at zero extra cost to you."}
        </p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {folders.map((f) => (
            <button key={f} type="button" onClick={() => setFolder(f)} className={folder === f ? "btn-primary" : "btn-ghost"} style={{ width: "auto", minHeight: 36, padding: "0 12px", fontSize: 11.5 }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="card-surface" style={{ padding: 28, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
          {isHe ? "טרם פורסמו דילים בחנות זו." : "No public deals published in this storefront yet."}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 14, marginBottom: 20 }}>
          {visible.map((lk) => (
            <div key={lk.id} className="card-surface" style={{ padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>
                    <Tag size={11} /> {lk.folder_name}
                  </span>
                  {lk.price_display && <span className="badge-pill" style={{ fontSize: 11, background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontWeight: 800 }}>{lk.price_display}</span>}
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", lineHeight: 1.35, marginBottom: 6 }}>{lk.product_title}</h2>
                {lk.product_summary && <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.55 }}>{lk.product_summary}</p>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href={`/go/${encodeURIComponent(lk.slug)}`} target="_blank" rel="noopener noreferrer nofollow sponsored" className="btn-primary" style={{ minHeight: 40, fontSize: 12.5 }}>
                  <span>{isHe ? "לצפייה בדיל המאומת" : "Check Verified Offer"}</span>
                  <ExternalLink size={14} />
                </a>
                <ViralShareBar
                  title={lk.product_title}
                  url={typeof window !== "undefined" ? `${window.location.origin}/affiliate/deal/${encodeURIComponent(lk.slug)}` : undefined}
                  isHe={isHe}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card-surface" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 12, color: "#cbd5e1" }}>
          <Award size={14} color="#38bdf8" style={{ display: "inline", marginInlineEnd: 5 }} />
          <strong>ProofCraft Fintech OS</strong> · {isHe ? "פתח לוח דילים ציבורי וקישורים חכמים משלך בחינם." : "Launch your own verified deal storefront & smart links for free."}
        </div>
        <Link href="/affiliate" className="btn-ghost" style={{ minHeight: 36, fontSize: 11.5, color: "#34d399" }}>
          <Sparkles size={13} /> {isHe ? "צור לוח דילים בחינם" : "Create My Free Storefront"}
        </Link>
      </div>
    </div>
  );
}