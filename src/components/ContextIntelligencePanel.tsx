"use client";

import React, { useEffect, useState } from "react";
import { BookmarkPlus, Copy, Filter, KeyRound, ShieldCheck, Trash2, Sparkles, FolderOpen } from "lucide-react";
import { SmartAnalysisReport, SurgicalFilterMode } from "@/lib/context-smart-analyzer";

interface ProjectSnapshot {
  id: string;
  projectTitle: string;
  note: string;
  lineCount: number;
  rawText: string;
  savedAt: string;
}

const STORAGE_KEY = "proofcraft_context_snapshots_v1";

export default function ContextIntelligencePanel({
  rawInput, projectTitle, analysis, filterMode, isHe, onChangeFilter, onLoadSnapshot, onNotify,
}: {
  rawInput: string; projectTitle: string; analysis: SmartAnalysisReport; filterMode: SurgicalFilterMode;
  isHe: boolean; onChangeFilter: (m: SurgicalFilterMode) => void; onLoadSnapshot: (text: string, title: string) => void; onNotify: (msg: string) => void;
}) {
  const [tab, setTab] = useState<"summary" | "assets" | "history">("summary");
  const [snapNote, setSnapNote] = useState("");
  const [snapshots, setSnapshots] = useState<ProjectSnapshot[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setSnapshots(saved);
    } catch {}
  }, []);

  const persistSnapshots = (next: ProjectSnapshot[]) => {
    setSnapshots(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const handleSaveSnapshot = () => {
    if (!rawInput.trim()) return;
    const item: ProjectSnapshot = {
      id: Date.now().toString(),
      projectTitle: projectTitle || "ProofCraft",
      note: snapNote.trim() || (isHe ? analysis.detectedKindHe : analysis.detectedKindEn),
      lineCount: analysis.originalLineCount,
      rawText: rawInput.slice(0, 350000),
      savedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    persistSnapshots([item, ...snapshots].slice(0, 15));
    setSnapNote("");
    onNotify(isHe ? "הפלט נשמר ביומן הפרויקט עם הקשר מלא ✓" : "Snapshot saved to project log ✓");
  };

  const secretsCount = analysis.assets.filter((a) => a.kind === "secret").length;

  return (
    <div style={{ padding: 18, borderRadius: 16, background: "#0d111a", border: "1px solid rgba(52,211,153,0.3)", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 900, color: "#34d399" }}>
          <Sparkles size={14} style={{ display: "inline", marginInlineEnd: 5 }} />
          {isHe ? "מרכז מודיעין הפלט, חילוץ מפתחות ויומן מעקב פרויקט" : "OUTPUT INTELLIGENCE, SECRETS EXTRACTOR & PROJECT LOG"}
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setTab("summary")} className={tab === "summary" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 30, padding: "0 10px", fontSize: 11.5 }}>{isHe ? "1. סיכום וסינון חכם" : "1. Summary & Filter"}</button>
          <button type="button" onClick={() => setTab("assets")} className={tab === "assets" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 30, padding: "0 10px", fontSize: 11.5 }}>{isHe ? `2. מפתחות ופרטים (${analysis.assets.length})` : `2. Keys & Data (${analysis.assets.length})`}</button>
          <button type="button" onClick={() => setTab("history")} className={tab === "history" ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 30, padding: "0 10px", fontSize: 11.5 }}>{isHe ? `3. מעקב פרויקט (${snapshots.length})` : `3. Project Log (${snapshots.length})`}</button>
        </div>
      </div>

      {tab === "summary" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 12, background: "#05070a", border: "1px solid rgba(56,189,248,0.25)", fontSize: 12.5, color: "#e2e8f0", lineHeight: 1.6 }}>
            <strong style={{ color: "#38bdf8", display: "block", marginBottom: 4 }}>{isHe ? `הקשר הפלט שזוהה: ${analysis.detectedKindHe}` : `Detected Context: ${analysis.detectedKindEn}`}</strong>
            {isHe ? analysis.explanationHe : analysis.explanationEn}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 800 }}><Filter size={12} style={{ display: "inline", marginInlineEnd: 4 }} />{isHe ? "סינון לפני יצירת קובץ:" : "Pre-Export Filter:"}</span>
            {[
              { id: "full_with_summary" as const, he: "הכל + תקציר", en: "Full + Summary" },
              { id: "errors_only" as const, he: `רק שגיאות (${analysis.errorLines.length})`, en: `Errors Only (${analysis.errorLines.length})` },
              { id: "assets_only" as const, he: `רק מפתחות ופרטים (${analysis.assets.length})`, en: `Assets Only (${analysis.assets.length})` },
              { id: "clean_compact" as const, he: "ניקוי רעשים", en: "Compact Clean" },
            ].map((f) => (
              <button key={f.id} type="button" onClick={() => onChangeFilter(f.id)} className={filterMode === f.id ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 30, padding: "0 10px", fontSize: 11.5 }}>
                {isHe ? f.he : f.en}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "assets" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto" }}>
          {secretsCount > 0 && (
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, fontSize: 12, color: "#fde68a" }}>
              <span><KeyRound size={13} style={{ display: "inline", marginInlineEnd: 5 }} />{isHe ? `זוהו ${secretsCount} מפתחות רגישים בפלט!` : `${secretsCount} sensitive key(s) extracted!`}</span>
              <a href="/vault" className="btn-primary" style={{ width: "auto", height: 28, padding: "0 10px", fontSize: 11, background: "#fbbf24", color: "#0a0b0e" }}><ShieldCheck size={12} /> {isHe ? "שמור בכספת" : "Save in Vault"}</a>
            </div>
          )}
          {analysis.assets.length === 0 ? (
            <div style={{ fontSize: 12, color: "#94a3b8", padding: 10 }}>{isHe ? "לא זוהו מפתחות פרטיים, מיילים או קישורים בפלט הנוכחי." : "No secrets, emails, or URLs found in current output."}</div>
          ) : (
            analysis.assets.map((a, i) => (
              <div key={i} style={{ padding: "8px 12px", borderRadius: 10, background: "#05070a", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis" }}>
                  <span style={{ color: a.kind === "secret" ? "#fbbf24" : "#38bdf8", fontWeight: 800, marginInlineEnd: 6 }}>[{isHe ? a.labelHe : a.labelEn}]</span>
                  <code dir="ltr" style={{ color: "#e2e8f0" }}>{a.value}</code>
                </div>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(a.value); onNotify(isHe ? "הפריט הועתק ✓" : "Copied ✓"); }} className="btn-ghost" style={{ height: 26, padding: "0 8px", fontSize: 11, flexShrink: 0 }}><Copy size={11} /></button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input type="text" value={snapNote} onChange={(e) => setSnapNote(e.target.value)} placeholder={isHe ? `תיאור שלב עבור ${projectTitle}...` : "Step label (e.g. Build check)..."} className="input-dark" style={{ flex: 1, height: 36, fontSize: 12 }} />
            <button type="button" onClick={handleSaveSnapshot} disabled={!rawInput.trim()} className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12 }}><BookmarkPlus size={13} /> {isHe ? "שמור ביומן הפרויקט" : "Save Snapshot"}</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
            {snapshots.map((sp) => (
              <div key={sp.id} style={{ padding: "8px 12px", borderRadius: 10, background: "#05070a", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 12 }}>
                  <strong style={{ color: "#34d399" }}>{sp.projectTitle}</strong> · <span style={{ color: "#f8fafc" }}>{sp.note}</span> <span style={{ color: "#64748b" }}>({sp.lineCount} {isHe ? "שורות" : "lines"} · {sp.savedAt})</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" onClick={() => onLoadSnapshot(sp.rawText, sp.projectTitle)} className="btn-ghost" style={{ height: 26, padding: "0 8px", fontSize: 11, color: "#38bdf8" }}><FolderOpen size={11} /> {isHe ? "טען" : "Load"}</button>
                  <button type="button" onClick={() => persistSnapshots(snapshots.filter((x) => x.id !== sp.id))} className="btn-ghost" style={{ height: 26, padding: "0 8px", fontSize: 11, color: "#f87171" }}><Trash2 size={11} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}