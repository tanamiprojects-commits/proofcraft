"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Award, ExternalLink, Lock, Share2, ShieldCheck, Layers } from "lucide-react";
import { getActiveUserProfile, TrackProjectEntry } from "@/lib/cloud-store";
import { BuilderProfile, DEFAULT_PROFILE } from "@/lib/proofcraft-store";
import { STRATEGIC_TRACK_GUIDES } from "@/lib/plg-career-strategy";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";
import VerifiedProofsPanel from "@/components/VerifiedProofsPanel";

export default function LivePortfolioPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<BuilderProfile>(DEFAULT_PROFILE);
  const [trackProjects, setTrackProjects] = useState<Record<string, TrackProjectEntry>>({});
  const [purchasedLevel, setPurchasedLevel] = useState<number>(1);
  const [toast, setToast] = useState<string>("");

  const showMsg = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3200); };

  useEffect(() => {
    getActiveUserProfile().then((res) => {
      setUserId(res.userId);
      setProfile(res.profile);
      setTrackProjects(res.trackProjects || {});
      setPurchasedLevel(res.purchasedTrackLevel || 1);
    });
  }, []);

  const builtCount = ["1", "2", "3", "4"].filter((k) => Boolean(trackProjects[k]?.url)).length;
  const toolsList = (profile.primaryTools || "Next.js, TypeScript, Supabase, Vercel").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div dir="ltr" style={{ textAlign: "left" }}>
      <StudioVisualArtwork variant="portfolio" />

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      <div className="card-hero" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc" }}>{profile.fullName || "Independent AI Systems Builder"}</h1>
              <span className="badge-pill" style={{
                fontSize: 11,
                background: profile.adminVerified ? "rgba(52, 211, 153, 0.16)" : "rgba(56, 189, 248, 0.16)",
                color: profile.adminVerified ? "#34d399" : "#38bdf8",
                border: `1px solid ${profile.adminVerified ? "rgba(52, 211, 153, 0.4)" : "rgba(56, 189, 248, 0.35)"}`
              }}>
                {profile.adminVerified ? <><Award size={12} /> Certified Graduate</> : <><ShieldCheck size={12} /> ProofCraft Verified Builder</>}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.5 }}>{profile.headline || "AI Product Engineer & Business Automation Architect — Backed by Live Execution Proof"}</p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(window.location.href); showMsg("Verified portfolio URL copied to clipboard!"); }}
              className="btn-primary"
              style={{ width: "auto", height: 38, fontSize: 12 }}
            >
              <Share2 size={14} /> Share Portfolio
            </button>
            <Link href="/workspace" className="btn-ghost" style={{ height: 38, fontSize: 12 }}>
              <Layers size={14} /> Edit in Studio
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {toolsList.map((tl, idx) => (
            <span key={idx} className="badge-pill" style={{ background: "#0a0b0e", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.09)", fontSize: 11 }}>
              {tl}
            </span>
          ))}
        </div>

        <div style={{ padding: "10px 14px", borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: 12 }}>
          <span style={{ color: "#34d399", fontWeight: 800 }}>Verified Production Systems Locked in Portfolio: {builtCount} of 4 Architecture Tiers</span>
          {purchasedLevel < 4 && (
            <Link href="/workspace" style={{ color: "#fbbf24", fontWeight: 800 }}>
              Complete All 4 Systems (v1.0–v4.0) →
            </Link>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16, marginBottom: 22 }}>
        {STRATEGIC_TRACK_GUIDES.map((guide) => {
          const key = String(guide.level);
          const entry = trackProjects[key];
          const isUnlocked = purchasedLevel >= guide.level;

          return (
            <div
              key={guide.level}
              className="card-surface"
              style={{
                padding: 18,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: entry?.url ? "1px solid rgba(52, 211, 153, 0.45)" : isUnlocked ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span className="badge-pill" style={{
                    fontSize: 10,
                    background: entry?.url ? "rgba(52, 211, 153, 0.16)" : isUnlocked ? "rgba(56, 189, 248, 0.14)" : "rgba(251, 191, 36, 0.14)",
                    color: entry?.url ? "#34d399" : isUnlocked ? "#38bdf8" : "#fbbf24"
                  }}>
                    {entry?.url ? "Verified Live Deployment" : isUnlocked ? "Unlocked for Submission" : `Tier ${guide.level} · Strategic Preview`}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8" }}>v{guide.level}.0</span>
                </div>

                <h2 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>
                  {entry?.title || guide.name}
                </h2>
                <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55, marginBottom: 12 }}>
                  {entry?.summary || guide.concreteDeliverable}
                </p>
              </div>

              {entry?.url ? (
                <a href={entry.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ height: 38, fontSize: 12 }}>
                  <span>Open Live Production System</span>
                  <ExternalLink size={14} />
                </a>
              ) : isUnlocked ? (
                <Link href="/workspace" className="btn-ghost" style={{ height: 38, fontSize: 12 }}>
                  <span>Submit Production URL in Studio</span>
                </Link>
              ) : (
                <Link href="/workspace" className="btn-ghost" style={{ height: 38, fontSize: 12, opacity: 0.85 }}>
                  <Lock size={13} />
                  <span>Unlock Tier {guide.level} Deliverable</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <VerifiedProofsPanel userId={userId} />
    </div>
  );
}
