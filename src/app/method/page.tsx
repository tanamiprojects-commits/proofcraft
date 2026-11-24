"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, Copy, Sparkles, Terminal, PlusCircle, Package,
  ShieldAlert, BookMarked, Layers, BookmarkCheck
} from "lucide-react";
import { PROMPT_VAULT_CATALOG, VaultPromptItem } from "@/lib/prompt-vault-data";
import { getActiveUserProfile, syncProfileToCloud } from "@/lib/cloud-store";
import { BuilderProfile, DEFAULT_PROFILE } from "@/lib/proofcraft-store";
import GlobalModal from "@/components/GlobalModal";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";

const DOMAIN_CONTEXTS = [
  { id: "landing", label: "Conversion Landing Engine", context: "for a high-converting global web landing engine with instant lead capture" },
  { id: "saas", label: "Multi-User Cloud SaaS", context: "for a cloud SaaS application backed by Supabase PostgreSQL and strict RLS" },
  { id: "commerce", label: "Verified Payments & Webhooks", context: "for an HMAC-verified server payment route handler with webhook automation" },
  { id: "ai", label: "Enterprise AI Copilot", context: "for a multi-tenant AI copilot workspace with role-based access and audit logs" },
];

export default function MethodPage() {
  const [customPrompts, setCustomPrompts] = useState<VaultPromptItem[]>([]);
  const [savedOutputs, setSavedOutputs] = useState<Record<string, string>>({});
  const [selectedChainIds, setSelectedChainIds] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [domainIdx, setDomainIdx] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<BuilderProfile>(DEFAULT_PROFILE);

  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [outputModalOpen, setOutputModalOpen] = useState(false);
  const [outputDraft, setOutputDraft] = useState("");
  const [chainOpen, setChainOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showMsg = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3200); };

  useEffect(() => {
    getActiveUserProfile().then((res) => {
      setUserId(res.userId);
      setProfile(res.profile);
    });
    const rawVault = localStorage.getItem("pc_prompt_vault_v1");
    if (rawVault) {
      try {
        const parsed = JSON.parse(rawVault);
        if (Array.isArray(parsed.customPrompts)) setCustomPrompts(parsed.customPrompts);
        if (parsed.savedOutputs && typeof parsed.savedOutputs === "object") setSavedOutputs(parsed.savedOutputs);
      } catch {}
    }
  }, []);

  const persistVaultState = (nextCustom: VaultPromptItem[], nextOutputs: Record<string, string>) => {
    localStorage.setItem("pc_prompt_vault_v1", JSON.stringify({ customPrompts: nextCustom, savedOutputs: nextOutputs }));
  };

  const allPrompts = [...PROMPT_VAULT_CATALOG, ...customPrompts];
  const currentItem = allPrompts[activeIdx] || allPrompts;
  const domain = DOMAIN_CONTEXTS[domainIdx];
  const stepKey = `vault-step-${currentItem.id}`;
  const isDone = profile.completedStepIds.includes(stepKey);
  const personalizedPrompt = `${currentItem.powershellReadyPrompt} (${domain.context})`;
  const toggleStepDone = async () => {
    const nextSteps = isDone
      ? profile.completedStepIds.filter((s) => s !== stepKey)
      : [...profile.completedStepIds, stepKey];
    const nextProf = { ...profile, completedStepIds: nextSteps };
    setProfile(nextProf);
    await syncProfileToCloud(userId, nextProf);
    showMsg(isDone ? "Stage unmarked." : "Stage marked complete!");
  };

  const handleAddCustomPrompt = async () => {
    if (!newTitle.trim() || !newBody.trim()) return showMsg("Please provide both a title and prompt template.");
    const item: VaultPromptItem = {
      id: `custom-${Date.now()}`,
      stageNumber: allPrompts.length + 1,
      category: "Custom Studio Recipe",
      title: newTitle.trim(),
      goal: "Saved personal prompt recipe for reusable production builds.",
      powershellReadyPrompt: newBody.trim(),
      securityNote: "Verify no API keys or secrets are embedded before sharing.",
      sampleOutput: "Verified custom production artifact saved to vault.",
    };
    const nextCustom = [...customPrompts, item];
    setCustomPrompts(nextCustom);
    await persistVaultState(nextCustom, savedOutputs);
    setNewTitle(""); setNewBody(""); setAddOpen(false);
    setActiveIdx(allPrompts.length);
    showMsg("Custom prompt saved to your Vault!");
  };

  const handleSaveOutput = async () => {
    const nextOutputs = { ...savedOutputs, [currentItem.id]: outputDraft };
    setSavedOutputs(nextOutputs);
    await persistVaultState(customPrompts, nextOutputs);
    setOutputModalOpen(false);
    showMsg("Verified execution output locked into your Vault!");
  };

  const toggleChainItem = (id: string) => {
    setSelectedChainIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const compiledChainBundle = allPrompts
    .filter((p) => selectedChainIds.includes(p.id))
    .map((p, i) => `### STEP ${i + 1}: ${p.title}\nContext: ${domain.context}\n${p.powershellReadyPrompt}`)
    .join("\n\n---\n\n");

  const copyText = (txt: string, label: string) => {
    navigator.clipboard?.writeText(txt);
    showMsg(`Copied ${label} to clipboard!`);
  };

  return (
    <div dir="ltr" style={{ textAlign: "left" }}>
      <StudioVisualArtwork variant="method" />

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      <div className="card-hero" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <div>
            <span className="badge-pill" style={{ background: "rgba(129, 140, 248, 0.16)", color: "#818cf8", border: "1px solid rgba(129, 140, 248, 0.35)", fontSize: 11, marginBottom: 6 }}>
              <Sparkles size={12} /> 8-STAGE PRODUCTION PROMPT VAULT & SECURITY PROTOCOL
            </span>
            <h1 style={{ fontSize: 21, fontWeight: 900, color: "#f8fafc" }}>ProofCraft Engineering Method & Prompt Vault</h1>
            <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 2 }}>
              Copy production-grade PowerShell prompts, enforce .env secret isolation, and bundle multi-stage workflows.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setAddOpen(true)} className="btn-ghost" style={{ height: 36, fontSize: 12 }}>
              <PlusCircle size={14} /> Add Custom Prompt
            </button>
            <button type="button" onClick={() => setChainOpen(true)} className="btn-primary" style={{ width: "auto", height: 36, fontSize: 12 }}>
              <Package size={14} /> Chain Builder ({selectedChainIds.length})
            </button>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 12, background: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.3)", fontSize: 12, color: "#fca5a5", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Zero-Secret Terminal Protocol:</strong> Never paste <code>SERVICE_ROLE_KEY</code>, database passwords, or Stripe secrets into AI prompts or client files. Store secrets strictly in <code>.env.local</code> (server-only).
          </div>
        </div>
      </div>
      <div className="card-surface" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: "#94a3b8", marginBottom: 8 }}>SELECT TARGET ARCHITECTURE CONTEXT:</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8, marginBottom: 16 }}>
          {DOMAIN_CONTEXTS.map((d, idx) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDomainIdx(idx)}
              style={{
                padding: "9px 12px", borderRadius: 10, textAlign: "left", cursor: "pointer", fontSize: 12, fontWeight: 700,
                background: domainIdx === idx ? "rgba(56, 189, 248, 0.16)" : "#0a0b0e",
                color: domainIdx === idx ? "#38bdf8" : "#cbd5e1",
                border: `1px solid ${domainIdx === idx ? "#38bdf8" : "rgba(255,255,255,0.08)"}`
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {allPrompts.map((item, idx) => {
            const done = profile.completedStepIds.includes(`vault-step-${item.id}`);
            const inChain = selectedChainIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                style={{
                  padding: "6px 12px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                  background: activeIdx === idx ? "#0284c7" : "#0a0b0e",
                  color: activeIdx === idx ? "#fff" : done ? "#34d399" : "#cbd5e1",
                  border: `1px solid ${activeIdx === idx ? "#0284c7" : inChain ? "#fbbf24" : "rgba(255,255,255,0.1)"}`
                }}
              >
                {done ? "✓ " : ""}{idx + 1}. {item.title.slice(0, 26)}
              </button>
            );
          })}
        </div>

        <div style={{ padding: 18, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            <span className="badge-pill" style={{ background: "rgba(56, 189, 248, 0.14)", color: "#38bdf8", fontSize: 11 }}>{currentItem.category}</span>
            <button
              type="button"
              onClick={() => toggleChainItem(currentItem.id)}
              className="btn-ghost"
              style={{ height: 30, fontSize: 11, color: selectedChainIds.includes(currentItem.id) ? "#fbbf24" : "#cbd5e1" }}
            >
              {selectedChainIds.includes(currentItem.id) ? "✓ Included in Bundle" : "+ Add to Chain Bundle"}
            </button>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>{currentItem.title}</h2>
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>{currentItem.goal}</p>

          <pre style={{ padding: 14, borderRadius: 10, background: "#05070a", border: "1px solid rgba(56, 189, 248, 0.25)", color: "#e2e8f0", fontSize: 12, whiteSpace: "pre-wrap", lineHeight: 1.6, marginBottom: 12 }}>
            {personalizedPrompt}
          </pre>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => copyText(personalizedPrompt, "PowerShell Prompt")} className="btn-primary" style={{ width: "auto", height: 36, fontSize: 12 }}>
              <Copy size={13} /> Copy Prompt
            </button>
            <button type="button" onClick={() => { setOutputDraft(savedOutputs[currentItem.id] || ""); setOutputModalOpen(true); }} className="btn-ghost" style={{ height: 36, fontSize: 12 }}>
              <BookMarked size={13} /> {savedOutputs[currentItem.id] ? "Edit Saved Output" : "Save Verified Output"}
            </button>
            <button type="button" onClick={toggleStepDone} className="btn-ghost" style={{ height: 36, fontSize: 12, color: isDone ? "#34d399" : "#cbd5e1" }}>
              <CheckCircle2 size={13} /> {isDone ? "Completed" : "Mark Stage Complete"}
            </button>
          </div>
        </div>
      </div>
      {savedOutputs[currentItem.id] && (
        <div className="card-surface" style={{ padding: 16, marginBottom: 18, border: "1px solid rgba(52, 211, 153, 0.35)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#34d399", marginBottom: 6 }}>LOCKED VERIFIED ARTIFACT FOR THIS STAGE:</div>
          <pre style={{ fontSize: 12, color: "#cbd5e1", whiteSpace: "pre-wrap", margin: 0 }}>{savedOutputs[currentItem.id]}</pre>
        </div>
      )}

      <GlobalModal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Save Custom Prompt Recipe">
        <div dir="ltr" style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10 }}>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Recipe Title (e.g., Stripe Webhook Verification)" className="input-dark" />
          <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} rows={5} placeholder="Paste your tested prompt instructions..." className="input-dark" />
          <button type="button" onClick={handleAddCustomPrompt} className="btn-primary">Save to Vault</button>
        </div>
      </GlobalModal>

      <GlobalModal isOpen={outputModalOpen} onClose={() => setOutputModalOpen(false)} title="Lock Verified Execution Output">
        <div dir="ltr" style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea value={outputDraft} onChange={(e) => setOutputDraft(e.target.value)} rows={6} placeholder="Paste your verified terminal output, SQL policy, or working code snippet..." className="input-dark" />
          <button type="button" onClick={handleSaveOutput} className="btn-primary">Lock Output in Vault</button>
        </div>
      </GlobalModal>

      <GlobalModal isOpen={chainOpen} onClose={() => setChainOpen(false)} title={`Multi-Stage Prompt Bundle (${selectedChainIds.length} Selected)`}>
        <div dir="ltr" style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10 }}>
          {selectedChainIds.length === 0 ? (
            <p style={{ fontSize: 13, color: "#94a3b8" }}>Click "+ Add to Chain Bundle" on any prompt stage to compile a reusable multi-step build workflow.</p>
          ) : (
            <>
              <pre style={{ maxHeight: 280, overflow: "auto", padding: 12, borderRadius: 10, background: "#05070a", color: "#e2e8f0", fontSize: 11.5, whiteSpace: "pre-wrap" }}>
                {compiledChainBundle}
              </pre>
              <button type="button" onClick={() => copyText(compiledChainBundle, "Full Prompt Chain Bundle")} className="btn-primary">
                <Copy size={14} /> Copy Full Bundle
              </button>
            </>
          )}
        </div>
      </GlobalModal>
    </div>
  );
}
