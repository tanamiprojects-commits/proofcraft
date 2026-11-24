"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Copy, AlertTriangle, Sparkles, Briefcase, DollarSign, Send, Terminal, ShieldCheck, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { AcademyModule } from "@/lib/track1-academy-data";
import ExternalServiceBridge from "./ExternalServiceBridge";

export interface UnifiedPreset {
  label: string;
  headline: string;
  projectTitle: string;
  projectSummary: string;
}

interface UnifiedStudioProps {
  trackNumber: number;
  trackLabel: string;
  accentColor: string;
  modules: AcademyModule[];
  presets: UnifiedPreset[];
  closingKit: {
    recommendedPricing: string;
    salesPitchTemplate: string;
    handoverChecklist: string[];
  };
  fullName: string;
  onNameChange?: (name: string) => void;
  headline: string;
  primaryTools: string;
  onToggleTool: (tool: string) => void;
  quickToolsList: string[];
  onApplyPreset: (idx: number) => void;
  selectedPresetIdx: number;
  completedStepIds: string[];
  portfolioEntries: { key: string; label: string; title?: string; url?: string }[];
  liveUrlInput: string;
  onLiveUrlChange: (val: string) => void;
  urlPlaceholder: string;
  onCompleteModule: (mod: AcademyModule, quizChoice: number | null, onSuccessNextTab: () => void) => Promise<string | null>;
  onNotify: (msg: string) => void;
}

export default function UnifiedTrackFintechStudio({
  trackNumber,
  trackLabel,
  accentColor,
  modules,
  presets,
  closingKit,
  fullName,
  onNameChange,
  headline,
  primaryTools,
  onToggleTool,
  quickToolsList,
  onApplyPreset,
  selectedPresetIdx,
  completedStepIds,
  portfolioEntries,
  liveUrlInput,
  onLiveUrlChange,
  urlPlaceholder,
  onCompleteModule,
  onNotify,
}: UnifiedStudioProps) {
  const [activeModIdx, setActiveModIdx] = useState<number>(0);
  const [focusTab, setFocusTab] = useState<"lesson" | "build" | "verify" | "portfolio">("lesson");
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [showTrouble, setShowTrouble] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const mod = modules[activeModIdx] || modules;
  const isModDone = (id: string) => completedStepIds.includes(id);
  const completedCount = modules.filter((m) => isModDone(m.id)).length;
  const builtCount = portfolioEntries.filter((p) => Boolean(p.url)).length;

  const handleVerifyClick = async () => {
    setErrMsg("");
    const err = await onCompleteModule(mod, quizChoice, () => {
      setQuizChoice(null);
      if (activeModIdx < modules.length - 1) {
        setActiveModIdx(activeModIdx + 1);
        setFocusTab("lesson");
      } else {
        setFocusTab("portfolio");
      }
    });
    if (err) setErrMsg(err);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 18, alignItems: "start" }}>
      {/* Main Interactive Fintech Room */}
      <div className="card-base" style={{ marginBottom: 0, padding: 18 }}>
        {/* Module Selector Pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 12 }}>
          {modules.map((m, idx) => {
            const done = isModDone(m.id);
            const active = idx === activeModIdx;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => { setActiveModIdx(idx); setFocusTab("lesson"); setQuizChoice(null); setErrMsg(""); setShowTrouble(false); }}
                style={{
                  padding: "8px 13px", borderRadius: 999, fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap",
                  display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
                  background: active ? accentColor : done ? "rgba(52, 211, 153, 0.14)" : "#0a0b0e",
                  color: active ? "#0a0b0e" : done ? "#34d399" : "#cbd5e1",
                  border: `1px solid ${active ? accentColor : done ? "rgba(52, 211, 153, 0.4)" : "rgba(255,255,255,0.09)"}`
                }}
              >
                {done ? <CheckCircle2 size={13} /> : <BookOpen size={13} />}
                <span>שלב {m.stepNumber}</span>
              </button>
            );
          })}
        </div>

        <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>{mod.title}</h2>
        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5, marginBottom: 14 }}>{mod.subtitle}</p>

        {/* 4 Thumb-Friendly Mobile & Desktop Focus Tabs (Zero Scroll Needed!) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, padding: 4, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 16 }}>
          {[
            { id: "lesson", label: "1. שיעור" },
            { id: "build", label: "2. ביצוע" },
            { id: "verify", label: "3. אימות" },
            { id: "portfolio", label: `4. תיק (${builtCount})` },
          ].map((t) => {
            const active = focusTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setFocusTab(t.id as "lesson" | "build" | "verify" | "portfolio")}
                style={{
                  padding: "9px 4px", borderRadius: 9, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
                  background: active ? "#1e2433" : "transparent",
                  color: active ? accentColor : "#94a3b8",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        {/* TAB 1: Lesson */}
        {focusTab === "lesson" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: `1px solid ${accentColor}44` }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: accentColor, marginBottom: 6 }}>🎓 {mod.coreLessonTitle}</div>
              <p style={{ fontSize: 13, color: "#f8fafc", lineHeight: 1.65, marginBottom: 10 }}>{mod.coreLessonBody}</p>
              <div style={{ padding: "8px 10px", borderRadius: 10, background: "rgba(251, 191, 36, 0.1)", color: "#fbbf24", fontSize: 12, fontWeight: 700 }}>
                💰 {mod.roiInsight}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
              <div style={{ padding: 12, borderRadius: 12, background: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.25)", fontSize: 12 }}>
                <strong style={{ color: "#f87171", display: "block", marginBottom: 4 }}>❌ טעות של מתחיל</strong>
                <span style={{ color: "#cbd5e1", lineHeight: 1.5 }}>{mod.amateurMistake}</span>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: "rgba(52, 211, 153, 0.08)", border: "1px solid rgba(52, 211, 153, 0.25)", fontSize: 12 }}>
                <strong style={{ color: "#34d399", display: "block", marginBottom: 4 }}>✅ ביצוע של מקצוען</strong>
                <span style={{ color: "#f8fafc", lineHeight: 1.5 }}>{mod.proExecution}</span>
              </div>
            </div>

            <button type="button" onClick={() => setFocusTab("build")} className="btn-primary">
              <span>הבא: 2. ביצוע, כלים ופרומפט</span>
              <ArrowLeft size={15} />
            </button>
          </div>
        )}

        {/* TAB 2: Build & Tools */}
        {focusTab === "build" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mod.stepNumber === 1 && (
              <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.09)" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: accentColor, marginBottom: 8 }}>🎛️ בחר התמחות עסקית בלחיצה:</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
                  {presets.map((pr, idx) => (
                    <button key={idx} type="button" onClick={() => onApplyPreset(idx)} style={{
                      padding: "9px 8px", borderRadius: 10, textAlign: "right", fontSize: 11, fontWeight: 700, cursor: "pointer",
                      background: selectedPresetIdx === idx ? `${accentColor}22` : "#12141a",
                      border: `1px solid ${selectedPresetIdx === idx ? accentColor : "rgba(255,255,255,0.08)"}`,
                      color: selectedPresetIdx === idx ? "#fff" : "#cbd5e1"
                    }}>{pr.label}</button>
                  ))}
                </div>
                {onNameChange && (
                  <input dir="rtl" value={fullName} onChange={(e) => onNameChange(e.target.value)} placeholder="שמך המלא (להופעה בפרופיל ובתעודה)" className="input-field" style={{ textAlign: "right" }} />
                )}
              </div>
            )}

            {mod.stepNumber === 2 && (
              <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.09)" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: accentColor, marginBottom: 8 }}>🎛️ סמן כלים שהטמעת:</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {quickToolsList.map((tl) => {
                    const active = primaryTools.toLowerCase().includes(tl.toLowerCase());
                    return (
                      <button key={tl} type="button" onClick={() => onToggleTool(tl)} style={{
                        padding: "6px 11px", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer",
                        background: active ? "rgba(52, 211, 153, 0.18)" : "#12141a",
                        color: active ? "#34d399" : "#cbd5e1",
                        border: `1px solid ${active ? "#34d399" : "rgba(255,255,255,0.1)"}`
                      }}>{active ? "✓ " : "+ "}{tl}</button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#f8fafc" }}>🧭 שירותים חיצוניים לביצוע:</div>
              {mod.externalServices.map((srv, i) => (
                <div key={i} style={{ padding: 11, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#38bdf8" }}>{srv.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{srv.purpose}</div>
                  </div>
                  <ExternalServiceBridge
                    serviceName={srv.name}
                    targetUrl={srv.url}
                    contextWhy={srv.purpose}
                    stepsToPerform={srv.exactSteps}
                    whatToBringBack="השלמת הפעולה והמשך לאימות"
                    optionalPrompt={mod.readyPrompt}
                    buttonLabel="פתח שירות"
                  />
                </div>
              ))}
            </div>

            <div style={{ padding: 12, borderRadius: 12, background: "rgba(52, 211, 153, 0.08)", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#34d399" }}><Terminal size={13} style={{ display: "inline" }} /> פרומפט ביצוע:</span>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(mod.readyPrompt); onNotify("✓ הועתק!"); }}
                  style={{ padding: "5px 10px", borderRadius: 8, background: "#34d399", border: "none", color: "#0a0b0e", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                  <Copy size={11} style={{ display: "inline" }} /> העתק
                </button>
              </div>
              <div style={{ fontSize: 12, color: "#f8fafc", lineHeight: 1.55 }}>{mod.readyPrompt}</div>
            </div>

            <button type="button" onClick={() => setShowTrouble(!showTrouble)} style={{ background: "none", border: "none", color: "#fbbf24", fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "right" }}>
              <AlertTriangle size={13} style={{ display: "inline", marginLeft: 5 }} />
              {showTrouble ? "הסתר חילוץ מתקלות" : "נתקעת? פתח חילוץ מתקלות"}
            </button>

            {showTrouble && mod.troubleshooting.map((tr, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 10, background: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.3)", fontSize: 12 }}>
                <div style={{ fontWeight: 800, color: "#f87171" }}>תקלה: {tr.symptom}</div>
                <div style={{ color: "#cbd5e1", marginBottom: 4 }}>{tr.fixExplanation}</div>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(tr.fixPrompt); onNotify("✓ פרומפט תיקון הועתק!"); }}
                  style={{ background: "none", border: "none", color: "#34d399", fontWeight: 800, cursor: "pointer", fontSize: 11 }}>
                  העתק פרומפט תיקון ←
                </button>
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
              <button type="button" onClick={() => setFocusTab("lesson")} className="btn-ghost" style={{ height: 46 }}>
                <ArrowRight size={14} /> הקודם
              </button>
              <button type="button" onClick={() => setFocusTab("verify")} className="btn-primary">
                <span>הבא: 3. אימות</span>
                <ArrowLeft size={15} />
              </button>
            </div>
          </div>
        )}
        {/* TAB 3: Verification & Portfolio Submission */}
        {focusTab === "verify" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mod.stepNumber === 3 && (
              <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(52, 211, 153, 0.35)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#34d399", marginBottom: 6 }}>🚀 הזנת קישור הנכס החי לתיק העבודות (HTTPS):</div>
                <input dir="ltr" value={liveUrlInput} onChange={(e) => onLiveUrlChange(e.target.value)} placeholder={urlPlaceholder} className="input-field" style={{ textAlign: "left" }} />
              </div>
            )}

            {mod.stepNumber === 4 && (
              <div style={{ padding: 12, borderRadius: 12, background: "rgba(251, 191, 36, 0.08)", border: "1px solid rgba(251, 191, 36, 0.3)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>📣 שלב אימות קהילה ושיווק אורגני:</div>
                <p style={{ fontSize: 12, color: "#e2e8f0", marginBottom: 8 }}>שתף את הנכס בקיר הקהילה וקבל ביקורת בונה:</p>
                <Link href="/feed" className="btn-ghost" style={{ height: 34, fontSize: 12, color: "#fbbf24" }}>
                  <Send size={13} /> פתח קיר קהילה ושיווק
                </Link>
              </div>
            )}

            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(129, 140, 248, 0.3)" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#818cf8", marginBottom: 8 }}>🧠 בדיקת הבנה: {mod.quizQuestion}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {mod.quizOptions.map((opt, idx) => (
                  <button key={idx} type="button" onClick={() => { setQuizChoice(idx); setErrMsg(""); }} style={{
                    padding: "9px 11px", borderRadius: 10, textAlign: "right", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    background: quizChoice === idx ? "rgba(129, 140, 248, 0.2)" : "#12141a",
                    border: `1px solid ${quizChoice === idx ? "#818cf8" : "rgba(255,255,255,0.08)"}`,
                    color: quizChoice === idx ? "#fff" : "#cbd5e1"
                  }}>
                    {quizChoice === idx ? "● " : "○ "}{opt}
                  </button>
                ))}
              </div>
            </div>

            {errMsg && <div style={{ color: "#f87171", fontSize: 12, fontWeight: 700 }}>{errMsg}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
              <button type="button" onClick={() => setFocusTab("build")} className="btn-ghost" style={{ height: 46 }}>
                <ArrowRight size={14} /> הקודם
              </button>
              <button type="button" onClick={handleVerifyClick} className="btn-primary" style={{ background: accentColor, color: "#0a0b0e" }}>
                <Sparkles size={15} /> אמת וסנכרן פרופיל
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Instant Mobile Portfolio & Client Closing Kit (Zero Scrolling on Mobile!) */}
        {focusTab === "portfolio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: accentColor }}>
                  <Briefcase size={14} style={{ display: "inline", marginLeft: 5 }} />
                  הפרופיל ותיק העבודות שלך ({builtCount}/{portfolioEntries.length})
                </span>
                <span className="badge-pill tabular-nums" style={{ fontSize: 10, background: "rgba(255,255,255,0.07)" }}>
                  {completedCount}/{modules.length} מודולים
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc" }}>{fullName || "בונה AI"}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: accentColor, marginBottom: 8 }}>{trackLabel} · {headline}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12 }}>
                {portfolioEntries.map((pe) => (
                  <div key={pe.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: pe.url ? "#34d399" : "#94a3b8" }}>
                    <span>{pe.url ? `✓ ${pe.label}: ${pe.title}` : `○ ${pe.label}: ממתין להשלמה`}</span>
                    {pe.url && <a href={pe.url} target="_blank" rel="noreferrer" style={{ color: "#38bdf8" }}><ExternalLink size={13} /></a>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(251, 191, 36, 0.28)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>
                <DollarSign size={14} style={{ display: "inline" }} /> תמחור והצעת מכירה מהירה ללקוח:
              </div>
              <div style={{ fontSize: 12, color: "#34d399", fontWeight: 700, marginBottom: 6 }}>{closingKit.recommendedPricing}</div>
              <p style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.5, marginBottom: 10 }}>{closingKit.salesPitchTemplate}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(closingKit.salesPitchTemplate); onNotify("✓ הצעת המכירה הועתקה!"); }} className="btn-ghost" style={{ height: 38, fontSize: 11 }}>
                  <Copy size={12} /> העתק הצעה
                </button>
                <Link href="/portfolio/live" className="btn-primary" style={{ height: 38, fontSize: 11 }}>
                  <ShieldCheck size={13} /> תיק עבודות מלא
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
