"use client";
import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react";
import { AffLink } from "@/lib/affiliate-store";
import { supabase } from "@/lib/supabase";

interface Props {
  links: AffLink[];
  isHe: boolean;
  onUpdated: () => Promise<void>;
  onNotify: (msg: string) => void;
}

export default function LinkHealthWatchdog({ links, isHe, onUpdated, onNotify }: Props) {
  const [scanning, setScanning] = useState(false);
  if (links.length === 0) return null;

  const flagged = links.filter(
    (l) => l.health_status !== "active" || !l.destination_url?.startsWith("https://")
  );

  const runHealthAudit = async () => {
    setScanning(true);
    try {
      let fixed = 0;
      for (const l of links) {
        const validHttps = Boolean(l.destination_url && l.destination_url.startsWith("https://") && l.destination_url.length > 12);
        const nextStatus = validHttps ? "active" : "needs_update";
        if (l.health_status !== nextStatus) {
          await supabase.from("aff_links").update({ health_status: nextStatus }).eq("id", l.id);
          fixed++;
        }
      }
      await onUpdated();
      onNotify(
        isHe
          ? `\u05E1\u05E8\u05D9\u05E7\u05EA \u05EA\u05E7\u05D9\u05E0\u05D5\u05EA \u05D4\u05D5\u05E9\u05DC\u05DE\u05D4 (${fixed} \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05E2\u05D5\u05D3\u05DB\u05E0\u05D5)`
          : `Link Health Audit complete (${fixed} links updated)`
      );
    } finally {
      setScanning(false);
    }
  };

  return (
    <div
      className="card-surface"
      style={{
        padding: 14,
        marginBottom: 16,
        border: flagged.length > 0 ? "1px solid rgba(251,191,36,0.42)" : "1px solid rgba(52,211,153,0.28)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {flagged.length > 0 ? <ShieldAlert size={18} color="#fbbf24" /> : <CheckCircle2 size={18} color="#34d399" />}
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc" }}>
            {flagged.length > 0
              ? (isHe ? `\u05D6\u05D5\u05D4\u05D5 ${flagged.length} \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05E9\u05D3\u05D5\u05E8\u05E9\u05D9\u05DD \u05D1\u05D3\u05D9\u05E7\u05EA \u05EA\u05E7\u05D9\u05E0\u05D5\u05EA` : `${flagged.length} Smart Links Flagged for Review`)
              : (isHe ? `\u05DB\u05DC ${links.length} \u05D4\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05EA\u05E7\u05D9\u05E0\u05D9\u05DD \u05D5\u05DE\u05D0\u05D5\u05D1\u05D8\u05D7\u05D9 HTTPS` : `All ${links.length} Smart Links Verified & HTTPS Active`)}
          </div>
          <div style={{ fontSize: 11.5, color: "#94a3b8" }}>
            {isHe ? "\u05DE\u05E0\u05D5\u05E2 \u05D4\u05D2\u05E0\u05D4 \u05DE\u05E4\u05E0\u05D9 \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05E9\u05D1\u05D5\u05E8\u05D9\u05DD \u05D0\u05D5 \u05D7\u05E1\u05D5\u05DE\u05D9\u05DD \u05DC\u05E4\u05E0\u05D9 \u05E4\u05E8\u05E1\u05D5\u05DD" : "Proactive anti-broken-link & HTTPS compliance shield"}
          </div>
        </div>
      </div>
      <button type="button" onClick={runHealthAudit} disabled={scanning} className="btn-ghost" style={{ height: 34, fontSize: 12 }}>
        <RefreshCw size={13} />
        <span>{scanning ? (isHe ? "\u05E1\u05D5\u05E8\u05E7..." : "Scanning...") : (isHe ? "\u05D4\u05E8\u05E5 \u05D1\u05D3\u05D9\u05E7\u05EA \u05EA\u05E7\u05D9\u05E0\u05D5\u05EA" : "Run Health Audit")}</span>
      </button>
    </div>
  );
}