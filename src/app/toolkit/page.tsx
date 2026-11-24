"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Copy, BookOpen, Search, Layers } from "lucide-react";
import { CloudDevTool, fetchCloudDevTools, getActiveUserProfile, syncProfileToCloud } from "@/lib/cloud-store";
import { BuilderProfile, DEFAULT_PROFILE } from "@/lib/proofcraft-store";
import GlobalModal from "@/components/GlobalModal";
import SuggestToolButton from "@/components/SuggestToolButton";
import ExternalServiceBridge from "@/components/ExternalServiceBridge";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";

const TOOLKIT_STAGES = [
  { stage: 1, label: "Architecture & Spec" },
  { stage: 2, label: "UI/UX Design" },
  { stage: 3, label: "AI & Code Generation" },
  { stage: 4, label: "Cloud DB & Auth" },
  { stage: 5, label: "Security & QA" },
  { stage: 6, label: "Deployment & Growth" },
];

export default function ToolkitPage() {
  const [tools, setTools] = useState<CloudDevTool[]>([]);
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<BuilderProfile>(DEFAULT_PROFILE);
  const [completedTools, setCompletedTools] = useState<string[]>([]);
  const [guideTool, setGuideTool] = useState<CloudDevTool | null>(null);
  const [toast, setToast] = useState<string>("");

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    Promise.all([fetchCloudDevTools(), getActiveUserProfile()]).then(([cloudTools, uRes]) => {
      setTools(cloudTools);
      setUserId(uRes.userId);
      setProfile(uRes.profile);
      setCompletedTools(uRes.completedTools || []);
    });
  }, []);

  const toggleToolMastery = async (tool: CloudDevTool) => {
    const exists = completedTools.includes(tool.id);
    const nextList = exists ? completedTools.filter((id) => id !== tool.id) : [...completedTools, tool.id];
    setCompletedTools(nextList);

    const currToolsStr = profile.primaryTools || "";
    let nextToolsStr = currToolsStr;
    if (!exists && !currToolsStr.toLowerCase().includes(tool.name.toLowerCase())) {
      nextToolsStr = currToolsStr ? `${currToolsStr}, ${tool.name}` : tool.name;
    }
    const nextProf = { ...profile, primaryTools: nextToolsStr };
    setProfile(nextProf);
    await syncProfileToCloud(userId, nextProf, { completed_tools: nextList });
    showToast(exists ? `Removed from mastered stack: ${tool.name}` : `${tool.name} added to your verified portfolio stack!`);
  };

  const filteredTools = tools.filter((t) => {
    const matchStage = selectedStage === 0 || t.stage_number === selectedStage;
    const q = searchQuery.trim().toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.short_desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    return matchStage && matchQ;
  });

  const masteryPct = tools.length > 0 ? Math.round((completedTools.length / tools.length) * 100) : 0;

  return (
    <div dir="ltr" style={{ textAlign: "left" }}>
      <StudioVisualArtwork variant="toolkit" />

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}
      <div className="card-hero" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc" }}>Curated AI & Cloud Stack Matrix</h1>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>Mark tools you have deployed — they sync automatically to your public Verified Portfolio</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <SuggestToolButton userId={userId} authorName={profile.fullName || "ProofCraft Builder"} onNotify={showToast} />
            <Link href="/method" className="badge-pill" style={{ background: "rgba(129, 140, 248, 0.16)", color: "#818cf8", border: "1px solid rgba(129, 140, 248, 0.35)" }}>
              <span>Prompt Vault</span>
            </Link>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginBottom: 6 }}>
            <span style={{ fontWeight: 800, color: "#34d399" }}>
              <Layers size={13} style={{ display: "inline", marginRight: 5 }} />
              Verified Stack Mastery: {completedTools.length} of {tools.length} tools ({masteryPct}%)
            </span>
            <Link href="/portfolio/live" style={{ color: "#38bdf8", fontWeight: 700, fontSize: 11 }}>View Public Portfolio →</Link>
          </div>
          <div style={{ width: "100%", height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${masteryPct}%`, background: "linear-gradient(to right, #38bdf8, #34d399)", transition: "width 0.3s" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search size={15} color="#94a3b8" style={{ position: "absolute", left: 14, top: 14 }} />
            <input
              dir="ltr"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tool by name, role, or capability (e.g., Supabase, Stripe, AI)..."
              className="input-dark"
              style={{ width: "100%", paddingLeft: 38, textAlign: "left" }}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <button
              type="button"
              onClick={() => setSelectedStage(0)}
              style={{
                padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer",
                background: selectedStage === 0 ? "#0284c7" : "#0a0b0e",
                color: selectedStage === 0 ? "#fff" : "#cbd5e1",
                border: `1px solid ${selectedStage === 0 ? "#0284c7" : "rgba(255,255,255,0.09)"}`
              }}
            >
              All Tools ({tools.length})
            </button>
            {TOOLKIT_STAGES.map((st) => {
              const active = selectedStage === st.stage;
              return (
                <button
                  key={st.stage}
                  type="button"
                  onClick={() => setSelectedStage(st.stage)}
                  style={{
                    padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    background: active ? "#0284c7" : "#0a0b0e",
                    color: active ? "#fff" : "#cbd5e1",
                    border: `1px solid ${active ? "#0284c7" : "rgba(255,255,255,0.09)"}`
                  }}
                >
                  {st.stage}. {st.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {filteredTools.map((tool) => {
          const mastered = completedTools.includes(tool.id);
          const deployPrompt = `Follow the ProofCraft Studio method: integrate ${tool.name} (${tool.category}) into my project following these steps: ${tool.actions_list.join(", ")}`;
          return (
            <div
              key={tool.id}
              className="card-surface"
              style={{
                padding: 18,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: mastered ? "1px solid rgba(52, 211, 153, 0.4)" : "1px solid rgba(255,255,255,0.09)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span className="badge-pill" style={{ background: "rgba(129, 140, 248, 0.14)", color: "#818cf8", fontSize: 10 }}>
                    Stage {tool.stage_number}: {tool.stage_title}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleToolMastery(tool)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999,
                      fontSize: 11, fontWeight: 700, cursor: "pointer",
                      background: mastered ? "rgba(52, 211, 153, 0.16)" : "#0a0b0e",
                      color: mastered ? "#34d399" : "#cbd5e1",
                      border: `1px solid ${mastered ? "#34d399" : "rgba(255,255,255,0.12)"}`
                    }}
                  >
                    {mastered ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    <span>{mastered ? "Mastered" : "Mark Deployed"}</span>
                  </button>
                </div>

                <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", marginBottom: 2 }}>{tool.name}</h2>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8", marginBottom: 8 }}>{tool.category}</div>
                <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5, marginBottom: 12 }}>{tool.short_desc}</p>
              </div>

              <div>
                {tool.pricing_summary && (
                  <div style={{ padding: "8px 10px", borderRadius: 10, background: "rgba(251, 191, 36, 0.08)", border: "1px solid rgba(251, 191, 36, 0.25)", color: "#fbbf24", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
                    {tool.pricing_summary}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <ExternalServiceBridge
                    serviceName={tool.name}
                    targetUrl={tool.official_url}
                    contextWhy={tool.short_desc}
                    stepsToPerform={tool.actions_list}
                    whatToBringBack={`Proof of ${tool.name} integration for your portfolio`}
                    optionalPrompt={deployPrompt}
                    buttonLabel="Launch Guided Tool"
                    buttonStyle={{ width: "100%", justifyContent: "center", height: 36, borderRadius: 10 }}
                  />
                  <button type="button" onClick={() => setGuideTool(tool)} className="btn-ghost" style={{ height: 36, fontSize: 11 }}>
                    <BookOpen size={13} /> Guide & Spec
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { navigator.clipboard?.writeText(deployPrompt); showToast(`Copied integration prompt for ${tool.name}!`); }}
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 10, background: "rgba(52, 211, 153, 0.1)",
                    border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399", fontSize: 11, fontWeight: 800,
                    cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5
                  }}
                >
                  <Copy size={12} /> Copy Integration Prompt
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <GlobalModal isOpen={Boolean(guideTool)} onClose={() => setGuideTool(null)} title={`Integration Guide: ${guideTool?.name || ""}`}>
        {guideTool && (
          <div dir="ltr" style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>{guideTool.full_explanation || guideTool.short_desc}</p>
            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontWeight: 800, color: "#38bdf8", marginBottom: 6 }}>Execution Steps:</div>
              <ul style={{ paddingLeft: 18, color: "#cbd5e1", lineHeight: 1.6 }}>
                {guideTool.actions_list.map((act, i) => <li key={i}>{act}</li>)}
              </ul>
            </div>
          </div>
        )}
      </GlobalModal>
    </div>
  );
}
