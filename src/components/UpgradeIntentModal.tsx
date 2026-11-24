"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { sanitizePlainText } from "@/lib/security-utils";
import GlobalModal from "./GlobalModal";

interface UpgradeIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTier: number;
  tierName: string;
  deltaUsd: number;
  deltaIls: number;
  userId?: string | null;
  defaultName?: string;
  defaultEmail?: string;
}

export default function UpgradeIntentModal({
  isOpen, onClose, targetTier, tierName, deltaUsd, deltaIls, userId, defaultName = "", defaultEmail = ""
}: UpgradeIntentModalProps) {
  const { isHe, dir, t } = useStudioLang();
  const [fullName, setFullName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [intentType, setIntentType] = useState<"founder_reservation" | "notify_live" | "team_quote">("founder_reservation");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setFullName(defaultName || "");
    setEmail(defaultEmail || "");
    setSubmitted(false);
    setErrMsg("");
  }, [isOpen, defaultName, defaultEmail, targetTier]);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return setErrMsg(t("Please enter a valid email address.", "נא להזין כתובת אימייל תקינה."));
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("upgrade_intents").insert({
        user_id: userId || null,
        full_name: sanitizePlainText(fullName || cleanEmail.split("@")[0], 80),
        email: cleanEmail.slice(0, 140),
        market_region: isHe ? "ISRAEL" : "GLOBAL",
        target_tier: targetTier,
        intent_type: intentType,
        quoted_usd: deltaUsd,
        quoted_ils: deltaIls,
        note: sanitizePlainText(note, 300),
        status: "waiting",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: unknown) {
      setErrMsg(err instanceof Error ? err.message : t("Could not save reservation. Please try again.", "שגיאה בשמירת הבקשה, נסה שוב."));
    } finally {
      setSubmitting(false);
    }
  };
  const formattedPrice = isHe ? `₪${deltaIls}` : `$${deltaUsd}`;

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title={t(`Reserve ${tierName} · Founder Access`, `שריון גישת מייסדים · ${tierName}`)}
    >
      <div dir={dir} style={{ textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 14 }}>
        {submitted ? (
          <div style={{ padding: 18, borderRadius: 14, background: "rgba(52, 211, 153, 0.12)", border: "1px solid rgba(52, 211, 153, 0.4)", textAlign: "center" }}>
            <CheckCircle2 size={32} color="#34d399" style={{ margin: "0 auto 8px" }} />
            <h3 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
              {t("Founder Spot & Upgrade-Delta Price Locked!", "מקומך ומחיר המייסדים נשמרו בהצלחה!")}
            </h3>
            <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 14 }}>
              {t(
                `Your ${formattedPrice} Upgrade-Delta quote for ${tierName} is reserved with zero charge today. You will receive priority checkout access as soon as the cohort gate opens.`,
                `הצעת השדרוג שלך בסך ${formattedPrice} עבור ${tierName} נשמרה ללא חיוב כרגע. תקבל קישור אישי לפתיחת המסלול ברגע שמכסת המחזור תיפתח.`
              )}
            </p>
            <button type="button" onClick={onClose} className="btn-primary" style={{ width: "auto", padding: "0 24px" }}>
              {t("Back to Studio", "חזור לסטודיו")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleReserve} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: 12, borderRadius: 12, background: "rgba(251, 191, 36, 0.1)", border: "1px solid rgba(251, 191, 36, 0.35)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#fbbf24" }}>
                  <Lock size={12} style={{ display: "inline", marginRight: 4 }} />
                  {t("100% UPGRADE-DELTA FOUNDER QUOTE", "הצעת מחיר מייסדים (Upgrade-Delta)")}
                </div>
                <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                  {t("Zero charge today · No commitment until checkout opens", "ללא חיוב כרגע · שריון מחיר מוקדם למחזור ההשקה")}
                </div>
              </div>
              <span className="tabular-nums" style={{ fontSize: 20, fontWeight: 900, color: "#34d399" }}>{formattedPrice}</span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#e2e8f0", marginBottom: 6 }}>
                {t("Select Reservation Type:", "בחר סוג שריון:")}
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { id: "founder_reservation", label: t("Founder Lock — Ready to upgrade when cohort opens", "שריון מחיר מייסדים — מוכן לשדרוג עם פתיחת המחזור") },
                  { id: "notify_live", label: t("Early Access Waitlist — Notify me when live checkout opens", "רשימת המתנה — עדכנו אותי כשהסליקה החיה נפתחת") },
                  { id: "team_quote", label: t("Team / Agency Cohort — Request multi-seat license", "חבילת צוות / סוכנות — בקשה להצעת מחיר מרוכזת") },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIntentType(opt.id as "founder_reservation" | "notify_live" | "team_quote")}
                    style={{
                      padding: "9px 12px", borderRadius: 10, textAlign: isHe ? "right" : "left", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      background: intentType === opt.id ? "rgba(56, 189, 248, 0.18)" : "#0a0b0e",
                      border: `1px solid ${intentType === opt.id ? "#38bdf8" : "rgba(255,255,255,0.08)"}`,
                      color: intentType === opt.id ? "#fff" : "#cbd5e1"
                    }}
                  >
                    {intentType === opt.id ? "● " : "○ "}{opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("Your Name", "השם שלך")}
                className="input-dark"
                style={{ width: "100%" }}
              />
              <input
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-dark"
                style={{ width: "100%", textAlign: "left" }}
              />
            </div>

            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("Optional: What system are you building next?", "אופציונלי: איזו מערכת תרצה לבנות במסלול זה?")}
              className="input-dark"
              style={{ width: "100%", fontSize: 13 }}
            />

            {errMsg && (
              <div style={{ padding: 10, borderRadius: 10, background: "rgba(248,113,113,0.14)", color: "#fca5a5", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertCircle size={14} /> <span>{errMsg}</span>
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary" style={{ height: 46, fontSize: 14 }}>
              <Sparkles size={15} />
              <span>{submitting ? t("Locking Reservation...", "שומר שריון...") : t(`Lock ${formattedPrice} Founder Spot (Free Today)`, `שריין מקום במחיר ${formattedPrice} (ללא חיוב היום)`)}</span>
            </button>

            <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
              <ShieldCheck size={12} style={{ display: "inline", marginRight: 4 }} />
              {t("No payment collected today · Instant admin priority queue", "אין גביית תשלום כרגע · כניסה מיידית לתור העדיפות")}
            </div>
          </form>
        )}
      </div>
    </GlobalModal>
  );
}
