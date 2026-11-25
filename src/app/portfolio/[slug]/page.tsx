"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Award, ExternalLink, Lock, ShieldCheck, Layers, Sparkles, ArrowUpRight } from "lucide-react";
import { getActiveUserProfile, TrackProjectEntry } from "@/lib/cloud-store";
import { BuilderProfile, DEFAULT_PROFILE } from "@/lib/proofcraft-store";
import { getStrategicTrackGuides } from "@/lib/plg-career-strategy";
import { fetchAffiliateHubState, AffLink } from "@/lib/affiliate-store";
import { useStudioLang } from "@/lib/i18n-engine";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";
import VerifiedProofsPanel from "@/components/VerifiedProofsPanel";
import ViralShareBar from "@/components/ViralShareBar";
import VerifiedCredentialCard from "@/components/VerifiedCredentialCard";

export default function LivePortfolioPage() {
  const { lang, isHe, dir, t } = useStudioLang();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<BuilderProfile>(DEFAULT_PROFILE);
  const [trackProjects, setTrackProjects] = useState<Record<string, TrackProjectEntry>>({});
  const [purchasedLevel, setPurchasedLevel] = useState<number>(1);
  const [verifiedTools, setVerifiedTools] = useState<AffLink[]>([]);

  const loadPortfolio = useCallback(() => {
    getActiveUserProfile().then((res) => {
      setUserId(res.userId);
      setProfile(res.profile);
      setTrackProjects(res.trackProjects || {});
      setPurchasedLevel(res.purchasedTrackLevel || 1);
      if (res.userId) {
        fetchAffiliateHubState(res.userId).then((hub) => {
          const activeLinks = (hub.links || []).filter((l) => l.health_status === "active");
          setVerifiedTools(activeLinks.slice(0, 6));
        });
      }
    });
  }, []);

  useEffect(() => {
    loadPortfolio();
    const onSync = () => loadPortfolio();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [loadPortfolio]);

  const builtCount = ["1", "2", "3", "4"].filter((k) => Boolean(trackProjects[k]?.url)).length;
  const toolsList = (profile.primaryTools || "Next.js, TypeScript, Supabase, Vercel").split(",").map((s) => s.trim()).filter(Boolean);
  const guides = getStrategicTrackGuides(lang);
  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      <StudioVisualArtwork variant="portfolio" />
      <div className="card-hero" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc" }}>
                {profile.fullName || t("Independent AI Systems Builder", "\u05D1\u05D5\u05E0\u05D4 \u05DE\u05E2\u05E8\u05DB\u05D5\u05EA AI \u05E2\u05E6\u05DE\u05D0\u05D9")}
              </h1>
              <span className="badge-pill" style={{ fontSize: 11, background: profile.adminVerified ? "rgba(52, 211, 153, 0.16)" : "rgba(56, 189, 248, 0.16)", color: profile.adminVerified ? "#34d399" : "#38bdf8", border: `1px solid ${profile.adminVerified ? "rgba(52, 211, 153, 0.4)" : "rgba(56, 189, 248, 0.35)"}` }}>
                {profile.adminVerified ? <><Award size={12} /> {t("Certified Graduate", "\u05D1\u05D5\u05D2\u05E8 \u05DE\u05D5\u05E1\u05DE\u05DA \u05E8\u05E9\u05DE\u05D9\u05EA")}</> : <><ShieldCheck size={12} /> {t("ProofCraft Verified Builder", "\u05D1\u05D5\u05E0\u05D4 \u05DE\u05D0\u05D5\u05DE\u05EA ProofCraft")}</>}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.5 }}>
              {profile.headline || t("AI Product Engineer & Business Automation Architect - Backed by Live Execution Proof", "\u05DE\u05D4\u05E0\u05D3\u05E1 \u05DE\u05D5\u05E6\u05E8\u05D9 AI \u05D5\u05D0\u05E8\u05DB\u05D9\u05D8\u05E7\u05D8 \u05D0\u05D5\u05D8\u05D5\u05DE\u05E6\u05D9\u05D4 \u05E2\u05E1\u05E7\u05D9\u05EA - \u05DE\u05D2\u05D5\u05D1\u05D4 \u05D1\u05D4\u05D5\u05DB\u05D7\u05D5\u05EA \u05D1\u05D9\u05E6\u05D5\u05E2 \u05D7\u05D9\u05D5\u05EA")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <ViralShareBar title={`${profile.fullName || t("ProofCraft Builder", "\u05D1\u05D5\u05E0\u05D4 ProofCraft")} - ${t("Verified AI & Fintech Portfolio", "\u05EA\u05D9\u05E7 \u05E2\u05D1\u05D5\u05D3\u05D5\u05EA AI \u05D5\u05E4\u05D9\u05E0\u05D8\u05E7 \u05DE\u05D0\u05D5\u05DE\u05EA")}`} isHe={isHe} compact />
            <Link href="/workspace" className="btn-ghost" style={{ height: 32, fontSize: 12 }}>
              <Layers size={14} /> {t("Edit in Studio", "\u05E2\u05E8\u05D9\u05DB\u05D4 \u05D1\u05E1\u05D8\u05D5\u05D3\u05D9\u05D5")}
            </Link>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {toolsList.map((tl, idx) => (
            <span key={idx} className="badge-pill" style={{ background: "#0a0b0e", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.09)", fontSize: 11 }}>{tl}</span>
          ))}
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: 12 }}>
          <span style={{ color: "#34d399", fontWeight: 800 }}>
            {t(`Verified Production Systems Locked in Portfolio: ${builtCount} of 4 Architecture Tiers`, `\u05DE\u05E2\u05E8\u05DB\u05D5\u05EA \u05D9\u05D9\u05E6\u05D5\u05E8 \u05DE\u05D0\u05D5\u05DE\u05EA\u05D5\u05EA \u05E9\u05E0\u05E2\u05D5\u05DC\u05D5 \u05D1\u05EA\u05D9\u05E7: ${builtCount} \u05DE\u05EA\u05D5\u05DA 4 \u05E8\u05DE\u05D5\u05EA \u05D0\u05E8\u05DB\u05D9\u05D8\u05E7\u05D8\u05D5\u05E8\u05D4`)}
          </span>
          {purchasedLevel < 4 && (
            <Link href="/workspace" style={{ color: "#fbbf24", fontWeight: 800 }}>
              {t("Complete All 4 Systems (v1.0-v4.0)", "\u05D4\u05E9\u05DC\u05DD \u05D0\u05EA \u05DB\u05DC 4 \u05D4\u05DE\u05E2\u05E8\u05DB\u05D5\u05EA (v1.0-v4.0)")}
            </Link>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16, marginBottom: 22 }}>
        {guides.map((guide) => {
          const key = String(guide.level);
          const entry = trackProjects[key];
          const isUnlocked = purchasedLevel >= guide.level;
          return (
            <div key={guide.level} className="card-surface" style={{ padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", border: entry?.url ? "1px solid rgba(52, 211, 153, 0.45)" : isUnlocked ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span className="badge-pill" style={{ fontSize: 10, background: entry?.url ? "rgba(52, 211, 153, 0.16)" : isUnlocked ? "rgba(56, 189, 248, 0.14)" : "rgba(251, 191, 36, 0.14)", color: entry?.url ? "#34d399" : isUnlocked ? "#38bdf8" : "#fbbf24" }}>
                    {entry?.url ? t("Verified Live Deployment", "\u05E4\u05E8\u05D9\u05E1\u05D4 \u05D7\u05D9\u05D4 \u05DE\u05D0\u05D5\u05DE\u05EA\u05EA") : isUnlocked ? t("Unlocked for Submission", "\u05E4\u05EA\u05D5\u05D7 \u05DC\u05D4\u05D2\u05E9\u05D4") : t(`Tier ${guide.level} Preview`, `\u05EA\u05E6\u05D5\u05D2\u05D4 \u05DE\u05E7\u05D3\u05D9\u05DE\u05D4 \u05E8\u05DE\u05D4 ${guide.level}`)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8" }}>v{guide.level}.0</span>
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>{entry?.title || guide.name}</h2>
                <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55, marginBottom: 12 }}>{entry?.summary || guide.concreteDeliverable}</p>
              </div>
              {entry?.url ? (
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ height: 38, fontSize: 12 }}>
                  <span>{t("Open Live Production System", "\u05E4\u05EA\u05D7 \u05DE\u05E2\u05E8\u05DB\u05EA \u05D7\u05D9\u05D4 \u05D1\u05D9\u05D9\u05E6\u05D5\u05E8")}</span>
                  <ExternalLink size={14} />
                </a>
              ) : isUnlocked ? (
                <Link href="/workspace" className="btn-ghost" style={{ height: 38, fontSize: 12 }}>
                  <span>{t("Submit Production URL in Studio", "\u05D4\u05D2\u05E9 \u05E7\u05D9\u05E9\u05D5\u05E8 \u05D9\u05D9\u05E6\u05D5\u05E8 \u05D1\u05E1\u05D8\u05D5\u05D3\u05D9\u05D5")}</span>
                </Link>
              ) : (
                <Link href="/workspace" className="btn-ghost" style={{ height: 38, fontSize: 12, opacity: 0.85 }}>
                  <Lock size={13} />
                  <span>{t(`Unlock Tier ${guide.level} Deliverable`, `\u05E4\u05EA\u05D7 \u05EA\u05D5\u05E6\u05E8 \u05E8\u05DE\u05D4 ${guide.level}`)}</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <VerifiedCredentialCard fullName={profile.fullName} userId={userId} purchasedLevel={purchasedLevel} builtCount={builtCount} adminVerified={profile.adminVerified} isHe={isHe} />
      <VerifiedProofsPanel userId={userId} />
    </div>
  );
}
