"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExternalLink, ShieldCheck, Sparkles, ThumbsUp, Award, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AffLink, AffNetwork } from "@/lib/affiliate-store";
import { useStudioLang } from "@/lib/i18n-engine";

export default function PublicDealCardPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";
  const { isHe, dir, t } = useStudioLang();
  const [link, setLink] = useState<AffLink | null>(null);
  const [network, setNetwork] = useState<AffNetwork | null>(null);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [verifiedDone, setVerifiedDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeal = async () => {
      const [{ data: lData }, { data: uData }] = await Promise.all([
        supabase.from("aff_links").select("*").eq("slug", slug).single(),
        supabase.auth.getUser(),
      ]);
      if (lData) {
        setLink(lData as AffLink);
        const { data: nData } = await supabase.from("aff_networks").select("*").eq("slug", lData.network_slug).single();
        if (nData) setNetwork(nData as AffNetwork);
      }
      setViewerId(uData?.user?.id || null);
      setLoading(false);
    };
    if (slug) loadDeal();
  }, [slug]);

  const handleCommunityVerify = async () => {
    if (!viewerId || !link || verifiedDone) return;
    setVerifiedDone(true);
    const { data: prof } = await supabase.from("profiles").select("affiliate_boost_credits").eq("id", viewerId).single();
    const curr = Number(prof?.affiliate_boost_credits ?? 10);
    await Promise.all([
      supabase.from("profiles").update({ affiliate_boost_credits: curr + 5 }).eq("id", viewerId),
      supabase.from("aff_karma_ledger").insert({
        user_id: viewerId,
        action_type: "deal_verified",
        credits_delta: 5,
        description_en: `Verified active deal: ${link.product_title}`,
        description_he: `אימות תקינות דיל בקהילה: ${link.product_title}`,
      }),
    ]);
  };

  if (loading) {
    return <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>{t("Loading Verified Deal Card...", "טוען כרטיס דיל מאומת...")}</div>;
  }

  if (!link) {
    return (
      <div className="card-surface" style={{ maxWidth: 520, margin: "40px auto", padding: 24, textAlign: "center" }}>
        <AlertTriangle size={28} color="#fbbf24" style={{ margin: "0 auto 10px" }} />
        <h1 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginBottom: 8 }}>{t("Deal Link Not Found", "הדיל המבוקש לא נמצא")}</h1>
        <Link href="/affiliate" className="btn-primary" style={{ width: "auto", padding: "0 20px" }}>{t("Explore Direct Income Hub", "עבור למרכז השותפים והדילים")}</Link>
      </div>
    );
  }

  const netName = network ? (isHe ? network.name_he : network.name_en) : link.network_slug;
  const requiresDisclosure = Boolean(network?.disclose_required || link.network_slug === "amazon");

  return (
    <div dir={dir} style={{ maxWidth: 640, margin: "24px auto", textAlign: isHe ? "right" : "left" }}>
      <div className="card-hero" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 11 }}>
            <ShieldCheck size={13} /> {t("VERIFIED PARTNER DEAL CARD", "כרטיס מוצר מאומת ותקני")}
          </span>
          <span className="badge-pill" style={{ background: "rgba(56,189,248,0.14)", color: "#38bdf8", fontSize: 11 }}>
            {netName} · {link.folder_name}
          </span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc", lineHeight: 1.3, marginBottom: 10 }}>{link.product_title}</h1>

        {link.price_display && (
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 10, background: "rgba(251,191,36,0.14)", border: "1px solid rgba(251,191,36,0.35)", color: "#fbbf24", fontWeight: 900, fontSize: 16, marginBottom: 12 }}>
            {link.price_display}
          </div>
        )}

        {link.product_summary && (
          <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.65, marginBottom: 18 }}>{link.product_summary}</p>
        )}

        {requiresDisclosure && (
          <div style={{ padding: 12, borderRadius: 10, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", fontSize: 12, color: "#fde68a", marginBottom: 16 }}>
            <strong>{t("Affiliate Disclosure:", "גילוי נאות:")}</strong>{" "}
            {t(
              "As an Amazon Associate and verified partner, the curator may earn a commission from qualifying purchases at zero extra cost to you. Product prices and availability are subject to change.",
              "גילוי נאות: כשותף אמזון ורשתות מסחר מאומתות, מפרסם הדיל עשוי לקבל עמלה מרכישות מזכות ללא כל עלות נוספת עבורך. המחיר והזמינות מתעדכנים באתר המוכר."
            )}
          </div>
        )}

        <a
          href={link.destination_url}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="btn-primary"
          style={{ height: 48, fontSize: 15, marginBottom: 12 }}
        >
          <span>{t(`Continue to Official Store (${netName})`, `המשך לחנות הרשמית (${netName})`)}</span>
          <ExternalLink size={16} />
        </a>

        {viewerId && viewerId !== link.user_id && (
          <button
            type="button"
            onClick={handleCommunityVerify}
            disabled={verifiedDone}
            className="btn-ghost"
            style={{ width: "100%", height: 38, fontSize: 12, color: verifiedDone ? "#34d399" : "#38bdf8" }}
          >
            <ThumbsUp size={13} />
            <span>
              {verifiedDone
                ? t("Verified! +5 Boost Credits added to your account", "אומת בהצלחה! +5 נקודות חשיפה נוספו לחשבונך")
                : t("Verify Link Works & Is In Stock (+5 Boost Credits)", "אמת שהקישור תקין ובמלאי (+5 נקודות חשיפה)")}
            </span>
          </button>
        )}
      </div>

      {/* Viral Attribution Footer ($0 CAC Growth Loop) */}
      <div className="card-surface" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 12, color: "#cbd5e1" }}>
          <Award size={14} color="#38bdf8" style={{ display: "inline", marginRight: 5 }} />
          <strong>{t("Powered by ProofCraft Direct Income Hub", "מופעל ע״י ProofCraft Direct Income Hub")}</strong> ·{" "}
          {t("Curate deals & earn commissions without coding.", "נהל קישורי שותפים והפק מודעות מנצחות בחינם.")}
        </div>
        <Link href="/affiliate" className="btn-ghost" style={{ height: 34, fontSize: 11.5, color: "#34d399" }}>
          <Sparkles size={13} /> {t("Start Free Deal Hub", "פתח תיק קישורים בחינם")}
        </Link>
      </div>
    </div>
  );
}
