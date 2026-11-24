"use client";

import React, { useEffect, useState } from "react";
import { FileCode2, ShieldCheck, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProofRow {
  id: string;
  user_id: string;
  author_name: string;
  track_level: number;
  module_id: string;
  module_title: string;
  artifact_output: string;
  architecture_rationale: string;
  status: string;
  created_at: string;
}

export default function VerifiedProofsPanel({ userId, isAdminView = false }: { userId?: string | null; isAdminView?: boolean }) {
  const [proofs, setProofs] = useState<ProofRow[]>([]);
  const [toast, setToast] = useState("");

  const loadProofs = async () => {
    let q = supabase.from("milestone_proofs").select("*").order("created_at", { ascending: false });
    if (!isAdminView && userId) q = q.eq("user_id", userId).eq("status", "verified");
    const { data } = await q.limit(30);
    if (data) setProofs(data);
  };

  useEffect(() => { loadProofs(); }, [userId, isAdminView]);

  const resetMilestoneProof = async (pr: ProofRow) => {
    await supabase.from("milestone_proofs").delete().eq("id", pr.id);
    const { data: prof } = await supabase.from("profiles").select("completed_step_ids").eq("id", pr.user_id).single();
    if (prof && Array.isArray(prof.completed_step_ids)) {
      const filtered = prof.completed_step_ids.filter((id: string) => id !== pr.module_id);
      await supabase.from("profiles").update({ completed_step_ids: filtered }).eq("id", pr.user_id);
    }
    setToast(`✓ אבן הדרך "${pr.module_title}" הוחזרה למשתמש לביצוע מחדש.`);
    setTimeout(() => setToast(""), 3200);
    loadProofs();
  };

  if (proofs.length === 0) {
    return isAdminView ? (
      <div className="card-base" style={{ textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
        טרם הוגשו ראיות ביצוע טכניות ע״י משתמשים.
      </div>
    ) : null;
  }

  return (
    <div dir="rtl" style={{ textAlign: "right", marginTop: 22 }}>
      <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
        <FileCode2 size={18} color="#34d399" />
        <span>{isAdminView ? `בקרת ראיות ביצוע של משתמשים (${proofs.length})` : `כספת הוכחות הנדסיות מאומתות (${proofs.length})`}</span>
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {proofs.map((pr) => (
          <div key={pr.id} className="card-base" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#38bdf8" }}>
                Track {pr.track_level} · {pr.module_title} {isAdminView ? `(${pr.author_name || "משתמש"})` : ""}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.16)", color: "#34d399", fontSize: 10 }}>
                  <ShieldCheck size={11} /> אומת בתקנון
                </span>
                {isAdminView && (
                  <button type="button" onClick={() => resetMilestoneProof(pr)} className="btn-ghost" style={{ height: 30, fontSize: 11, color: "#f87171" }}>
                    <RotateCcw size={12} /> החזר לתיקון
                  </button>
                )}
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.55, marginBottom: 8 }}>
              <strong>החלטת ארכיטקטורה:</strong> {pr.architecture_rationale}
            </p>
            <pre dir="ltr" style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", fontSize: 11, color: "#94a3b8", overflowX: "auto", textAlign: "left" }}>
              {pr.artifact_output.slice(0, 260)}{pr.artifact_output.length > 260 ? "..." : ""}
            </pre>
          </div>
        ))}
      </div>

      {toast && <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: "#34d399" }}>{toast}</div>}
    </div>
  );
}
