"use client";

import React, { useState } from "react";
import { ExternalLink, Copy, CheckCircle2, ShieldAlert } from "lucide-react";
import GlobalModal from "./GlobalModal";
import { sanitizeExternalUrl } from "@/lib/security-utils";
import { useStudioLang } from "@/lib/i18n-engine";

interface ExternalServiceBridgeProps {
  serviceName: string;
  targetUrl: string;
  contextWhy: string;
  stepsToPerform: string[];
  whatToBringBack: string;
  optionalPrompt?: string;
  buttonLabel?: string;
  buttonStyle?: React.CSSProperties;
  isUserSubmittedLink?: boolean;
}

export default function ExternalServiceBridge({
  serviceName,
  targetUrl,
  contextWhy,
  stepsToPerform,
  whatToBringBack,
  optionalPrompt,
  buttonLabel,
  buttonStyle,
  isUserSubmittedLink = false,
}: ExternalServiceBridgeProps) {
  const { isHe, dir, t } = useStudioLang();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const check = sanitizeExternalUrl(targetUrl);

  const handleProceed = () => {
    if (!check.valid) return;
    window.open(check.cleanUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="badge-pill"
        style={{
          background: "rgba(56,189,248,0.16)",
          color: "#38bdf8",
          fontSize: 11,
          cursor: "pointer",
          border: "1px solid rgba(56,189,248,0.35)",
          ...buttonStyle,
        }}
      >
        <span>{buttonLabel || t("Launch Guided Service", "פתח שירות מודרך")}</span>
        <ExternalLink size={11} />
      </button>

      <GlobalModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={t(`Smart Action Guide: ${serviceName}`, `מדריך מעבר חכם: ${serviceName}`)}
        primaryLabel={check.valid ? t(`Continue to ${serviceName} →`, `המשך ל-${serviceName} בחלון חדש`) : undefined}
        onPrimaryAction={check.valid ? handleProceed : undefined}
      >
        <div dir={dir} style={{ textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 12, fontSize: 12.5 }}>
          {!check.valid ? (
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.4)", color: "#f87171" }}>
              {check.error}
            </div>
          ) : (
            <>
              {isUserSubmittedLink && (
                <div style={{ padding: 10, borderRadius: 10, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.35)", color: "#fbbf24", fontSize: 11.5, display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldAlert size={15} />
                  <span>{t("Community-shared external URL. Never enter passwords or payment credentials on unverified third-party domains.", "קישור חיצוני ששותף ע״י יוצר בקהילה. הקפד לעולם לא להזין סיסמאות או פרטי אשראי באתרים חיצוניים.")}</span>
                </div>
              )}

              <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(129,140,248,0.3)" }}>
                <div style={{ fontWeight: 800, color: "#818cf8", marginBottom: 4 }}>{t("1. Objective & Context", "1. למה עוברים לשירות הזה עכשיו?")}</div>
                <div style={{ color: "#e2e8f0", lineHeight: 1.5 }}>{contextWhy}</div>
              </div>

              <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontWeight: 800, color: "#38bdf8", marginBottom: 6 }}>{t("2. Execution Steps", "2. מה בדיוק לבצע בתוך השירות:")}</div>
                <ol style={{ paddingLeft: isHe ? 0 : 18, paddingRight: isHe ? 18 : 0, color: "#e2e8f0", lineHeight: 1.6 }}>
                  {stepsToPerform.map((st, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{st}</li>
                  ))}
                </ol>
              </div>

              {optionalPrompt && (
                <div style={{ padding: 10, borderRadius: 10, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, color: "#34d399", fontSize: 11 }}>{t("Ready-to-Use Prompt", "פרומפט מוכן להעתקה")}</span>
                    <button
                      type="button"
                      onClick={() => { navigator.clipboard?.writeText(optionalPrompt); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      style={{ background: "none", border: "none", color: "#34d399", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                    >
                      {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                      <span>{copied ? t("Copied!", "הועתק!") : t("Copy", "העתק")}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#cbd5e1", lineHeight: 1.5 }}>{optionalPrompt}</div>
                </div>
              )}

              <div style={{ padding: 10, borderRadius: 10, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", fontSize: 12, color: "#bae6fd" }}>
                <strong>{t("Deliverable to Bring Back:", "מה להחזיר לסטודיו:")}</strong> {whatToBringBack}
              </div>
            </>
          )}
        </div>
      </GlobalModal>
    </>
  );
}
