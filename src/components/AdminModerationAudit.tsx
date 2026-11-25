"use client";
import React, { useEffect, useState } from "react";
import { ShieldCheck, Check, Trash2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";

interface PendingPost {
  id: string;
  author_name: string;
  project_title: string;
  live_url: string;
  post_type?: string;
}

export default function AdminModerationAudit({ onNotify }: { onNotify: (msg: string) => void }) {
  const { isHe, dir } = useStudioLang();
  const [pending, setPending] = useState<PendingPost[]>([]);

  const loadPending = async () => {
    const { data } = await supabase
      .from("feed_posts")
      .select("id, author_name, project_title, live_url, post_type")
      .eq("is_approved", false)
      .order("created_at", { ascending: false })
      .limit(20);
    setPending((data as PendingPost[]) || []);
  };

  useEffect(() => {
    loadPending();
    const onSync = () => loadPending();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, []);

  if (pending.length === 0) return null;

  const approvePost = async (id: string) => {
    await supabase.from("feed_posts").update({ is_approved: true }).eq("id", id);
    await loadPending();
    onNotify(isHe ? "\u05D4\u05E4\u05E8\u05D9\u05D8 \u05D0\u05D5\u05E9\u05E8 \u05D5\u05E4\u05D5\u05E8\u05E1\u05DD \u05D1\u05E4\u05D9\u05D3!" : "Feed item approved & published!");
  };

  const rejectPost = async (id: string) => {
    await supabase.from("feed_posts").delete().eq("id", id);
    await loadPending();
    onNotify(isHe ? "\u05D4\u05E4\u05E8\u05D9\u05D8 \u05E0\u05D3\u05D7\u05D4 \u05D5\u05D4\u05D5\u05E1\u05E8." : "Pending item rejected & removed.");
  };

  return (
    <div dir={dir} className="card-surface" style={{ padding: 16, marginBottom: 16, textAlign: isHe ? "right" : "left", border: "1px solid rgba(251,191,36,0.45)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={16} color="#fbbf24" />
          <strong style={{ fontSize: 14, color: "#fef3c7" }}>
            {isHe
              ? `\u05E4\u05E8\u05E1\u05D5\u05DE\u05D9\u05DD \u05D5\u05D3\u05D9\u05DC\u05D9\u05DD \u05DE\u05DE\u05EA\u05D9\u05E0\u05D9\u05DD \u05DC\u05E1\u05D9\u05E0\u05D5\u05DF \u05D0\u05D1\u05D8\u05D7\u05D4 (${pending.length})`
              : `Pending Feed & Deal Security Screening (${pending.length})`}
          </strong>
        </div>
        <span className="badge-pill" style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 10.5 }}>
          <ShieldCheck size={11} /> {isHe ? "\u05EA\u05D5\u05E8 \u05D0\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD" : "MODERATION QUEUE"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {pending.map((item) => (
          <div key={item.id} style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc" }}>{item.project_title}</div>
              <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{item.author_name} · {item.live_url}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={() => approvePost(item.id)} className="btn-primary" style={{ width: "auto", height: 32, fontSize: 11.5, padding: "0 12px" }}>
                <Check size={13} /> {isHe ? "\u05D0\u05E9\u05E8" : "Approve"}
              </button>
              <button type="button" onClick={() => rejectPost(item.id)} className="btn-ghost" style={{ height: 32, fontSize: 11.5, color: "#f87171" }}>
                <Trash2 size={13} /> {isHe ? "\u05D3\u05D7\u05D4" : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}