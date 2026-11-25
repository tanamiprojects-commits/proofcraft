"use client";
import React, { useState } from "react";
import { Award, Printer, Code2, CheckCircle2, ShieldCheck } from "lucide-react";

interface Props {
  fullName: string;
  userId: string | null;
  purchasedLevel: number;
  builtCount: number;
  adminVerified?: boolean;
  isHe?: boolean;
}

export default function VerifiedCredentialCard({ fullName, userId, purchasedLevel, builtCount, adminVerified, isHe = false }: Props) {
  const [copiedBadge, setCopiedBadge] = useState(false);

  const tierNamesEn: Record<number, string> = {
    1: "Junior AI Builder (v1.0)",
    2: "Full-Stack AI Builder (v2.0)",
    3: "Systems & Web3 Architect (v3.0)",
    4: "Senior AI Systems Architect (v4.0)",
  };
  const tierNamesHe: Record<number, string> = {
    1: "\u05D1\u05D5\u05E0\u05D4 AI \u05DE\u05EA\u05D7\u05D9\u05DC (v1.0)",
    2: "\u05DE\u05D4\u05E0\u05D3\u05E1 AI Full-Stack (v2.0)",
    3: "\u05D0\u05E8\u05DB\u05D9\u05D8\u05E7\u05D8 \u05DE\u05E2\u05E8\u05DB\u05D5\u05EA \u05D5-Web3 (v3.0)",
    4: "\u05D0\u05E8\u05DB\u05D9\u05D8\u05E7\u05D8 \u05DE\u05E2\u05E8\u05DB\u05D5\u05EA AI \u05D1\u05DB\u05D9\u05E8 (v4.0)",
  };

  const shortHash = (userId || "PROOFCRAFT").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
  const credentialId = `PC-${shortHash}-V${purchasedLevel}`;
  const displayName = fullName || (isHe ? "\u05D1\u05D5\u05E0\u05D4 \u05DE\u05E2\u05E8\u05DB\u05D5\u05EA AI \u05E2\u05E6\u05DE\u05D0\u05D9" : "Independent AI Systems Builder");
  const tierMap = isHe ? tierNamesHe : tierNamesEn;
  const tierLabel = tierMap[purchasedLevel] || tierMap[1];

  const copyMarkdownBadge = () => {
    const pageUrl = typeof window !== "undefined" ? window.location.href : "https://" + "studio.tanami360.com";
    const md = `[![ProofCraft Verified AI Engineer](https://shields.io{encodeURIComponent(credentialId)}-10b981?style=for-the-badge&logo=vercel)](${pageUrl})`;
    navigator.clipboard.writeText(md);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2400);
  };

  return (
    <div
      dir={isHe ? "rtl" : "ltr"}
      className="card-hero"
      style={{
        padding: 22,
        marginBottom: 22,
        textAlign: isHe ? "right" : "left",
        background: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(16,185,129,0.10))",
        border: "1px solid rgba(52,211,153,0.38)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(52,211,153,0.16)", border: "1px solid rgba(52,211,153,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={22} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: isHe ? 0 : 1, color: "#34d399", textTransform: "uppercase" }}>
              {isHe ? "\u05EA\u05E2\u05D5\u05D3\u05EA \u05D4\u05E1\u05DE\u05DB\u05D4 \u05E8\u05E9\u05DE\u05D9\u05EA \u05DE\u05D0\u05D5\u05DE\u05EA\u05EA" : "Official Proof-of-Execution Credential"}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", margin: 0 }}>
              {tierLabel}
            </h2>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={copyMarkdownBadge} className="btn-ghost" style={{ height: 34, fontSize: 12 }}>
            {copiedBadge ? <CheckCircle2 size={14} color="#34d399" /> : <Code2 size={14} />}
            <span>
              {copiedBadge
                ? (isHe ? "\u05EA\u05D2 \u05D4\u05D4\u05D8\u05DE\u05E2\u05D4 \u05D4\u05D5\u05E2\u05EA\u05E7!" : "GitHub Badge Copied!")
                : (isHe ? "\u05D4\u05E2\u05EA\u05E7 \u05EA\u05D2 \u05DC-GitHub / LinkedIn" : "Copy GitHub / README Badge")}
            </span>
          </button>
          <button type="button" onClick={() => window.print()} className="btn-primary" style={{ width: "auto", height: 34, fontSize: 12, padding: "0 14px" }}>
            <Printer size={14} />
            <span>{isHe ? "\u05D4\u05D3\u05E4\u05E1\u05D4 / \u05E9\u05DE\u05D9\u05E8\u05EA PDF" : "Print / Save PDF"}</span>
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, padding: 14, borderRadius: 12, background: "rgba(10,11,14,0.75)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <div style={{ fontSize: 10.5, color: "#94a3b8", textTransform: "uppercase" }}>{isHe ? "\u05DE\u05D5\u05E2\u05E0\u05E7 \u05DC" : "Issued To"}</div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: "#f8fafc", marginTop: 2 }}>{displayName}</div>
        </div>
        <div>
          <div style={{ fontSize: 10.5, color: "#94a3b8", textTransform: "uppercase" }}>{isHe ? "\u05DE\u05D6\u05D4\u05D4 \u05EA\u05E2\u05D5\u05D3\u05D4" : "Credential ID"}</div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: "#38bdf8", fontFamily: "monospace", marginTop: 2 }}>{credentialId}</div>
        </div>
        <div>
          <div style={{ fontSize: 10.5, color: "#94a3b8", textTransform: "uppercase" }}>{isHe ? "\u05DE\u05E2\u05E8\u05DB\u05D5\u05EA \u05D7\u05D9\u05D5\u05EA \u05DE\u05D0\u05D5\u05DE\u05EA\u05D5\u05EA" : "Live Systems Locked"}</div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: "#34d399", marginTop: 2 }}>
            {isHe ? `${builtCount} \u05DE\u05EA\u05D5\u05DA 4 \u05E8\u05DE\u05D5\u05EA \u05D9\u05D9\u05E6\u05D5\u05E8` : `${builtCount} / 4 Production Tiers`}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10.5, color: "#94a3b8", textTransform: "uppercase" }}>{isHe ? "\u05E1\u05D8\u05D8\u05D5\u05E1 \u05D0\u05D9\u05DE\u05D5\u05EA" : "Verification Status"}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: adminVerified ? "#34d399" : "#fbbf24", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
            <ShieldCheck size={14} />
            {adminVerified
              ? (isHe ? "\u05DE\u05D0\u05D5\u05DE\u05EA \u05D5\u05DE\u05D5\u05E1\u05DE\u05DA \u05D0\u05D3\u05DE\u05D9\u05DF" : "Admin Audited & Certified")
              : (isHe ? "\u05DE\u05E2\u05D5\u05D2\u05DF \u05E7\u05E8\u05D9\u05E4\u05D8\u05D5\u05D2\u05E8\u05E4\u05D9\u05EA" : "Cryptographically Anchored")}
          </div>
        </div>
      </div>
    </div>
  );
}