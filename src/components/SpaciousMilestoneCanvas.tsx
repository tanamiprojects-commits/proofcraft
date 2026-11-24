"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Copy, ShieldCheck, Sparkles, Terminal, AlertTriangle, FileCode2, Award, Eye } from "lucide-react";
import { AcademyModule } from "@/lib/track1-academy-data";
import { getRubricForModule } from "@/lib/verification-rubric";
import { sanitizeCodeArtifact, sanitizePlainText } from "@/lib/security-utils";
import { supabase } from "@/lib/supabase";
import ExternalServiceBridge from "./ExternalServiceBridge";

export interface SpaciousPreset {
  label: string;
  headline: string;
  projectTitle: string;
  projectSummary: string;
}

interface SpaciousCanvasProps {
  userId: string | null;
  trackNumber: number;
  trackLabel: string;
  accentColor: string;
  modules: AcademyModule[];
  presets: SpaciousPreset[];
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
  liveUrlInput: string;
  onLiveUrlChange: (val: string) => void;
  urlPlaceholder: string;
  onCompleteModule: (mod: AcademyModule, quizChoice: number | null, onSuccessNext: () => void) => Promise<string | null>;
  onNotify: (msg: string) => void;
}

export default function SpaciousMilestoneCanvas({
  userId,
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
  liveUrlInput,
  onLiveUrlChange,
  urlPlaceholder,
  onCompleteModule,
  onNotify,
}: SpaciousCanvasProps) {
  const [viewMode, setViewMode] = useState<"overview" | "execute">("overview");
  const [activeModIdx, setActiveModIdx] = useState<number>(0);

  // Anti-Cheat Proof-of-Execution States
  const [artifactPaste, setArtifactPaste] = useState<string>("");
  const [selectedRationaleIdx, setSelectedRationaleIdx] = useState<number>(0);
  const [customRationaleNote, setCustomRationaleNote] = useState<string>("");
  const [checkedAuditItems, setCheckedAuditItems] = useState<Record<number, boolean>>({});
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [showTrouble, setShowTrouble] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const mod = modules[activeModIdx] || modules;
  const rubric = getRubricForModule(mod.id, mod.stepNumber);
  const completedCount = modules.filter((m) => completedStepIds.includes(m.id)).length;
  const progressPct = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  const openMilestoneRoom = (idx: number) => {
    setActiveModIdx(idx);
    setArtifactPaste("");
    setCustomRationaleNote("");
    setCheckedAuditItems({});
    setQuizChoice(null);
    setValidationError("");
    setShowTrouble(false);
    setViewMode("execute");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const runRubricVerification = async () => {
    setValidationError("");
    const cleanArtifact = sanitizeCodeArtifact(artifactPaste, 2500);

    // 1. Validate Minimum Length & Real Technical Signals (Anti-Cheat Gate)
    if (cleanArtifact.length < rubric.minChars) {
      return setValidationError(`⚠️ אימות ראיות נכשל: הפלט שהדבקת קצר מדי (${cleanArtifact.length}/${rubric.minChars} תווים). ${rubric.missingSignalHint}`);
    }
    const lowerArt = cleanArtifact.toLowerCase();
    const matchedSignals = rubric.requiredSignals.filter((sig) => lowerArt.includes(sig.toLowerCase()));
    if (matchedSignals.length === 0) {
      return setValidationError(`⚠️ הפלט שהודבק אינו תואם לתקנון האימות של שלב זה. ${rubric.missingSignalHint}`);
    }

    // 2. Validate Self-Audit Checklist Completion
    const allAuditsChecked = rubric.auditChecklist.every((_, idx) => Boolean(checkedAuditItems[idx]));
    if (!allAuditsChecked) {
      return setValidationError("⚠️ יש לאמת ולסמן את כל סעיפי הבקרה העצמית לפני נעילת אבן הדרך.");
    }

    // 3. Validate Architectural Rationale
    const baseRationale = rubric.rationaleOptions[selectedRationaleIdx] || rubric.rationaleOptions;
    const extraNote = sanitizePlainText(customRationaleNote, 280);
    const fullRationale = extraNote ? `${baseRationale} | יישום בפועל: ${extraNote}` : baseRationale;

    setSubmitting(true);
    const err = await onCompleteModule(mod, quizChoice, async () => {
      if (userId) {
        await supabase.from("milestone_proofs").upsert({
          user_id: userId,
          author_name: sanitizePlainText(fullName || "בונה AI", 80),
          track_level: trackNumber,
          module_id: mod.id,
          module_title: mod.title,
          artifact_output: cleanArtifact,
          architecture_rationale: fullRationale,
          status: "verified",
        }, { onConflict: "user_id,module_id" });
      }
      setSubmitting(false);
      if (activeModIdx < modules.length - 1) {
        openMilestoneRoom(activeModIdx + 1);
      } else {
        setViewMode("overview");
      }
    });

    if (err) {
      setSubmitting(false);
      setValidationError(`⚠️ ${err}`);
    }
  };

  // MODE A: Clean, Spacious Track Overview Lobby
  if (viewMode === "overview") {
    const nextIncompleteIdx = Math.max(0, modules.findIndex((m) => !completedStepIds.includes(m.id)));
    return (
      <div dir="rtl" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="card-hero" style={{ padding: 24, marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
            <span className="badge-pill" style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}55`, fontSize: 11 }}>
              {trackLabel} · מפת אבני דרך
            </span>
            <span className="tabular-nums" style={{ fontSize: 13, fontWeight: 900, color: "#34d399" }}>
              התקדמות מאומתת: {completedCount}/{modules.length} ({progressPct}%)
            </span>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
            {trackNumber === 1
              ? "מסלול ההזנקה החינמי: בניית מערכת המרה ראשונה ותיק עבודות מאומת"
              : `חדר ההנדסה של ${trackLabel}: ביצוע צעד-אחר-צעד ואימות ראיות`}
          </h2>
          <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.65, marginBottom: 16 }}>
            כל אבן דרך נפתחת בחלון ביצוע רחב ומרווח. בסיום כל שלב תזין את פלט הביצוע האמיתי ותיעוד הארכיטקטורה שלך — מנוע האימות יבדוק אותם מול תקנון הפלטפורמה וינעל את ההוכחה בתיק העבודות הציבורי שלך.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button type="button" onClick={() => openMilestoneRoom(nextIncompleteIdx)} className="btn-primary" style={{ width: "auto", padding: "0 24px", background: accentColor, color: "#0a0b0e" }}>
              <span>{completedCount === modules.length ? "סקור שוב את אבני הדרך" : `היכנס לחלון הביצוע: אבן דרך #${nextIncompleteIdx + 1}`}</span>
              <ArrowLeft size={16} />
            </button>
            <Link href="/portfolio/live" className="btn-ghost" style={{ padding: "0 18px" }}>
              <Eye size={15} /> צפה בתיק העבודות ובכספת הראיות
            </Link>
          </div>
        </div>

        {/* Spacious Milestone Cards List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {modules.map((m, idx) => {
            const done = completedStepIds.includes(m.id);
            return (
              <div key={m.id} className="card-base" style={{ marginBottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", borderColor: done ? "rgba(52, 211, 153, 0.45)" : "rgba(255,255,255,0.09)" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="badge-pill" style={{ fontSize: 10, background: done ? "rgba(52, 211, 153, 0.16)" : "#0a0b0e", color: done ? "#34d399" : "#94a3b8" }}>
                      {done ? "✓ אומת וננעל בתיק" : `אבן דרך ${m.stepNumber} מתוך ${modules.length}`}
                    </span>
                    <span style={{ fontSize: 11, color: accentColor, fontWeight: 700 }}>{m.badgeUnlocked}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{m.title}</h3>
                  <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55, marginBottom: 14 }}>{m.subtitle}</p>
                </div>

                <button type="button" onClick={() => openMilestoneRoom(idx)} className={done ? "btn-ghost" : "btn-primary"} style={{ height: 42, fontSize: 12 }}>
                  <span>{done ? "צפה בפרטי אבן הדרך" : `התחל ביצוע אבן דרך #${m.stepNumber}`}</span>
                  <ArrowLeft size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  // MODE B: Spacious Full-Width Milestone Execution Room (Zero Visual Clutter)
  return (
    <div dir="rtl" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Top Room Navigation & Progress Bar */}
      <div className="card-base" style={{ padding: 18, marginBottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <button type="button" onClick={() => setViewMode("overview")} className="btn-ghost" style={{ height: 36, fontSize: 12 }}>
            <ArrowRight size={14} /> חזור למפת אבני הדרך
          </button>
          <span className="badge-pill tabular-nums" style={{ background: `${accentColor}22`, color: accentColor, fontSize: 11 }}>
            אבן דרך {mod.stepNumber} מתוך {modules.length} · {trackLabel}
          </span>
        </div>

        <h2 style={{ fontSize: 21, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>{mod.title}</h2>
        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{mod.subtitle}</p>
      </div>

      {/* STATION 1: Strategic Briefing & Value Architecture */}
      <section className="card-base" style={{ padding: 22, marginBottom: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: accentColor, marginBottom: 6 }}>תחנה 1 מתוך 3 · הבנה אסטרטגית ותוצר יעד</div>
        <h3 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 8 }}>{mod.coreLessonTitle}</h3>
        <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.75, marginBottom: 14 }}>{mod.coreLessonBody}</p>

        <div style={{ padding: 12, borderRadius: 12, background: "rgba(251, 191, 36, 0.09)", border: "1px solid rgba(251, 191, 36, 0.28)", color: "#fbbf24", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
          💰 ערך עסקי ללקוח: {mod.roiInsight}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 12, background: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.25)", fontSize: 13 }}>
            <strong style={{ color: "#f87171", display: "block", marginBottom: 4 }}>❌ מלכודת של מתחיל</strong>
            <span style={{ color: "#cbd5e1", lineHeight: 1.6 }}>{mod.amateurMistake}</span>
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: "rgba(52, 211, 153, 0.08)", border: "1px solid rgba(52, 211, 153, 0.25)", fontSize: 13 }}>
            <strong style={{ color: "#34d399", display: "block", marginBottom: 4 }}>✅ סטנדרט ביצוע הנדסי</strong>
            <span style={{ color: "#f8fafc", lineHeight: 1.6 }}>{mod.proExecution}</span>
          </div>
        </div>
      </section>

      {/* STATION 2: Step-by-Step Practical Execution Workspace */}
      <section className="card-base" style={{ padding: 22, marginBottom: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#38bdf8", marginBottom: 6 }}>תחנה 2 מתוך 3 · ביצוע מעשי בסביבת העבודה</div>
        <h3 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 14 }}>משימות הביצוע הנדרשות באבן דרך זו:</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mod.stepNumber === 1 && (
            <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.09)" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: accentColor, marginBottom: 8 }}>שלב משנה א׳ — הגדרת פרופיל והתמחות עסקית:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, marginBottom: 12 }}>
                {presets.map((pr, idx) => (
                  <button key={idx} type="button" onClick={() => onApplyPreset(idx)} style={{
                    padding: "10px 12px", borderRadius: 10, textAlign: "right", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    background: selectedPresetIdx === idx ? `${accentColor}22` : "#12141a",
                    border: `1px solid ${selectedPresetIdx === idx ? accentColor : "rgba(255,255,255,0.08)"}`,
                    color: selectedPresetIdx === idx ? "#fff" : "#cbd5e1"
                  }}>{pr.label}</button>
                ))}
              </div>
              {onNameChange && (
                <input dir="rtl" value={fullName} onChange={(e) => onNameChange(e.target.value)} placeholder="הזן את שמך המלא (להופעה בפרופיל ובתיק העבודות)" className="input-field" style={{ textAlign: "right" }} />
              )}
            </div>
          )}

          {mod.stepNumber === 2 && (
            <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.09)" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: accentColor, marginBottom: 8 }}>שלב משנה א׳ — הטמעת כלי הפיתוח והענן במחסנית שלך:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {quickToolsList.map((tl) => {
                  const active = primaryTools.toLowerCase().includes(tl.toLowerCase());
                  return (
                    <button key={tl} type="button" onClick={() => onToggleTool(tl)} style={{
                      padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      background: active ? "rgba(52, 211, 153, 0.18)" : "#12141a",
                      color: active ? "#34d399" : "#cbd5e1",
                      border: `1px solid ${active ? "#34d399" : "rgba(255,255,255,0.1)"}`
                    }}>{active ? "✓ " : "+ "}{tl}</button>
                  );
                })}
              </div>
            </div>
          )}

          {/* External Guided Services */}
          <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.09)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#38bdf8", marginBottom: 10 }}>🧭 שירותי ענן ופיתוח לביצוע המשימה:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mod.externalServices.map((srv, i) => (
                <div key={i} style={{ padding: 12, borderRadius: 12, background: "#12141a", border: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc" }}>{srv.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{srv.purpose}</div>
                  </div>
                  <ExternalServiceBridge
                    serviceName={srv.name}
                    targetUrl={srv.url}
                    contextWhy={srv.purpose}
                    stepsToPerform={srv.exactSteps}
                    whatToBringBack="העתק את פלט הביצוע או הקוד שנוצר להדבקה בתחנה 3"
                    optionalPrompt={mod.readyPrompt}
                    buttonLabel="פתח כלי מודרך"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Copyable PowerShell Execution Prompt */}
          <div style={{ padding: 16, borderRadius: 14, background: "rgba(52, 211, 153, 0.08)", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#34d399" }}><Terminal size={14} style={{ display: "inline" }} /> פקודת ביצוע ופרומפט להרצה:</span>
              <button type="button" onClick={() => { navigator.clipboard?.writeText(mod.readyPrompt); onNotify("✓ הפרומפט הועתק!"); }}
                style={{ padding: "7px 14px", borderRadius: 8, background: "#34d399", border: "none", color: "#0a0b0e", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                <Copy size={12} style={{ display: "inline" }} /> העתק פרומפט ביצוע
              </button>
            </div>
            <div style={{ fontSize: 13, color: "#f8fafc", lineHeight: 1.65 }}>{mod.readyPrompt}</div>
          </div>

          <button type="button" onClick={() => setShowTrouble(!showTrouble)} style={{ background: "none", border: "none", color: "#fbbf24", fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "right" }}>
            <AlertTriangle size={14} style={{ display: "inline", marginLeft: 5 }} />
            {showTrouble ? "הסתר מדריך פתרון תקלות" : "נתקעת בטרמינל או בענן? פתח מדריך פתרון תקלות"}
          </button>

          {showTrouble && mod.troubleshooting.map((tr, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 12, background: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.3)", fontSize: 12 }}>
              <div style={{ fontWeight: 800, color: "#f87171" }}>תקלה: {tr.symptom}</div>
              <div style={{ color: "#cbd5e1", marginBottom: 6 }}>{tr.fixExplanation}</div>
              <button type="button" onClick={() => { navigator.clipboard?.writeText(tr.fixPrompt); onNotify("✓ פרומפט תיקון הועתק!"); }}
                style={{ background: "none", border: "none", color: "#34d399", fontWeight: 800, cursor: "pointer", fontSize: 11 }}>
                העתק פרומפט תיקון ←
              </button>
            </div>
          ))}
        </div>
      </section>
      {/* STATION 3: Anti-Cheat Proof-of-Execution Verification Station */}
      <section className="card-hero" style={{ padding: 22, marginBottom: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24", marginBottom: 6 }}>תחנה 3 מתוך 3 · תחנת אימות ראיות והסמכה (Anti-Cheat Verification)</div>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>הוכחת ביצוע הנדסית לנעילת אבן הדרך</h3>
        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 16 }}>
          מנוע האימות בודק את הפלט הטכני שלך מול תקנון הפלטפורמה. לאחר המעבר, הראיה והנימוק הארכיטקטוני יישמרו אוטומטית בתיק העבודות הציבורי שלך.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mod.stepNumber === 3 && (
            <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(52, 211, 153, 0.35)" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#34d399", marginBottom: 6 }}>
                🚀 כתובת HTTPS חיה של הנכס שבנית (Production URL):
              </label>
              <input dir="ltr" value={liveUrlInput} onChange={(e) => onLiveUrlChange(e.target.value)} placeholder={urlPlaceholder} className="input-field" style={{ textAlign: "left" }} />
            </div>
          )}

          {/* Layer A: Real Technical Output Artifact Paste */}
          <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#38bdf8", marginBottom: 6 }}>
              <FileCode2 size={14} style={{ display: "inline", marginLeft: 5 }} />
              {rubric.artifactPromptTitle}
            </label>
            <textarea
              dir="ltr"
              rows={4}
              value={artifactPaste}
              onChange={(e) => { setArtifactPaste(e.target.value); setValidationError(""); }}
              placeholder={rubric.artifactPlaceholder}
              className="input-field"
              style={{ textAlign: "left", fontFamily: "monospace", fontSize: 12 }}
            />
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              דרישת תקנון: מינימום {rubric.minChars} תווים + אימות מבנה טכני אמיתי מהביצוע שלך.
            </div>
          </div>

          {/* Layer B: Architectural Rationale (Becomes Public Portfolio Case Study!) */}
          <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(129, 140, 248, 0.3)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#818cf8", marginBottom: 8 }}>
              🏛️ בחר תבנית נימוק ארכיטקטוני (יוצג למעסיקים ולקוחות בתיק העבודות שלך):
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
              {rubric.rationaleOptions.map((rat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedRationaleIdx(idx)}
                  style={{
                    padding: "10px 12px", borderRadius: 10, textAlign: "right", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    background: selectedRationaleIdx === idx ? "rgba(129, 140, 248, 0.2)" : "#12141a",
                    border: `1px solid ${selectedRationaleIdx === idx ? "#818cf8" : "rgba(255,255,255,0.08)"}`,
                    color: selectedRationaleIdx === idx ? "#fff" : "#cbd5e1"
                  }}
                >
                  {selectedRationaleIdx === idx ? "● " : "○ "}{rat}
                </button>
              ))}
            </div>
            <input
              dir="rtl"
              value={customRationaleNote}
              onChange={(e) => setCustomRationaleNote(e.target.value)}
              placeholder="הוסף משפט אישי על איך יישמת זאת בפרויקט שלך (אופציונלי)..."
              className="input-field"
              style={{ textAlign: "right", fontSize: 12 }}
            />
          </div>

          {/* Layer C: Engineering Scenario Question + Self-Audit Checklist */}
          <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.09)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>
              🧠 תרחיש אבחון הנדסי: {mod.quizQuestion}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              {mod.quizOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setQuizChoice(idx); setValidationError(""); }}
                  style={{
                    padding: "10px 12px", borderRadius: 10, textAlign: "right", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    background: quizChoice === idx ? "rgba(52, 211, 153, 0.18)" : "#12141a",
                    border: `1px solid ${quizChoice === idx ? "#34d399" : "rgba(255,255,255,0.08)"}`,
                    color: quizChoice === idx ? "#fff" : "#cbd5e1"
                  }}
                >
                  {quizChoice === idx ? "● " : "○ "}{opt}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24", marginBottom: 6 }}>
              ☑️ צ׳ק-ליסט בקרת איכות עצמית (חובה לאשר לפני נעילה):
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {rubric.auditChecklist.map((chk, idx) => (
                <label key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#e2e8f0", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={Boolean(checkedAuditItems[idx])}
                    onChange={(e) => { setCheckedAuditItems({ ...checkedAuditItems, [idx]: e.target.checked }); setValidationError(""); }}
                  />
                  <span>{chk}</span>
                </label>
              ))}
            </div>
          </div>

          {validationError && (
            <div style={{ padding: 12, borderRadius: 12, background: "rgba(248, 113, 113, 0.14)", border: "1px solid rgba(248, 113, 113, 0.4)", color: "#fca5a5", fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>
              {validationError}
            </div>
          )}

          <button
            type="button"
            disabled={submitting}
            onClick={runRubricVerification}
            className="btn-primary"
            style={{ background: accentColor, color: "#0a0b0e", height: 50, fontSize: 14 }}
          >
            <ShieldCheck size={17} />
            <span>{submitting ? "מאמת ראיות מול התקנון..." : `אמת ראיות ונעל אבן דרך #${mod.stepNumber} בתיק העבודות`}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
