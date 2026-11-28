"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Compass, ShieldCheck, Link2, Sparkles, ExternalLink, Copy, CheckCircle2,
  AlertTriangle, Plus, BarChart3, Lock, Flame, Award, ArrowRight, ArrowLeft, CheckSquare, Square, Megaphone
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { sanitizePlainText } from "@/lib/security-utils";
import {
  AffClick, AffKarmaEntry, AffLink, AffNetwork, AffPromptItem, AffUserAccount,
  buildMultiChannelAdCopy, fetchAffiliateHubState, generateSmartSlug
} from "@/lib/affiliate-store";
import Link360Drawer from "@/components/affiliate/Link360Drawer";
import CustomNetworkModal from "@/components/affiliate/CustomNetworkModal";
import AffiliateMonetizationModal from "@/components/affiliate/AffiliateMonetizationModal";
import ReferralRewardCard from "@/components/affiliate/ReferralRewardCard";
import SmartCampaignLauncher from "@/components/SmartCampaignLauncher";
import AffiliateAnalyticsPanel from "@/components/affiliate/AffiliateAnalyticsPanel";
import KarmaLedgerPanel from "@/components/affiliate/KarmaLedgerPanel";
import LinkHealthWatchdog from "@/components/affiliate/LinkHealthWatchdog";
import AffiliateBeginnerAcademy from "@/components/affiliate/AffiliateBeginnerAcademy";
import LinkLifecycleWorkbench from "@/components/affiliate/LinkLifecycleWorkbench";
import AffiliateUniversityOS from "@/components/affiliate/AffiliateUniversityOS";
import AffiliateDigitalBankOS from "@/components/affiliate/AffiliateDigitalBankOS";
import BusinessExitAndTrafficOS from "@/components/affiliate/BusinessExitAndTrafficOS";

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
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const uniRef = useRef<HTMLDivElement | null>(null);
  const stage3PanelRef = useRef<HTMLDivElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4>(1);
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

  const [selectedNetSlug, setSelectedNetSlug] = useState("aliexpress");
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [tagInput, setTagInput] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [salesCountInput, setSalesCountInput] = useState(0);

  const [newNetSlug, setNewNetSlug] = useState("aliexpress");
  const [newFolder, setNewFolder] = useState("General Deals");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [folderFilter, setFolderFilter] = useState("ALL");
  const [stage3View, setStage3View] = useState<"links" | "workbench" | "bank" | "health">("links");
  const [uniOpen, setUniOpen] = useState<boolean>(false);
  const switchStage3 = (v: "links" | "workbench" | "bank" | "health") => { setStage3View(v); focusElement(stage3PanelRef.current); };
  const [active360Link, setActive360Link] = useState<AffLink | null>(null);

  const [bridgeProduct, setBridgeProduct] = useState("");
  const [bridgePrice, setBridgePrice] = useState("");
  const [bridgeBenefit, setBridgeBenefit] = useState("");
  const [proModalOpen, setProModalOpen] = useState(false);
  const [customNetOpen, setCustomNetOpen] = useState(false);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3400); };

  const focusElement = (el: HTMLElement | null) => { if (!el) return; setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 70); };
  const goToStage = (stage: 1 | 2 | 3 | 4) => {
    setActiveStage(stage);
    setTimeout(() => {
      focusElement(workspaceRef.current);
    }, 60);
  };

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
      reloadHub(uid);
      const onSync = () => reloadHub(uid);
      window.addEventListener("proofcraft:sync-now", onSync);
    });
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get("tool");
      const urlParam = params.get("url");
      if (toolParam) {
        setNewTitle(toolParam); setBridgeProduct(toolParam); setNewFolder("Builder & AI Stack");
        if (urlParam && urlParam.startsWith("https://")) setNewUrl(urlParam);
        setActiveStage(3);
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
      if (!rx.test(cleanTag)) return notify(t(`Invalid ID format. Expected: ${activeNetwork.tracking_id_label_en}`, `פורמט מזהה לא תקין. נדרש: ${activeNetwork.tracking_id_label_he}`));
    } catch {}
    const { error } = await supabase.from("aff_user_accounts").upsert({
      user_id: userId, network_slug: activeNetwork.slug, tracking_id: cleanTag,
      coupon_code: sanitizePlainText(couponInput, 40), is_verified: true,
      verified_at: new Date().toISOString(), qualifying_sales_count: Math.max(0, Number(salesCountInput) || 0),
    }, { onConflict: "user_id,network_slug" });
    if (error) return notify(error.message);
    await reloadHub(userId);
    setNewNetSlug(activeNetwork.slug);
    notify(t(`${activeNetwork.name_en} verified! Moving to Stage 3.`, `חשבון ${activeNetwork.name_he} אומת! עוברים לתחנה 3.`));
    goToStage(3);
  };

  const handleCreateSmartLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return notify(t("Sign in to create smart links.", "התחבר כדי ליצור קישורים חכמים."));
    if (!isPro && links.length >= 3) { setProModalOpen(true); return; }
    const cleanTitle = sanitizePlainText(newTitle, 110);
    const cleanUrl = newUrl.trim();
    if (cleanTitle.length < 4 || !cleanUrl.startsWith("https://")) return notify(t("Enter a valid product title and HTTPS link.", "נא להזין כותרת מוצר תקינה וקישור HTTPS מאובטח."));
    const slug = generateSmartSlug(cleanTitle);
    const origin = typeof window !== "undefined" ? window.location.origin : "https://tanami360.com";
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
    setBridgeProduct(cleanTitle); setBridgePrice(newPrice); setBridgeBenefit(newSummary);
    setNewTitle(""); setNewUrl(""); setNewPrice(""); setNewSummary("");
    await reloadHub(userId);
    notify(t("Smart Link created! Opening Stage 4 Campaign Studio.", "הקישור החכם נוצר! פותח את תחנה 4 להפצה וקמפיינים."));
    goToStage(4);
  };
  const formatCookieHe = (raw: string) => !isHe ? raw : raw.replace("Days", "ימים").replace("Hours", "שעות").replace("Session + Cart Lock", "סשן + שמירה בעגלה").replace("if Added to Cart", "בהוספה לעגלה").replace("in Cart", "בעגלה");
  const folders = ["ALL", ...Array.from(new Set(links.map((l) => l.folder_name)))];
  const visibleLinks = links.filter((l) => folderFilter === "ALL" || l.folder_name === folderFilter);
  const totalClicks = links.reduce((sum, l) => sum + (l.click_count || 0), 0);
  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://tanami360.com";

  const loadingBanner = loading ? (<div style={{ padding: "10px 14px", marginBottom: 14, borderRadius: 12, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.28)", color: "#38bdf8", fontSize: 12.5, fontWeight: 700 }}>{t("Syncing live affiliate networks & links...", "מסנכרן רשתות שותפים וקישורים בזמן אמת...")}</div>) : null;

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left", paddingBottom: 76 }}>
      {toast && <div style={{ position: "fixed", bottom: 72, right: 20, zIndex: 95, background: "#0f172a", border: "1px solid rgba(52,211,153,0.5)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 800 }}>{toast}</div>}

      <div className="card-hero" style={{ padding: 24, marginBottom: 18, borderRadius: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.16)", color: "#34d399", fontSize: 11.5, fontWeight: 800 }}>
            <Sparkles size={13} /> {t("TRACK 1 · AFFILIATE STUDIO OS WORKSPACE", "מסלול 1 · סביבת עבודה מקצועית להכנסה מקישורים שיתופיים")}
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <a href="/vault" style={{ textDecoration: "none" }} className="badge-pill"><Lock size={12} color="#34d399" /> <span style={{ color: "#34d399", fontSize: 11 }}>{t("Save IDs in Vault", "שמור מזהים בכספת")}</span></a>
            <button type="button" onClick={() => window.open("/context-studio?floating=1", "pcContextFloat", "width=460,height=760")} className="badge-pill" style={{ cursor: "pointer", background: "rgba(129,140,248,0.16)", color: "#a5b4fc", fontSize: 11, border: "1px solid rgba(129,140,248,0.35)" }}><Sparkles size={12} /> {t("Floating Context Studio", "סטודיו הקשר צף")}</button>
            <span className="badge-pill" style={{ background: "rgba(251,191,36,0.14)", color: "#fbbf24", fontSize: 11 }}><Flame size={12} /> {boostCredits} {t("Boost Credits", "נקודות חשיפה")}</span>
            <span className="badge-pill" style={{ background: isPro ? "rgba(56,189,248,0.18)" : "rgba(148,163,184,0.16)", color: isPro ? "#38bdf8" : "#cbd5e1", fontSize: 11 }}>
              {isPro ? "AFFILIATE PRO" : t(`STARTER (${links.length}/3 Links)`, `מסלול חינם (${links.length}/3 קישורים)`)}
            </span>
          </div>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{t("Your Step-by-Step Affiliate Income Command Center", "מרכז השליטה שלך לבניית הכנסה מקישורים שיתופיים — צעד אחר צעד")}</h1>
        <p style={{ fontSize: 13.5, color: "#94a3b8", lineHeight: 1.6, marginBottom: 16 }}>{t("Follow the 4 structured stations below: choose a network, verify your ID, create tracked links, and launch ready-made campaigns.", "עבוד לפי 4 התחנות המסודרות למטה: בחר רשת שותפים, אמת מזהה, צור קישורים חכמים והפץ קמפיינים מוכנים בלחיצה.")}</p>
        <div ref={workspaceRef} style={{ scrollMarginTop: 84, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {[
            { id: 1 as const, icon: Compass, step: "01", label: t("1. Choose Network", "1. בחירת רשת והשוואה"), sub: t(`${networks.length} verified networks`, `${networks.length} רשתות מאומתות`) },
            { id: 2 as const, icon: ShieldCheck, step: "02", label: t("2. Guided Signup & ID", "2. הרשמה ואימות מזהה"), sub: t(`${accounts.length} active accounts`, `${accounts.length} חשבונות מאומתים`) },
            { id: 3 as const, icon: Link2, step: "03", label: t("3. Smart Link Vault", "3. יצירת קישורים חכמים"), sub: t(`${links.length} links · ${totalClicks} clicks`, `${links.length} קישורים · ${totalClicks} קליקים`) },
            { id: 4 as const, icon: Megaphone, step: "04", label: t("4. Campaign & Ad Studio", "4. אשף הפצה וקמפיינים"), sub: t("Ads, AI Bridge & Payouts", "מודעות מוכנות וכלי AI") },
          ].map((st) => {
            const Icon = st.icon;
            const active = activeStage === st.id;
            return (
              <button key={st.id} type="button" onClick={() => goToStage(st.id)} style={{ padding: "12px 14px", borderRadius: 14, border: active ? "1.5px solid #34d399" : "1px solid rgba(255,255,255,0.1)", background: active ? "rgba(52,211,153,0.14)" : "rgba(10,11,14,0.75)", textAlign: isHe ? "right" : "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 900, color: active ? "#34d399" : "#f8fafc", display: "flex", alignItems: "center", gap: 6 }}><Icon size={15} /> {st.label}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 900, color: active ? "#34d399" : "#64748b" }}>{st.step}</span>
                </div>
                <span style={{ fontSize: 11.5, color: active ? "#a7f3d0" : "#94a3b8" }}>{st.sub}</span>
              </button>
            );
          })}
        </div>
      </div>
      {loadingBanner}<AffiliateBeginnerAcademy isHe={isHe} activeStage={activeStage} onJumpStage={goToStage} />
      <div style={{ marginBottom: 16 }}><button type="button" onClick={() => { const next = !uniOpen; setUniOpen(next); if (next) focusElement(uniRef.current); }} className="btn-ghost" style={{ width: "100%", height: 44, fontSize: 13.5, fontWeight: 900, borderColor: "rgba(56,189,248,0.45)", color: "#38bdf8", background: "rgba(56,189,248,0.08)" }}>{uniOpen ? t("Close Affiliate University (5 Full Modules)", "סגור את אוניברסיטת השותפים המלאה (5 מודולים)") : t("Open Affiliate University: Money Flow, Profit Simulator, Zero-Follower Playbook & 30-Day Plan", "פתח את אוניברסיטת השותפים המלאה: איך הכסף עובר, מחשבון רווחים, שיווק בלי עוקבים ותוכנית 30 יום")}</button></div>
      {uniOpen && <div ref={uniRef} style={{ marginBottom: 20, scrollMarginTop: 84 }}><AffiliateUniversityOS isHe={isHe} onJumpStage={(st) => { setUniOpen(false); goToStage(st); }} /></div>}
      {activeStage === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card-surface" style={{ padding: 16, border: "1px solid rgba(56,189,248,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <strong style={{ fontSize: 13, color: "#38bdf8" }}>{t("Step 1 — Pick Your Starting Platform:", "שלב 1 — בחר פלטפורמה להתחלה (או הוסף פלטפורמה משלך):")}</strong>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={() => setCustomNetOpen(true)} className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12, background: "#38bdf8", color: "#0a0b0e" }}><Plus size={13} /> {t("Add Custom Platform", "הוסף פלטפורמה חיצונית")}</button>
              {!isPro && <button type="button" onClick={() => setProModalOpen(true)} className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12, background: "#fbbf24", color: "#0a0b0e" }}><Sparkles size={13} /> {t("Upgrade Pro", "שדרוג Pro")}</button>}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 18 }}>
            {networks.map((net) => {
              const verified = accounts.some((a) => a.network_slug === net.slug && a.is_verified);
              const theme = NETWORK_THEME[net.slug] || { accent: "#38bdf8", glow: "rgba(56,189,248,0.18)", badgeHe: "פלטפורמה מותאמת אישית", badgeEn: "Custom Partner Network" };
              return (
                <div key={net.id} className="card-surface" style={{ padding: 22, borderRadius: 18, background: `linear-gradient(160deg, ${theme.glow} 0%, rgba(15,18,26,0.96) 45%)`, border: verified ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div>
                        <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(10,11,14,0.75)", color: theme.accent, border: `1px solid ${theme.accent}44`, marginBottom: 8 }}>{isHe ? theme.badgeHe : theme.badgeEn}</span>
                        <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc" }}>{isHe ? net.name_he : net.name_en}</h2>
                      </div>
                      {verified && <span className="badge-pill" style={{ fontSize: 11, background: "rgba(52,211,153,0.18)", color: "#34d399" }}>✓ {t("VERIFIED", "מאומת")}</span>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ padding: 12, borderRadius: 12, background: "rgba(10,11,14,0.82)" }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{t("COMMISSION", "אחוז עמלה")}</div>
                        <div dir="ltr" style={{ fontSize: 13.5, fontWeight: 900, color: "#34d399", textAlign: isHe ? "right" : "left" }}>{net.commission_range}</div>
                      </div>
                      <div style={{ padding: 12, borderRadius: 12, background: "rgba(10,11,14,0.82)" }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{t("COOKIE WINDOW", "חלון מעקב")}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#38bdf8" }}>{formatCookieHe(net.cookie_window)}</div>
                      </div>
                    </div>
                    <div style={{ padding: 12, borderRadius: 12, background: "rgba(10,11,14,0.65)", fontSize: 13, color: "#e2e8f0", lineHeight: 1.6 }}>
                      <strong>{t("Who Can Join:", "תנאי סף:")}</strong> {isHe ? net.threshold_he : net.threshold_en}
                    </div>
                    <details style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.28)", fontSize: 12.5, color: "#fecaca" }}>
                      <summary style={{ cursor: "pointer", fontWeight: 800, listStyle: "none", display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={14} color="#f87171" /><span>{t("Safety & Anti-Ban Rules", "כללי בטיחות ומניעת חסימה (לחץ לקריאה)")}</span></summary>
                      <ul style={{ margin: "10px 0 0", paddingInlineStart: 18, lineHeight: 1.55 }}>{(isHe ? net.strict_rules_he : net.strict_rules_en).map((rule, idx) => <li key={idx}>{rule}</li>)}</ul>
                    </details>
                  </div>
                  <button type="button" onClick={() => { setSelectedNetSlug(net.slug); goToStage(2); }} className="btn-primary" style={{ width: "100%", height: 44, fontSize: 13 }}>
                    <span>{verified ? t("Manage Verified Account ->", "נהל חשבון מאומת והמשך ->") : t("Select & Continue to Stage 2", "בחר רשת זו והמשך לתחנה 2")}</span><ArrowIcon size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeStage === 2 && activeNetwork && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card-surface" style={{ padding: 14 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#38bdf8", marginBottom: 8 }}>{t("ACTIVE NETWORK:", "הרשת שנבחרה להקמה כעת:")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {networks.map((n) => (
                <button key={n.slug} type="button" onClick={() => { setSelectedNetSlug(n.slug); focusElement(workspaceRef.current); }} className={selectedNetSlug === n.slug ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12 }}>
                  {accounts.some((a) => a.network_slug === n.slug && a.is_verified) ? "✓ " : ""}{isHe ? n.name_he : n.name_en}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <div className="card-surface" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <span className="badge-pill" style={{ background: "rgba(56,189,248,0.16)", color: "#38bdf8", fontSize: 11, width: "fit-content" }}>{t("PART A · PRE-FLIGHT & REGISTRATION", "חלק א׳ · מדריך הרשמה לפני יציאה מהדף")}</span>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc" }}>{t(`How to Register on ${activeNetwork.name_en}`, `מדריך הרשמה מאפס עבור ${activeNetwork.name_he}`)}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(activeNetwork.onboarding_steps || []).map((st) => {
                  const stepKey = `${activeNetwork.slug}_${st.step}`;
                  const checked = Boolean(completedSteps[stepKey]);
                  return (
                    <div key={st.step} onClick={() => setCompletedSteps({ ...completedSteps, [stepKey]: !checked })} style={{ padding: 12, borderRadius: 12, cursor: "pointer", background: checked ? "rgba(52,211,153,0.1)" : "#0a0b0e", border: `1px solid ${checked ? "rgba(52,211,153,0.45)" : "rgba(255,255,255,0.08)"}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                      {checked ? <CheckSquare size={18} color="#34d399" style={{ flexShrink: 0, marginTop: 2 }} /> : <Square size={18} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: checked ? "#34d399" : "#f8fafc" }}>{t(`Step ${st.step}:`, `צעד ${st.step}:`)} {isHe ? st.title_he : st.title_en}</div>
                        <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.55, marginTop: 3 }}>{isHe ? st.detail_he : st.detail_en}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <a href={activeNetwork.signup_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ height: 44, fontSize: 13, background: "#38bdf8", color: "#0a0b0e" }}>
                <ExternalLink size={15} /><span>{t(`Open Official ${activeNetwork.name_en} Registration`, `פתח את דף ההרשמה הרשמי של ${activeNetwork.name_he}`)}</span>
              </a>
            </div>
            <div className="card-hero" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14 }}>
              <div>
                <span className="badge-pill" style={{ background: "rgba(52,211,153,0.16)", color: "#34d399", fontSize: 11, marginBottom: 8 }}>{t("PART B · RETURN CHECKPOINT & VERIFICATION", "חלק ב׳ · אימות מזהה השותף לאחר החזרה")}</span>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 10 }}>{t("Verify & Lock Your Partner Tracking ID", "הזן ואמת את מזהה השותף שקיבלת")}</h3>
                <form onSubmit={handleVerifyAccount} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{isHe ? activeNetwork.tracking_id_label_he : activeNetwork.tracking_id_label_en}</label>
                    <input type="text" dir="ltr" required value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g. proofcraft-20 / dealhub_il" className="input-dark" style={{ width: "100%", textAlign: "left" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{t("Personal Promo / Coupon Code (Optional)", "קוד קופון אישי (אופציונלי)")}</label>
                    <input type="text" dir="ltr" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="SAVE20" className="input-dark" style={{ width: "100%", textAlign: "left" }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ height: 44 }}><CheckCircle2 size={15} /> {t("Verify & Continue to Stage 3", "אמת מזהה והמשך לתחנה 3")}</button>
                </form>
              </div>
              <button type="button" onClick={() => { setNewNetSlug(activeNetwork.slug); goToStage(3); }} className="btn-ghost" style={{ height: 40, fontSize: 12.5 }}>
                <span>{t("Already have links? Skip to Stage 3 (Smart Links)", "כבר יש לך מזהה? דלג ישירות לתחנה 3 (יצירת קישורים)")}</span><ArrowIcon size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
      {activeStage === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {userId && (
            <div className="card-surface" style={{ padding: 14, border: "1px solid rgba(56,189,248,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 12.5, color: "#cbd5e1" }}>
                <strong style={{ color: "#38bdf8" }}>{t("Your Public Deal Storefront:", "כתובת חנות הדילים הציבורית שלך:")}</strong>{" "}
                <code dir="ltr" style={{ color: "#34d399" }}>{`${originUrl}/deals/${userId}`}</code>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(`${originUrl}/deals/${userId}`); notify(t("Storefront URL copied!", "קישור חנות הדילים הועתק!")); }} className="btn-ghost" style={{ height: 32, fontSize: 11.5 }}><Copy size={12} /> {t("Copy", "העתק")}</button>
                <a href={`/deals/${userId}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: "auto", height: 32, padding: "0 12px", fontSize: 11.5 }}><ExternalLink size={12} /> {t("Open", "פתח חנות")}</a>
              </div>
            </div>
          )}
          <div className="card-hero" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc" }}><Plus size={16} style={{ display: "inline", marginInlineEnd: 5, color: "#38bdf8" }} />{t("Create Smart Tracking Link", "יצירת קישור חכם חדש (עם מעקב קליקים ובדיקת תקינות)")}</h2>
              <span className="tabular-nums" style={{ fontSize: 12.5, color: "#34d399", fontWeight: 800 }}>{t(`Total Clicks: ${totalClicks}`, `סה״כ קליקים: ${totalClicks}`)}</span>
            </div>
            <form onSubmit={handleCreateSmartLink} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
              <select value={newNetSlug} onChange={(e) => setNewNetSlug(e.target.value)} className="input-dark" style={{ fontSize: 13 }}>{networks.map((n) => <option key={n.slug} value={n.slug}>{isHe ? n.name_he : n.name_en}</option>)}</select>
              <input type="text" value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder={t("Category Folder", "תיקיית קטגוריה")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder={t("Product Title", "שם המוצר / הדיל")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder={t("Price ($29 / ₪99)", "מחיר מבצע")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="url" dir="ltr" required value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="input-dark" style={{ fontSize: 13, textAlign: "left" }} />
              <input type="text" value={newSummary} onChange={(e) => setNewSummary(e.target.value)} placeholder={t("Key selling benefit", "יתרון מרכזי למחולל המודעות")} className="input-dark" style={{ fontSize: 13 }} />
              <button type="submit" className="btn-primary" style={{ height: 42, fontSize: 13 }}><Sparkles size={14} /> {t("Create Link & Go to Stage 4", "צור קישור והמשך להפצה (תחנה 4)")}</button>
            </form>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
            <button type="button" onClick={() => switchStage3("links")} className={stage3View === "links" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>{t(`My Links (${links.length})`, `הקישורים שלי (${links.length})`)}</button>
            <button type="button" onClick={() => switchStage3("workbench")} className={stage3View === "workbench" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>{t("Channel Tracker & Organic", "מעקב ערוצים ושיווק אורגני")}</button>
            <button type="button" onClick={() => switchStage3("bank")} className={stage3View === "bank" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>{t("Digital Bank & Organic Hub", "הבנק הדיגיטלי ושיווק אורגני")}</button>
            <button type="button" onClick={() => switchStage3("health")} className={stage3View === "health" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>{t("Analytics & 24/7 Health", "סטטיסטיקה ובדיקת תקינות")}</button>
          </div>
          <div ref={stage3PanelRef} style={{ scrollMarginTop: 84 }} />
          {stage3View === "workbench" && <LinkLifecycleWorkbench links={links} originUrl={originUrl} isHe={isHe} onInspectLink={(lnk) => setActive360Link(lnk)} onNotify={notify} />}
          {stage3View === "bank" && <AffiliateDigitalBankOS userId={userId} links={links} clicks={clicks} networks={networks} accounts={accounts} originUrl={originUrl} isHe={isHe} onReload={() => reloadHub(userId)} onInspectLink={(lnk) => setActive360Link(lnk)} onNotify={notify} />}
          {stage3View === "health" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <LinkHealthWatchdog links={links} isHe={isHe} onUpdated={() => reloadHub(userId)} onNotify={notify} />
              <AffiliateAnalyticsPanel links={links} clicks={clicks} networks={networks} isHe={isHe} onInspectLink={(lnk) => setActive360Link(lnk)} />
            </div>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {folders.map((f) => <button key={f} type="button" onClick={() => setFolderFilter(f)} className={folderFilter === f ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 32, padding: "0 12px", fontSize: 11.5 }}>{f}</button>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {visibleLinks.map((lk) => {
              const smartUrl = `${originUrl}/go/${lk.slug}`;
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
                    <button type="button" onClick={() => { navigator.clipboard?.writeText(smartUrl); notify(t("Smart link copied!", "הקישור החכם הועתק!")); }} className="btn-ghost" style={{ flex: 1, height: 34, fontSize: 11.5 }}><Copy size={12} /> {t("Copy", "העתק")}</button>
                    <button type="button" onClick={() => setActive360Link(lk)} className="btn-primary" style={{ flex: 1, height: 34, fontSize: 11.5 }}><BarChart3 size={12} /> {t("Ads & 360°", "מודעות ו-360°")}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeStage === 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card-hero" style={{ padding: 20, border: "1px solid rgba(52,211,153,0.35)" }}>
            <span className="badge-pill" style={{ background: "rgba(52,211,153,0.16)", color: "#34d399", fontSize: 11, marginBottom: 8 }}>{t("STAGE 4 · DISTRIBUTION & CAMPAIGN STUDIO", "תחנה 4 · אשף הפצה, קמפיינים חכמים וצמיחה")}</span>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>{t("Launch Your Deals Across Social Channels", "הפץ את הקישורים החכמים שלך ברשתות החברתיות בלחיצה")}</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 14 }}>{t("Use the Smart Campaign Launcher below or pick any link from your portfolio to copy ready-made posts.", "השתמש באשף ההפצה למטה או בחר קישור מתיק הנכסים שלך כדי להעתיק פוסטים מוכנים לוואטסאפ, פייסבוק ורילס.")}</p>
            <SmartCampaignLauncher userId={userId} context="affiliate" />
          </div>
          <BusinessExitAndTrafficOS userId={userId} links={links} accounts={accounts} originUrl={originUrl} isHe={isHe} onNotify={notify} />
          <ReferralRewardCard referralCode={referralCode} isHe={isHe} />
          <KarmaLedgerPanel karma={karma} boostCredits={boostCredits} isHe={isHe} />
          <div className="card-surface" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 8 }}>{t("AI Copywriting Bridge (ChatGPT / Claude / Canva)", "גשר כלי AI חיצוניים לכתיבת קופי שיווקי")}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8, marginBottom: 12 }}>
              <input type="text" value={bridgeProduct} onChange={(e) => setBridgeProduct(e.target.value)} placeholder={t("Product Name", "שם המוצר...")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={bridgePrice} onChange={(e) => setBridgePrice(e.target.value)} placeholder={t("Price", "מחיר מבצע...")} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={bridgeBenefit} onChange={(e) => setBridgeBenefit(e.target.value)} placeholder={t("Key Benefit", "יתרון מרכזי...")} className="input-dark" style={{ fontSize: 13 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {prompts.map((pr) => {
                const locked = pr.is_pro_only && !isPro;
                const compiled = (isHe ? pr.prompt_template_he : pr.prompt_template_en).replace(/\{\{PRODUCT_TITLE\}\}/g, bridgeProduct || t("[Product]", "[שם המוצר]")).replace(/\{\{PRICE\}\}/g, bridgePrice || t("[Price]", "[מחיר]")).replace(/\{\{BENEFIT\}\}/g, bridgeBenefit || t("[Benefit]", "[יתרון מרכזי]"));
                return (
                  <div key={pr.id} style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <span className="badge-pill" style={{ fontSize: 10, background: "rgba(129,140,248,0.16)", color: "#818cf8", marginBottom: 6 }}>{pr.tool_name}</span>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc", marginBottom: 6 }}>{isHe ? pr.title_he : pr.title_en}</div>
                      <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>{locked ? t("Upgrade to Affiliate Pro to unlock.", "שדרג ל-Affiliate Pro לפתיחת פרומפט זה.") : compiled}</div>
                    </div>
                    {locked ? <button type="button" onClick={() => setProModalOpen(true)} className="btn-primary" style={{ height: 34, fontSize: 11.5, background: "#fbbf24", color: "#0a0b0e" }}><Lock size={12} /> {t("Unlock Pro", "שדרג ל-Pro")}</button> : (
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
        </div>
      )}

      <Link360Drawer link={active360Link} network={networks.find((n) => n.slug === active360Link?.network_slug)} clicks={clicks} boostCredits={boostCredits} onClose={() => setActive360Link(null)} onUpdated={() => reloadHub(userId)} onNotify={notify} />
      <CustomNetworkModal isOpen={customNetOpen} onClose={() => setCustomNetOpen(false)} userId={userId} onCreated={() => reloadHub(userId)} onNotify={notify} />
      <AffiliateMonetizationModal isOpen={proModalOpen} onClose={() => setProModalOpen(false)} userId={userId} defaultEmail={userEmail} onNotify={notify} />

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 80, background: "rgba(10,11,14,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(56,189,248,0.3)", padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: "#e2e8f0" }}>
          <span style={{ color: "#34d399" }}>{t(`Stage ${activeStage}/4`, `תחנה ${activeStage} מתוך 4`)}</span> · {activeStage === 1 ? t("Choose Network", "בחירת רשת") : activeStage === 2 ? t("Verify ID", "אימות מזהה") : activeStage === 3 ? t("Create Links", "בניית קישורים") : t("Campaign Studio", "אשף הפצה וקמפיינים")}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {activeStage > 1 && <button type="button" onClick={() => goToStage((activeStage - 1) as 1 | 2 | 3 | 4)} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12 }}>{t("Back", "חזור")}</button>}
          {activeStage < 4 && <button type="button" onClick={() => goToStage((activeStage + 1) as 1 | 2 | 3 | 4)} className="btn-primary" style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12, background: "#34d399", color: "#0a0b0e" }}>{t("Next Step", "המשך לשלב הבא")} <ArrowIcon size={13} /></button>}
        </div>
      </div>
    </div>
  );
}