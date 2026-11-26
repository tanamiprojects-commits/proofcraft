"use client";
import ZeroKnowledgeVaultOS from "@/components/ZeroKnowledgeVaultOS";
import OrganicNetworkBuilderOS from "@/components/OrganicNetworkBuilderOS";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, ShieldCheck, UserPlus, ArrowRight, ArrowLeft, TrendingUp, Link2 } from "lucide-react";
import { getStrategicTrackGuides } from "@/lib/plg-career-strategy";
import { getActiveUserProfile, TrackProjectEntry } from "@/lib/cloud-store";
import { BuilderProfile, DEFAULT_PROFILE } from "@/lib/proofcraft-store";
import { useStudioLang } from "@/lib/i18n-engine";
import Track1AcademyStudio from "@/components/Track1AcademyStudio";
import Track2AcademyStudio from "@/components/Track2AcademyStudio";
import Track3AcademyStudio from "@/components/Track3AcademyStudio";
import Track4AcademyStudio from "@/components/Track4AcademyStudio";
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
  const [wsMode, setWsMode] = useState<"build" | "organic" | "vault">("build");
  const [selectedTrack, setSelectedTrack] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string>("");
  const [reserveModalOpen, setReserveModalOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [affStats, setAffStats] = useState<{ links: number; clicks: number; credits: number }>({ links: 0, clicks: 0, credits: 10 });

  const showNotify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3200); };

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
      if (res.userId) { const uid = res.userId; const refreshWs = () => claimReferralBonusForNewUser(uid).then(() => fetchAffiliateHubState(uid)).then((h) => setAffStats({ links: h.links.length, clicks: h.clicks.length, credits: h.boostCredits })); refreshWs(); window.addEventListener("proofcraft:sync-now", refreshWs); }
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>{t("Loading Production Studio...", "טוען את סטודיו הייצור...")}</div>;

  const guides = getStrategicTrackGuides(lang);
  const activeGuide = guides.find((g) => g.level === selectedTrack) || guides[0];
  const isTrackUnlocked = purchasedLevel >= selectedTrack;
  const deltaIls = Math.max(0, activeGuide.priceIls - totalPaidIls);
  const deltaUsd = Math.max(0, activeGuide.priceUsd - Math.round(totalPaidIls / 3.65));

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      <StudioVisualArtwork variant="workspace" />
      

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      <UserGuideDrawer context="workspace" />
      <NextBestActionEngine userId={userId} />
      <PublicIdentityBar userId={userId} isHe={isHe} />
      <CreatorRankBadge userId={userId} />
      <ExecutiveReportCard userId={userId} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.25)", marginBottom: 16 }}><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" onClick={() => setWsMode("build")} className={wsMode === "build" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 36, fontSize: 12.5 }}>{t("1. Engineering Studio & Portfolio", "1. סטודיו בנייה ותיק עבודות")}</button><button type="button" onClick={() => setWsMode("organic")} className={wsMode === "organic" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 36, fontSize: 12.5 }}>{t("2. Organic Network & Co-Op Ring", "2. רשת שיווק אורגנית וקידום הדדי")}</button><button type="button" onClick={() => setWsMode("vault")} className={wsMode === "vault" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 36, fontSize: 12.5 }}>{t("3. Encrypted Context & Crypto Vault", "3. כספת סודות, קריפטו והקשר")}</button></div><span style={{ fontSize: 11.5, color: "#94a3b8" }}>{t("Switch between building your product and growing organic traffic.", "עבור בין בניית המוצר להקמת רשת השיווק האורגנית שלך.")}</span></div>{wsMode === "organic" && <OrganicNetworkBuilderOS userId={userId} />}{wsMode === "vault" && <ZeroKnowledgeVaultOS userId={userId} />}
      <SmartCampaignLauncher userId={userId} context="workspace" />
      <PublicBrandingEditor userId={userId} />
      <div className="card-hero" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc" }}>
              {t("AI Engineering & Asset Production Studio", "סטודיו הנדסת AI ובניית נכסים חיים")}
            </h1>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>
              {t(
                "Track 1 is 100% free to build your profile & v1.0 portfolio · Tracks 2–4 include strategic previews & upgrade-delta pricing",
                "מסלול 1 חינמי ב-100% לבניית פרופיל ותיק עבודות v1.0 · מסלולים 2–4 כוללים תצוגה מקדימה וזיכוי Upgrade-Delta"
              )}
            </p>
          </div>
          {!userId ? (
            <Link href="/auth" className="btn-primary" style={{ width: "auto", height: 38, fontSize: 12 }}>
              <UserPlus size={14} /> {t("Free Sign Up to Save Portfolio", "הרשמה חינמית לשמירת התיק")}
            </Link>
          ) : (
            <Link href="/portfolio/live" className="btn-ghost" style={{ height: 36, fontSize: 12, color: "#38bdf8" }}>
              <ShieldCheck size={14} /> {t("View Public Verified Portfolio", "צפה בתיק העבודות המאומת")}
            </Link>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
          {guides.map((tr) => {
            const unlocked = purchasedLevel >= tr.level;
            const active = selectedTrack === tr.level;
            const trDelta = isHe ? `₪${Math.max(0, tr.priceIls - totalPaidIls)}` : `$${Math.max(0, tr.priceUsd - Math.round(totalPaidIls / 3.65))}`;
            return (
              <button
                key={tr.level}
                type="button"
                onClick={() => setSelectedTrack(tr.level)}
                style={{
                  padding: "11px 12px", borderRadius: 12, textAlign: isHe ? "right" : "left", cursor: "pointer",
                  background: active ? "rgba(56, 189, 248, 0.16)" : "#0a0b0e",
                  border: `1px solid ${active ? "#38bdf8" : tr.highlightFlagship ? "rgba(251, 191, 36, 0.35)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: unlocked ? "#34d399" : tr.highlightFlagship ? "#fbbf24" : "#94a3b8" }}>
                    {unlocked ? t("UNLOCKED", "פתוח") : tr.highlightFlagship ? t("FLAGSHIP (4 BUILDS)", "הסמכת הדגל (4 מערכות)") : t("STRATEGIC PREVIEW", "תצוגה מקדימה")}
                  </span>
                  <span className="tabular-nums" style={{ fontSize: 11, fontWeight: 800, color: "#f8fafc" }}>
                    {tr.priceUsd === 0 ? t("FREE", "חינם") : unlocked ? "" : trDelta}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc" }}>{tr.name}</div>
              </button>
            );
          })}
        </div>
      </div>
            {userId && (
        <div className="card-surface" style={{ padding: 14, marginBottom: 16, border: "1px solid rgba(56, 189, 248, 0.38)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 13, color: "#e2e8f0" }}>
            <strong style={{ color: "#38bdf8" }}>
              {t(`Welcome back, ${profile.fullName || "AI Builder"}!`, `ברוך הבא, ${profile.fullName || "בונה AI"}!`)}
            </strong>{" "}
            {t(`Cloud Sync Active · Tier v${purchasedLevel}.0 · ${profile.completedStepIds.length} Verified Proofs`, `סנכרון ענן פעיל · דרגה v${purchasedLevel}.0 · ${profile.completedStepIds.length} הוכחות מאומתות`)}
          </div>
          <Link href="/portfolio/live" className="btn-ghost" style={{ height: 34, fontSize: 11.5, color: "#34d399" }}>
            {t("Open Public Portfolio", "פתח תיק עבודות ציבורי")}
          </Link>
        </div>
      )}

      {userId && (
        <div className="card-surface" style={{ padding: 14, marginBottom: 16, border: "1px solid rgba(52, 211, 153, 0.32)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 12.5, color: "#cbd5e1" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 900, color: "#34d399" }}><TrendingUp size={15} /> {isHe ? "מדדי שותפים וחנות:" : "Affiliate & Storefront Pulse:"}</span>
            <span><strong>{affStats.links}</strong> {isHe ? "קישורים" : "Links"}</span><span>·</span>
            <span><strong>{affStats.clicks}</strong> {isHe ? "קליקים" : "Clicks"}</span><span>·</span>
            <span style={{ color: "#fbbf24" }}><strong>{affStats.credits}</strong> Boost</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={`/deals/${encodeURIComponent(userId)}`} className="btn-ghost" style={{ height: 32, fontSize: 11.5 }}>{isHe ? "חנות הדילים שלי" : "My Storefront"}</Link>
            <Link href="/affiliate" className="btn-primary" style={{ width: "auto", height: 32, fontSize: 11.5 }}><Link2 size={13} /> {isHe ? "מרכז השותפים" : "Affiliate Hub"}</Link>
          </div>
        </div>
      )}
      {!userId && selectedTrack === 1 && (
        <div className="card-surface" style={{ padding: 14, marginBottom: 16, border: "1px solid rgba(52, 211, 153, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12, color: "#cbd5e1" }}>
            <strong style={{ color: "#34d399" }}>{t("Open Sandbox Mode (Track 1):", "מצב התנסות פתוח (מסלול 1):")}</strong>{" "}
            {t("Explore all milestones and tools right now. Create a free account to save your verified portfolio in the cloud.", "סקור את כל אבני הדרך והכלים כבר עכשיו. צור חשבון חינמי כדי לשמור את תיק העבודות בענן.")}
          </div>
          <Link href="/auth" className="btn-ghost" style={{ height: 34, fontSize: 11, color: "#34d399" }}>
            {t("Create Free Account", "צור חשבון חינמי")} {isHe ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
          </Link>
        </div>
      )}

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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 18 }}>
            <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{t("TARGET BUILDER PROFILE", "למי המסלול מיועד")}</div>
              <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.55 }}>{activeGuide.whoIsItFor}</p>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8", marginBottom: 4 }}>{t("VERIFIED DELIVERABLE", "תוצר הנדסי מאומת")}</div>
              <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.55 }}>{activeGuide.concreteDeliverable}</p>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#34d399", marginBottom: 4 }}>{t("CAREER & CLIENT IMPACT", "השפעה עסקית וקרייריסטית")}</div>
              <p style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.55 }}>{activeGuide.careerAndMarketImpact}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setReserveModalOpen(true)} className="btn-primary" style={{ width: "auto", background: "#fbbf24", color: "#0a0b0e" }}>
              {t(`Reserve Founder Spot (${isHe ? `₪${deltaIls}` : `$${deltaUsd}`} · $0 Today)`, `שריין מחיר מייסדים (${isHe ? `₪${deltaIls}` : `$${deltaUsd}`} · ₪0 היום)`)}
            </button>
            <button type="button" onClick={() => setSelectedTrack(1)} className="btn-ghost" style={{ width: "auto" }}>
              {t("Continue Free in Track 1 Studio", "המשך בחינם בסטודיו מסלול 1")}
            </button>
            <Link href="/portfolio/live" className="btn-ghost">
              {t("Preview 4-Project Portfolio Layout", "צפה בתצוגת תיק 4 הפרויקטים")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
