"use client";

import React, { useEffect, useState } from "react";
import { Smartphone, Monitor, Send, Copy, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sanitizePlainText } from "@/lib/security-utils";
import { useStudioLang } from "@/lib/i18n-engine";

interface SyncItem {
  id: string;
  direction: "to-desktop" | "to-mobile";
  title: string;
  content: string;
  createdAt: string;
}

export default function PocketFieldStudio() {
  const { isHe, dir, t } = useStudioLang();
  const [tab, setTab] = useState<"sync" | "proposal">("sync");
  const [userId, setUserId] = useState<string | null>(null);
  const [builderName, setBuilderName] = useState<string>("");
  const [queue, setQueue] = useState<SyncItem[]>([]);

  const [direction, setDirection] = useState<"to-desktop" | "to-mobile">("to-desktop");
  const [itemTitle, setItemTitle] = useState("");
  const [itemContent, setItemContent] = useState("");

  const [clientName, setClientName] = useState("");
  const [packageTier, setPackageTier] = useState("Conversion Landing Engine + Lead Automation (v1.0)");
  const [priceAmount, setPriceAmount] = useState("750");
  const [deliveryDays, setDeliveryDays] = useState("4");
  const [msg, setMsg] = useState("");

  const notify = (txt: string) => { setMsg(txt); setTimeout(() => setMsg(""), 2800); };

  useEffect(() => { const loadSyncQueue = () => supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        const { data: prof } = await supabase.from("profiles").select("full_name, custom_prompts").eq("id", data.user.id).single();
        if (prof?.full_name) setBuilderName(prof.full_name);
        if (Array.isArray(prof?.custom_prompts)) {
          const syncOnly = (prof.custom_prompts as SyncItem[]).filter((x) => x.direction === "to-desktop" || x.direction === "to-mobile");
          setQueue(syncOnly);
        }
      } }); loadSyncQueue(); window.addEventListener("proofcraft:sync-now", loadSyncQueue); return () => window.removeEventListener("proofcraft:sync-now", loadSyncQueue); }, []);

  const saveQueue = async (next: SyncItem[]) => {
    setQueue(next);
    if (userId) {
      await supabase.from("profiles").update({ custom_prompts: next }).eq("id", userId); if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("proofcraft:sync-now"));
    }
  };

  const addSyncItem = async () => {
    const cleanT = sanitizePlainText(itemTitle, 90);
    const cleanC = sanitizePlainText(itemContent, 600);
    if (!cleanT || !cleanC) return notify(t("Please enter both a title and payload.", "נא למלא כותרת ותוכן להעברה"));

    const next: SyncItem[] = [
      { id: `sync-${Date.now()}`, direction, title: cleanT, content: cleanC, createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ...queue,
    ];
    await saveQueue(next);
    setItemTitle(""); setItemContent("");
    notify(direction === "to-desktop" ? t("Queued for Desktop Studio!", "נשמר לתור העבודה במחשב!") : t("Sent to Mobile Field View!", "נשלח לבדיקה בנייד!"));
  };

  const buildProposalText = () => {
    const portfolioUrl = typeof window !== "undefined" ? `${window.location.origin}/portfolio/live` : "https://vercel.app";
    if (isHe) {
      return `היי ${clientName || "שלום רב"},\nבהמשך לשיחתנו, להלן הצעת מחיר מסודרת להקמת המערכת:\n\n• פתרון נבחר: ${packageTier}\n• השקעה: ₪${priceAmount} (חד-פעמי)\n• זמן אספקה משוער: ${deliveryDays} ימי עסקים\n• כולל: התאמה מלאה למובייל, אבטחת SSL והדרכת שימוש.\n\nלצפייה בתיק העבודות המאומת שלי:\n${portfolioUrl}\n\nבברכה,\n${builderName || "בונה מערכות AI"}`;
    }
    return `Hi ${clientName || "there"},\nFollowing up on our conversation, here is a clear proposal for your build:\n\n• Selected Package: ${packageTier}\n• Investment: $${priceAmount} (one-time)\n• Estimated Delivery: ${deliveryDays} business days\n• Includes: Responsive mobile/desktop UI, SSL security, and handover walkthrough.\n\nInspect my Verified Live Portfolio:\n${portfolioUrl}\n\nBest regards,\n${builderName || "AI Systems Builder"}`;
  };

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 12, fontSize: 12.5 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <button type="button" onClick={() => setTab("sync")} className={tab === "sync" ? "btn-primary" : "btn-ghost"} style={{ fontSize: 11.5, padding: "8px 10px" }}>
          {t(`Mobile ↔ Desktop Sync (${queue.length})`, `סנכרון נייד ↔ מחשב (${queue.length})`)}
        </button>
        <button type="button" onClick={() => setTab("proposal")} className={tab === "proposal" ? "btn-primary" : "btn-ghost"} style={{ fontSize: 11.5, padding: "8px 10px" }}>
          {t("Quick Client Proposal", "הצעת מחיר מהירה בשטח")}
        </button>
      </div>

      {msg && (
        <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(52,211,153,0.14)", color: "#34d399", fontWeight: 700, fontSize: 12 }}>
          {msg}
        </div>
      )}

      {tab === "sync" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <button type="button" onClick={() => setDirection("to-desktop")} className="btn-ghost" style={{ borderColor: direction === "to-desktop" ? "#38bdf8" : undefined, color: direction === "to-desktop" ? "#38bdf8" : undefined, fontSize: 11.5 }}>
              <Monitor size={13} /> {t("Send to Desktop", "שלח למחשב")}
            </button>
            <button type="button" onClick={() => setDirection("to-mobile")} className="btn-ghost" style={{ borderColor: direction === "to-mobile" ? "#34d399" : undefined, color: direction === "to-mobile" ? "#34d399" : undefined, fontSize: 11.5 }}>
              <Smartphone size={13} /> {t("Send to Mobile", "שלח לנייד")}
            </button>
          </div>
          <input value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} placeholder={t("Title (e.g., Client Notes / API Snippet)", "כותרת (לדוגמה: הערות לקוח / קוד)")} className="input-dark" />
          <textarea rows={3} value={itemContent} onChange={(e) => setItemContent(e.target.value)} placeholder={t("Paste prompt, URL, or field notes...", "הדבק פרומפט, קישור או הערה...")} className="input-dark" />
          <button type="button" onClick={addSyncItem} className="btn-primary">
            <Send size={13} /> {t("Sync Across Devices", "סנכרן בין מכשירים")}
          </button>

          {queue.map((item) => (
            <div key={item.id} style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>{item.direction === "to-desktop" ? t("-> DESKTOP", "-> \u05DC\u05DE\u05D7\u05E9\u05D1") : t("-> MOBILE", "-> \u05DC\u05E0\u05D9\u05D9\u05D3")} · {item.createdAt}</div>
                <strong style={{ color: "#f8fafc" }}>{item.title}</strong>
                <div style={{ color: "#cbd5e1", marginTop: 2 }}>{item.content}</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(item.content); notify(t("Copied!", "הועתק!")); }} className="btn-ghost" style={{ padding: 6 }}><Copy size={12} /></button>
                <button type="button" onClick={() => saveQueue(queue.filter((x) => x.id !== item.id))} className="btn-ghost" style={{ padding: 6, color: "#f87171" }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={t("Client / Company Name", "שם הלקוח / החברה")} className="input-dark" />
          <input value={packageTier} onChange={(e) => setPackageTier(e.target.value)} placeholder={t("Deliverable Scope", "היקף המערכת")} className="input-dark" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input value={priceAmount} onChange={(e) => setPriceAmount(e.target.value)} placeholder={t("Price ($)", "מחיר (₪)")} className="input-dark" />
            <input value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} placeholder={t("Delivery Days", "ימי אספקה")} className="input-dark" />
          </div>
          <pre style={{ padding: 10, borderRadius: 10, background: "#05070a", color: "#e2e8f0", fontSize: 11.5, whiteSpace: "pre-wrap", border: "1px solid rgba(255,255,255,0.08)" }}>
            {buildProposalText()}
          </pre>
          <button type="button" onClick={() => { navigator.clipboard?.writeText(buildProposalText()); notify(t("Proposal copied to clipboard!", "הצעת המחיר הועתקה!")); }} className="btn-primary">
            <Copy size={13} /> {t("Copy Client Proposal", "העתק הצעת מחיר")}
          </button>
        </div>
      )}
    </div>
  );
}
