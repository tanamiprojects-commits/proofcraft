"use client";
import React, { useState } from "react";
import { Gift, Copy, CheckCircle2 } from "lucide-react";
import ViralShareBar from "@/components/ViralShareBar";

export default function ReferralRewardCard({ referralCode, isHe }: { referralCode: string; isHe: boolean }) {
  const [copied, setCopied] = useState(false);
  const code = referralCode || "PROOFCRAFT25";
  const inviteUrl = (typeof window !== "undefined" ? window.location.origin : "https://" + "proofcraft-seven.vercel.app") + "/auth?ref=" + encodeURIComponent(code);
  const copyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  return (
    <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 12, background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(56,189,248,0.10))", border: "1px solid rgba(52,211,153,0.32)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Gift size={18} color="#34d399" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#ecfdf5" }}>
            {isHe ? "\u05EA\u05D5\u05DB\u05E0\u05D9\u05EA \u05E9\u05D5\u05EA\u05E4\u05D9\u05DD \u05DC\u05D4\u05D6\u05DE\u05E0\u05EA \u05D7\u05D1\u05E8\u05D9\u05DD (Refer & Earn +25 Boost Credits)" : "Refer & Earn (+25 Boost Credits per Creator)"}
          </div>
          <div style={{ fontSize: 11.5, color: "#94a3b8" }}>
            {isHe ? `\u05E7\u05D5\u05D3 \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05E9\u05DC\u05DA: ${code} \u00B7 \u05E9\u05EA\u05E3 \u05D5\u05E7\u05D1\u05DC \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D7\u05E9\u05D9\u05E4\u05D4 \u05D1\u05E4\u05D9\u05D3` : `Your invite code: ${code} \u00B7 Share to earn instant Feed Boost Credits`}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={copyInvite} className="btn-ghost" style={{ height: 34, fontSize: 12, padding: "0 12px" }}>
          {copied ? <CheckCircle2 size={14} color="#34d399" /> : <Copy size={14} />}
          <span>{copied ? (isHe ? "\u05D4\u05D5\u05E2\u05EA\u05E7!" : "Copied!") : (isHe ? "\u05D4\u05E2\u05EA\u05E7 \u05E7\u05D9\u05E9\u05D5\u05E8 \u05D4\u05D6\u05DE\u05E0\u05D4" : "Copy Invite Link")}</span>
        </button>
        <ViralShareBar url={inviteUrl} title="Join ProofCraft Fintech OS & Unlock +25 Boost Credits" isHe={isHe} compact />
      </div>
    </div>
  );
}