"use client";

import React, { useEffect, useState } from "react";
import { Smartphone, Monitor, Send, Copy, CheckCircle2, Trash2, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sanitizePlainText } from "@/lib/security-utils";

interface SyncItem {
  id: string;
  direction: "to-desktop" | "to-mobile";
  title: string;
  content: string;
  createdAt: string;
}

export default function PocketFieldStudio() {
  const [tab, setTab] = useState<"sync" | "proposal">("sync");
  const [userId, setUserId] = useState<string | null>(null);
  const [builderName, setBuilderName] = useState<string>("");
  const [queue, setQueue] = useState<SyncItem[]>([]);

  const [direction, setDirection] = useState<"to-desktop" | "to-mobile">("to-desktop");
  const [itemTitle, setItemTitle] = useState("");
  const [itemContent, setItemContent] = useState("");

  const [clientName, setClientName] = useState("");
  const [packageTier, setPackageTier] = useState("דף נחיתה ממיר + מנוע הזמנות WhatsApp (v1.0)");
  const [priceIls, setPriceIls] = useState("2,200");
  const [deliveryDays, setDeliveryDays] = useState("4");
  const [msg, setMsg] = useState("");

  const notify = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 2800); };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        const { data: prof } = await supabase.from("profiles").select("full_name, custom_prompts").eq("id", data.user.id).single();
        if (prof?.full_name) setBuilderName(prof.full_name);
        if (Array.isArray(prof?.custom_prompts)) {
          const syncOnly = (prof.custom_prompts as SyncItem[]).filter((x) => x.direction === "to-desktop" || x.direction === "to-mobile");
          setQueue(syncOnly);
        }
      }
    });
  }, []);

  const saveQueue = async (next: SyncItem[]) => {
    setQueue(next);
    if (userId) {
      await supabase.from("profiles").update({ custom_prompts: next }).eq("id", userId);
    }
  };

  const addSyncItem = async () => {
    const cleanT = sanitizePlainText(itemTitle, 90);
    const cleanC = sanitizePlainText(itemContent, 600);
    if (!cleanT || !cleanC) return notify("נא למלא כותרת ותוכן להעברה");

    const next: SyncItem[] = [
      { id: `sync-${Date.now()}`, direction, title: cleanT, content: cleanC, createdAt: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }) },
      ...queue,
    ];
    await saveQueue(next);
    setItemTitle(""); setItemContent("");
    notify(direction === "to-desktop" ? "✓ נשמר לתור העבודה במחשב!" : "✓ נשלח לבדיקה ושיתוף בנייד!");
  };

  const buildProposalText = () => {
    const portfolioUrl = typeof window !== "undefined" ? `${window.location.origin}/portfolio/live` : "https://proofcraft.app";
    return `היי ${clientName || "שלום רב"},\nבהמשך לשיחתנו, להלן הצעת מחיר מסודרת להקמת המערכת:\n\n• פתרון נבחר: ${packageTier}\n• השקעה: ₪${priceIls} (חד-פעמי)\n• זמן אספקה משוער: ${deliveryDays} ימי עסקים\n• כולל: התאמה מלאה למובייל (RTL), אבטחת SSL, נגישות והדרכת שימוש.\n\nלצפייה בתיק העבודות המאומת שלי:\n${portfolioUrl}\n\nבברכה,\n${builderName || "בונה מערכות AI"}`;
  };
  return (
    <div dir="rtl" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <button type="button" onClick={() => setTab("sync")} style={{
          padding: "9px 8px", borderRadius: 10, fontWeight: 800, fontSize: 11, cursor: "pointer",
          background: tab === "sync" ? "#2481cc" : "#182235", color: "#fff", border: "none"
        }}>
          🔄 סנכרון נייד ↔ מחשב ({queue.length})
        </button>
        <button type="button" onClick={() => setTab("proposal")} style={{
          padding: "9px 8px", borderRadius: 10, fontWeight: 800, fontSize: 11, cursor: "pointer",
          background: tab === "proposal" ? "#51cf66" : "#182235", color: tab === "proposal" ? "#090d16" : "#fff", border: "none"
        }}>
          📄 הצעת מחיר מהירה בשטח
        </button>
      </div>

      {tab === "sync" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <button type="button" onClick={() => setDirection("to-desktop")} style={{
              padding: 8, borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: direction === "to-desktop" ? "rgba(151,117,250,0.2)" : "#090d16",
              color: direction === "to-desktop" ? "#9775fa" : "#94a3b8",
              border: `1px solid ${direction === "to-desktop" ? "#9775fa" : "rgba(255,255,255,0.08)"}`
            }}>
              <Monitor size={13} style={{ display: "inline", marginLeft: 4 }} /> שמור לעבודה במחשב
            </button>
            <button type="button" onClick={() => setDirection("to-mobile")} style={{
              padding: 8, borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: direction === "to-mobile" ? "rgba(81,207,102,0.2)" : "#090d16",
              color: direction === "to-mobile" ? "#51cf66" : "#94a3b8",
              border: `1px solid ${direction === "to-mobile" ? "#51cf66" : "rgba(255,255,255,0.08)"}`
            }}>
              <Smartphone size={13} style={{ display: "inline", marginLeft: 4 }} /> שלח להצגה בנייד
            </button>
          </div>

          <input value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} placeholder="כותרת קצרה (לדוגמה: פרומפט לדף קליניקה / לינק להדגמה)" className="input-field" />
          <textarea rows={2} value={itemContent} onChange={(e) => setItemContent(e.target.value)} placeholder="הדבק כאן פרומפט, רעיון מפגישה או קישור חי..." className="input-field" />
          <button type="button" onClick={addSyncItem} className="btn-primary" style={{ height: 38 }}>
            <Send size={13} /> סנכרן לענן עכשיו
          </button>

          {queue.length === 0 ? (
            <div style={{ padding: 12, borderRadius: 10, background: "#090d16", color: "#64748b", textAlign: "center", fontSize: 11 }}>
              התור ריק. שמור כאן פרומפטים מהנייד או קישורים להדגמה מהמחשב.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 210, overflowY: "auto" }}>
              {queue.map((q) => (
                <div key={q.id} style={{ padding: 10, borderRadius: 10, background: "#090d16", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: q.direction === "to-desktop" ? "#9775fa" : "#51cf66" }}>
                      {q.direction === "to-desktop" ? "💻 למחשב" : "📱 לנייד"} · {q.createdAt}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" onClick={() => { navigator.clipboard?.writeText(q.content); notify("✓ הועתק!"); }} style={{ background: "none", border: "none", color: "#2481cc", cursor: "pointer" }}><Copy size={13} /></button>
                      <button type="button" onClick={() => saveQueue(queue.filter((x) => x.id !== q.id))} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer" }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, marginBottom: 2 }}>{q.title}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", wordBreak: "break-word" }}>{q.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="שם הלקוח / העסק" className="input-field" />
          <select value={packageTier} onChange={(e) => setPackageTier(e.target.value)} className="input-field">
            <option>דף נחיתה ממיר + מנוע הזמנות WhatsApp (v1.0)</option>
            <option>מערכת SaaS לניהול תורים ולקוחות בענן (v2.0)</option>
            <option>מערכת סליקה מאומתת ואוטומציית Telegram (v3.0)</option>
            <option>פלטפורמת Enterprise רב-צוותית + AI Copilot (v4.0)</option>
          </select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input value={priceIls} onChange={(e) => setPriceIls(e.target.value)} placeholder="מחיר (₪)" className="input-field" />
            <input value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} placeholder="ימי אספקה" className="input-field" />
          </div>
          <div style={{ padding: 10, borderRadius: 10, background: "#090d16", border: "1px solid rgba(81,207,102,0.3)", fontSize: 11 }}>
            <div style={{ fontWeight: 800, color: "#51cf66", marginBottom: 4 }}><FileText size={12} style={{ display: "inline" }} /> תצוגה מקדימה להצעה:</div>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", color: "#e2e8f0" }}>{buildProposalText()}</pre>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button type="button" onClick={() => { navigator.clipboard?.writeText(buildProposalText()); notify("✓ הצעת המחיר הועתקה!"); }} className="btn-ghost" style={{ height: 38 }}>
              <Copy size={13} /> העתק טקסט
            </button>
            <a href={`https://wa.me{encodeURIComponent(buildProposalText())}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ height: 38, background: "#51cf66", color: "#090d16" }}>
              שלח בוואטסאפ
            </a>
          </div>
        </div>
      )}

      {msg && (
        <div style={{ padding: 8, borderRadius: 8, background: "rgba(81,207,102,0.14)", color: "#51cf66", fontSize: 11, fontWeight: 700, textAlign: "center" }}>
          <CheckCircle2 size={12} style={{ display: "inline", marginLeft: 4 }} /> {msg}
        </div>
      )}
    </div>
  );
}
