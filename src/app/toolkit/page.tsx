"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Copy, BookOpen, Search, Layers, Link2 } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";
import { CloudDevTool, fetchCloudDevTools, getActiveUserProfile, syncProfileToCloud } from "@/lib/cloud-store";
import { BuilderProfile, DEFAULT_PROFILE } from "@/lib/proofcraft-store";
import GlobalModal from "@/components/GlobalModal";
import SuggestToolButton from "@/components/SuggestToolButton";
import ExternalServiceBridge from "@/components/ExternalServiceBridge";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";

import { DEV_TOOLS } from "@/lib/dev-toolkit-data";

const INITIAL_CLOUD_TOOLS: CloudDevTool[] = DEV_TOOLS.map((t) => ({
  id: t.id,
  stage_number: t.stageNumber,
  stage_title: t.stageTitle,
  name: t.name,
  category: t.category,
  short_desc: t.shortDesc,
  full_explanation: t.fullExplanation,
  actions_list: t.actionsYouCanDo,
  pricing_summary: "",
  user_requirements: t.userRequirements,
  core_capabilities: t.coreCapabilities,
  official_url: t.officialUrl,
  verification_label: t.verificationActionLabel,
  is_active: true,
}));

const TOOLKIT_STAGES = [
  { stage: 1, label: "Architecture & Spec", labelHe: "ארכיטקטורה ואפיון" },
  { stage: 2, label: "UI/UX Design", labelHe: "עיצוב ממשק וחוויה" },
  { stage: 3, label: "AI & Code Generation", labelHe: "יצירת קוד ובינה מלאכותית" },
  { stage: 4, label: "Cloud DB & Auth", labelHe: "מסד נתונים ואבטחה" },
  { stage: 5, label: "Security & QA", labelHe: "בדיקות איכות והגנה" },
  { stage: 6, label: "Deployment & Growth", labelHe: "פריסה לאוויר וצמיחה" },
];

export default function ToolkitPage() {
  const { isHe, dir } = useStudioLang();
  const [tools, setTools] = useState<CloudDevTool[]>(INITIAL_CLOUD_TOOLS);
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
      if (cloudTools && cloudTools.length > 0) setTools(cloudTools);
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
    showToast(
      exists
        ? (isHe ? `הוסר מרשימת הכלים: ${tool.name}` : `Removed from mastered stack: ${tool.name}`)
        : (isHe ? `${tool.name} נוסף לתיק העבודות המאומת שלך!` : `${tool.name} added to your verified portfolio stack!`)
    );
  };
  const filteredTools = tools.filter((item) => {
    const matchStage = selectedStage === 0 || item.stage_number === selectedStage;
    const q = searchQuery.trim().toLowerCase();
    const matchQ = !q || item.name.toLowerCase().includes(q) || item.short_desc.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    return matchStage && matchQ;
  });

  const masteryPct = tools.length > 0 ? Math.round((completedTools.length / tools.length) * 100) : 0;

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      <StudioVisualArtwork variant="toolkit" />

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      <div className="card-hero" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc" }}>
              {isHe ? "מטריצת כלי AI וענן מאומתים" : "Curated AI & Cloud Stack Matrix"}
            </h1>
            <p style={{ fontSize: 12.5, color: "#94a3b8" }}>
              {isHe
                ? "סמן כלים שהטמעת — הם מסתנכרנים אוטומטית לתיק העבודות הציבורי ולמרכז השותפים"
                : "Mark tools you have deployed — they sync automatically to your Verified Portfolio & Affiliate Hub"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <SuggestToolButton userId={userId} authorName={profile.fullName || "ProofCraft Builder"} onNotify={showToast} />
            <Link href="/vault" className="badge-pill" style={{ minHeight: 36, background: "rgba(52, 211, 153, 0.14)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.35)", textDecoration: "none" }}><span>{isHe ? "שמור מפתחות בכספת" : "Save Keys in Vault"}</span></Link><button type="button" onClick={() => window.open("/context-studio?floating=1", "pcContextFloat", "width=460,height=760")} className="badge-pill" style={{ minHeight: 36, cursor: "pointer", background: "rgba(56, 189, 248, 0.14)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.35)" }}><span>{isHe ? "סטודיו הקשר צף" : "Floating Context Studio"}</span></button><Link href="/method" className="badge-pill" style={{ minHeight: 36, background: "rgba(129, 140, 248, 0.16)", color: "#818cf8", border: "1px solid rgba(129, 140, 248, 0.35)" }}>
              <span>{isHe ? "כספת הפרומפטים" : "Prompt Vault"}</span>
            </Link>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: 12, marginBottom: 6 }}>
            <span style={{ fontWeight: 800, color: "#34d399" }}>
              <Layers size={13} style={{ display: "inline", marginInlineEnd: 5 }} />
              {isHe
                ? `שליטה במחסנית המאומתת: ${completedTools.length} מתוך ${tools.length} כלים (${masteryPct}%)`
                : `Verified Stack Mastery: ${completedTools.length} of ${tools.length} tools (${masteryPct}%)`}
            </span>
            <Link href="/portfolio/live" style={{ color: "#38bdf8", fontWeight: 700, fontSize: 11.5 }}>
              {isHe ? "צפה בתיק העבודות הציבורי ←" : "View Public Portfolio →"}
            </Link>
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
              aria-label="Search tools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHe ? "חיפוש כלי לפי שם, קטגוריה או תפקיד (למשל Supabase, Stripe, AI)..." : "Search tool by name, role, or capability (e.g., Supabase, Stripe, AI)..."}
              className="input-dark"
              style={{ width: "100%", paddingLeft: 38, textAlign: "left", minHeight: 44 }}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <button
              type="button"
              onClick={() => setSelectedStage(0)}
              style={{
                minHeight: 36, padding: "6px 12px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                background: selectedStage === 0 ? "#0284c7" : "#0a0b0e",
                color: selectedStage === 0 ? "#fff" : "#cbd5e1",
                border: `1px solid ${selectedStage === 0 ? "#0284c7" : "rgba(255,255,255,0.09)"}`
              }}
            >
              {isHe ? `כל הכלים (${tools.length})` : `All Tools (${tools.length})`}
            </button>
            {TOOLKIT_STAGES.map((st) => {
              const active = selectedStage === st.stage;
              return (
                <button
                  key={st.stage}
                  type="button"
                  onClick={() => setSelectedStage(st.stage)}
                  style={{
                    minHeight: 36, padding: "6px 12px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                    background: active ? "#0284c7" : "#0a0b0e",
                    color: active ? "#fff" : "#cbd5e1",
                    border: `1px solid ${active ? "#0284c7" : "rgba(255,255,255,0.09)"}`
                  }}
                >
                  {st.stage}. {isHe ? st.labelHe : st.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filteredTools.map((tool) => {
          const mastered = completedTools.includes(tool.id);
          const deployPrompt = `Follow the ProofCraft Studio method: integrate ${tool.name} (${tool.category}) into my project following these steps: ${tool.actions_list.join(", ")}`;
          const affiliateHref = `/affiliate?tool=${encodeURIComponent(tool.name)}&url=${encodeURIComponent(tool.official_url || "")}`;
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
                    {isHe ? `שלב ${tool.stage_number}` : `Stage ${tool.stage_number}`}: {tool.stage_title}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleToolMastery(tool)}
                    style={{
                      minHeight: 34, display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999,
                      fontSize: 11, fontWeight: 700, cursor: "pointer",
                      background: mastered ? "rgba(52, 211, 153, 0.16)" : "#0a0b0e",
                      color: mastered ? "#34d399" : "#cbd5e1",
                      border: `1px solid ${mastered ? "#34d399" : "rgba(255,255,255,0.12)"}`
                    }}
                  >
                    {mastered ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    <span>{mastered ? (isHe ? "הוטמע" : "Mastered") : (isHe ? "סמן כהוטמע" : "Mark Deployed")}</span>
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
                    buttonLabel={isHe ? "הפעל כלי מודרך" : "Launch Guided Tool"}
                    buttonStyle={{ width: "100%", justifyContent: "center", minHeight: 40, borderRadius: 10 }}
                  />
                  <button type="button" onClick={() => setGuideTool(tool)} className="btn-ghost" style={{ minHeight: 40, fontSize: 11.5 }}>
                    <BookOpen size={13} /> {isHe ? "מדריך ואפיון" : "Guide & Spec"}
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard?.writeText(deployPrompt); showToast(isHe ? `פרומפט ההטמעה של ${tool.name} הועתק!` : `Copied integration prompt for ${tool.name}!`); }}
                    style={{
                      minHeight: 40, padding: "8px 10px", borderRadius: 10, background: "rgba(52, 211, 153, 0.1)",
                      border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399", fontSize: 11, fontWeight: 800,
                      cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5
                    }}
                  >
                    <Copy size={12} /> {isHe ? "העתק פרומפט" : "Copy Prompt"}
                  </button>

                  <Link
                    href={affiliateHref}
                    style={{
                      minHeight: 40, padding: "8px 10px", borderRadius: 10, background: "rgba(56, 189, 248, 0.12)",
                      border: "1px solid rgba(56, 189, 248, 0.35)", color: "#38bdf8", fontSize: 11, fontWeight: 800,
                      textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5
                    }}
                  >
                    <Link2 size={12} /> {isHe ? "צור קישור שותפים" : "Affiliate Link"}
                  </Link>
                </div>
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
