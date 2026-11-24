"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, ShieldCheck, UserPlus, ArrowRight } from "lucide-react";
import { STRATEGIC_TRACK_GUIDES } from "@/lib/plg-career-strategy";
import { getActiveUserProfile, TrackProjectEntry } from "@/lib/cloud-store";
import { BuilderProfile, DEFAULT_PROFILE } from "@/lib/proofcraft-store";
import Track1AcademyStudio from "@/components/Track1AcademyStudio";
import Track2AcademyStudio from "@/components/Track2AcademyStudio";
import Track3AcademyStudio from "@/components/Track3AcademyStudio";
import Track4AcademyStudio from "@/components/Track4AcademyStudio";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";

export default function WorkspacePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<BuilderProfile>(DEFAULT_PROFILE);
  const [trackProjects, setTrackProjects] = useState<Record<string, TrackProjectEntry>>({});
  const [purchasedLevel, setPurchasedLevel] = useState<number>(1);
  const [totalPaidIls, setTotalPaidIls] = useState<number>(0);
  const [selectedTrack, setSelectedTrack] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string>("");

  const showNotify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3200); };

  useEffect(() => {
    getActiveUserProfile().then((res) => {
      setUserId(res.userId);
      setProfile(res.profile);
      setTrackProjects(res.trackProjects || {});
      const lvl = res.purchasedTrackLevel || 1;
      setPurchasedLevel(lvl);
      setTotalPaidIls(res.totalPaidIls || 0);
      setSelectedTrack(lvl);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>Loading Production Studio...</div>;

  const activeGuide = STRATEGIC_TRACK_GUIDES.find((g) => g.level === selectedTrack) || STRATEGIC_TRACK_GUIDES[0];
  const isTrackUnlocked = purchasedLevel >= selectedTrack;
  const deltaPrice = Math.max(0, activeGuide.priceIls - totalPaidIls);

  return (
    <div dir="ltr" style={{ textAlign: "left" }}>
      <StudioVisualArtwork variant="workspace" />

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      <div className="card-hero" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc" }}>AI Engineering & Asset Production Studio</h1>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>
              Track 1 is 100% free to build your profile & v1.0 portfolio · Tracks 2–4 include full strategic previews & upgrade-delta pricing
            </p>
          </div>
          {!userId ? (
            <Link href="/auth" className="btn-primary" style={{ width: "auto", height: 38, fontSize: 12 }}>
              <UserPlus size={14} /> Free Sign Up to Save Portfolio
            </Link>
          ) : (
            <Link href="/portfolio/live" className="btn-ghost" style={{ height: 36, fontSize: 12, color: "#38bdf8" }}>
              <ShieldCheck size={14} /> View Public Verified Portfolio
            </Link>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
          {STRATEGIC_TRACK_GUIDES.map((tr) => {
            const unlocked = purchasedLevel >= tr.level;
            const active = selectedTrack === tr.level;
            return (
              <button
                key={tr.level}
                type="button"
                onClick={() => setSelectedTrack(tr.level)}
                style={{
                  padding: "11px 12px", borderRadius: 12, textAlign: "left", cursor: "pointer",
                  background: active ? "rgba(56, 189, 248, 0.16)" : "#0a0b0e",
                  border: `1px solid ${active ? "#38bdf8" : tr.highlightFlagship ? "rgba(251, 191, 36, 0.35)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: unlocked ? "#34d399" : tr.highlightFlagship ? "#fbbf24" : "#94a3b8" }}>
                    {unlocked ? "UNLOCKED" : tr.highlightFlagship ? "FLAGSHIP (4 BUILDS)" : "STRATEGIC PREVIEW"}
                  </span>
                  <span className="tabular-nums" style={{ fontSize: 11, fontWeight: 800, color: "#f8fafc" }}>
                    {tr.priceIls === 0 ? "FREE" : unlocked ? "" : `$${Math.max(0, tr.priceIls - totalPaidIls)}`}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc" }}>{tr.name}</div>
              </button>
            );
          })}
        </div>
      </div>
      {!userId && selectedTrack === 1 && (
        <div className="card-surface" style={{ padding: 14, marginBottom: 16, border: "1px solid rgba(52, 211, 153, 0.4)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12, color: "#cbd5e1" }}>
            <strong style={{ color: "#34d399" }}>Open Sandbox Mode (Track 1):</strong> Explore all lessons and builder tools right now. Create a free account to lock your verified portfolio in the cloud.
          </div>
          <Link href="/auth" className="btn-ghost" style={{ height: 34, fontSize: 11, color: "#34d399" }}>
            Create Free Account <ArrowRight size={13} />
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
              <Lock size={13} /> Strategic Tier Preview · {activeGuide.badge}
            </span>
            <span className="tabular-nums" style={{ fontSize: 18, fontWeight: 900, color: "#34d399" }}>
              Upgrade-Delta Price: ${deltaPrice}
            </span>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{activeGuide.name}</h2>
          <p style={{ fontSize: 14, color: "#38bdf8", fontWeight: 700, marginBottom: 16 }}>{activeGuide.tagline}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 18 }}>
            <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#34d399", marginBottom: 4 }}>Target Builder Profile</div>
              <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>{activeGuide.whoIsItFor}</p>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#38bdf8", marginBottom: 4 }}>Portfolio Deliverable Unlocked</div>
              <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>{activeGuide.concreteDeliverable}</p>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>Career & Client Impact</div>
              <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>{activeGuide.careerAndMarketImpact}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/auth" className="btn-primary" style={{ width: "auto", padding: "0 20px" }}>
              Unlock Track {activeGuide.level} (${deltaPrice} Upgrade-Delta) <ArrowRight size={15} />
            </Link>
            <button type="button" onClick={() => setSelectedTrack(1)} className="btn-ghost" style={{ padding: "0 16px" }}>
              Return to Free Track 1
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
