"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Cpu, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";

interface ProbeResult {
  name: string;
  ok: boolean;
  ms: number;
}

export default function AdminDiagnosticsSuite() {
  const { isHe, dir } = useStudioLang();
  const [probes, setProbes] = useState<ProbeResult[]>([]);
  const [running, setRunning] = useState(false);

  const runDiagnostics = useCallback(async () => {
    setRunning(true);
    const tables = ["profiles", "aff_links", "feed_posts", "support_tickets", "aff_karma_ledger"];
    const results: ProbeResult[] = [];
    for (const tbl of tables) {
      const t0 = performance.now();
      const { error } = await supabase.from(tbl).select("id").limit(1);
      const ms = Math.max(1, Math.round(performance.now() - t0));
      results.push({ name: tbl, ok: !error, ms });
    }
    setProbes(results);
    setRunning(false);
  }, []);

  useEffect(() => {
    runDiagnostics();
    const onSync = () => runDiagnostics();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [runDiagnostics]);

  const allHealthy = probes.length > 0 && probes.every((p) => p.ok);

  return (
    <div dir={dir} className="card-surface" style={{ padding: 16, marginBottom: 16, textAlign: isHe ? "right" : "left", border: allHealthy ? "1px solid rgba(52,211,153,0.35)" : "1px solid rgba(251,191,36,0.4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Cpu size={16} color={allHealthy ? "#34d399" : "#fbbf24"} />
          <strong style={{ fontSize: 14, color: "#f8fafc" }}>
            {isHe ? "\u05D0\u05D1\u05D7\u05D5\u05DF \u05EA\u05E7\u05D9\u05E0\u05D5\u05EA \u05D5\u05DE\u05D5\u05DB\u05E0\u05D5\u05EA \u05DC\u05D9\u05D9\u05E6\u05D5\u05E8 (v35.0)" : "Production Health & Readiness Diagnostics (v35.0)"}
          </strong>
        </div>
        <button type="button" onClick={runDiagnostics} disabled={running} className="btn-ghost" style={{ height: 32, fontSize: 11.5 }}>
          <RefreshCw size={12} />
          <span>{running ? (isHe ? "\u05D1\u05D5\u05D3\u05E7..." : "Probing...") : (isHe ? "\u05D4\u05E8\u05E5 \u05D1\u05D3\u05D9\u05E7\u05EA \u05DE\u05E2\u05E8\u05DB\u05EA" : "Run Self-Test")}</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
        {probes.map((pr) => (
          <div key={pr.name} style={{ padding: "8px 10px", borderRadius: 9, background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>
              {pr.ok ? <CheckCircle2 size={13} color="#34d399" /> : <AlertTriangle size={13} color="#f87171" />}
              <span>{pr.name}</span>
            </div>
            <span style={{ fontSize: 11, color: pr.ok ? "#34d399" : "#f87171", fontFamily: "monospace" }}>
              {pr.ok ? `${pr.ms}ms` : "ERR"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}