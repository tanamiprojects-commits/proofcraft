"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Lock, ShieldCheck, UserPlus, ArrowRight, ArrowLeft, TrendingUp,
  Link2, Sparkles, Layers, ChevronDown, ChevronUp, CheckCircle2, Rocket, HelpCircle
} from "lucide-react";
import { getStrategicTrackGuides } from "@/lib/plg-career-strategy";
import { getActiveUserProfile, TrackProjectEntry } from "@/lib/cloud-store";
import { BuilderProfile, DEFAULT_PROFILE } from "@/lib/proofcraft-store";
import { useStudioLang } from "@/lib/i18n-engine";
import Track1AcademyStudio from "@/components/Track1AcademyStudio";
import Track2AcademyStudio from "@/components/Track2AcademyStudio";
import Track3AcademyStudio from "@/components/Track3AcademyStudio";
import Track4AcademyStudio from "@/components/Track4AcademyStudio";
import ZeroKnowledgeVaultOS from "@/components/ZeroKnowledgeVaultOS";
import OrganicNetworkBuilderOS from "@/components/OrganicNetworkBuilderOS";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";
import PublicIdentityBar from "@/components/PublicIdentityBar";
import UserGuideDrawer from "@/components/UserGuideDrawer";
import NextBestActionEngine from "@/components/NextBestActionEngine";
import CreatorRankBadge from "@/components/CreatorRankBadge";
import ExecutiveReportCard from "@/components/ExecutiveReportCard";
import SmartCampaignLauncher from "@/components/SmartCampaignLauncher";
import PublicBrandingEditor from "@/components/PublicBrandingEditor";
import CreatorLaunchChecklist from "@/components/CreatorLaunchChecklist";
import UserSupportInboxCard from "@/components/UserSupportInboxCard";
import UpgradeIntentModal from "@/components/UpgradeIntentModal";
import { supabase } from "@/lib/supabase";
import { fetchAffiliateHubState } from "@/lib/affiliate-store";
import { claimReferralBonusForNewUser } from "@/lib/referral-engine";

export default function WorkspacePage() {
  const { lang, isHe, dir, t } = useStudioLang();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<BuilderProfile>(DEFAULT_PROFILE);
  const [trackProjects, setTrackProjects] = useState<Record<string, TrackProjectEntry>>({});
  const [purchasedLevel, setPurchasedLevel] = useState<number>(1);
  const [totalPaidIls, setTotalPaidIls] = useState<number>(0);
  const [selectedTrack, setSelectedTrack] = useState<number>(1);
  const [syncing, setSyncing] = useState<boolean>(true);
  const [toast, setToast] = useState<string>("");
  const [reserveModalOpen, setReserveModalOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showQuickGuide, setShowQuickGuide] = useState<boolean>(false);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
  const [advancedTab, setAdvancedTab] = useState<"growth" | "organic" | "vault" | "branding">("growth");
  const [affStats, setAffStats] = useState<{ links: number; clicks: number; credits: number }>({ links: 0, clicks: 0, credits: 10 });
  const station2Ref = useRef<HTMLDivElement | null>(null);

  const showNotify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3200); };
  const scrollToStation2 = (trackLvl?: number) => {
    if (trackLvl) setSelectedTrack(trackLvl);
    setTimeout(() => station2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  useEffect(() => {
    getActiveUserProfile().then((res) => {
      setUserId(res.userId);
      supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email || ""));
      setProfile(res.profile);
      setTrackProjects(res.trackProjects || {});
      const lvl = res.purchasedTrackLevel || 1;
      setPurchasedLevel(lvl);
      setTotalPaidIls(res.totalPaidIls || 0);
      setSelectedTrack(lvl);
      if (res.userId) {
        const uid = res.userId;
        const refreshWs = () => claimReferralBonusForNewUser(uid)
          .then(() => fetchAffiliateHubState(uid))
          .then((h) => setAffStats({ links: h.links.length, clicks: h.clicks.length, credits: h.boostCredits }));
        refreshWs();
        window.addEventListener("proofcraft:sync-now", refreshWs);
      }
      setSyncing(false);
    });
  }, []);

  const guides = getStrategicTrackGuides(lang);
  const activeGuide = guides.find((g) => g.level === selectedTrack) || guides[0];
  const isTrackUnlocked = purchasedLevel >= selectedTrack;
  const deltaIls = Math.max(0, activeGuide.priceIls - totalPaidIls);
  const deltaUsd = Math.max(0, activeGuide.priceUsd - Math.round(totalPaidIls / 3.65));
  const verifiedCount = profile.completedStepIds.length;
  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      <StudioVisualArtwork variant="workspace" />

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      {/* STATION 1 */}
      <section className="card-hero" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="badge-pill" style={{ background: "rgba(56, 189, 248, 0.16)", color: "#38bdf8", fontSize: 11 }}>
              {t("STATION 1 OF 3 · TRACK & GOAL", "תחנה 1 מתוך 3 · בחירת מסלול ומטרה")}
            </span>
            {syncing && <span style={{ fontSize: 11, color: "#94a3b8" }}>{t("Syncing profile...", "מסנכרן פרופיל...")}</span>}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setShowQuickGuide((v) => !v)} className="btn-ghost" style={{ height: 34, fontSize: 12, color: "#fbbf24", borderColor: "rgba(251,191,36,0.35)" }}>
              <HelpCircle size={14} /> {t("How it works (30s)", "איך זה עובד? (30 שניות)")}
            </button>
            <button type="button" onClick={() => scrollToStation2(1)} className="btn-ghost" style={{ height: 34, fontSize: 12, color: "#34d399", borderColor: "rgba(52,211,153,0.35)" }}>
              <Sparkles size={14} /> {t("Start Free Track 1", "התחל מסלול 1 חינם")}
            </button>
            {!userId ? (
              <Link href="/auth" className="btn-primary" style={{ width: "auto", height: 34, fontSize: 12 }}>
                <UserPlus size={14} /> {t("Free Sign Up", "הרשמה חינמית")}
              </Link>
            ) : (
              <Link href="/portfolio/live" className="btn-primary" style={{ width: "auto", height: 34, fontSize: 12 }}>
                <ShieldCheck size={14} /> {t("Public Portfolio", "תיק עבודות חי")}
              </Link>
            )}
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
          {t("Track 2: AI Engineering Studio & Verified Portfolio", "מסלול 2: סטודיו הנדסת AI ותיק עבודות מאומת")}
        </h1>
        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 14 }}>
          {t(
            "Build real AI systems step-by-step, verify live links, and publish an employer-ready portfolio. Track 1 (v1.0) is 100% free.",
            "בנה מערכות AI אמיתיות צעד-אחר-צעד, אמת קישורים חיים, ופרסם תיק עבודות מוכן ללקוחות ומעסיקים. מסלול 1 (v1.0) חינמי ב-100%."
          )}
        </p>

        {showQuickGuide && (
          <div style={{ padding: 14, borderRadius: 12, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.28)", marginBottom: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
            <div style={{ fontSize: 12.5, color: "#e2e8f0" }}>
              <strong style={{ color: "#38bdf8" }}>1. {t("Pick Track v1.0 (Free):", "בחר מסלול v1.0 (חינם):")}</strong>{" "}
              {t("No coding background required. Follow the guided checklist.", "אין צורך בניסיון קודם. עקוב אחרי רשימת המשימות המודרכת.")}
            </div>
            <div style={{ fontSize: 12.5, color: "#e2e8f0" }}>
              <strong style={{ color: "#34d399" }}>2. {t("Build & Verify Link:", "בנה ואמת קישור חי:")}</strong>{" "}
              {t("Paste your GitHub or live URL in Station 2 to earn verified proof.", "הדבק קישור GitHub או אתר חי בתחנה 2 לקבלת חותמת אימות.")}
            </div>
            <div style={{ fontSize: 12.5, color: "#e2e8f0" }}>
              <strong style={{ color: "#fbbf24" }}>3. {t("Share Verified Portfolio:", "שתף תיק עבודות מאומת:")}</strong>{" "}
              {t("Your live portfolio updates automatically in Station 3.", "תיק העבודות הציבורי שלך מתעדכן אוטומטית בתחנה 3.")}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))", gap: 8 }}>
          {guides.map((tr) => {
            const unlocked = purchasedLevel >= tr.level;
            const active = selectedTrack === tr.level;
            const trDelta = isHe ? `₪${Math.max(0, tr.priceIls - totalPaidIls)}` : `$${Math.max(0, tr.priceUsd - Math.round(totalPaidIls / 3.65))}`;
            return (
              <button
                key={tr.level}
                type="button"
                onClick={() => scrollToStation2(tr.level)}
                style={{
                  padding: "12px 13px", borderRadius: 12, textAlign: isHe ? "right" : "left", cursor: "pointer",
                  background: active ? "rgba(56, 189, 248, 0.16)" : "#0a0b0e",
                  border: `1px solid ${active ? "#38bdf8" : tr.highlightFlagship ? "rgba(251, 191, 36, 0.35)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: unlocked ? "#34d399" : tr.highlightFlagship ? "#fbbf24" : "#94a3b8" }}>
                    {unlocked ? t("UNLOCKED", "פתוח לעבודה") : tr.highlightFlagship ? t("FLAGSHIP (4 BUILDS)", "הסמכת הדגל (4 מערכות)") : t("PREVIEW", "תצוגה מקדימה")}
                  </span>
                  <span className="tabular-nums" style={{ fontSize: 11, fontWeight: 800, color: "#f8fafc" }}>
                    {tr.priceUsd === 0 ? t("FREE", "חינם") : unlocked ? "✓" : trDelta}
                  </span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "#f8fafc" }}>{tr.name}</div>
              </button>
            );
          })}
        </div>
      </section>
      {/* STATION 2 */}
      <section ref={station2Ref} style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, padding: "10px 14px", borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.24)", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.16)", color: "#34d399", fontSize: 11 }}>
              {t("STATION 2 OF 3 · ACTIVE STUDIO", "תחנה 2 מתוך 3 · סביבת הביצוע")}
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc" }}>{activeGuide.name}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => window.open("/context-studio?floating=1", "pcContextFloat", "width=540,height=740")} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12, color: "#a5b4fc", borderColor: "rgba(129,140,248,0.38)" }}>
              {t("Floating Context Studio", "סטודיו הקשר צף")}
            </button>
            {!userId && selectedTrack === 1 && (
              <Link href="/auth" className="btn-ghost" style={{ height: 32, fontSize: 11.5, color: "#34d399" }}>
                {t("Save Progress in Cloud", "שמור התקדמות בענן")} {isHe ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
              </Link>
            )}
          </div>
        </div>

        {isTrackUnlocked ? (
          <>
            {selectedTrack === 1 && <Track1AcademyStudio userId={userId} profile={profile} setProfile={setProfile} trackProjects={trackProjects} setTrackProjects={setTrackProjects} onNotify={showNotify} />}
            {selectedTrack === 2 && <Track2AcademyStudio userId={userId} profile={profile} setProfile={setProfile} trackProjects={trackProjects} setTrackProjects={setTrackProjects} onNotify={showNotify} />}
            {selectedTrack === 3 && <Track3AcademyStudio userId={userId} profile={profile} setProfile={setProfile} trackProjects={trackProjects} setTrackProjects={setTrackProjects} onNotify={showNotify} />}
            {selectedTrack === 4 && <Track4AcademyStudio userId={userId} profile={profile} setProfile={setProfile} trackProjects={trackProjects} setTrackProjects={setTrackProjects} onNotify={showNotify} />}
          </>
        ) : (
          <div className="card-hero" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
              <span className="badge-pill" style={{ background: "rgba(251, 191, 36, 0.18)", color: "#fbbf24", fontSize: 11 }}>
                <Lock size={13} /> {t("Strategic Tier Preview", "תצוגה מקדימה למסלול")} · {activeGuide.badge}
              </span>
              <span className="tabular-nums" style={{ fontSize: 18, fontWeight: 900, color: "#34d399" }}>
                {t(`Upgrade-Delta Price: $${deltaUsd}`, `מחיר שדרוג (Upgrade-Delta): ₪${deltaIls}`)}
              </span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{activeGuide.name}</h2>
            <p style={{ fontSize: 14, color: "#38bdf8", fontWeight: 700, marginBottom: 16 }}>{activeGuide.tagline}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12, marginBottom: 18 }}>
              <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{t("TARGET BUILDER", "למי המסלול מיועד")}</div>
                <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.55 }}>{activeGuide.whoIsItFor}</p>
              </div>
              <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8", marginBottom: 4 }}>{t("VERIFIED DELIVERABLE", "תוצר הנדסי מאומת")}</div>
                <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.55 }}>{activeGuide.concreteDeliverable}</p>
              </div>
              <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#34d399", marginBottom: 4 }}>{t("CAREER IMPACT", "השפעה עסקית")}</div>
                <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.55 }}>{activeGuide.careerAndMarketImpact}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={() => setReserveModalOpen(true)} className="btn-primary" style={{ width: "auto", background: "#fbbf24", color: "#0a0b0e" }}>
                {t(`Reserve Founder Spot (${isHe ? `₪${deltaIls}` : `$${deltaUsd}`} · $0 Today)`, `שריין מחיר מייסדים (${isHe ? `₪${deltaIls}` : `$${deltaUsd}`} · ₪0 היום)`)}
              </button>
              <button type="button" onClick={() => scrollToStation2(1)} className="btn-ghost" style={{ width: "auto" }}>
                {t("Continue Free in Track 1 Studio", "המשך בחינם בסטודיו מסלול 1")}
              </button>
            </div>
          </div>
        )}
      </section>
      {/* STATION 3 */}
      <section className="card-surface" style={{ padding: 18, marginBottom: 18, border: "1px solid rgba(52, 211, 153, 0.28)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          <div>
            <span className="badge-pill" style={{ background: "rgba(251, 191, 36, 0.16)", color: "#fbbf24", fontSize: 11, marginBottom: 6 }}>
              {t("STATION 3 OF 3 · PORTFOLIO & GROWTH TOOLS", "תחנה 3 מתוך 3 · תיק עבודות וכלים מתקדמים")}
            </span>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc" }}>
              {userId
                ? t(`${profile.fullName || "AI Builder"} · Tier v${purchasedLevel}.0 · ${verifiedCount} Verified Proofs`, `${profile.fullName || "בונה AI"} · דרגה v${purchasedLevel}.0 · ${verifiedCount} הוכחות מאומתות`)
                : t("Ready to Publish Your Verified Portfolio?", "מוכן לפרסם את תיק העבודות המאומת שלך?")}
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/portfolio/live" className="btn-primary" style={{ width: "auto", height: 36, fontSize: 12 }}>
              <CheckCircle2 size={14} /> {t("Open Public Portfolio", "פתח תיק עבודות ציבורי")}
            </Link>
            <Link href="/affiliate" className="btn-ghost" style={{ height: 36, fontSize: 12 }}>
              <Link2 size={14} /> {t("Track 1: Affiliate Hub", "מסלול 1: מרכז השותפים")}
            </Link>
          </div>
        </div>

        {userId && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 12.5, color: "#cbd5e1", padding: "10px 12px", borderRadius: 10, background: "#0a0b0e", marginBottom: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 900, color: "#34d399" }}>
              <TrendingUp size={15} /> {isHe ? "מדדי שותפים וחנות:" : "Affiliate & Storefront Pulse:"}
            </span>
            <span><strong>{affStats.links}</strong> {isHe ? "קישורים" : "Links"}</span><span>·</span>
            <span><strong>{affStats.clicks}</strong> {isHe ? "קליקים" : "Clicks"}</span><span>·</span>
            <span style={{ color: "#fbbf24" }}><strong>{affStats.credits}</strong> Boost</span>
            <Link href={`/deals/${encodeURIComponent(userId)}`} style={{ color: "#38bdf8", fontWeight: 700, marginInlineStart: "auto" }}>
              {isHe ? "צפה בחנות הדילים שלי ←" : "Open My Storefront →"}
            </Link>
          </div>
        )}

        <button type="button" onClick={() => setAdvancedOpen((v) => !v)} className="btn-ghost" style={{ width: "100%", justifyContent: "space-between", height: 42, fontSize: 13, fontWeight: 800, color: "#e2e8f0" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Layers size={16} color="#38bdf8" />
            {t("Advanced Studio Tools (Organic Network, AES-256 Vault, Public Branding & Reports)", "מגירת כלים מתקדמים (שיווק אורגני, כספת AES-256, מיתוג ציבורי ודוחות)")}
          </span>
          {advancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {advancedOpen && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <button type="button" onClick={() => setAdvancedTab("growth")} className={advancedTab === "growth" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 34, fontSize: 12 }}>
                <Rocket size={13} /> {t("Growth & Checklist", "צמיחה וצ'ק-ליסט")}
              </button>
              <button type="button" onClick={() => setAdvancedTab("organic")} className={advancedTab === "organic" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 34, fontSize: 12 }}>
                {t("Organic Co-Op Network", "רשת שיווק אורגנית")}
              </button>
              <button type="button" onClick={() => setAdvancedTab("vault")} className={advancedTab === "vault" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 34, fontSize: 12 }}>
                {t("AES-256 Secret Vault", "כספת סודות מוצפנת")}
              </button>
              <button type="button" onClick={() => setAdvancedTab("branding")} className={advancedTab === "branding" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 34, fontSize: 12 }}>
                {t("Public Identity & Branding", "מיתוג ופרופיל ציבורי")}
              </button>
            </div>

            {advancedTab === "growth" && (<><UserGuideDrawer context="workspace" /><NextBestActionEngine userId={userId} /><CreatorLaunchChecklist hasName={Boolean(profile.fullName)} linksCount={affStats.links} builtCount={verifiedCount} credits={affStats.credits} isHe={isHe} /><SmartCampaignLauncher userId={userId} context="workspace" /><ExecutiveReportCard userId={userId} /><UserSupportInboxCard userId={userId} isHe={isHe} /></>)}
            {advancedTab === "organic" && <OrganicNetworkBuilderOS userId={userId} />}
            {advancedTab === "vault" && <ZeroKnowledgeVaultOS userId={userId} />}
            {advancedTab === "branding" && (<><CreatorRankBadge userId={userId} /><PublicBrandingEditor userId={userId} /></>)}
          </div>
        )}
      </section>

      <UpgradeIntentModal isOpen={reserveModalOpen} onClose={() => setReserveModalOpen(false)} userId={userId} defaultName={profile.fullName} defaultEmail={userEmail} targetTier={activeGuide.level} tierName={activeGuide.name} deltaIls={deltaIls} deltaUsd={deltaUsd} />
    </div>
  );
}