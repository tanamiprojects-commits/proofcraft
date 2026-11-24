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
    setToast(`Milestone "${pr.module_title}" returned to builder for revision.`);
    setTimeout(() => setToast(""), 3200);
    loadProofs();
  };

  if (proofs.length === 0) {
    return isAdminView ? (
      <div className="card-surface" style={{ padding: 18, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
        No technical execution proofs submitted by builders yet.
      </div>
    ) : null;
  }

  return (
    <div dir="ltr" style={{ textAlign: "left", marginTop: 18 }}>
      {toast && (
        <div style={{ marginBottom: 10, padding: "8px 14px", borderRadius: 10, background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 12, fontWeight: 700 }}>
          {toast}
        </div>
      )}
      <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
        <ShieldCheck size={18} color="#34d399" />
        {isAdminView ? "Builder Proof-of-Execution Vault (Audit & Revision)" : "Verified Engineering Proofs & Artifacts"}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 12 }}>
        {proofs.map((pr) => (
          <div key={pr.id} className="card-surface" style={{ padding: 16, border: "1px solid rgba(52,211,153,0.28)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>
                Track {pr.track_level} · {pr.author_name || "Verified Builder"}
              </span>
              {isAdminView && (
                <button type="button" onClick={() => resetMilestoneProof(pr)} className="btn-ghost" style={{ padding: "4px 9px", fontSize: 11, color: "#fbbf24" }}>
                  <RotateCcw size={12} /> Return for Revision
                </button>
              )}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc", marginBottom: 6 }}>{pr.module_title}</div>
            <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5, marginBottom: 8 }}>{pr.architecture_rationale}</p>
            <pre style={{ padding: 10, borderRadius: 8, background: "#05070a", color: "#34d399", fontSize: 11, whiteSpace: "pre-wrap", maxHeight: 130, overflow: "auto" }}>
              {pr.artifact_output}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
