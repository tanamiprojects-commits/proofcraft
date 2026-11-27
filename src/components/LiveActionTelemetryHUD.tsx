"use client";

import React, { useEffect, useRef } from "react";
import { CheckCircle2, Loader2, Sparkles, Copy, Download, ShieldCheck, Filter, Compass, ArrowRight, ArrowLeft } from "lucide-react";
import { SmartAnalysisReport, SurgicalFilterMode } from "@/lib/context-smart-analyzer";

export default function LiveActionTelemetryHUD({
  status,
  progressPct,
  actionTitle,
  fileName,
  analysis,
  isHe,
  onCopyPacket,
  onDownloadPacket,
  onFilterErrors,
  onInspectAssets,
}: {
  status: "idle" | "running" | "done";
  progressPct: number;
  actionTitle: string;
  fileName: string;
  analysis: SmartAnalysisReport;
  isHe: boolean;
  onCopyPacket: () => void;
  onDownloadPacket: () => void;
  onFilterErrors: (m: SurgicalFilterMode) => void;
  onInspectAssets: () => void;
}) {
  const hudRef = useRef<HTMLDivElement | null>(null);
  const ArrowIcon = isHe ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (status === "running" || status === "done") {
      setTimeout(() => hudRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
    }
  }, [status]);

  if (status === "idle") return null;

  const secretsCount = analysis.assets.filter((a) => a.kind === "secret").length;
  const steps = [
    { pct: 25, he: "אימות אבטחה וחתימת קובץ", en: "Security & Signature Check" },
    { pct: 55, he: "סריקת מבנה וממדים", en: "Structure & Dimensions Scan" },
    { pct: 85, he: "פענוח טקסט (OCR) וחילוץ פרטים", en: "OCR Text & Entity Extraction" },
    { pct: 100, he: "אריזה חכמה מוכנה לפעולה", en: "Smart Action Package Ready" },
  ];

  return (
    <div ref={hudRef} style={{ scrollMarginTop: 84, padding: 18, borderRadius: 16, background: status === "done" ? "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(10,11,14,0.96) 100%)" : "rgba(15,23,42,0.95)", border: status === "done" ? "1.5px solid rgba(52,211,153,0.5)" : "1.5px solid rgba(56,189,248,0.45)", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {status === "running" ? <Loader2 size={18} color="#38bdf8" className="animate-spin" /> : <CheckCircle2 size={18} color="#34d399" />}
          <strong style={{ fontSize: 14, color: status === "done" ? "#34d399" : "#38bdf8" }}>
            {status === "running"
              ? (isHe ? `מבצע כעת: ${actionTitle} (${progressPct}%)` : `Processing: ${actionTitle} (${progressPct}%)`)
              : (isHe ? `הפעולה הושלמה בהצלחה! ${fileName ? `(${fileName})` : ""}` : `Action Completed Successfully! ${fileName ? `(${fileName})` : ""}`)}
          </strong>
        </div>
        <span className="badge-pill" style={{ background: "rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 11 }}>
          {isHe ? analysis.detectedKindHe : analysis.detectedKindEn}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ width: "100%", height: 8, borderRadius: 99, background: "#05070a", overflow: "hidden" }}>
        <div style={{ width: `${progressPct}%`, height: "100%", background: status === "done" ? "#34d399" : "linear-gradient(90deg, #38bdf8, #818cf8)", transition: "width 0.25s ease" }} />
      </div>

      {/* 4 Execution Milestones */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
        {steps.map((st, idx) => {
          const reached = progressPct >= st.pct;
          return (
            <div key={idx} style={{ padding: "8px 10px", borderRadius: 10, background: reached ? "rgba(52,211,153,0.14)" : "#0a0b0e", border: `1px solid ${reached ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.06)"}`, fontSize: 11.5, fontWeight: 800, color: reached ? "#a7f3d0" : "#64748b" }}>
              {reached ? "✓ " : "○ "}{isHe ? st.he : st.en}
            </div>
          );
        })}
      </div>

      {/* Smart Next-Best-Actions Based on Result */}
      {status === "done" && (
        <div style={{ paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12.5, color: "#e2e8f0", lineHeight: 1.55 }}>
            <Sparkles size={13} color="#fbbf24" style={{ display: "inline", marginInlineEnd: 5 }} />
            <strong>{isHe ? "המלצת המשך חכמה לפי התוצאה: " : "Smart Next Action: "}</strong>
            {isHe ? analysis.explanationHe : analysis.explanationEn}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={onCopyPacket} className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12 }}>
              <Copy size={13} /> {isHe ? "העתק תוצאה לצ׳אט החכם" : "Copy Result to AI Chat"}
            </button>
            <button type="button" onClick={onDownloadPacket} className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12, color: "#38bdf8", borderColor: "rgba(56,189,248,0.4)" }}>
              <Download size={13} /> {isHe ? "הורד כקובץ (.md)" : "Download (.md)"}
            </button>
            {analysis.errorLines.length > 0 && (
              <button type="button" onClick={() => onFilterErrors("errors_only")} className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12, color: "#fbbf24", borderColor: "rgba(251,191,36,0.45)" }}>
                <Filter size={13} /> {isHe ? `התמקד ב-${analysis.errorLines.length} השגיאות` : `Focus ${analysis.errorLines.length} Errors`}
              </button>
            )}
            {analysis.assets.length > 0 && (
              <button type="button" onClick={onInspectAssets} className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12, color: "#34d399", borderColor: "rgba(52,211,153,0.4)" }}>
                <span>{isHe ? `צפה ב-${analysis.assets.length} פרטים שחולצו` : `Inspect ${analysis.assets.length} Extracted Items`}</span> <ArrowIcon size={13} />
              </button>
            )}
            {secretsCount > 0 && (
              <a href="/vault" className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12, color: "#fde68a" }}>
                <ShieldCheck size={13} /> {isHe ? "שמור מפתחות בכספת" : "Save Keys in Vault"}
              </a>
            )}
            <a href="/affiliate" className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12 }}>
              <Compass size={13} /> {isHe ? "הפץ במרכז השותפים" : "Affiliate Hub"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}