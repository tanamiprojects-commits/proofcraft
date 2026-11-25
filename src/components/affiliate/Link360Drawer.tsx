"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Copy, CheckCircle2, Sparkles, RefreshCw, Flame, ExternalLink } from "lucide-react";
import { AffClick, AffLink, AffNetwork, buildMultiChannelAdCopy } from "@/lib/affiliate-store";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { sanitizePlainText } from "@/lib/security-utils";
import GlobalModal from "@/components/GlobalModal";

interface Link360DrawerProps {
  link: AffLink | null;
  network?: AffNetwork;
  clicks: AffClick[];
  boostCredits: number;
  onClose: () => void;
  onUpdated: () => Promise<void>;
  onNotify: (msg: string) => void;
}

export default function Link360Drawer({
  link, network, clicks, boostCredits, onClose, onUpdated, onNotify
}: Link360DrawerProps) {
  const { isHe, dir, t } = useStudioLang();
  const [destUrl, setDestUrl] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [health, setHealth] = useState<"active" | "needs_update" | "out_of_stock">("active");
  const [benefit, setBenefit] = useState("");
  const [fbCopy, setFbCopy] = useState("");
  const [waCopy, setWaCopy] = useState("");
  const [ttCopy, setTtCopy] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeChannel, setActiveChannel] = useState<"facebook" | "whatsapp" | "tiktok">("facebook");

  useEffect(() => {
    if (!link) return;
    setDestUrl(link.destination_url);
    setPriceStr(link.price_display || "");
    setHealth(link.health_status);
    setIsPublic(Boolean(link.is_public_deal));
    const origin = typeof window !== "undefined" ? window.location.origin : "https://vercel.app";
    const smartUrl = `${origin}/go/${link.slug}`;
    const generated = buildMultiChannelAdCopy({
      title: link.product_title,
      price: link.price_display || "",
      benefit: link.product_summary || "",
      smartUrl,
      isAmazon: link.network_slug === "amazon",
      isHe,
    });
    setFbCopy(link.saved_ad_copy?.facebook || generated.facebook);
    setWaCopy(link.saved_ad_copy?.whatsapp || generated.whatsapp);
    setTtCopy(link.saved_ad_copy?.tiktok || generated.tiktok);
  }, [link, isHe]);

  if (!link) return null;

  const linkClicks = clicks.filter((c) => c.link_id === link.id);
  const mobileCount = linkClicks.filter((c) => c.device_type === "mobile").length;
  const mobilePct = linkClicks.length > 0 ? Math.round((mobileCount / linkClicks.length) * 100) : 0;

  const hourCounts: Record<number, number> = {};
  linkClicks.forEach((c) => {
    const h = new Date(c.clicked_at).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });
  const peakHourEntry = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
  const peakHourLabel = peakHourEntry ? `${String(peakHourEntry[0]).padStart(2, "0")}:00` : t("Not enough data yet", "טרם נאספו מספיק נתונים");

  const nextBestAction = linkClicks.length === 0
    ? t("Share the WhatsApp/Facebook copy in 2 niche groups to trigger initial click telemetry.", "שתף את נוסח הוואטסאפ/פייסבוק ב-2 קבוצות נישה כדי להזרים קליקים ראשונים.")
    : mobilePct >= 65
      ? t(`${mobilePct}% of your traffic is Mobile — prioritize short WhatsApp & TikTok/Reels hooks.`, `${mobilePct}% מהתנועה שלך מהנייד — התמקד בהודעות וואטסאפ קצרות ורילס.`)
      : t("Strong desktop engagement — publish to the Public Deal Feed with +5 Boost Credits.", "מעורבות גבוהה בדסקטופ — פרסם לפיד הדילים הציבורי עם נקודות חשיפה.");

  const regenerateAds = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://vercel.app";
    const generated = buildMultiChannelAdCopy({
      title: link.product_title,
      price: priceStr,
      benefit: benefit || link.product_summary || "",
      smartUrl: `${origin}/go/${link.slug}`,
      isAmazon: link.network_slug === "amazon",
      isHe,
    });
    setFbCopy(generated.facebook);
    setWaCopy(generated.whatsapp);
    setTtCopy(generated.tiktok);
    onNotify(t("Fresh multi-channel ad angles generated!", "נוצרו זוויות שיווק חדשות לכל הערוצים!"));
  };

  const handleSave360 = async () => {
    setSaving(true);
    try {
      const parsed = new URL(destUrl.trim());
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Invalid URL");
      const { error } = await supabase.from("aff_links").update({
        destination_url: parsed.toString(),
        price_display: sanitizePlainText(priceStr, 40),
        health_status: health,
        is_public_deal: isPublic,
        saved_ad_copy: { facebook: fbCopy, whatsapp: waCopy, tiktok: ttCopy },
        updated_at: new Date().toISOString(),
      }).eq("id", link.id);
      if (error) throw error;
      await onUpdated();
      onNotify(t("360° Smart Link & Ad Vault saved!", "הגדרות הקישור החכם והמודעות נשמרו בענן!"));
    } catch {
      onNotify(t("Please enter a valid HTTPS destination URL.", "נא להזין כתובת יעד תקינה (HTTPS)."));
    } finally {
      setSaving(false);
    }
  };
  const handleBoostLink = async () => {
    if (boostCredits < 5) {
      return onNotify(t("Need at least 5 Boost Credits. Verify community deals to earn more!", "נדרשות לפחות 5 נקודות חשיפה. אמת דילים בקהילה כדי לצבור עוד!"));
    }
    setSaving(true);
    await Promise.all([
      supabase.from("aff_links").update({ boost_score: (link.boost_score || 0) + 5, is_public_deal: true }).eq("id", link.id),
      supabase.from("profiles").update({ affiliate_boost_credits: boostCredits - 5 }).eq("id", link.user_id),
      supabase.from("aff_karma_ledger").insert({
        user_id: link.user_id,
        action_type: "boost_spent",
        credits_delta: -5,
        description_en: `Boosted deal: ${link.product_title}`,
        description_he: `קידום דיל לראש הפיד: ${link.product_title}`,
      }),
    ]);
    setIsPublic(true);
    await onUpdated();
    setSaving(false);
    onNotify(t("+5 Boost Score applied! Deal elevated in Public Feed.", "+5 נקודות חשיפה הופעלו! הדיל קודם בפיד הציבורי."));
  };

  const currentAdText = activeChannel === "facebook" ? fbCopy : activeChannel === "whatsapp" ? waCopy : ttCopy;

  return (
    <GlobalModal isOpen={Boolean(link)} onClose={onClose} title={`360° Hub · ${link.product_title}`}>
      <div dir={dir} style={{ textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Live Telemetry Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          <div style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{t("TOTAL CLICKS", "סה״כ קליקים")}</div>
            <div className="tabular-nums" style={{ fontSize: 18, fontWeight: 900, color: "#38bdf8" }}>{link.click_count}</div>
          </div>
          <div style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{t("MOBILE SHARE", "אחוז מובייל")}</div>
            <div className="tabular-nums" style={{ fontSize: 18, fontWeight: 900, color: "#34d399" }}>{mobilePct}%</div>
          </div>
          <div style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{t("PEAK HOUR", "שעת שיא")}</div>
            <div className="tabular-nums" style={{ fontSize: 14, fontWeight: 900, color: "#fbbf24" }}>{peakHourLabel}</div>
          </div>
        </div>

        {/* Next Best Action Recommendation */}
        <div style={{ padding: 10, borderRadius: 10, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)", fontSize: 12, color: "#e0f2fe" }}>
          <BarChart3 size={13} style={{ display: "inline", marginRight: 5 }} />
          <strong>{t("Next-Best-Action:", "המלצת פעולה חכמה:")}</strong> {nextBestAction}
        </div>

        {/* Dynamic Destination URL & Health Status (Zero-Breakage Swap) */}
        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8" }}>
            {t("DYNAMIC DESTINATION URL (UPDATE PRODUCT WITHOUT BREAKING SHARED LINKS)", "כתובת יעד דינמית (החלף מוצר יעד בלי לשבור קישורים שכבר פורסמו)")}
          </div>
          <input type="url" dir="ltr" value={destUrl} onChange={(e) => setDestUrl(e.target.value)} className="input-dark" style={{ width: "100%", fontSize: 12, textAlign: "left" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input type="text" value={priceStr} onChange={(e) => setPriceStr(e.target.value)} placeholder={t("Price tag (e.g. $29 / ₪99)", "תג מחיר (לדוגמה ₪99)")} className="input-dark" style={{ fontSize: 12 }} />
            <select value={health} onChange={(e) => setHealth(e.target.value as "active" | "needs_update" | "out_of_stock")} className="input-dark" style={{ fontSize: 12 }}>
              <option value="active">{t("Status: Active & In Stock", "סטטוס: פעיל ובמלאי")}</option>
              <option value="needs_update">{t("Status: Needs Price Check", "סטטוס: דורש עדכון מחיר")}</option>
              <option value="out_of_stock">{t("Status: Out of Stock", "סטטוס: אזל מהמלאי")}</option>
            </select>
          </div>
        </div>

        {/* Built-in Multi-Channel Ad Copy Generator */}
        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#f8fafc" }}>
              <Sparkles size={13} style={{ display: "inline", marginRight: 4, color: "#fbbf24" }} />
              {t("Multi-Channel Ad Copy Studio", "מחולל מודעות מובנה לכל הערוצים")}
            </span>
            <button type="button" onClick={regenerateAds} className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11 }}>
              <RefreshCw size={11} /> {t("Regenerate Angles", "רענן ניסוח")}
            </button>
          </div>

          <input type="text" value={benefit} onChange={(e) => setBenefit(e.target.value)} placeholder={t("Key selling hook (e.g. Saves 40% vs retail, fast shipping)", "יתרון מרכזי של המוצר לחידוד המודעה...")} className="input-dark" style={{ fontSize: 12 }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {(["facebook", "whatsapp", "tiktok"] as const).map((ch) => (
              <button key={ch} type="button" onClick={() => setActiveChannel(ch)} className={activeChannel === ch ? "btn-primary" : "btn-ghost"} style={{ height: 32, fontSize: 11 }}>
                {ch === "facebook" ? "Facebook / IG" : ch === "whatsapp" ? "WhatsApp / TG" : "TikTok / Reels"}
              </button>
            ))}
          </div>

          <textarea
            rows={5}
            value={currentAdText}
            onChange={(e) => {
              if (activeChannel === "facebook") setFbCopy(e.target.value);
              else if (activeChannel === "whatsapp") setWaCopy(e.target.value);
              else setTtCopy(e.target.value);
            }}
            className="input-dark"
            style={{ width: "100%", fontSize: 12, lineHeight: 1.55 }}
          />

          <button
            type="button"
            onClick={() => { navigator.clipboard?.writeText(currentAdText); onNotify(t("Ad copy copied to clipboard!", "נוסח המודעה הועתק ללוח!")); }}
            className="btn-ghost"
            style={{ height: 34, fontSize: 12, color: "#38bdf8" }}
          >
            <Copy size={13} /> {t("Copy Ready-to-Post Ad", "העתק מודעה מוכנה לפרסום")}
          </button>
        </div>

        {/* Public Deal Feed & Give-to-Get Boost Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: 10, borderRadius: 10, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: "#e2e8f0", cursor: "pointer" }}>
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            <span>{t("Publish to Public SEO Deal Feed", "פרסם בעמוד הדילים הציבורי (SEO)")}</span>
          </label>
          <button type="button" onClick={handleBoostLink} disabled={saving} className="badge-pill" style={{ background: "rgba(251,191,36,0.18)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.4)", cursor: "pointer", fontSize: 11 }}>
            <Flame size={12} /> {t(`Boost +5 (${boostCredits} Credits)`, `קדם ב-+5 (${boostCredits} נק׳)`)}
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          <a href={`/affiliate/deal/${encodeURIComponent(link.slug)}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 40, fontSize: 12 }}>
            <ExternalLink size={13} /> {t("Open Public Deal Card", "צפה בכרטיס הדיל הציבורי")}
          </a>
          <button type="button" onClick={handleSave360} disabled={saving} className="btn-primary" style={{ width: "auto", padding: "0 20px", height: 40, fontSize: 13 }}>
            <CheckCircle2 size={14} /> {saving ? t("Saving...", "שומר...") : t("Save 360° Changes", "שמור שינויים")}
          </button>
        </div>
      </div>
    </GlobalModal>
  );
}
