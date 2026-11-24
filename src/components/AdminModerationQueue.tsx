"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, CheckCircle2, XCircle, Lightbulb, MessageSquare, FileCheck2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PendingPost { id: string; author_name: string; project_title: string; summary: string; live_url: string; }
interface PendingComment { id: string; post_id: string; author_name: string; review_tag: string; body: string; }
interface ToolSuggestion { id: string; user_id: string | null; author_name: string; tool_name: string; tool_url: string; stage_number: number; reason: string; }

export default function AdminModerationQueue() {
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const [toolSuggestions, setToolSuggestions] = useState<ToolSuggestion[]>([]);
  const [toast, setToast] = useState("");

  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  const loadQueue = async () => {
    const [pRes, cRes, tRes] = await Promise.all([
      supabase.from("feed_posts").select("id, author_name, project_title, summary, live_url").eq("status", "pending_admin"),
      supabase.from("feed_comments").select("id, post_id, author_name, review_tag, body").eq("status", "pending_admin"),
      supabase.from("tool_suggestions").select("*").eq("status", "pending"),
    ]);
    setPendingPosts(pRes.data || []);
    setPendingComments(cRes.data || []);
    setToolSuggestions(tRes.data || []);
  };

  useEffect(() => { loadQueue(); }, []);

  const handlePostDecision = async (id: string, approve: boolean) => {
    if (approve) {
      await supabase.from("feed_posts").update({ status: "approved" }).eq("id", id);
      notify("✓ פרסום האורח אושר והוצג בקיר הקהילה!");
    } else {
      await supabase.from("feed_posts").delete().eq("id", id);
      notify("✕ פרסום האורח נדחה ונמחק.");
    }
    loadQueue();
  };

  const handleCommentDecision = async (id: string, approve: boolean) => {
    if (approve) {
      await supabase.from("feed_comments").update({ status: "approved" }).eq("id", id);
      notify("✓ תגובת האורח אושרה!");
    } else {
      await supabase.from("feed_comments").delete().eq("id", id);
      notify("✕ תגובת האורח נמחקה.");
    }
    loadQueue();
  };

  const handleToolDecision = async (item: ToolSuggestion, approve: boolean) => {
    if (approve) {
      await supabase.from("tool_suggestions").update({ status: "approved" }).eq("id", item.id);
      await supabase.from("dev_tools").insert({
        id: `community-tool-${Date.now()}`,
        stage_number: item.stage_number,
        stage_title: `כלי מומלץ מהקהילה (שלב ${item.stage_number})`,
        name: item.tool_name,
        category: "Community Verified",
        short_desc: item.reason,
        full_explanation: item.reason,
        actions_list: ["התחבר לכלי הרשמי", "הגדר סביבת עבודה", "סמן שליטה ב-ProofCraft"],
        pricing_summary: "מומלץ קהילה",
        user_requirements: ["חשבון פעיל"],
        core_capabilities: ["פיתוח וייעול"],
        official_url: item.tool_url,
        verification_label: "הוטמע בהצלחה",
        is_active: true,
      });
      if (item.user_id) {
        const { data: prof } = await supabase.from("profiles").select("peer_karma").eq("id", item.user_id).single();
        await supabase.from("profiles").update({ peer_karma: (prof?.peer_karma || 0) + 15 }).eq("id", item.user_id);
      }
      notify(`✓ הכלי ${item.tool_name} אושר, נוסף לארגז הכלים והמציע זוכה ב-+15 קרמה!`);
    } else {
      await supabase.from("tool_suggestions").update({ status: "rejected" }).eq("id", item.id);
      notify("✕ הצעת הכלי נדחתה.");
    }
    loadQueue();
  };

  const totalPending = pendingPosts.length + pendingComments.length + toolSuggestions.length;

  return (
    <div className="card-hero" style={{ padding: 20, marginBottom: 20 }} dir="rtl">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: "#fbbf24", display: "flex", alignItems: "center", gap: 6 }}>
          <ShieldAlert size={17} /> מרכז בקרה ואישור אדמין (אורחים והצעות כלים)
        </div>
        <span className="badge-pill tabular-nums" style={{ background: totalPending > 0 ? "rgba(251, 191, 36, 0.2)" : "rgba(52, 211, 153, 0.15)", color: totalPending > 0 ? "#fbbf24" : "#34d399" }}>
          {totalPending} ממתינים לבדיקה
        </span>
      </div>

      {totalPending === 0 ? (
        <div style={{ fontSize: 12, color: "#94a3b8" }}>אין בקשות אורחים או הצעות כלים ממתינות כרגע. המערכת מוגנת ונקייה.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pendingPosts.map((p) => (
            <div key={p.id} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251, 191, 36, 0.3)", fontSize: 12 }}>
              <div style={{ fontWeight: 800, color: "#38bdf8", marginBottom: 3 }}><FileCheck2 size={13} style={{ display: "inline" }} /> בקשת פרסום אורח: {p.project_title} ({p.author_name})</div>
              <p style={{ color: "#cbd5e1", marginBottom: 6 }}>{p.summary}</p>
              {p.live_url && <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{p.live_url}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => handlePostDecision(p.id, true)} className="btn-ghost" style={{ height: 32, color: "#34d399" }}><CheckCircle2 size={13} /> אשר ופרסם</button>
                <button type="button" onClick={() => handlePostDecision(p.id, false)} className="btn-ghost" style={{ height: 32, color: "#f87171" }}><XCircle size={13} /> דחה ומחק</button>
              </div>
            </div>
          ))}

          {pendingComments.map((c) => (
            <div key={c.id} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(129, 140, 248, 0.3)", fontSize: 12 }}>
              <div style={{ fontWeight: 800, color: "#818cf8", marginBottom: 3 }}><MessageSquare size={13} style={{ display: "inline" }} /> תגובת אורח: {c.author_name} ({c.review_tag})</div>
              <p style={{ color: "#f8fafc", marginBottom: 8 }}>{c.body}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => handleCommentDecision(c.id, true)} className="btn-ghost" style={{ height: 32, color: "#34d399" }}><CheckCircle2 size={13} /> אשר תגובה</button>
                <button type="button" onClick={() => handleCommentDecision(c.id, false)} className="btn-ghost" style={{ height: 32, color: "#f87171" }}><XCircle size={13} /> מחק</button>
              </div>
            </div>
          ))}

          {toolSuggestions.map((t) => (
            <div key={t.id} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(52, 211, 153, 0.3)", fontSize: 12 }}>
              <div style={{ fontWeight: 800, color: "#34d399", marginBottom: 3 }}><Lightbulb size={13} style={{ display: "inline" }} /> הצעת כלי חדש: {t.tool_name} (מאת {t.author_name})</div>
              <p style={{ color: "#cbd5e1", marginBottom: 4 }}>{t.reason}</p>
              <div style={{ fontSize: 11, color: "#38bdf8", marginBottom: 8 }}>{t.tool_url}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => handleToolDecision(t, true)} className="btn-ghost" style={{ height: 32, color: "#34d399" }}><CheckCircle2 size={13} /> אשר והוסף לארגז (+15 קרמה)</button>
                <button type="button" onClick={() => handleToolDecision(t, false)} className="btn-ghost" style={{ height: 32, color: "#f87171" }}><XCircle size={13} /> דחה</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: "#34d399" }}>{toast}</div>}
    </div>
  );
}
