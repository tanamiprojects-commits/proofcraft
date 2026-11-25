"use client";
import React from "react";
import { Flame, History, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { downloadCsvReport } from "@/lib/csv-export";
import { AffKarmaEntry } from "@/lib/affiliate-store";

interface Props {
  karma: AffKarmaEntry[];
  boostCredits: number;
  isHe: boolean;
}

export default function KarmaLedgerPanel({ karma, boostCredits, isHe }: Props) {
  return (
    <div className="card-surface" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <History size={17} color="#fbbf24" />
          <h3 style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc", margin: 0 }}>
            {isHe ? "\u05D9\u05D5\u05DE\u05DF \u05EA\u05E0\u05D5\u05E2\u05D5\u05EA \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D7\u05E9\u05D9\u05E4\u05D4 \u05D5\u05E7\u05D0\u05E8\u05DE\u05D4" : "Boost Credits & Karma Ledger"}
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>{karma.length > 0 && <button type="button" onClick={() => downloadCsvReport("proofcraft-karma-ledger.csv", ["Action", "Credits Delta", "Description EN", "Description HE"], karma.map((k) => [k.action_type, k.credits_delta, k.description_en, k.description_he]))} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}><Download size={12} /> <span>{isHe ? "\u05D9\u05D9\u05E6\u05D5\u05D0 CSV" : "Export CSV"}</span></button>}<span className="badge-pill" style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 12, fontWeight: 800 }}><Flame size={13} /> {boostCredits} {isHe ? "\u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D6\u05DE\u05D9\u05E0\u05D5\u05EA" : "Available Credits"}</span></div>
      </div>

      {karma.length === 0 ? (
        <div style={{ padding: 14, borderRadius: 10, background: "rgba(15,23,42,0.65)", border: "1px dashed rgba(148,163,184,0.2)", fontSize: 12.5, color: "#94a3b8" }}>
          {isHe
            ? "\u05D8\u05E8\u05DD \u05E0\u05E8\u05E9\u05DE\u05D5 \u05EA\u05E0\u05D5\u05E2\u05D5\u05EA \u05D1\u05D9\u05D5\u05DE\u05DF. \u05D4\u05D6\u05DE\u05DF \u05D7\u05D1\u05E8\u05D9\u05DD (+25) \u05D0\u05D5 \u05D0\u05DE\u05EA \u05D3\u05D9\u05DC\u05D9\u05DD (+5) \u05DB\u05D3\u05D9 \u05DC\u05E6\u05D1\u05D5\u05E8 \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA."
            : "No ledger entries yet. Invite creators (+25) or verify active deals (+5) to build your Boost balance."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {karma.slice(0, 12).map((entry) => {
            const pos = entry.credits_delta >= 0;
            return (
              <div key={entry.id} style={{ padding: "9px 12px", borderRadius: 9, background: "rgba(15,23,42,0.65)", border: "1px solid rgba(148,163,184,0.14)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 12.5, color: "#e2e8f0" }}>
                  {isHe ? (entry.description_he || entry.description_en) : entry.description_en}
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: pos ? "#34d399" : "#fb923c", display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
                  {pos ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {pos ? `+${entry.credits_delta}` : entry.credits_delta}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}