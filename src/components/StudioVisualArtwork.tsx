"use client";

import React from "react";

interface ArtworkProps {
  variant: "home" | "method" | "workspace" | "toolkit" | "feed" | "portfolio" | "affiliate";
}

const THEMES: Record<
  ArtworkProps["variant"],
  {
    badge: string;
    title: string;
    subtitle: string;
    primaryGlow: string;
    secondaryGlow: string;
    accentHex: string;
    stat1Label: string;
    stat1Val: string;
    stat2Label: string;
    stat2Val: string;
  }
> = {
  home: {
    badge: "PROOF-CRAFT STUDIO OS",
    title: "v1.0 → v4.0 Production",
    subtitle: "Verified Engineering & Live Deployment",
    primaryGlow: "rgba(16, 185, 129, 0.28)",
    secondaryGlow: "rgba(2, 132, 199, 0.26)",
    accentHex: "#34d399",
    stat1Label: "אבטחה והצפנה",
    stat1Val: "RLS + HMAC",
    stat2Label: "תיק עבודות",
    stat2Val: "4 מסלולי פיתוח",
  },
  method: {
    badge: "PROMPT & TERMINAL VAULT",
    title: "Zero-Secret Architecture",
    subtitle: "8-Stage Execution & Output Showcase",
    primaryGlow: "rgba(129, 140, 248, 0.3)",
    secondaryGlow: "rgba(192, 132, 252, 0.22)",
    accentHex: "#a78bfa",
    stat1Label: "ENV GUARD",
    stat1Val: "SERVER-ONLY",
    stat2Label: "WORKFLOW",
    stat2Val: "8 STAGES",
  },
  workspace: {
    badge: "MILESTONE EXECUTION ROOM",
    title: "Proof-of-Execution Engine",
    subtitle: "Anti-Cheat Rubric & Live Artifact Check",
    primaryGlow: "rgba(245, 158, 11, 0.28)",
    secondaryGlow: "rgba(56, 189, 248, 0.24)",
    accentHex: "#fbbf24",
    stat1Label: "VERIFICATION",
    stat1Val: "RUBRIC GATE",
    stat2Label: "FREE START",
    stat2Val: "TRACK 1 ($0)",
  },
  toolkit: {
    badge: "מחסנית כלי AI וענן מאומתים",
    title: "32 אינטגרציות ייצור מאומתות",
    subtitle: "Curated Infrastructure & Prompt Sync",
    primaryGlow: "rgba(6, 182, 212, 0.28)",
    secondaryGlow: "rgba(52, 211, 153, 0.22)",
    accentHex: "#22d3ee",
    stat1Label: "קטלוג",
    stat1Val: "32 כלים",
    stat2Label: "סנכרון",
    stat2Val: "פרופיל חי",
  },
  feed: {
    badge: "ORGANIC GROWTH & ANALYTICS",
    title: "Multi-Channel Launchpad",
    subtitle: "GA-Grade Telemetry & Admin Quote Gate",
    primaryGlow: "rgba(251, 113, 133, 0.28)",
    secondaryGlow: "rgba(251, 191, 36, 0.24)",
    accentHex: "#fb7185",
    stat1Label: "TELEMETRY",
    stat1Val: "CTR & LEADS",
    stat2Label: "MODERATION",
    stat2Val: "ADMIN VERIFIED",
  },
      affiliate: {
      badge: "VERIFIED AFFILIATE & SMART DEAL OS",
      title: "Smart Edge Links & Multi-Channel Ads",
      subtitle: "Edge 302 Telemetry · FTC & Amazon Compliant",
      primaryGlow: "rgba(52, 211, 153, 0.25)",
      secondaryGlow: "rgba(56, 189, 248, 0.2)",
      accentHex: "#34d399",
      stat1Label: "ROUTING",
      stat1Val: "EDGE 302",
      stat2Label: "COMPLIANCE",
      stat2Val: "VERIFIED SAFE",
    },
    portfolio: {
    badge: "CERTIFIED BUILDER CREDENTIAL",
    title: "Live Proof-of-Work",
    subtitle: "Cryptographic Case Studies & Deployed Apps",
    primaryGlow: "rgba(52, 211, 153, 0.28)",
    secondaryGlow: "rgba(99, 102, 241, 0.26)",
    accentHex: "#34d399",
    stat1Label: "STATUS",
    stat1Val: "PUBLIC HTTPS",
    stat2Label: "PROOFS",
    stat2Val: "VERIFIED LOGS",
  },
};

export default function StudioVisualArtwork({ variant }: ArtworkProps) {
  const t = THEMES[variant] || THEMES.home;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        padding: "20px 22px",
        marginBottom: 20,
        background: `radial-gradient(circle at 85% 20%, ${t.primaryGlow}, transparent 55%), radial-gradient(circle at 15% 85%, ${t.secondaryGlow}, transparent 55%), #0c0e14`,
        border: "1px solid rgba(255, 255, 255, 0.11)",
        boxShadow: "0 18px 40px -15px rgba(0, 0, 0, 0.65)",
      }}
    >
      {/* Subtle Tech Dot Matrix Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        {/* Left/Start Identity & 3D Isometric Node */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${t.accentHex}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 24px ${t.primaryGlow}`,
              flexShrink: 0,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <polygon points="18,4 32,11 18,18 4,11" fill={`${t.accentHex}33`} stroke={t.accentHex} strokeWidth="1.8" />
              <polyline points="4,18 18,25 32,18" stroke="#38bdf8" strokeWidth="1.8" fill="none" />
              <polyline points="4,25 18,32 32,25" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${t.accentHex}44`,
                color: t.accentHex,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.06em",
                marginBottom: 5,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.accentHex }} />
              {t.badge}
            </div>
            <div style={{ fontSize: 19, fontWeight: 900, color: "#f8fafc", letterSpacing: "-0.3px" }}>{t.title}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{t.subtitle}</div>
          </div>
        </div>

        {/* Right/End Floating Glass Telemetry Pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ padding: "8px 14px", borderRadius: 12, background: "rgba(10, 11, 14, 0.72)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.05em" }}>{t.stat1Label}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: t.accentHex }}>{t.stat1Val}</div>
          </div>
          <div style={{ padding: "8px 14px", borderRadius: 12, background: "rgba(10, 11, 14, 0.72)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.05em" }}>{t.stat2Label}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#f8fafc" }}>{t.stat2Val}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
