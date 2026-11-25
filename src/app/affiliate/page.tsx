"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, ShieldCheck, Link2, Sparkles, ExternalLink, Copy, CheckCircle2, AlertTriangle, Plus, BarChart3, Lock, Flame, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { sanitizePlainText } from "@/lib/security-utils";
import {
  AffClick, AffKarmaEntry, AffLink, AffNetwork, AffPromptItem, AffUserAccount,
  buildMultiChannelAdCopy, fetchAffiliateHubState, generateSmartSlug
} from "@/lib/affiliate-store";
import Link360Drawer from "@/components/affiliate/Link360Drawer";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";
import CustomNetworkModal from "@/components/affiliate/CustomNetworkModal";
import AffiliateMonetizationModal from "@/components/affiliate/AffiliateMonetizationModal";

export default function AffiliateIncomeHubPage() {
  const { isHe, dir, t } = useStudioLang();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"compass" | "wizard" | "portfolio" | "bridge">("compass");
  const [networks, setNetworks] = useState<AffNetwork[]>([]);
  const [prompts, setPrompts] = useState<AffPromptItem[]>([]);
  const [accounts, setAccounts] = useState<AffUserAccount[]>([]);
  const [links, setLinks] = useState<AffLink[]>([]);
  const [clicks, setClicks] = useState<AffClick[]>([]);
  const [karma, setKarma] = useState<AffKarmaEntry[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [boostCredits, setBoostCredits] = useState(10);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // Wizard State
  const [selectedNetSlug, setSelectedNetSlug] = useState("aliexpress");
  const [tagInput, setTagInput] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [salesCountInput, setSalesCountInput] = useState(0);

  // Smart Link Creator State
  const [newNetSlug, setNewNetSlug] = useState("aliexpress");
  const [newFolder, setNewFolder] = useState("General Deals");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [folderFilter, setFolderFilter] = useState("ALL");
  const [active360Link, setActive360Link] = useState<AffLink | null>(null);

  // External AI Bridge State
  const [bridgeProduct, setBridgeProduct] = useState("");
  const [bridgePrice, setBridgePrice] = useState("");
  const [bridgeBenefit, setBridgeBenefit] = useState("");
  const [proModalOpen, setProModalOpen] = useState(false);
  const [customNetOpen, setCustomNetOpen] = useState(false);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3400); };

  const reloadHub = async (uid: string | null) => {
    const st = await fetchAffiliateHubState(uid);
    setNetworks(st.networks);
    setPrompts(st.prompts);
    setAccounts(st.accounts);
    setLinks(st.links);
    setClicks(st.clicks);
    setKarma(st.karma);
    setIsPro(st.isAffiliatePro);
    setBoostCredits(st.boostCredits);
    setReferralCode(st.referralCode);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id || null;
      setUserId(uid);
      setUserEmail(data.user?.email || "");
      reloadHub(uid);
    });
  }, []);
  const activeNetwork = networks.find((n) => n.slug === selectedNetSlug) || networks[0];
  const existingAccount = accounts.find((a) => a.network_slug === selectedNetSlug);

  useEffect(() => {
    if (existingAccount) {
      setTagInput(existingAccount.tracking_id || "");
      setCouponInput(existingAccount.coupon_code || "");
      setSalesCountInput(existingAccount.qualifying_sales_count || 0);
    } else {
      setTagInput("");
      setCouponInput("");
      setSalesCountInput(0);
    }
  }, [selectedNetSlug, accounts]);

  const handleVerifyAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !activeNetwork) return notify(t("Please sign in first to verify partner accounts.", "נא להתחבר כדי לאמת חשבונות שותפים."));
    const cleanTag = sanitizePlainText(tagInput, 64);
    try {
      const rx = new RegExp(activeNetwork.tracking_id_regex || "^[a-zA-Z0-9._-]{3,60}$");
      if (!rx.test(cleanTag)) {
        return notify(t(
          `Invalid ID format for ${activeNetwork.name_en}. Expected: ${activeNetwork.tracking_id_label_en}`,
          `פורמט מזהה לא תקין עבור ${activeNetwork.name_he}. נדרש: ${activeNetwork.tracking_id_label_he}`
        ));
      }
    } catch {}

    const { error } = await supabase.from("aff_user_accounts").upsert({
      user_id: userId,
      network_slug: activeNetwork.slug,
      tracking_id: cleanTag,
      coupon_code: sanitizePlainText(couponInput, 40),
      is_verified: true,
      verified_at: new Date().toISOString(),
      qualifying_sales_count: Math.max(0, Number(salesCountInput) || 0),
    }, { onConflict: "user_id,network_slug" });

    if (error) return notify(error.message);
    await reloadHub(userId);
    notify(t(`${activeNetwork.name_en} verified! Smart link generation unlocked.`, `חשבון ${activeNetwork.name_he} אומת בהצלחה! כעת ניתן ליצור קישורים חכמים.`));
  };

  const isMaliciousOrUnsafeUrl = (rawUrl: string): boolean => {
    const lower = rawUrl.trim().toLowerCase();
    if (!lower.startsWith("https://")) return true;
    const blockedExt = [".exe", ".bat", ".cmd", ".scr", ".msi", ".apk", ".zip", ".rar", ".js", ".vbs", ".ps1"];
    if (blockedExt.some((ext) => lower.includes(ext))) return true;
    if (lower.includes("javascript:") || lower.includes("data:") || lower.includes("<script")) return true;
    return false;
  };

  const handleCreateSmartLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return notify(t("Sign in to create smart links.", "התחבר כדי ליצור קישורים חכמים."));
    if (!isPro && links.length >= 3) {
      setProModalOpen(true);
      return notify(t("Free Starter tier allows up to 3 links. Upgrade to Affiliate Pro for unlimited links!", "מסלול Starter החינמי מוגבל ל-3 קישורים. שדרג ל-Affiliate Pro לקישורים ללא הגבלה!"));
    }

    const cleanTitle = sanitizePlainText(newTitle, 110);
    const cleanUrl = newUrl.trim();
    if (cleanTitle.length < 4) return notify(t("Enter a descriptive product title (min 4 chars).", "הזן כותרת מוצר ברורה (לפחות 4 תווים)."));
    if (isMaliciousOrUnsafeUrl(cleanUrl)) {
      return notify(t("Security Block: Only safe HTTPS product URLs are permitted (no executables or raw scripts).", "חסימת אבטחה: מותרות רק כתובות HTTPS מאובטחות של מוצרים (ללא קבצים להורדה או סקריפטים)."));
    }

    const slug = generateSmartSlug(cleanTitle);
    const origin = typeof window !== "undefined" ? window.location.origin : "https://vercel.app";
    const generatedAds = buildMultiChannelAdCopy({
      title: cleanTitle,
      price: sanitizePlainText(newPrice, 30),
      benefit: sanitizePlainText(newSummary, 180),
      smartUrl: `${origin}/go/${slug}`,
      isAmazon: newNetSlug === "amazon",
      isHe,
    });

    const { error } = await supabase.from("aff_links").insert({
      user_id: userId,
      network_slug: newNetSlug,
      folder_name: sanitizePlainText(newFolder || "General Deals", 40),
      slug,
      product_title: cleanTitle,
      product_summary: sanitizePlainText(newSummary, 240),
      destination_url: cleanUrl,
      price_display: sanitizePlainText(newPrice, 30),
      saved_ad_copy: generatedAds,
      health_status: "active",
      is_public_deal: false,
    });

    if (error) {
      if (error.message.includes("STARTER_QUOTA_REACHED")) setProModalOpen(true);
      return notify(error.message);
    }

    setNewTitle(""); setNewUrl(""); setNewPrice(""); setNewSummary("");
    await reloadHub(userId);
    notify(t("Smart Link & Multi-Channel Ad Copy created!", "הקישור החכם והמודעות לכל הערוצים נוצרו בהצלחה!"));
  };
  const folders = ["ALL", ...Array.from(new Set(links.map((l) => l.folder_name)))];
  const visibleLinks = links.filter((l) => folderFilter === "ALL" || l.folder_name === folderFilter);
  const totalClicks = links.reduce((sum, l) => sum + (l.click_count || 0), 0);

  if (loading) {
    return <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>{t("Loading Direct Income & Affiliate Hub...", "טוען את מרכז ההכנסה והשותפים...")}</div>;
  }

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 95, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      <div className="card-hero" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <span className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.14)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.35)", fontSize: 11 }}>
            <Sparkles size={13} /> {t("DIRECT INCOME & AFFILIATE ENGINE · ZERO CODING REQUIRED", "מנוע הכנסה ישירה ושיווק שותפים · ללא צורך בתיק עבודות או קוד")}
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge-pill" style={{ background: "rgba(251, 191, 36, 0.14)", color: "#fbbf24", fontSize: 11 }}>
              <Flame size={12} /> {boostCredits} {t("Boost Credits", "נקודות חשיפה")}
            </span>
            <span className="badge-pill" style={{ background: isPro ? "rgba(56, 189, 248, 0.18)" : "rgba(148, 163, 184, 0.16)", color: isPro ? "#38bdf8" : "#cbd5e1", fontSize: 11 }}>
              {isPro ? "AFFILIATE PRO · UNLIMITED" : t(`STARTER (${links.length}/3 Links)`, `מסלול חינמי (${links.length}/3 קישורים)`)}
            </span>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
          {t("Global Affiliate & Smart Deal Portfolio Hub", "מרכז שיווק שותפים, קישורים חכמים והכנסה מיידית")}
        </h1>
        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 16 }}>
          {t(
            "Compare global & Israeli partner networks before signing up, verify your tracking IDs with built-in compliance guards, and generate multi-channel ads in one click.",
            "השווה בין רשתות שותפים מהעולם ומישראל לפני ההרשמה, אמת מזהי מעקב עם הגנה מפני חסימות, והפק מודעות מוכנות לכל הרשתות בלחיצה אחת."
          )}
        </p>

                <div style={{ marginBottom: 14 }}>
          <StudioVisualArtwork variant="affiliate" />
        </div>

        {/* Built-in Smart Action Coach (Tailors next profitable step automatically) */}
        <div style={{ padding: 12, borderRadius: 12, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.35)", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12.5, color: "#e0f2fe" }}>
            <strong style={{ color: "#38bdf8" }}>{t("Smart Action Coach:", "המלצת מנוע הפעולה החכם:")}</strong>{" "}
            {accounts.filter((a) => a.is_verified).length === 0
              ? t("Step 1: Open 'Setup & Verify IDs' and verify your first partner tag (AliExpress/Temu or WeSell Israel) to unlock safe link tracking.", "שלב 1: היכנס ללשונית ׳אשף הקמה ואימות׳ ואמת מזהה שותף ראשון כדי לפתוח יצירת קישורים מאובטחים.")
              : links.length === 0
                ? t("Step 2: Your partner ID is verified! Open 'Smart Links' to create your first /go/ link and auto-generate ads.", "שלב 2: מזהה השותף שלך מאומת! פתח את ׳תיק קישורים׳ ליצירת הקישור החכם הראשון ומודעות מוכנות.")
                : totalClicks === 0
                  ? t("Step 3: Copy your ready-made WhatsApp/Facebook ad from '360° Hub & Ads' and publish to the Organic Feed.", "שלב 3: העתק את מודעת הוואטסאפ/פייסבוק מתוך ׳ניהול 360°׳ ושגר את הדיל לפיד האורגני.")
                  : t("Step 4: Great momentum! Open '360° Hub' on your top link to inspect peak hours or boost visibility.", "שלב 4: יש תנועה חיה! פתח ׳ניהול 360°׳ בקישור המוביל שלך לבדיקת שעות שיא או קידום בראש הפיד.")}
          </div>
          <button
            type="button"
            onClick={() => setActiveTab(accounts.filter((a) => a.is_verified).length === 0 ? "wizard" : "portfolio")}
            className="btn-primary"
            style={{ width: "auto", height: 32, padding: "0 14px", fontSize: 11.5 }}
          >
            {accounts.filter((a) => a.is_verified).length === 0 ? t("Verify First ID", "אמת מזהה ראשון") : t("Create / Manage Links", "נהל קישורים ומודעות")}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8 }}>
          {[
            { id: "compass", icon: Compass, label: t("1. Decision Compass", "1. מצפן ההחלטות") },
            { id: "wizard", icon: ShieldCheck, label: t("2. Setup & Verify IDs", "2. אשף הקמה ואימות") },
            { id: "portfolio", icon: Link2, label: t(`3. Smart Links (${links.length})`, `3. תיק קישורים (${links.length})`) },
            { id: "bridge", icon: Award, label: t("4. AI Bridge & Karma", "4. גשר כלי AI וקרמה") },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as "compass" | "wizard" | "portfolio" | "bridge")} className={active ? "btn-primary" : "btn-ghost"} style={{ height: 40, fontSize: 12.5 }}>
                <Icon size={14} /> <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "compass" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card-surface" style={{ padding: 14, border: "1px solid rgba(251,191,36,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 12.5, color: "#e2e8f0" }}>
              <strong style={{ color: "#fbbf24" }}>{t("Fintech Partner Directory & Custom Networks:", "ספריית רשתות השותפים והוספת פלטפורמות:")}</strong>{" "}
              {t("Compare verified commission yields or add any external affiliate program to track in one place.", "השווה אחוזי עמלה מאומתים או הוסף כל תוכנית שותפים חיצונית למעקב מרוכז.")}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={() => setCustomNetOpen(true)} className="btn-primary" style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12, background: "#38bdf8", color: "#0a0b0e" }}>
                <Plus size={13} /> {t("Add Custom Platform", "הוסף פלטפורמה חיצונית")}
              </button>
              {!isPro && (
                <button type="button" onClick={() => setProModalOpen(true)} className="btn-primary" style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12, background: "#fbbf24", color: "#0a0b0e" }}>
                  <Sparkles size={13} /> {t("Upgrade Pro & Bundles", "שדרוג Pro וחבילות")}
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {networks.map((net) => {
            const verified = accounts.some((a) => a.network_slug === net.slug && a.is_verified);
            const catLabel = isHe
              ? (net.category === "Global E-Commerce" ? "מסחר גלובלי" : net.category === "High-Conversion Consumer" ? "צרכנות והמרה גבוהה" : net.category === "Global Marketplace & Tech" ? "טכנולוגיה ומרקטפלייס" : net.category)
              : net.category;
            return (
              <div key={net.id} className="card-surface" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14, border: verified ? "1px solid rgba(52,211,153,0.45)" : "1px solid rgba(255,255,255,0.09)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <span className="badge-pill" style={{ fontSize: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8", marginBottom: 6 }}>{catLabel}</span>
                      <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", lineHeight: 1.3 }}>{isHe ? net.name_he : net.name_en}</h2>
                    </div>
                    {verified && (
                      <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(52,211,153,0.16)", color: "#34d399", border: "1px solid rgba(52,211,153,0.35)" }}>
                        ✓ {t("VERIFIED", "מאומת")}
                      </span>
                    )}
                  </div>

                  {/* Separate Fintech KPI Telemetry Boxes */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", marginBottom: 2 }}>{t("COMMISSION YIELD", "טווח עמלה")}</div>
                      <div dir="ltr" style={{ fontSize: 12.5, fontWeight: 800, color: "#34d399", textAlign: isHe ? "right" : "left" }}>{net.commission_range}</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", marginBottom: 2 }}>{t("COOKIE WINDOW", "חלון עוגייה")}</div>
                      <div dir="ltr" style={{ fontSize: 12.5, fontWeight: 800, color: "#38bdf8", textAlign: isHe ? "right" : "left" }}>{net.cookie_window}</div>
                    </div>
                  </div>

                  <div style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.55 }}>
                    <strong style={{ color: "#f8fafc" }}>{t("Approval Requirement:", "תנאי סף:")}</strong> {isHe ? net.threshold_he : net.threshold_en}
                  </div>

                  {/* Clean Collapsible Anti-Ban Compliance Drawer */}
                  <details style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.25)", fontSize: 12, color: "#fecaca" }}>
                    <summary style={{ cursor: "pointer", fontWeight: 800, listStyle: "none", display: "flex", alignItems: "center", gap: 6 }}>
                      <AlertTriangle size={13} color="#f87171" />
                      <span>{t("View Anti-Ban & Compliance Rules", "צפה בכללי אבטחה ומניעת חסימה")}</span>
                    </summary>
                    <ul style={{ margin: "8px 0 0", paddingInlineStart: 18, lineHeight: 1.5 }}>
                      {(isHe ? net.strict_rules_he : net.strict_rules_en).map((rule, idx) => (
                        <li key={idx} style={{ marginBottom: 3 }}>{rule}</li>
                      ))}
                    </ul>
                  </details>
                </div>

                <button type="button" onClick={() => { setSelectedNetSlug(net.slug); setActiveTab("wizard"); }} className={verified ? "btn-ghost" : "btn-primary"} style={{ width: "100%", height: 40, fontSize: 12.5 }}>
                  {verified ? t("Manage Verified Partner Tag", "נהל מזהה שותף מאומת") : t("Start Guided Setup & Verify", "התחל אשף הקמה ואימות")}
                </button>
              </div>
            );
          })}
          </div>
        </div>
      )}
      {activeTab === "wizard" && activeNetwork && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          <div className="card-surface" style={{ padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8", marginBottom: 6 }}>{t("SELECT PARTNER NETWORK", "בחר רשת שותפים להקמה")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {networks.map((n) => (
                <button
                  key={n.slug}
                  type="button"
                  onClick={() => setSelectedNetSlug(n.slug)}
                  className={selectedNetSlug === n.slug ? "btn-primary" : "btn-ghost"}
                  style={{ width: "auto", height: 32, padding: "0 12px", fontSize: 11.5 }}
                >
                  {isHe ? n.name_he.split("(") : n.name_en.split("(")}
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 8 }}>
              {t("Step-by-Step Guided Checklist", "מדריך הקמה שלב-אחר-שלב")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {(activeNetwork.onboarding_steps || []).map((st) => (
                <div key={st.step} style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: "#38bdf8" }}>{st.step}. {isHe ? st.title_he : st.title_en}</div>
                  <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: 2 }}>{isHe ? st.detail_he : st.detail_en}</p>
                </div>
              ))}
            </div>

            <a href={activeNetwork.signup_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ width: "100%", height: 38, fontSize: 12, color: "#34d399" }}>
              <ExternalLink size={14} /> {t(`Open Official ${activeNetwork.name_en} Portal`, `פתח את פורטל ההרשמה הרשמי של ${activeNetwork.name_he}`)}
            </a>
          </div>

          {userId && (
            <div className="card-surface" style={{ padding: 12, border: "1px solid rgba(56,189,248,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                <strong style={{ color: "#38bdf8" }}>{t("Your Public Deal Storefront URL:", "כתובת חנות הדילים הציבורית שלך לשיתוף בביו:")}</strong>{" "}
                <code dir="ltr" style={{ color: "#34d399" }}>{`https://vercel.app{userId}`}</code>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(`https://vercel.app{userId}`); notify(t("Public storefront link copied!", "קישור חנות הדילים הועתק!")); }} className="btn-ghost" style={{ height: 32, fontSize: 11 }}>
                  <Copy size={12} /> {t("Copy Storefront URL", "העתק קישור לחנות")}
                </button>
                <a href={`/deals/${userId}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: "auto", height: 32, padding: "0 12px", fontSize: 11 }}>
                  <ExternalLink size={12} /> {t("Open Storefront", "צפה בחנות")}
                </a>
              </div>
            </div>
          )}

          <div className="card-hero" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
              {t("Verify Partner ID & Compliance Checkpoint", "אימות מזהה שותף ובקרת תקינות")}
            </h3>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>
              {t("Paste your assigned partner tag below. ProofCraft validates the exact format before unlocking smart links.", "הדבק את מזהה השותף שקיבלת. המערכת מאמתת את הפורמט המדויק לפני פתיחת יצירת קישורים.")}
            </p>

            <form onSubmit={handleVerifyAccount} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
                  {isHe ? activeNetwork.tracking_id_label_he : activeNetwork.tracking_id_label_en}
                </label>
                <input type="text" dir="ltr" required value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g. proofcraft-20 / dealhub_il" className="input-dark" style={{ width: "100%", textAlign: "left" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
                  {t("Optional Promo / Coupon Code", "קוד קופון אישי (אופציונלי)")}
                </label>
                <input type="text" dir="ltr" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="SAVE20" className="input-dark" style={{ width: "100%", textAlign: "left" }} />
              </div>

              {activeNetwork.slug === "amazon" && (
                <div style={{ padding: 12, borderRadius: 10, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.35)" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>
                    {t("Amazon 180-Day 3-Sale Qualification Tracker", "מד 180 הימים של אמזון (3 מכירות ראשונות)")}
                  </div>
                  <input type="number" min={0} max={99} value={salesCountInput} onChange={(e) => setSalesCountInput(Number(e.target.value) || 0)} className="input-dark" style={{ width: 90, height: 34, fontSize: 13 }} />
                  <span style={{ fontSize: 12, color: "#cbd5e1", marginInlineStart: 8 }}>/ 3 {t("Qualifying Sales Completed", "מכירות מאושרות הושלמו")}</span>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ height: 44 }}>
                <CheckCircle2 size={15} /> {t("Verify & Lock Partner Account", "אמת ושמור מזהה שותף")}
              </button>
            </form>
          </div>
        </div>
      )}
      {activeTab === "portfolio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {userId && (
            <div className="card-surface" style={{ padding: 12, border: "1px solid rgba(56,189,248,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                <strong style={{ color: "#38bdf8" }}>{t("Your Public Deal Storefront URL:", "כתובת חנות הדילים הציבורית שלך לשיתוף בביו:")}</strong>{" "}
                <code dir="ltr" style={{ color: "#34d399" }}>{`https://vercel.app{userId}`}</code>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(`https://vercel.app{userId}`); notify(t("Public storefront link copied!", "קישור חנות הדילים הועתק!")); }} className="btn-ghost" style={{ height: 32, fontSize: 11 }}>
                  <Copy size={12} /> {t("Copy Storefront URL", "העתק קישור לחנות")}
                </button>
                <a href={`/deals/${userId}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: "auto", height: 32, padding: "0 12px", fontSize: 11 }}>
                  <ExternalLink size={12} /> {t("Open Storefront", "צפה בחנות")}
                </a>
              </div>
            </div>
          )}

          <div className="card-hero" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc" }}>
                <Plus size={16} style={{ display: "inline", marginRight: 5, color: "#38bdf8" }} />
                {t("Create Smart Tracking Link & Auto-Generate Ad Copy", "יצירת קישור חכם ומודעות שיווקיות בלחיצה")}
              </h2>
              <span className="tabular-nums" style={{ fontSize: 12, color: "#34d399", fontWeight: 800 }}>
                {t(`Total Portfolio Clicks: ${totalClicks}`, `סה״כ קליקים בתיק: ${totalClicks}`)}
              </span>
            </div>

            <form onSubmit={handleCreateSmartLink} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
              <select value={newNetSlug} onChange={(e) => setNewNetSlug(e.target.value)} className="input-dark" style={{ fontSize: 13 }}>
                {networks.map((n) => (
                  <option key={n.slug} value={n.slug}>{isHe ? n.name_he : n.name_en}</option>
                ))}
              </select>
              <input type="text" value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder={t("Folder (e.g. Tech Deals, Home)", "תיקייה (לדוגמה: גאדג׳טים, בית חכם)")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={t("Product Title", "שם המוצר / הדיל")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder={t("Price Tag ($29 / ₪99)", "מחיר מבצע (₪99 / $29)")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="url" dir="ltr" required value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="input-dark" style={{ fontSize: 13, textAlign: "left" }} />
              <input type="text" value={newSummary} onChange={(e) => setNewSummary(e.target.value)} placeholder={t("Key selling benefit for ad generator", "יתרון מרכזי של המוצר למחולל המודעות")} className="input-dark" style={{ fontSize: 13 }} />
              <button type="submit" className="btn-primary" style={{ height: 42, fontSize: 13 }}>
                <Sparkles size={14} /> {t("Generate Smart Link + Ads", "צור קישור חכם + מודעות")}
              </button>
            </form>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {folders.map((f) => (
              <button key={f} type="button" onClick={() => setFolderFilter(f)} className={folderFilter === f ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 32, padding: "0 12px", fontSize: 11.5 }}>
                {f}
              </button>
            ))}
          </div>

          {visibleLinks.length === 0 ? (
            <div className="card-surface" style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
              {t("No smart links in this folder yet. Create your first smart link above!", "אין עדיין קישורים בתיקייה זו. צור את הקישור החכם הראשון שלך למעלה!")}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {visibleLinks.map((lk) => {
                const origin = typeof window !== "undefined" ? window.location.origin : "https://vercel.app";
                const smartUrl = `${origin}/go/${lk.slug}`;
                return (
                  <div key={lk.id} className="card-surface" style={{ padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span className="badge-pill" style={{ fontSize: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>{lk.network_slug} · {lk.folder_name}</span>
                        <span className="tabular-nums" style={{ fontSize: 12, fontWeight: 900, color: "#34d399" }}>{lk.click_count} {t("clicks", "קליקים")}</span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>{lk.product_title}</h3>
                      <div style={{ fontSize: 11.5, color: "#94a3b8", wordBreak: "break-all" }}>{smartUrl}</div>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button type="button" onClick={() => { navigator.clipboard?.writeText(smartUrl); notify(t("Smart link copied!", "הקישור החכם הועתק!")); }} className="btn-ghost" style={{ flex: 1, height: 34, fontSize: 11.5 }}>
                        <Copy size={12} /> {t("Copy Link", "העתק")}
                      </button>
                      <button type="button" onClick={() => setActive360Link(lk)} className="btn-primary" style={{ flex: 1, height: 34, fontSize: 11.5 }}>
                        <BarChart3 size={12} /> {t("360° Hub & Ads", "ניהול 360° ומודעות")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {activeTab === "bridge" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {userId && (
            <div className="card-surface" style={{ padding: 12, border: "1px solid rgba(56,189,248,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                <strong style={{ color: "#38bdf8" }}>{t("Your Public Deal Storefront URL:", "כתובת חנות הדילים הציבורית שלך לשיתוף בביו:")}</strong>{" "}
                <code dir="ltr" style={{ color: "#34d399" }}>{`https://vercel.app{userId}`}</code>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(`https://vercel.app{userId}`); notify(t("Public storefront link copied!", "קישור חנות הדילים הועתק!")); }} className="btn-ghost" style={{ height: 32, fontSize: 11 }}>
                  <Copy size={12} /> {t("Copy Storefront URL", "העתק קישור לחנות")}
                </button>
                <a href={`/deals/${userId}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: "auto", height: 32, padding: "0 12px", fontSize: 11 }}>
                  <ExternalLink size={12} /> {t("Open Storefront", "צפה בחנות")}
                </a>
              </div>
            </div>
          )}

          <div className="card-hero" style={{ padding: 18 }}>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
              {t("External AI Tools & Dynamic Prompt Bridge", "גשר לכלי AI חיצוניים ומחולל פרומפטים דינמי")}
            </h2>
            <p style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 12 }}>
              {t("Enter your product details once — all prompts below auto-inject your product parameters for instant copy into ChatGPT, Claude, Canva, or CapCut.", "הזן את פרטי המוצר פעם אחת — כל הפרומפטים למטה ימולאו אוטומטית להעתקה מיידית ל-ChatGPT, Claude, Canva או CapCut.")}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
              <input type="text" value={bridgeProduct} onChange={(e) => setBridgeProduct(e.target.value)} placeholder={t("Product Name (e.g. Anker MagSafe PowerBank)", "שם המוצר...")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={bridgePrice} onChange={(e) => setBridgePrice(e.target.value)} placeholder={t("Price ($39 / ₪139)", "מחיר מבצע...")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={bridgeBenefit} onChange={(e) => setBridgeBenefit(e.target.value)} placeholder={t("Main Benefit (e.g. Fast 15W wireless charge)", "יתרון מרכזי...")} className="input-dark" style={{ fontSize: 13 }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 12 }}>
            {prompts.map((pr) => {
              const locked = pr.is_pro_only && !isPro;
              const rawTpl = isHe ? pr.prompt_template_he : pr.prompt_template_en;
              const compiled = rawTpl
                .replace(/\{\{PRODUCT_TITLE\}\}/g, bridgeProduct || t("[Product Name]", "[שם המוצר]"))
                .replace(/\{\{PRICE\}\}/g, bridgePrice || t("[Price]", "[מחיר]"))
                .replace(/\{\{BENEFIT\}\}/g, bridgeBenefit || t("[Key Benefit]", "[יתרון מרכזי]"));

              return (
                <div key={pr.id} className="card-surface" style={{ padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span className="badge-pill" style={{ fontSize: 10, background: "rgba(129,140,248,0.16)", color: "#818cf8" }}>{pr.tool_name}</span>
                      {pr.is_pro_only && <span className="badge-pill" style={{ fontSize: 10, background: "rgba(251,191,36,0.16)", color: "#fbbf24" }}>PRO</span>}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{isHe ? pr.title_he : pr.title_en}</h3>
                    <div style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>
                      {locked ? t("Upgrade to Affiliate Pro to unlock viral video & studio visual prompts.", "שדרג ל-Affiliate Pro כדי לפתוח תסריטי וידאו ופרומפטים ויזואליים.") : compiled}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    {locked ? (
                      <button type="button" onClick={() => setProModalOpen(true)} className="btn-primary" style={{ height: 34, fontSize: 11.5, background: "#fbbf24", color: "#0a0b0e" }}>
                        <Lock size={12} /> {t("Unlock Affiliate Pro", "פתח גישת Affiliate Pro")}
                      </button>
                    ) : (
                      <>
                        <button type="button" onClick={() => { navigator.clipboard?.writeText(compiled); notify(t("Prompt copied!", "הפרומפט הועתק!")); }} className="btn-primary" style={{ flex: 1, height: 34, fontSize: 11.5 }}>
                          <Copy size={12} /> {t("Copy Prompt", "העתק פרומפט")}
                        </button>
                        <a href={pr.tool_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 11.5 }}>
                          <ExternalLink size={12} /> {t("Open Tool", "פתח כלי")}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card-surface" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
              {t("Give-to-Get Karma Economy & Referral Attribution", "כלכלת קרמה הדדית (Give-to-Get) וקישור הזמנה")}
            </h3>
            <p style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 10 }}>
              {t("Verify other builders' deal links (+5 Credits) or invite new curators to earn organic Boost Credits for the Public Feed.", "אמת קישורי דילים של חברי קהילה (+5 נקודות) או הזמן יוצרים חדשים כדי לצבור נקודות חשיפה אורגניות.")}
            </p>
            {referralCode && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                <code style={{ padding: "6px 12px", borderRadius: 8, background: "#0a0b0e", color: "#34d399", fontSize: 12 }}>
                  {`https://vercel.app{referralCode}`}
                </code>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(`https://vercel.app{referralCode}`); notify(t("Referral link copied!", "קישור ההזמנה הועתק!")); }} className="btn-ghost" style={{ height: 32, fontSize: 11 }}>
                  <Copy size={12} /> {t("Copy Referral Link", "העתק קישור הזמנה")}
                </button>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {karma.map((k) => (
                <div key={k.id} style={{ fontSize: 12, color: "#cbd5e1", display: "flex", justifyContent: "space-between", padding: "6px 10px", borderRadius: 8, background: "#0a0b0e" }}>
                  <span>{isHe ? k.description_he : k.description_en}</span>
                  <strong style={{ color: k.credits_delta >= 0 ? "#34d399" : "#fbbf24" }}>{k.credits_delta >= 0 ? `+${k.credits_delta}` : k.credits_delta}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Link360Drawer
        link={active360Link}
        network={networks.find((n) => n.slug === active360Link?.network_slug)}
        clicks={clicks}
        boostCredits={boostCredits}
        onClose={() => setActive360Link(null)}
        onUpdated={() => reloadHub(userId)}
        onNotify={notify}
      />

            <CustomNetworkModal isOpen={customNetOpen} onClose={() => setCustomNetOpen(false)} userId={userId} onCreated={() => reloadHub(userId)} onNotify={notify} />
      <AffiliateMonetizationModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} userId={userId} defaultEmail={userEmail} onNotify={notify} />

      <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "rgba(15,23,42,0.65)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11.5, color: "#94a3b8", lineHeight: 1.55 }}>
        <AlertTriangle size={13} style={{ display: "inline", marginInlineEnd: 5, color: "#fbbf24" }} />
        {t(
          "Affiliate & Legal Compliance Notice: Every public deal undergoes Admin security screening before publication. Users are solely responsible for including mandatory affiliate disclosures (FTC / Amazon Associates) and complying with anti-spam regulations.",
          "הבהרה משפטית ובטיחותית: כל דיל ציבורי עובר סינון אבטחה ואישור אדמין לפני פרסום. המשתמש אחראי בלעדית להצגת גילוי נאות (חוק הגנת הצרכן / שותפי אמזון) ולעמידה מלאה בהוראות חוק הספאם (סעיף 30א)."
        )}
      </div>
    </div>
  );
}
