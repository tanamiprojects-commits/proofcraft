"use client";
import React, { useEffect, useState } from "react";
import { Activity, ExternalLink, Globe, Layers, RefreshCw, ShieldCheck } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";

interface NodeStatus {
  id: string; name: string; roleHe: string; roleEn: string;
  publicUrl: string; adminUrl: string; online: boolean | null; ms: number | null;
}

export default function EcosystemCommandCenter() {
  const { isHe } = useStudioLang();
  const mainSite = "https://" + "tanami360.com";
  const subSite = "https://" + "studio" + ".tanami360.com";

  const [nodes, setNodes] = useState<NodeStatus[]>([
    { id: "proofcraft", name: "ProofCraft Fintech OS", roleHe: "חדר בקרה ראשי · בנייה ושותפים", roleEn: "Master OS · Builder & Affiliate Hub", publicUrl: subSite, adminUrl: "/admin", online: null, ms: null },
    { id: "tanami360", name: "Tanami360 & SmartForm AI", roleHe: "פלטפורמת מסמכים, קטלוג וזכויות", roleEn: "Civic Documents, Catalog & Rights", publicUrl: mainSite, adminUrl: `${mainSite}/admin`, online: null, ms: null },
    { id: "studio-biz", name: "Tanami360 Studio (Herzliya)", roleHe: "כרטיס ביקור עסקי ולידים לסטודיו", roleEn: "Executive Studio & Client Leads", publicUrl: `${mainSite}/studio`, adminUrl: `${mainSite}/studio/contact`, online: null, ms: null },
  ]);
  const [checking, setChecking] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeUrl, setNewNodeUrl] = useState("");
  const [newNodeAdmin, setNewNodeAdmin] = useState("");

  const probeEcosystem = async () => {
    setChecking(true);
    const updated = await Promise.all(
      nodes.map(async (n) => {
        const t0 = performance.now();
        try {
          await fetch(n.publicUrl, { mode: "no-cors", cache: "no-store" });
          return { ...n, online: true, ms: Math.round(performance.now() - t0) };
        } catch {
          return { ...n, online: false, ms: null };
        }
      })
    );
    setNodes(updated);
    setChecking(false);
  };

  useEffect(() => { try { const saved = localStorage.getItem("pc_admin_custom_nodes_v1"); if (saved) setNodes(JSON.parse(saved)); } catch {} probeEcosystem(); }, []);
  const addCustomNode = () => { if (!newNodeName.trim() || !newNodeUrl.trim()) return; const pub = newNodeUrl.trim().startsWith("http") ? newNodeUrl.trim() : `https://${newNodeUrl.trim()}`; const adm = newNodeAdmin.trim() ? (newNodeAdmin.trim().startsWith("http") ? newNodeAdmin.trim() : `https://${newNodeAdmin.trim()}`) : `${pub}/admin`; const next = [...nodes, { id: `node-${Date.now()}`, name: newNodeName.trim(), roleHe: "פלטפורמה מנוהלת באקוסיסטם", roleEn: "Managed Ecosystem Node", publicUrl: pub, adminUrl: adm, online: null, ms: null }]; setNodes(next); localStorage.setItem("pc_admin_custom_nodes_v1", JSON.stringify(next)); setNewNodeName(""); setNewNodeUrl(""); setNewNodeAdmin(""); };

  return (
    <section className="card-hero" style={{ padding: 20, marginBottom: 18, borderColor: "rgba(56, 189, 248, 0.35)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(56, 189, 248, 0.16)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.35)", fontSize: 11 }}>
            <ShieldCheck size={12} /> {isHe ? "חדר בקרה מאוחד · TANAMI360 ECOSYSTEM OS" : "FEDERATED MASTER ADMIN COMMAND CENTER"}
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginTop: 6 }}>{isHe ? "שליטה מרכזית בכל הפלטפורמות ומוצרי הסטודיו" : "Unified Cross-Platform Control & Live Telemetry"}</h2>
        </div>
        <button type="button" onClick={probeEcosystem} disabled={checking} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#34d399", borderColor: "rgba(52,211,153,0.35)" }}>
          <RefreshCw size={13} /> {checking ? (isHe ? "סורק שרתים..." : "Probing...") : (isHe ? "בדיקת דופק חיה" : "Live Health Probe")}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {nodes.map((node) => (
          <div key={node.id} style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: node.online === false ? "#f87171" : "#34d399", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Activity size={12} /> {node.online === null ? "CHECKING..." : node.online ? `ONLINE (${node.ms}ms)` : "OFFLINE"}
                </span>
                <Layers size={13} color="#64748b" />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 900, color: "#f8fafc", marginTop: 6 }}>{node.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{isHe ? node.roleHe : node.roleEn}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
              <a href={node.publicUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#cbd5e1" }}>
                <Globe size={12} /> {isHe ? "אתר חי" : "Live Site"}
              </a>
              {node.adminUrl.startsWith("http") ? (
                <a href={node.adminUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#38bdf8", borderColor: "rgba(56,189,248,0.35)" }}>
                  <ExternalLink size={12} /> {isHe ? "ממשק ניהול" : "Open Admin"}
                </a>
              ) : (
                <span className="badge-pill" style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", fontSize: 11 }}>{isHe ? "פעיל כאן" : "Active Hub"}</span>
              )}
            </div>
          </div>
        ))}
      </div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}><input value={newNodeName} onChange={(e) => setNewNodeName(e.target.value)} placeholder={isHe ? "שם פלטפורמה חדשה" : "New Platform Name"} className="input-dark" style={{ height: 34, fontSize: 12 }} /><input value={newNodeUrl} onChange={(e) => setNewNodeUrl(e.target.value)} placeholder="https://tanami360.com" className="input-dark" style={{ height: 34, fontSize: 12 }} /><input value={newNodeAdmin} onChange={(e) => setNewNodeAdmin(e.target.value)} placeholder={isHe ? "כתובת אדמין (אופציונלי)" : "Admin URL (optional)"} className="input-dark" style={{ height: 34, fontSize: 12 }} /><button type="button" onClick={addCustomNode} className="btn-primary" style={{ height: 34, fontSize: 12, width: "auto" }}>{isHe ? "+ חבר פלטפורמה לחדר הבקרה" : "+ Connect Platform Node"}</button></div>
    </section>
  );
}