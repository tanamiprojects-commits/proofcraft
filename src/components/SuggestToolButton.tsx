"use client";

import React, { useState } from "react";
import { Lightbulb, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sanitizeExternalUrl, sanitizePlainText } from "@/lib/security-utils";
import GlobalModal from "./GlobalModal";

interface Props {
  userId: string | null;
  authorName: string;
  onNotify: (msg: string) => void;
}

export default function SuggestToolButton({ userId, authorName, onNotify }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState("3");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!userId) return onNotify("התחבר כדי להציע כלי חדש לארגז הכלים");
    const cleanName = sanitizePlainText(name, 80);
    const cleanReason = sanitizePlainText(reason, 300);
    if (!cleanName || !cleanReason) return onNotify("נא למלא שם כלי והסבר קצר על הערך שלו");

    const urlCheck = sanitizeExternalUrl(url);
    if (!urlCheck.valid) return onNotify(urlCheck.error || "כתובת אינטרנט לא תקינה");

    setSaving(true);
    await supabase.from("tool_suggestions").insert({
      user_id: userId,
      author_name: sanitizePlainText(authorName || "בונה AI", 60),
      tool_name: cleanName,
      tool_url: urlCheck.cleanUrl,
      stage_number: Number(stage) || 3,
      reason: cleanReason,
      status: "pending",
    });
    setSaving(false);
    setName(""); setUrl(""); setReason("");
    setOpen(false);
    onNotify("✓ ההצעה נשלחה לאישור צוות ProofCraft! לאחר אישור תזכה ב-+15 קרמה.");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => (userId ? setOpen(true) : onNotify("התחבר כדי להציע כלי חדש לארגז הכלים"))}
        className="badge-pill"
        style={{ background: "rgba(252,196,25,0.16)", color: "#fcc419", fontSize: 11, cursor: "pointer", border: "1px solid rgba(252,196,25,0.35)" }}
      >
        <Lightbulb size={12} /> <span>הצע כלי חדש</span>
      </button>

      <GlobalModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="💡 הצעת כלי AI / פיתוח חדש לארגז הכלים"
        primaryLabel={saving ? "שולח..." : "שלח הצעה לבדיקה"}
        onPrimaryAction={handleSubmit}
      >
        <div dir="rtl" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 11, color: "#b8c1cf", lineHeight: 1.5 }}>
            מכיר כלי חדשני שחוסך זמן או משפר ביצועים? שלח אותו לבדיקת הצוות — אם יאושר ויתווסף לקטלוג תקבל בונוס <strong>+15 Peer Karma</strong>!
          </p>
          <input dir="rtl" value={name} onChange={(e) => setName(e.target.value)} placeholder="שם הכלי (לדוגמה: v0.dev / Drizzle ORM)" className="input-field" style={{ textAlign: "right" }} />
          <input dir="ltr" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="input-field" style={{ textAlign: "left" }} />
          <select dir="rtl" value={stage} onChange={(e) => setStage(e.target.value)} className="input-field" style={{ textAlign: "right" }}>
            <option value="1">קטגוריה 1: אפיון וארכיטקטורה</option>
            <option value="2">קטגוריה 2: עיצוב UI/UX</option>
            <option value="3">קטגוריה 3: פיתוח ו-AI Coding</option>
            <option value="4">קטגוריה 4: מסד נתונים ואימות</option>
            <option value="5">קטגוריה 5: אבטחה, QA וביצועים</option>
            <option value="6">קטגוריה 6: פריסה, סליקה ושיווק</option>
          </select>
          <textarea dir="rtl" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="איזו בעיה הכלי פותר ולמה הוא מומלץ לבונים?" className="input-field" style={{ textAlign: "right" }} />
          <div style={{ fontSize: 10, color: "#7a8699", display: "flex", alignItems: "center", gap: 4 }}>
            <Send size={11} /> כל כלי נבדק ידנית ע״י מנהל המערכת לפני פרסום לציבור.
          </div>
        </div>
      </GlobalModal>
    </>
  );
}
