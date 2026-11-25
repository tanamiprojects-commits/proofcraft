"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Award, TrendingUp, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";

interface Props {
  userId: string | null;
}

export default function CreatorRankBadge({ userId }: Props) {
  const { isHe } = useStudioLang();
  const [score, setScore] = useState(0);
  const [linksCount, setLinksCount] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [stepsCount, setStepsCount] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const computeRank = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [profRes, linksRes, clicksRes] = await Promise.all([
        supabase.from("profiles").select("completed_step_ids, admin_verified").eq("id", userId).single(),
        supabase.from("aff_links").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("aff_clicks").select("id", { count: "exact", head: true }).eq("user_id", userId)
      ]);

      const steps = Array.isArray(profRes.data?.completed_step_ids) ? profRes.data.completed_step_ids.length : 0;
      const verified = Boolean(profRes.data?.admin_verified);
      const links = linksRes.count || 0;
      const clicks = clicksRes.count || 0;

      const total = (steps * 25) + (links * 15) + (clicks * 2) + (verified ? 100 : 0);
      setStepsCount(steps);
      setIsVerified(verified);
      setLinksCount(links);
      setClicksCount(clicks);
      setScore(total);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    computeRank();
    const onSync = () => computeRank();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [computeRank]);
  if (!userId) return null;

  const tiers = [
    { min: 0, max: 99, titleHe: "יוצר מתחיל (Starter)", titleEn: "Starter Creator", color: "#94a3b8", nextHe: "צבור 100 נקודות לפתיחת דרגת בונה מאומת", nextEn: "Reach 100 pts to unlock Verified Builder" },
    { min: 100, max: 249, titleHe: "בונה מאומת (Verified Builder)", titleEn: "Verified Builder", color: "#38bdf8", nextHe: "צבור 250 נקודות לפתיחת דרגת שותף צמיחה", nextEn: "Reach 250 pts to unlock Growth Partner" },
    { min: 250, max: 499, titleHe: "שותף צמיחה (Growth Partner)", titleEn: "Growth Partner", color: "#34d399", nextHe: "צבור 500 נקודות לדרגת העל Master Architect", nextEn: "Reach 500 pts for Master Architect status" },
    { min: 500, max: 99999, titleHe: "ארכיטקט מערכות על (Master Architect)", titleEn: "Master Systems Architect", color: "#fbbf24", nextHe: "הגעת לדרגה הגבוהה ביותר במערכת!", nextEn: "Maximum platform tier unlocked!" }
  ];

  const current = tiers.find((t) => score >= t.min && score <= t.max) || tiers[0];
  const pct = current.max >= 99999 ? 100 : Math.min(100, Math.round(((score - current.min) / (current.max - current.min + 1)) * 100));

  return (
    <div dir={isHe ? "rtl" : "ltr"} className="card-surface" style={{ padding: 16, marginBottom: 18, border: `1px solid ${current.color}55`, background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.55))" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${current.color}22`, border: `1px solid ${current.color}66`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={20} color={current.color} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc" }}>{isHe ? current.titleHe : current.titleEn}</span>
              {isVerified && (
                <span className="badge-pill" style={{ fontSize: 10, background: "rgba(52,211,153,0.16)", color: "#34d399", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <ShieldCheck size={11} /> {isHe ? "אימות רשמי" : "OFFICIAL"}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? current.nextHe : current.nextEn}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="badge-pill" style={{ fontSize: 12, fontWeight: 900, background: `${current.color}22`, color: current.color }}>
            <Zap size={12} /> {score} {isHe ? "נק׳ עוצמה" : "Proof Pts"}
          </span>
          <button type="button" onClick={computeRank} disabled={loading} className="btn-ghost" style={{ height: 30, padding: "0 8px" }}>
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      <div style={{ width: "100%", height: 7, borderRadius: 99, background: "rgba(15,23,42,0.9)", overflow: "hidden", marginBottom: 10 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: current.color, transition: "width 0.4s ease" }} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11.5, color: "#cbd5e1" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><TrendingUp size={12} color="#38bdf8" /> {isHe ? `שלבי בנייה: ${stepsCount}` : `Verified Steps: ${stepsCount}`}</span>
        <span>•</span>
        <span>{isHe ? `קישורים פעילים: ${linksCount}` : `Active Links: ${linksCount}`}</span>
        <span>•</span>
        <span>{isHe ? `קליקים שנמדדו: ${clicksCount}` : `Tracked Clicks: ${clicksCount}`}</span>
      </div>
    </div>
  );
}