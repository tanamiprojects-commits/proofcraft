"use client";

import React, { useEffect, useState } from "react";
import {
  Compass, ShieldCheck, Link2, Sparkles, ExternalLink, Copy, CheckCircle2,
  AlertTriangle, Plus, BarChart3, Lock, Flame, Award, ArrowRight, ArrowLeft, CheckSquare, Square
} from "lucide-react";
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
import ReferralRewardCard from "@/components/affiliate/ReferralRewardCard";
import PublicIdentityBar from "@/components/PublicIdentityBar";
import UserGuideDrawer from "@/components/UserGuideDrawer";
import NextBestActionEngine from "@/components/NextBestActionEngine";
import CreatorRankBadge from "@/components/CreatorRankBadge";
import ExecutiveReportCard from "@/components/ExecutiveReportCard";
import SmartCampaignLauncher from "@/components/SmartCampaignLauncher";
import AffiliateAnalyticsPanel from "@/components/affiliate/AffiliateAnalyticsPanel";
import KarmaLedgerPanel from "@/components/affiliate/KarmaLedgerPanel";
import LinkHealthWatchdog from "@/components/affiliate/LinkHealthWatchdog";

const NETWORK_THEME: Record<string, { accent: string; glow: string; badgeHe: string; badgeEn: string }> = {
  aliexpress: { accent: "#fb923c", glow: "rgba(251, 146, 60, 0.22)", badgeHe: "אישור מיידי · מומלץ למתחילים", badgeEn: "Instant Approval · Beginner Friendly" },
  amazon: { accent: "#38bdf8", glow: "rgba(56, 189, 248, 0.22)", badgeHe: "אמינות שיא · כלל 3 מכירות ב-180 יום", badgeEn: "High Trust · 180-Day 3-Sale Rule" },
  temu: { accent: "#f472b6", glow: "rgba(244, 114, 182, 0.22)", badgeHe: "עמלות גבוהות + בונוס התקנה", badgeEn: "High Commission + App Bonus" },
  ebay: { accent: "#818cf8", glow: "rgba(129, 140, 248, 0.22)", badgeHe: "טכנולוגיה, חלקים ואספנות", badgeEn: "Tech, Parts & Collectibles" },
  israel_local: { accent: "#34d399", glow: "rgba(52, 211, 153, 0.22)", badgeHe: "שוק ישראלי · תשלום בשקלים (₪)", badgeEn: "Israel Local Market (₪)" },
};

export default function AffiliateIncomeHubPage() {
  const { isHe, dir, t } = useStudioLang();
  const ArrowIcon = isHe ? ArrowLeft : ArrowRight;
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

  // Guided 4-Stage Wizard State
  const [selectedNetSlug, setSelectedNetSlug] = useState("aliexpress");
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
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

  // External AI Bridge & Modals
  const [bridgeProduct, setBridgeProduct] = useState("");
  const [bridgePrice, setBridgePrice] = useState("");
  const [bridgeBenefit, setBridgeBenefit] = useState("");
  const [proModalOpen, setProModalOpen] = useState(false);
  const [customNetOpen, setCustomNetOpen] = useState(false);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3400); };

  const reloadHub = async (uid: string | null) => {
    const st = await fetchAffiliateHubState(uid);
    setNetworks(st.networks); setPrompts(st.prompts); setAccounts(st.accounts);
    setLinks(st.links); setClicks(st.clicks); setKarma(st.karma);
    setIsPro(st.isAffiliatePro); setBoostCredits(st.boostCredits); setReferralCode(st.referralCode);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id || null;
      setUserId(uid); setUserEmail(data.user?.email || "");
      reloadHub(uid); const onSync = () => reloadHub(uid); window.addEventListener("proofcraft:sync-now", onSync);
    });
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get("tool");
      const urlParam = params.get("url");
      if (toolParam) {
        setNewTitle(toolParam);
        setBridgeProduct(toolParam);
        setNewFolder("Builder & AI Stack");
        if (urlParam && urlParam.startsWith("https://")) {
          setNewUrl(urlParam);
        }
        setActiveTab("portfolio");
        notify(`Loaded "${toolParam}" — paste your partner referral URL below to publish!`);
      }
    }
  }, []);

  const activeNetwork = networks.find((n) => n.slug === selectedNetSlug) || networks.at(0);
  const existingAccount = accounts.find((a) => a.network_slug === selectedNetSlug);

  useEffect(() => {
    if (existingAccount) {
      setTagInput(existingAccount.tracking_id || "");
      setCouponInput(existingAccount.coupon_code || "");
      setSalesCountInput(existingAccount.qualifying_sales_count || 0);
      setCompletedSteps({ [`${selectedNetSlug}_1`]: true, [`${selectedNetSlug}_2`]: true });
    } else {
      setTagInput(""); setCouponInput(""); setSalesCountInput(0);
    }
  }, [selectedNetSlug, existingAccount]);
  const handleVerifyAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !activeNetwork) return notify(t("Please sign in first to verify partner accounts.", "נא להתחבר כדי לאמת חשבונות שותפים."));
    const cleanTag = sanitizePlainText(tagInput, 64);
    try {
      const rx = new RegExp(activeNetwork.tracking_id_regex || "^[a-zA-Z0-9._-]{3,60}$");
      if (!rx.test(cleanTag)) {
        return notify(t(`Invalid ID format. Expected: ${activeNetwork.tracking_id_label_en}`, `פורמט מזהה לא תקין. נדרש: ${activeNetwork.tracking_id_label_he}`));
      }
    } catch {}

    const { error } = await supabase.from("aff_user_accounts").upsert({
      user_id: userId, network_slug: activeNetwork.slug, tracking_id: cleanTag,
      coupon_code: sanitizePlainText(couponInput, 40), is_verified: true,
      verified_at: new Date().toISOString(), qualifying_sales_count: Math.max(0, Number(salesCountInput) || 0),
    }, { onConflict: "user_id,network_slug" });

    if (error) return notify(error.message);
    await reloadHub(userId);
    notify(t(`${activeNetwork.name_en} verified! Ready for Step 4.`, `חשבון ${activeNetwork.name_he} אומת בהצלחה! המשך לשלב 4.`));
  };

  const handleCreateSmartLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return notify(t("Sign in to create smart links.", "התחבר כדי ליצור קישורים חכמים."));
    if (!isPro && links.length >= 3) { setProModalOpen(true); return; }
    const cleanTitle = sanitizePlainText(newTitle, 110);
    const cleanUrl = newUrl.trim();
    if (cleanTitle.length < 4 || !cleanUrl.startsWith("https://")) {
      return notify(t("Enter a valid product title and HTTPS link.", "נא להזין כותרת מוצר תקינה וקישור HTTPS מאובטח."));
    }
    const slug = generateSmartSlug(cleanTitle);
    const origin = typeof window !== "undefined" ? window.location.origin : "https://vercel.app";
    const generatedAds = buildMultiChannelAdCopy({
      title: cleanTitle, price: sanitizePlainText(newPrice, 30), benefit: sanitizePlainText(newSummary, 180),
      smartUrl: `${origin}/go/${slug}`, isAmazon: newNetSlug === "amazon", isHe,
    });
    const { error } = await supabase.from("aff_links").insert({
      user_id: userId, network_slug: newNetSlug, folder_name: sanitizePlainText(newFolder || "General Deals", 40),
      slug, product_title: cleanTitle, product_summary: sanitizePlainText(newSummary, 240),
      destination_url: cleanUrl, price_display: sanitizePlainText(newPrice, 30),
      saved_ad_copy: generatedAds, health_status: "active", is_public_deal: false,
    });
    if (error) return notify(error.message);
    setNewTitle(""); setNewUrl(""); setNewPrice(""); setNewSummary("");
    await reloadHub(userId);
    notify(t("Smart Link & Multi-Channel Ads created!", "הקישור החכם והמודעות לכל הערוצים נוצרו בהצלחה!"));
  };

  const formatCookieHe = (raw: string) => {
    if (!isHe) return raw;
    return raw.replace("Days", "ימים").replace("Hours", "שעות").replace("Session + Cart Lock", "סשן + שמירה בעגלה").replace("if Added to Cart", "בהוספה לעגלה").replace("in Cart", "בעגלה");
  };

  const folders = ["ALL", ...Array.from(new Set(links.map((l) => l.folder_name)))];
  const visibleLinks = links.filter((l) => folderFilter === "ALL" || l.folder_name === folderFilter);
  const totalClicks = links.reduce((sum, l) => sum + (l.click_count || 0), 0);

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>{t("Loading Affiliate Fintech OS...", "טוען את מערכת השותפים הפינטקית...")}</div>;

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      {toast && <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 95, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>{toast}</div>}

      <UserGuideDrawer context="affiliate" />
      <NextBestActionEngine userId={userId} />
      <PublicIdentityBar userId={userId} isHe={isHe} />
      <CreatorRankBadge userId={userId} />
      <ExecutiveReportCard userId={userId} />
      <SmartCampaignLauncher userId={userId} context="affiliate" />
      <div className="card-hero" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 11 }}>
            <Sparkles size={13} /> {t("DIRECT INCOME & AFFILIATE FINTECH OS", "מערכת הפעלה פינטקית להכנסה ישירה משותפים")}
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge-pill" style={{ background: "rgba(251,191,36,0.14)", color: "#fbbf24", fontSize: 11 }}><Flame size={12} /> {boostCredits} {t("Boost Credits", "נקודות חשיפה")}</span>
            <span className="badge-pill" style={{ background: isPro ? "rgba(56,189,248,0.18)" : "rgba(148,163,184,0.16)", color: isPro ? "#38bdf8" : "#cbd5e1", fontSize: 11 }}>
              {isPro ? "AFFILIATE PRO" : t(`STARTER (${links.length}/3 Links)`, `חינם (${links.length}/3 קישורים)`)}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}><StudioVisualArtwork variant="affiliate" /></div>
        
        <ReferralRewardCard referralCode={referralCode} isHe={isHe} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 8 }}>
          {[
            { id: "compass", icon: Compass, label: t("1. Partner Directory", "1. מצפן והשוואת רשתות") },
            { id: "wizard", icon: ShieldCheck, label: t("2. Guided Setup Wizard", "2. אשף הקמה ואימות שלב-אחר-שלב") },
            { id: "portfolio", icon: Link2, label: t(`3. Smart Links (${links.length})`, `3. תיק קישורים ומודעות (${links.length})`) },
            { id: "bridge", icon: Award, label: t("4. AI Bridge & Karma", "4. גשר כלי AI וקרמה") },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as "compass" | "wizard" | "portfolio" | "bridge")} className={activeTab === tab.id ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 12.5 }}>
                <Icon size={14} /> <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {activeTab === "compass" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card-surface" style={{ padding: 16, border: "1px solid rgba(56,189,248,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 13, color: "#e2e8f0" }}>
              <strong style={{ color: "#38bdf8" }}>{t("Partner Networks & Custom Platforms:", "בחר רשת שותפים להתחלה או הוסף פלטפורמה חיצונית:")}</strong>{" "}
              <span style={{ color: "#94a3b8" }}>{t("Compare verified commission rates, cookie windows, and safety rules.", "השווה עמלות, תקופות מעקב וכללי בטיחות לפני פתיחת חשבון.")}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={() => setCustomNetOpen(true)} className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12, background: "#38bdf8", color: "#0a0b0e" }}>
                <Plus size={13} /> {t("Add Custom Platform", "הוסף פלטפורמה חיצונית")}
              </button>
              {!isPro && (
                <button type="button" onClick={() => setProModalOpen(true)} className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12, background: "#fbbf24", color: "#0a0b0e" }}>
                  <Sparkles size={13} /> {t("Upgrade Pro & Bundles", "שדרוג Pro וחבילות")}
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18 }}>
            {networks.map((net) => {
              const verified = accounts.some((a) => a.network_slug === net.slug && a.is_verified);
              const theme = NETWORK_THEME[net.slug] || { accent: "#38bdf8", glow: "rgba(56,189,248,0.18)", badgeHe: "פלטפורמה מותאמת אישית", badgeEn: "Custom Partner Network" };
              return (
                <div key={net.id} className="card-surface" style={{ padding: 22, borderRadius: 18, background: `linear-gradient(160deg, ${theme.glow} 0%, rgba(15,18,26,0.96) 45%)`, border: verified ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div>
                        <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(10,11,14,0.75)", color: theme.accent, border: `1px solid ${theme.accent}44`, marginBottom: 8 }}>
                          {isHe ? theme.badgeHe : theme.badgeEn}
                        </span>
                        <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", lineHeight: 1.3 }}>{isHe ? net.name_he : net.name_en}</h2>
                      </div>
                      {verified && <span className="badge-pill" style={{ fontSize: 11, background: "rgba(52,211,153,0.18)", color: "#34d399" }}>✓ {t("VERIFIED", "מאומת")}</span>}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ padding: 12, borderRadius: 12, background: "rgba(10,11,14,0.82)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{t("COMMISSION RATE", "אחוז עמלה")}</div>
                        <div dir="ltr" style={{ fontSize: 13.5, fontWeight: 900, color: "#34d399", textAlign: isHe ? "right" : "left" }}>{net.commission_range}</div>
                      </div>
                      <div style={{ padding: 12, borderRadius: 12, background: "rgba(10,11,14,0.82)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{t("TRACKING COOKIE", "חלון מעקב (עוגייה)")}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#38bdf8" }}>{formatCookieHe(net.cookie_window)}</div>
                      </div>
                    </div>

                    <div style={{ padding: 12, borderRadius: 12, background: "rgba(10,11,14,0.65)", fontSize: 13, color: "#e2e8f0", lineHeight: 1.6 }}>
                      <strong style={{ color: "#f8fafc" }}>{t("Who Can Join:", "תנאי סף להצטרפות:")}</strong> {isHe ? net.threshold_he : net.threshold_en}
                    </div>

                    <details style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.28)", fontSize: 12.5, color: "#fecaca" }}>
                      <summary style={{ cursor: "pointer", fontWeight: 800, listStyle: "none", display: "flex", alignItems: "center", gap: 6 }}>
                        <AlertTriangle size={14} color="#f87171" />
                        <span>{t("Safety & Anti-Ban Rules (Click to Expand)", "כללי בטיחות ומניעת חסימת חשבון (לחץ לפתיחה)")}</span>
                      </summary>
                      <ul style={{ margin: "10px 0 0", paddingInlineStart: 18, lineHeight: 1.55 }}>
                        {(isHe ? net.strict_rules_he : net.strict_rules_en).map((rule, idx) => <li key={idx} style={{ marginBottom: 4 }}>{rule}</li>)}
                      </ul>
                    </details>
                  </div>

                  <button type="button" onClick={() => { setSelectedNetSlug(net.slug); setActiveTab("wizard"); }} className={verified ? "btn-ghost" : "btn-primary"} style={{ width: "100%", height: 44, fontSize: 13 }}>
                    <span>{verified ? t("Manage Verified Account", "נהל חשבון מאומת וצפה בהמשך") : t("Start Step-by-Step Setup", "התחל אשף הקמה ואימות שלב-אחר-שלב")}</span>
                    <ArrowIcon size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === "wizard" && activeNetwork && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card-surface" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8", marginBottom: 8 }}>
              {t("STEP 0 · CHOOSE PARTNER PLATFORM TO SET UP:", "שלב 0 · בחר את פלטפורמת השותפים שברצונך להקים כעת:")}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {networks.map((n) => {
                const isVer = accounts.some((a) => a.network_slug === n.slug && a.is_verified);
                return (
                  <button key={n.slug} type="button" onClick={() => setSelectedNetSlug(n.slug)} className={selectedNetSlug === n.slug ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12 }}>
                    {isVer ? "✓ " : ""}{isHe ? n.name_he : n.name_en}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <div className="card-surface" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge-pill" style={{ background: "rgba(56,189,248,0.16)", color: "#38bdf8", fontSize: 11 }}>
                  {t("STAGE 1 & 2 · ACCOUNT CREATION", "שלבים 1 ו-2 · פתיחת חשבון והוצאת מזהה")}
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#34d399" }}>
                  {existingAccount?.is_verified ? t("Completed ✓", "הושלם ✓") : t("In Progress", "בתהליך")}
                </span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc" }}>
                {t(`How to Register on ${activeNetwork.name_en} (Zero Experience Needed)`, `מדריך הרשמה מאפס עבור ${activeNetwork.name_he}`)}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(activeNetwork.onboarding_steps || []).map((st) => {
                  const stepKey = `${activeNetwork.slug}_${st.step}`;
                  const checked = Boolean(completedSteps[stepKey]);
                  return (
                    <div key={st.step} onClick={() => setCompletedSteps({ ...completedSteps, [stepKey]: !checked })} style={{ padding: 12, borderRadius: 12, cursor: "pointer", background: checked ? "rgba(52,211,153,0.1)" : "#0a0b0e", border: `1px solid ${checked ? "rgba(52,211,153,0.45)" : "rgba(255,255,255,0.08)"}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                      {checked ? <CheckSquare size={18} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} /> : <Square size={18} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: checked ? "#34d399" : "#f8fafc" }}>{t(`Step ${st.step}:`, `שלב ${st.step}:`)} {isHe ? st.title_he : st.title_en}</div>
                        <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.55, marginTop: 3 }}>{isHe ? st.detail_he : st.detail_en}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <a href={activeNetwork.signup_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ height: 42, fontSize: 12.5, background: "#38bdf8", color: "#0a0b0e" }}>
                <ExternalLink size={14} />
                <span>{t(`Open Official ${activeNetwork.name_en} Registration Page`, `פתח את דף ההרשמה הרשמי של ${activeNetwork.name_he}`)}</span>
              </a>
            </div>

            <div className="card-hero" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14 }}>
              <div>
                <span className="badge-pill" style={{ background: "rgba(52,211,153,0.16)", color: "#34d399", fontSize: 11, marginBottom: 8 }}>
                  {t("STAGE 3 · LIVE VERIFICATION CHECKPOINT", "שלב 3 · אימות מזהה השותף שלך במערכת")}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
                  {t("Verify & Lock Your Partner Tracking ID", "הזן ואמת את מזהה השותף שקיבלת")}
                </h3>
                <form onSubmit={handleVerifyAccount} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
                      {isHe ? activeNetwork.tracking_id_label_he : activeNetwork.tracking_id_label_en}
                    </label>
                    <input type="text" dir="ltr" required value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g. proofcraft-20 / dealhub_il" className="input-dark" style={{ width: "100%", textAlign: "left" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
                      {t("Personal Promo / Coupon Code (Optional)", "קוד קופון אישי (אופציונלי)")}
                    </label>
                    <input type="text" dir="ltr" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="SAVE20" className="input-dark" style={{ width: "100%", textAlign: "left" }} />
                  </div>
                  {activeNetwork.slug === "amazon" && (
                    <div style={{ padding: 12, borderRadius: 10, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.35)" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>{t("Amazon 180-Day 3-Sale Qualification Tracker", "מד 180 הימים של אמזון (3 מכירות ראשונות)")}</div>
                      <input type="number" min={0} max={99} value={salesCountInput} onChange={(e) => setSalesCountInput(Number(e.target.value) || 0)} className="input-dark" style={{ width: 90, height: 34, fontSize: 13 }} />
                      <span style={{ fontSize: 12, color: "#cbd5e1", marginInlineStart: 8 }}>/ 3 {t("Qualifying Sales", "מכירות מאושרות")}</span>
                    </div>
                  )}
                  <button type="submit" className="btn-primary" style={{ height: 44 }}><CheckCircle2 size={15} /> {t("Verify & Activate Partner Account", "אמת והפעל חשבון שותף")}</button>
                </form>
              </div>

              <div style={{ padding: 14, borderRadius: 12, background: existingAccount?.is_verified ? "rgba(52,211,153,0.12)" : "rgba(15,23,42,0.7)", border: `1px solid ${existingAccount?.is_verified ? "rgba(52,211,153,0.45)" : "rgba(255,255,255,0.08)"}` }}>
                <div style={{ fontSize: 11.5, fontWeight: 900, color: existingAccount?.is_verified ? "#34d399" : "#94a3b8", marginBottom: 4 }}>
                  {t("STAGE 4 · WHAT TO DO NEXT AFTER VERIFICATION", "שלב 4 · ההמשך המקצועי מיד לאחר האימות")}
                </div>
                <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55, marginBottom: 10 }}>
                  {t("1. Copy any product link -> 2. Paste into 'Smart Links' to generate /go/ tracking link + WhatsApp, Facebook & Reels ads -> 3. Share your public storefront!", "1. העתק קישור מוצר -> 2. הדבק ב׳תיק קישורים ומודעות׳ ליצירת קישור חכם + מודעות לוואטסאפ, פייסבוק ורילס -> 3. שתף את חנות הדילים שלך!")}
                </p>
                <button type="button" onClick={() => { setNewNetSlug(activeNetwork.slug); setActiveTab("portfolio"); }} className="btn-primary" style={{ height: 38, fontSize: 12, background: "#34d399", color: "#0a0b0e" }}>
                  <span>{t("Continue to Stage 4: Create First Smart Link & Ads", "המשך לשלב 4: צור קישור חכם ומודעות עכשיו")}</span>
                  <ArrowIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "portfolio" && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <AffiliateAnalyticsPanel links={links} clicks={clicks} networks={networks} isHe={isHe} onInspectLink={(lnk) => setActive360Link(lnk)} />
          <LinkHealthWatchdog links={links} isHe={isHe} onUpdated={() => reloadHub(userId)} onNotify={notify} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {userId && (
            <div className="card-surface" style={{ padding: 14, border: "1px solid rgba(56,189,248,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
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
                <Plus size={16} style={{ display: "inline", marginInlineEnd: 5, color: "#38bdf8" }} />
                {t("Create Smart Tracking Link & Auto-Generate Ad Copy", "יצירת קישור חכם ומודעות שיווקיות בלחיצה")}
              </h2>
              <span className="tabular-nums" style={{ fontSize: 12, color: "#34d399", fontWeight: 800 }}>
                {t(`Total Clicks: ${totalClicks}`, `סה״כ קליקים: ${totalClicks}`)}
              </span>
            </div>

            <form onSubmit={handleCreateSmartLink} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
              <select value={newNetSlug} onChange={(e) => setNewNetSlug(e.target.value)} className="input-dark" style={{ fontSize: 13 }}>
                {networks.map((n) => <option key={n.slug} value={n.slug}>{isHe ? n.name_he : n.name_en}</option>)}
              </select>
              <input type="text" value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder={t("Category Folder", "תיקיית קטגוריה")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={t("Product Title", "שם המוצר / הדיל")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder={t("Price ($29 / ₪99)", "מחיר מבצע")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="url" dir="ltr" required value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="input-dark" style={{ fontSize: 13, textAlign: "left" }} />
              <input type="text" value={newSummary} onChange={(e) => setNewSummary(e.target.value)} placeholder={t("Key selling benefit", "יתרון מרכזי למחולל המודעות")} className="input-dark" style={{ fontSize: 13 }} />
              <button type="submit" className="btn-primary" style={{ height: 42, fontSize: 13 }}><Sparkles size={14} /> {t("Generate Smart Link + Ads", "צור קישור חכם + מודעות")}</button>
            </form>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {folders.map((f) => (
              <button key={f} type="button" onClick={() => setFolderFilter(f)} className={folderFilter === f ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 32, padding: "0 12px", fontSize: 11.5 }}>{f}</button>
            ))}
          </div>

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
                    <div dir="ltr" style={{ fontSize: 11.5, color: "#94a3b8", wordBreak: "break-all" }}>{smartUrl}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button type="button" onClick={() => { navigator.clipboard?.writeText(smartUrl); notify(t("Smart link copied!", "הקישור החכם הועתק!")); }} className="btn-ghost" style={{ flex: 1, height: 34, fontSize: 11.5 }}><Copy size={12} /> {t("Copy Link", "העתק")}</button>
                    <button type="button" onClick={() => setActive360Link(lk)} className="btn-primary" style={{ flex: 1, height: 34, fontSize: 11.5 }}><BarChart3 size={12} /> {t("360° Hub & Ads", "ניהול 360° ומודעות")}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      )}
      {activeTab === "bridge" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <KarmaLedgerPanel karma={karma} boostCredits={boostCredits} isHe={isHe} />
          <div className="card-hero" style={{ padding: 18 }}>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{t("External AI Tools & Dynamic Prompt Bridge", "גשר לכלי AI חיצוניים ומחולל פרומפטים דינמי")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
              <input type="text" value={bridgeProduct} onChange={(e) => setBridgeProduct(e.target.value)} placeholder={t("Product Name", "שם המוצר...")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={bridgePrice} onChange={(e) => setBridgePrice(e.target.value)} placeholder={t("Price", "מחיר מבצע...")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={bridgeBenefit} onChange={(e) => setBridgeBenefit(e.target.value)} placeholder={t("Key Benefit", "יתרון מרכזי...")} className="input-dark" style={{ fontSize: 13 }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 12 }}>
            {prompts.map((pr) => {
              const locked = pr.is_pro_only && !isPro;
              const compiled = (isHe ? pr.prompt_template_he : pr.prompt_template_en)
                .replace(/\{\{PRODUCT_TITLE\}\}/g, bridgeProduct || t("[Product]", "[שם המוצר]"))
                .replace(/\{\{PRICE\}\}/g, bridgePrice || t("[Price]", "[מחיר]"))
                .replace(/\{\{BENEFIT\}\}/g, bridgeBenefit || t("[Benefit]", "[יתרון מרכזי]"));
              return (
                <div key={pr.id} className="card-surface" style={{ padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <span className="badge-pill" style={{ fontSize: 10, background: "rgba(129,140,248,0.16)", color: "#818cf8", marginBottom: 6 }}>{pr.tool_name}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{isHe ? pr.title_he : pr.title_en}</h3>
                    <div style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>
                      {locked ? t("Upgrade to Affiliate Pro to unlock.", "שדרג ל-Affiliate Pro לפתיחת פרומפט זה.") : compiled}
                    </div>
                  </div>
                  {locked ? (
                    <button type="button" onClick={() => setProModalOpen(true)} className="btn-primary" style={{ height: 34, fontSize: 11.5, background: "#fbbf24", color: "#0a0b0e" }}><Lock size={12} /> {t("Unlock Pro", "שדרג ל-Pro")}</button>
                  ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button type="button" onClick={() => { navigator.clipboard?.writeText(compiled); notify(t("Prompt copied!", "הפרומפט הועתק!")); }} className="btn-primary" style={{ flex: 1, height: 34, fontSize: 11.5 }}><Copy size={12} /> {t("Copy", "העתק")}</button>
                      <a href={pr.tool_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 11.5 }}><ExternalLink size={12} /> {t("Open", "פתח")}</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Link360Drawer link={active360Link} network={networks.find((n) => n.slug === active360Link?.network_slug)} clicks={clicks} boostCredits={boostCredits} onClose={() => setActive360Link(null)} onUpdated={() => reloadHub(userId)} onNotify={notify} />
      <CustomNetworkModal isOpen={customNetOpen} onClose={() => setCustomNetOpen(false)} userId={userId} onCreated={() => reloadHub(userId)} onNotify={notify} />
      <AffiliateMonetizationModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} userId={userId} defaultEmail={userEmail} onNotify={notify} />

      <div style={{ marginTop: 18, padding: 12, borderRadius: 12, background: "rgba(15,23,42,0.65)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11.5, color: "#94a3b8", lineHeight: 1.55 }}>
        <AlertTriangle size={13} style={{ display: "inline", marginInlineEnd: 5, color: "#fbbf24" }} />
        {t(
          "Affiliate & Legal Compliance Notice: Every public deal undergoes Admin security screening before publication. Users are solely responsible for mandatory affiliate disclosures (FTC / Amazon Associates) and local anti-spam laws.",
          "הבהרה משפטית ובטיחותית: כל דיל ציבורי עובר סינון אבטחה ואישור אדמין לפני פרסום. המשתמש אחראי בלעדית להצגת גילוי נאות (חוק הגנת הצרכן / שותפי אמזון) ולעמידה מלאה בהוראות חוק הספאם (סעיף 30א)."
        )}
      </div>
    </div>
  );
}
