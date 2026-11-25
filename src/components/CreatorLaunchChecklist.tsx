"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Rocket, ArrowRight, ArrowLeft } from "lucide-react";

interface Props {
  hasName: boolean;
  linksCount: number;
  builtCount: number;
  credits: number;
  isHe: boolean;
}

export default function CreatorLaunchChecklist({ hasName, linksCount, builtCount, credits, isHe }: Props) {
  const steps = [
    {
      done: hasName,
      title: isHe ? "1. \u05D4\u05E9\u05DC\u05DE\u05EA \u05E4\u05E8\u05D5\u05E4\u05D9\u05DC \u05D9\u05D5\u05E6\u05E8 \u05DE\u05D0\u05D5\u05DE\u05EA" : "1. Complete Verified Creator Profile",
      href: "/portfolio/live",
      cta: isHe ? "\u05E4\u05D5\u05E8\u05D8\u05E4\u05D5\u05DC\u05D9\u05D5" : "Portfolio",
    },
    {
      done: linksCount > 0,
      title: isHe ? "2. \u05E4\u05E8\u05E1\u05D5\u05DD \u05E7\u05D9\u05E9\u05D5\u05E8 \u05E9\u05D5\u05EA\u05E4\u05D9\u05DD \u05D7\u05DB\u05DD \u05E8\u05D0\u05E9\u05D5\u05DF" : "2. Publish First Smart Affiliate Link",
      href: "/affiliate",
      cta: isHe ? "\u05DE\u05E8\u05DB\u05D6 \u05E9\u05D5\u05EA\u05E4\u05D9\u05DD" : "Affiliate Hub",
    },
    {
      done: builtCount > 0,
      title: isHe ? "3. \u05E0\u05E2\u05D9\u05DC\u05EA \u05DE\u05E2\u05E8\u05DB\u05EA AI \u05D7\u05D9\u05D4 \u05D1\u05E1\u05D8\u05D5\u05D3\u05D9\u05D5" : "3. Lock Live AI Deployment in Studio",
      href: "/workspace",
      cta: isHe ? "\u05E1\u05D8\u05D5\u05D3\u05D9\u05D5" : "Studio",
    },
    {
      done: credits > 10,
      title: isHe ? "4. \u05E6\u05D1\u05D9\u05E8\u05EA \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D7\u05E9\u05D9\u05E4\u05D4 (+25 \u05D4\u05D6\u05DE\u05E0\u05EA \u05D7\u05D1\u05E8 / \u05E7\u05D9\u05D3\u05D5\u05DD \u05E4\u05D9\u05D3)" : "4. Earn Boost Credits (+25 Referral / Feed Boost)",
      href: "/feed",
      cta: isHe ? "\u05E4\u05D9\u05D3 \u05E7\u05D4\u05D9\u05DC\u05D4" : "Feed Wall",
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);
  if (completed === steps.length) return null;

  return (
    <div dir={isHe ? "rtl" : "ltr"} className="card-surface" style={{ padding: 16, marginBottom: 16, textAlign: isHe ? "right" : "left", border: "1px solid rgba(52,211,153,0.3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Rocket size={16} color="#34d399" />
          <strong style={{ fontSize: 13.5, color: "#f8fafc" }}>
            {isHe ? "\u05DE\u05E1\u05DC\u05D5\u05DC \u05D4\u05E9\u05E7\u05D4 \u05DE\u05D4\u05D9\u05E8\u05D4 \u05DC\u05D9\u05D5\u05E6\u05E8" : "Creator Quick-Launch Readiness"}
          </strong>
        </div>
        <span className="badge-pill" style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 11, fontWeight: 800 }}>
          {completed}/{steps.length} ({pct}%)
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: "rgba(15,23,42,0.9)", overflow: "hidden", marginBottom: 12 }}>
        <div style={{ width: `${Math.max(12, pct)}%`, height: "100%", background: "linear-gradient(90deg, #38bdf8, #34d399)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
        {steps.map((st, i) => (
          <div key={i} style={{ padding: "8px 10px", borderRadius: 9, background: "rgba(15,23,42,0.72)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: st.done ? "#94a3b8" : "#f8fafc", textDecoration: st.done ? "line-through" : "none" }}>
              {st.done ? <CheckCircle2 size={14} color="#34d399" /> : <Circle size={14} color="#38bdf8" />}
              <span>{st.title}</span>
            </div>
            {!st.done && (
              <Link href={st.href} style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
                <span>{st.cta}</span>
                {isHe ? <ArrowLeft size={11} /> : <ArrowRight size={11} />}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}