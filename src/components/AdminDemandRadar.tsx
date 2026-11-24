"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Download, CheckCircle2, Clock, Sparkles, Globe, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface UpgradeIntentRow {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  market_region: string;
  target_tier: number;
  intent_type: string;
  quoted_usd: number;
  quoted_ils: number;
  note: string;
  status: string;
  created_at: string;
}

export default function AdminDemandRadar({ onGrantTier }: { onGrantTier?: (userId: string, tier: number) => Promise<void> }) {
  const [intents, setIntents] = useState<UpgradeIntentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [quotaTargetCount, setQuotaTargetCount] = useState<number>(15);
  const [quotaTargetUsd, setQuotaTargetUsd] = useState<number>(1000);
  const [marketFilter, setMarketFilter] = useState<"ALL" | "ISRAEL" | "GLOBAL">("ALL");

  const loadIntents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("upgrade_intents")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setIntents(data as UpgradeIntentRow[]);
    setLoading(false);
  };

  useEffect(() => {
    loadIntents();
  }, []);

  const filtered = intents.filter((i) => marketFilter === "ALL" || i.market_region === marketFilter);
  const totalLeads = intents.length;
  const founderLocks = intents.filter((i) => i.intent_type === "founder_reservation").length;
  const pipelineUsd = intents.reduce((acc, i) => acc + (i.quoted_usd || 0), 0);
  const pipelineIls = intents.reduce((acc, i) => acc + (i.quoted_ils || 0), 0);

  const countPct = Math.min(100, Math.round((totalLeads / Math.max(1, quotaTargetCount)) * 100));
  const usdPct = Math.min(100, Math.round((pipelineUsd / Math.max(1, quotaTargetUsd)) * 100));
  const launchReady = totalLeads >= quotaTargetCount || pipelineUsd >= quotaTargetUsd;

  const exportCsv = () => {
    const headers = ["Date", "Name", "Email", "Market", "Target Tier", "Intent Type", "Quoted USD", "Quoted ILS", "Status", "Note"];
    const rows = filtered.map((r) => [
      new Date(r.created_at).toISOString().slice(0, 10),
      `"${(r.full_name || "").replace(/"/g, '""')}"`,
      r.email,
      r.market_region,
      `v${r.target_tier}.0`,
      r.intent_type,
      r.quoted_usd,
      r.quoted_ils,
      r.status,
      `"${(r.note || "").replace(/"/g, '""')}"`,
    ].join(","));
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proofcraft-demand-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };
  return (
    <div className="card-hero" style={{ padding: 20, marginBottom: 20, border: launchReady ? "1px solid rgba(52, 211, 153, 0.55)" : "1px solid rgba(251, 191, 36, 0.35)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div>
          <span className="badge-pill" style={{ background: launchReady ? "rgba(52,211,153,0.16)" : "rgba(251,191,36,0.16)", color: launchReady ? "#34d399" : "#fbbf24", fontSize: 11, marginBottom: 6 }}>
            <TrendingUp size={13} /> {launchReady ? "LAUNCH QUOTA REACHED · READY FOR LIVE CHECKOUT" : "DEMAND VALIDATION RADAR · $0 COLLECTED / ZERO TAX IMPACT"}
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc" }}>Upgrade Demand & Commercial Launch Gate</h2>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={loadIntents} className="btn-ghost" style={{ height: 34, fontSize: 11 }}>Refresh</button>
          <button type="button" onClick={exportCsv} className="btn-primary" style={{ width: "auto", height: 34, fontSize: 11, background: "#38bdf8", color: "#0a0b0e" }}>
            <Download size={13} /> Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 16 }}>
        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>TOTAL DEMAND SIGNALS</div>
          <div className="tabular-nums" style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc" }}>{totalLeads} / {quotaTargetCount}</div>
          <div style={{ fontSize: 11, color: "#38bdf8" }}>{founderLocks} Founder Price Locks</div>
        </div>
        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>VALIDATED PIPELINE (USD)</div>
          <div className="tabular-nums" style={{ fontSize: 22, fontWeight: 900, color: "#34d399" }}>${pipelineUsd.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Target Gate: ${quotaTargetUsd.toLocaleString()}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>LOCAL MARKET PIPELINE (ILS)</div>
          <div className="tabular-nums" style={{ fontSize: 22, fontWeight: 900, color: "#fbbf24" }}>₪{pipelineIls.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{intents.filter((i) => i.market_region === "ISRAEL").length} Israel · {intents.filter((i) => i.market_region === "GLOBAL").length} Global</div>
        </div>
        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>SET LAUNCH QUOTA GATE</div>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="number" min={1} value={quotaTargetCount} onChange={(e) => setQuotaTargetCount(Number(e.target.value) || 1)} title="Target Lead Count" className="input-dark" style={{ width: "50%", height: 32, padding: "4px 8px", fontSize: 12 }} />
            <input type="number" min={50} step={50} value={quotaTargetUsd} onChange={(e) => setQuotaTargetUsd(Number(e.target.value) || 50)} title="Target USD Pipeline" className="input-dark" style={{ width: "50%", height: 32, padding: "4px 8px", fontSize: 12 }} />
          </div>
        </div>
      </div>

      {/* Dual Launch Gate Progress Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, color: "#cbd5e1", marginBottom: 5 }}>
          <span>Quota Progress: {Math.max(countPct, usdPct)}% toward Live Checkout Activation</span>
          <span>{launchReady ? "Threshold Met — Safe to Notify Social Security & Activate" : "Keep Collecting Demand Signals ($0 Risk)"}</span>
        </div>
        <div style={{ height: 10, borderRadius: 99, background: "#0a0b0e", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ width: `${Math.max(countPct, usdPct)}%`, height: "100%", background: launchReady ? "#34d399" : "linear-gradient(90deg, #38bdf8, #fbbf24)", transition: "width 0.3s ease" }} />
        </div>
      </div>

      {/* Market Filter + Reservations List */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {(["ALL", "GLOBAL", "ISRAEL"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMarketFilter(m)} className={marketFilter === m ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 30, padding: "0 12px", fontSize: 11 }}>
            <Globe size={11} /> {m}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ fontSize: 12, color: "#94a3b8", padding: 12 }}>Loading demand signals...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 16, borderRadius: 12, background: "#0a0b0e", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          No reservations recorded yet in this filter. Every click on "Reserve Founder Spot" in Studio will appear here in real time.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
          {filtered.map((item) => (
            <div key={item.id} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <strong style={{ fontSize: 13, color: "#f8fafc" }}>{item.full_name || "Builder"}</strong>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>({item.email})</span>
                  <span className="badge-pill" style={{ fontSize: 10, background: item.market_region === "ISRAEL" ? "rgba(56,189,248,0.16)" : "rgba(129,140,248,0.16)", color: "#38bdf8" }}>{item.market_region}</span>
                  <span className="badge-pill" style={{ fontSize: 10, background: "rgba(251,191,36,0.16)", color: "#fbbf24" }}>v{item.target_tier}.0 · ${item.quoted_usd} / ₪{item.quoted_ils}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "#cbd5e1" }}>
                  <Sparkles size={11} style={{ display: "inline", marginRight: 4, color: "#34d399" }} />
                  {item.intent_type.replace("_", " ").toUpperCase()} · {new Date(item.created_at).toLocaleDateString()} {item.note ? `· "${item.note}"` : ""}
                </div>
              </div>

              {item.user_id && onGrantTier && (
                <button type="button" onClick={() => onGrantTier(item.user_id!, item.target_tier)} className="btn-ghost" style={{ height: 32, fontSize: 11, color: "#34d399" }}>
                  <ShieldCheck size={13} /> Unlock v{item.target_tier}.0
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
