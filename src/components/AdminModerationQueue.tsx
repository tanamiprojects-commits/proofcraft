"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, CheckCircle2, XCircle, Lightbulb, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PendingPost { id: string; author_name: string; project_title: string; summary: string; live_url: string; }
interface PendingComment { id: string; post_id: string; author_name: string; review_tag: string; body: string; }
interface ToolSuggestion { id: string; user_id: string | null; author_name: string; tool_name: string; tool_url: string; stage_number: number; reason: string; }

export default function AdminModerationQueue() {
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const [toolSuggestions, setToolSuggestions] = useState<ToolSuggestion[]>([]);
  const [toast, setToast] = useState("");

  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3200); };

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
      notify("Submission approved and published live to Builder Feed!");
    } else {
      await supabase.from("feed_posts").delete().eq("id", id);
      notify("Submission rejected and removed.");
    }
    loadQueue();
  };

  const handleCommentDecision = async (id: string, approve: boolean) => {
    if (approve) {
      await supabase.from("feed_comments").update({ status: "approved" }).eq("id", id);
      notify("Review comment approved!");
    } else {
      await supabase.from("feed_comments").delete().eq("id", id);
      notify("Review comment deleted.");
    }
    loadQueue();
  };

  const handleToolDecision = async (item: ToolSuggestion, approve: boolean) => {
    if (approve) {
      await supabase.from("dev_tools").insert({
        id: `tool-${Date.now()}`,
        stage_number: item.stage_number || 3,
        stage_title: "Community Verified Stack",
        name: item.tool_name,
        category: "Community Vetted Tool",
        short_desc: item.reason,
        full_explanation: item.reason,
        actions_list: ["Connect API / Workspace", "Verify Production Output"],
        pricing_summary: "Freemium / Usage-Based",
        user_requirements: ["HTTPS Account"],
        core_capabilities: ["Builder Recommended"],
        official_url: item.tool_url,
        verification_label: `Verify ${item.tool_name}`,
        is_active: true,
      });
      await supabase.from("tool_suggestions").update({ status: "approved" }).eq("id", item.id);
      notify(`Added "${item.tool_name}" to the Global Toolkit Matrix!`);
    } else {
      await supabase.from("tool_suggestions").update({ status: "rejected" }).eq("id", item.id);
      notify("Tool suggestion declined.");
    }
    loadQueue();
  };

  const totalPending = pendingPosts.length + pendingComments.length + toolSuggestions.length;

  return (
    <div dir="ltr" className="card-surface" style={{ padding: 18 }}>
      {toast && (
        <div style={{ marginBottom: 10, padding: "8px 14px", borderRadius: 10, background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 12, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", display: "flex", alignItems: "center", gap: 7 }}>
          <ShieldAlert size={18} color="#fbbf24" /> Pending Moderation & Tool Proposals ({totalPending})
        </h2>
      </div>

      {totalPending === 0 ? (
        <p style={{ fontSize: 13, color: "#94a3b8" }}>All submissions, reviews, and tool proposals are up to date.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pendingPosts.map((p) => (
            <div key={p.id} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#38bdf8" }}>{p.project_title} · <span style={{ color: "#94a3b8" }}>{p.author_name}</span></div>
                <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: 3 }}>{p.summary}</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => handlePostDecision(p.id, true)} className="btn-primary" style={{ width: "auto", padding: "5px 12px", fontSize: 11.5 }}><CheckCircle2 size={13} /> Approve</button>
                <button onClick={() => handlePostDecision(p.id, false)} className="btn-ghost" style={{ padding: "5px 12px", fontSize: 11.5, color: "#f87171" }}><XCircle size={13} /> Reject</button>
              </div>
            </div>
          ))}

          {pendingComments.map((c) => (
            <div key={c.id} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                <MessageSquare size={13} style={{ display: "inline", marginRight: 5 }} />
                <strong>{c.author_name}:</strong> {c.body}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => handleCommentDecision(c.id, true)} className="btn-primary" style={{ width: "auto", padding: "5px 12px", fontSize: 11.5 }}>Approve</button>
                <button onClick={() => handleCommentDecision(c.id, false)} className="btn-ghost" style={{ padding: "5px 12px", fontSize: 11.5, color: "#f87171" }}>Delete</button>
              </div>
            </div>
          ))}

          {toolSuggestions.map((t) => (
            <div key={t.id} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#34d399" }}><Lightbulb size={13} style={{ display: "inline", marginRight: 5 }} />{t.tool_name} (Stage {t.stage_number})</div>
                <p style={{ fontSize: 12, color: "#cbd5e1" }}>{t.reason} · {t.tool_url}</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => handleToolDecision(t, true)} className="btn-primary" style={{ width: "auto", padding: "5px 12px", fontSize: 11.5 }}>Add to Toolkit</button>
                <button onClick={() => handleToolDecision(t, false)} className="btn-ghost" style={{ padding: "5px 12px", fontSize: 11.5, color: "#f87171" }}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
