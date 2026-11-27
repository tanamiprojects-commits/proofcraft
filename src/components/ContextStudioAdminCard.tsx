"use client";
import React, { useEffect, useState } from "react";
import { ContextStudioConfig, DEFAULT_STUDIO_CONFIG } from "@/lib/context-packet-engine";
import { CheckCircle2, Save, Sliders, Sparkles, Terminal } from "lucide-react";

export default function ContextStudioAdminCard({ isHe = true }: { isHe?: boolean }) {
  const [config, setConfig] = useState<ContextStudioConfig>(DEFAULT_STUDIO_CONFIG);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetch("/api/context-studio-config")
      .then((r) => r.json())
      .then((d) => { if (d?.ok && d?.config) setConfig(d.config); })
      .catch(() => {});
  }, []);

  const saveConfig = async (next: ContextStudioConfig) => {
    setConfig(next);
    setSaving(true);
    setStatusMsg("");
    try {
      const res = await fetch("/api/context-studio-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: next }),
      });
      const data = await res.json();
      setStatusMsg(data?.ok ? (isHe ? (data.persistedToDb ? "נשמר וסונכרן לענן ✓" : "עודכן בשרת ✓") : "Saved & Synced ✓") : (isHe ? "שגיאה בשמירה" : "Save failed"));
    } catch {
      setStatusMsg(isHe ? "שגיאת תקשורת" : "Network error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(""), 3500);
    }
  };

  const toggleRec = (id: string) => {
    const updated = config.recommendations.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    saveConfig({ ...config, recommendations: updated });
  };

  return (
    <div dir={isHe ? "rtl" : "ltr"} style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.28)", color: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Terminal size={15} style={{ color: "#38bdf8" }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#38bdf8" }}>{isHe ? "מרכז שליטה: Context Packet Studio ושיווק אורגני חכם" : "Context Packet Studio & Smart Ecosystem Governance"}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{isHe ? "שליטה מלאה בדף השיטה (/method) ובכלי העצמאי (/context-studio) ללא עריכת קוד" : "Zero-code runtime control over /method & /context-studio"}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {statusMsg && <span style={{ fontSize: 11.5, fontWeight: 800, color: "#34d399", display: "inline-flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={13} /> {statusMsg}</span>}
          <a href="/context-studio" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}>{isHe ? "פתח סטודיו ↗" : "Open Studio ↗"}</a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={() => saveConfig({ ...config, enabled: !config.enabled })} className="btn-ghost"
          style={{ height: "auto", padding: "10px 12px", justifyContent: "space-between", background: config.enabled ? "rgba(16,185,129,0.12)" : "rgba(248,113,113,0.12)", borderColor: config.enabled ? "rgba(16,185,129,0.4)" : "rgba(248,113,113,0.4)", color: config.enabled ? "#34d399" : "#fca5a5" }}>
          <span style={{ fontSize: 11.5, fontWeight: 800 }}>{isHe ? "סטטוס כלי באתר" : "Studio Status"}</span>
          <strong style={{ fontSize: 11.5 }}>{config.enabled ? (isHe ? "פעיל ✓" : "ACTIVE") : (isHe ? "מושבת" : "OFF")}</strong>
        </button>

        <button type="button" onClick={() => saveConfig({ ...config, enableSmartEcosystemLinks: !config.enableSmartEcosystemLinks })} className="btn-ghost"
          style={{ height: "auto", padding: "10px 12px", justifyContent: "space-between", background: config.enableSmartEcosystemLinks ? "rgba(56,189,248,0.12)" : "#11131a", borderColor: config.enableSmartEcosystemLinks ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.1)", color: config.enableSmartEcosystemLinks ? "#38bdf8" : "#94a3b8" }}>
          <span style={{ fontSize: 11.5, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 4 }}><Sparkles size={13} /> {isHe ? "שיווק אורגני הקשרי" : "Context Prompts"}</span>
          <strong style={{ fontSize: 11.5 }}>{config.enableSmartEcosystemLinks ? "ON" : "OFF"}</strong>
        </button>

        <div style={{ padding: "8px 12px", borderRadius: 10, background: "#11131a", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: "#cbd5e1", display: "inline-flex", alignItems: "center", gap: 4 }}><Sliders size={13} /> {isHe ? "סף פיצול תווים:" : "Split Limit:"}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="number" min={4000} max={3000000} step={1000} value={config.defaultChunkLimit}
              onChange={(e) => setConfig({ ...config, defaultChunkLimit: Number(e.target.value) || 1500000 })}
              className="input-dark" style={{ width: 78, height: 28, fontSize: 11.5, padding: "0 8px" }} />
            <button type="button" disabled={saving} onClick={() => saveConfig(config)} className="btn-primary" style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>
              <Save size={12} /> {isHe ? "שמור" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11.5, fontWeight: 800, color: "#94a3b8", marginBottom: 6 }}>{isHe ? "חוקי סנכרון אורגני בין נכסי האקוסיסטם (מופעלים אוטומטית לפי תוכן הפלט):" : "Organic Ecosystem Sync Rules (Auto-triggered by output):"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
        {config.recommendations.map((rec) => (
          <button key={rec.id} type="button" onClick={() => toggleRec(rec.id)} className="btn-ghost"
            style={{ height: "auto", padding: "10px 12px", flexDirection: "column", alignItems: "stretch", textAlign: isHe ? "right" : "left", background: rec.enabled ? "rgba(56,189,248,0.08)" : "#11131a", borderColor: rec.enabled ? "rgba(56,189,248,0.35)" : "rgba(255,255,255,0.08)", opacity: rec.enabled ? 1 : 0.6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 800, color: "#38bdf8", marginBottom: 4 }}>
              <span dir="ltr">{rec.href}</span>
              <span style={{ color: rec.enabled ? "#34d399" : "#f87171" }}>{rec.enabled ? "ACTIVE" : "OFF"}</span>
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#f8fafc", whiteSpace: "normal", lineHeight: 1.4 }}>{isHe ? rec.titleHe : rec.titleEn}</div>
          </button>
        ))}
      </div>
    </div>
  );
}