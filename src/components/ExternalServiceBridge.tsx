"use client";

import React, { useState } from "react";
import { ExternalLink, Copy, CheckCircle2, ShieldAlert, ArrowUpLeft } from "lucide-react";
import GlobalModal from "./GlobalModal";
import { sanitizeExternalUrl } from "@/lib/security-utils";

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
  buttonLabel = "פתח שירות מודרך",
  buttonStyle,
  isUserSubmittedLink = false,
}: ExternalServiceBridgeProps) {
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
          background: "rgba(36,129,204,0.18)",
          color: "#2481cc",
          fontSize: 11,
          cursor: "pointer",
          border: "1px solid rgba(36,129,204,0.35)",
          ...buttonStyle,
        }}
      >
        <span>{buttonLabel}</span>
        <ExternalLink size={11} />
      </button>

      <GlobalModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={`🧭 מדריך מעבר חכם: ${serviceName}`}
        primaryLabel={check.valid ? `המשך ל-${serviceName} בחלון חדש` : undefined}
        onPrimaryAction={check.valid ? handleProceed : undefined}
      >
        <div dir="rtl" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
          {!check.valid ? (
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.4)", color: "#ff6b6b" }}>
              ⚠️ {check.error}
            </div>
          ) : (
            <>
              {isUserSubmittedLink && (
                <div style={{ padding: 10, borderRadius: 10, background: "rgba(252,196,25,0.1)", border: "1px solid rgba(252,196,25,0.35)", color: "#fcc419", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldAlert size={15} />
                  <span>קישור חיצוני ששותף ע״י יוצר בקהילה. הקפד לעולם לא להזין סיסמאות או פרטי אשראי באתרים חיצוניים.</span>
                </div>
              )}

              <div style={{ padding: 12, borderRadius: 12, background: "#131a26", border: "1px solid rgba(151,117,250,0.3)" }}>
                <div style={{ fontWeight: 800, color: "#9775fa", marginBottom: 4 }}>1. למה עוברים לשירות הזה עכשיו?</div>
                <div style={{ color: "#e6edf7", lineHeight: 1.5 }}>{contextWhy}</div>
              </div>

              <div style={{ padding: 12, borderRadius: 12, background: "#131a26", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontWeight: 800, color: "#2481cc", marginBottom: 6 }}>2. מה בדיוק לעשות בתוך האתר החיצוני:</div>
                <ol style={{ paddingRight: 18, color: "#e6edf7", lineHeight: 1.6 }}>
                  {stepsToPerform.map((st, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{st}</li>
                  ))}
                </ol>
              </div>

              {optionalPrompt && (
                <div style={{ padding: 10, borderRadius: 10, background: "rgba(81,207,102,0.08)", border: "1px solid rgba(81,207,102,0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, color: "#51cf66", fontSize: 11 }}>פרומפט מוכן להדבקה שם:</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(optionalPrompt);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2500);
                      }}
                      style={{ background: "#51cf66", color: "#0b0f17", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                    >
                      <Copy size={11} /> {copied ? "הועתק ✓" : "העתק פרומפט"}
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: "#b8c1cf", lineHeight: 1.4 }}>{optionalPrompt}</div>
                </div>
              )}

              <div style={{ padding: 10, borderRadius: 10, background: "rgba(252,196,25,0.08)", border: "1px solid rgba(252,196,25,0.28)", color: "#fcc419", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={14} />
                <span><strong>מה מביאים חזרה ל-ProofCraft בסיום:</strong> {whatToBringBack}</span>
              </div>

              <div style={{ fontSize: 10, color: "#7a8699", display: "flex", alignItems: "center", gap: 4 }}>
                <ArrowUpLeft size={12} /> האתר החיצוני ייפתח בלשונית חדשה — ProofCraft יישאר פתוח כאן בדיוק בנקודה שעצרת.
              </div>
            </>
          )}
        </div>
      </GlobalModal>
    </>
  );
}
