"use client";

import React, { useState } from "react";
import { Lightbulb, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sanitizeExternalUrl, sanitizePlainText } from "@/lib/security-utils";
import { useStudioLang } from "@/lib/i18n-engine";
import GlobalModal from "./GlobalModal";

interface Props {
  userId: string | null;
  authorName: string;
  onNotify: (msg: string) => void;
}

export default function SuggestToolButton({ userId, authorName, onNotify }: Props) {
  const { isHe, dir, t } = useStudioLang();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState("3");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!userId) return onNotify(t("Sign in to suggest a new tool to the matrix", "התחבר כדי להציע כלי חדש לארגז הכלים"));
    const cleanName = sanitizePlainText(name, 80);
    const cleanReason = sanitizePlainText(reason, 300);
    if (!cleanName || !cleanReason) return onNotify(t("Please enter the tool name and a concise explanation of its value", "נא למלא שם כלי והסבר קצר על הערך שלו"));

    const urlCheck = sanitizeExternalUrl(url);
    if (!urlCheck.valid) return onNotify(urlCheck.error || t("Invalid HTTPS URL", "כתובת אינטרנט לא תקינה"));

    setSaving(true);
    await supabase.from("tool_suggestions").insert({
      user_id: userId,
      author_name: sanitizePlainText(authorName || "ProofCraft Builder", 60),
      tool_name: cleanName,
      tool_url: urlCheck.cleanUrl,
      stage_number: Number(stage) || 3,
      reason: cleanReason,
      status: "pending",
    });
    setSaving(false);
    setName(""); setUrl(""); setReason("");
    setOpen(false);
    onNotify(t(
      "Tool suggestion submitted for admin review! Earn +15 Peer Karma upon approval.",
      "ההצעה נשלחה לאישור צוות ProofCraft! לאחר אישור תזכה ב-+15 קרמה."
    ));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => (userId ? setOpen(true) : onNotify(t("Sign in to suggest a new tool", "התחבר כדי להציע כלי חדש")))}
        className="badge-pill"
        style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 11, cursor: "pointer", border: "1px solid rgba(251,191,36,0.35)" }}
      >
        <Lightbulb size={12} /> <span>{t("Suggest a Tool", "הצע כלי חדש")}</span>
      </button>

      <GlobalModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={t("Suggest an AI / Dev Tool to the Matrix", "הצעת כלי AI / פיתוח חדש לארגז הכלים")}
        primaryLabel={saving ? t("Submitting...", "שולח...") : t("Submit for Review", "שלח הצעה לבדיקה")}
        onPrimaryAction={handleSubmit}
      >
        <div dir={dir} style={{ textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>
            {t(
              "Know a high-leverage developer or AI tool? Submit it for admin verification — approved additions award +15 Peer Karma!",
              "מכיר כלי חדשני שחוסך זמן או משפר ביצועים? שלח אותו לבדיקת הצוות — אם יאושר ויתווסף לקטלוג תקבל בונוס +15 Peer Karma!"
            )}
          </p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Tool Name (e.g., Drizzle ORM / Resend)", "שם הכלי (לדוגמה: Drizzle ORM)")} className="input-dark" />
          <input dir="ltr" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="input-dark" style={{ textAlign: "left" }} />
          <select value={stage} onChange={(e) => setStage(e.target.value)} className="input-dark">
            <option value="1">{t("Stage 1: Architecture & Spec", "קטגוריה 1: אפיון וארכיטקטורה")}</option>
            <option value="2">{t("Stage 2: UI/UX Design", "קטגוריה 2: עיצוב UI/UX")}</option>
            <option value="3">{t("Stage 3: AI & Code Generation", "קטגוריה 3: פיתוח ו-AI Coding")}</option>
            <option value="4">{t("Stage 4: Database & Auth", "קטגוריה 4: מסד נתונים ואימות")}</option>
            <option value="5">{t("Stage 5: Security & QA", "קטגוריה 5: אבטחה, QA וביצועים")}</option>
            <option value="6">{t("Stage 6: Deployment & Growth", "קטגוריה 6: פריסה, סליקה ושיווק")}</option>
          </select>
          <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("What problem does it solve and why recommend it?", "איזו בעיה הכלי פותר ולמה הוא מומלץ לבונים?")} className="input-dark" />
          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
            <Send size={11} /> {t("Every suggested tool is manually verified before public listing.", "כל כלי נבדק ידנית ע״י מנהל המערכת לפני פרסום לציבור.")}
          </div>
        </div>
      </GlobalModal>
    </>
  );
}
