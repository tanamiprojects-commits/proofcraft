"use client";
import React, { useEffect, useState } from "react";
import { Maximize2, Minimize2, PictureInPicture2, ShieldCheck, Terminal, X } from "lucide-react";

type DockTool = "vault" | "context" | null;

export default function PersistentFloatingToolsDock({ isHe = true }: { isHe?: boolean }) {
  const [activeTool, setActiveTool] = useState<DockTool>(null);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    try {
      const savedTool = localStorage.getItem("pc_floating_dock_tool") as DockTool;
      const savedMin = localStorage.getItem("pc_floating_dock_min") === "1";
      if (savedTool === "vault" || savedTool === "context") {
        setActiveTool(savedTool);
        setMinimized(savedMin);
      }
    } catch {}
  }, []);

  const openTool = (tool: DockTool) => {
    setActiveTool(tool);
    setMinimized(false);
    try {
      if (tool) localStorage.setItem("pc_floating_dock_tool", tool);
      else localStorage.removeItem("pc_floating_dock_tool");
      localStorage.setItem("pc_floating_dock_min", "0");
    } catch {}
  };
  const toggleMinimize = () => {
    const next = !minimized;
    setMinimized(next);
    try { localStorage.setItem("pc_floating_dock_min", next ? "1" : "0"); } catch {}
  };

  const popOutDesktopPip = async (path: string) => {
    try {
      const w = window as unknown as { documentPictureInPicture?: { requestWindow: (o: { width: number; height: number }) => Promise<Window> } };
      if (w.documentPictureInPicture) {
        const pip = await w.documentPictureInPicture.requestWindow({ width: 560, height: 700 });
        pip.location.href = `${path}?floating=1`;
      } else {
        window.open(`${path}?floating=1`, "ProofCraftAlwaysOnTop", "width=580,height=720,top=60,left=60");
      }
    } catch { window.open(`${path}?floating=1`, "_blank"); }
  };

  const toolUrl = activeTool === "vault" ? "/vault?floating=1" : "/context-studio?floating=1";
  const toolTitle = activeTool === "vault"
    ? (isHe ? "כספת Zero-Knowledge צפה (נעולה למסך)" : "Pinned Zero-Knowledge Vault")
    : (isHe ? "סטודיו קבצים והקשר לצ׳אט (נעול למסך)" : "Pinned AI Context & File Studio");

  return (
    <>
      <div dir={isHe ? "rtl" : "ltr"} style={{ position: "fixed", bottom: 72, [isHe ? "left" : "right"]: 16, zIndex: 9990, display: "flex", flexDirection: "column", gap: 8 }}>
        <button type="button" onClick={() => openTool(activeTool === "vault" && !minimized ? null : "vault")}
          className="btn-primary" style={{ height: 38, padding: "0 14px", fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.55)", background: activeTool === "vault" ? "#059669" : "linear-gradient(135deg,#0f172a,#1e293b)", border: "1px solid rgba(52,211,153,0.45)" }}>
          <ShieldCheck size={15} style={{ color: "#34d399" }} />
          <span>{isHe ? "כספת צפה" : "Floating Vault"}</span>
        </button>
        <button type="button" onClick={() => openTool(activeTool === "context" && !minimized ? null : "context")}
          className="btn-primary" style={{ height: 38, padding: "0 14px", fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.55)", background: activeTool === "context" ? "#0284c7" : "linear-gradient(135deg,#0f172a,#1e293b)", border: "1px solid rgba(56,189,248,0.45)" }}>
          <Terminal size={15} style={{ color: "#38bdf8" }} />
          <span>{isHe ? "קובץ לצ׳אט AI" : "AI File Studio"}</span>
        </button>
      </div>

      {activeTool && (
        <div dir={isHe ? "rtl" : "ltr"} style={{
          position: "fixed", bottom: 16, [isHe ? "right" : "left"]: 16, zIndex: 9999,
          width: minimized ? 320 : "min(560px, calc(100vw - 32px))",
          height: minimized ? 46 : "min(640px, calc(100vh - 96px))",
          borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.45)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          <div style={{ height: 46, padding: "0 12px", background: "#11131a", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#f8fafc" }}>
              {activeTool === "vault" ? <ShieldCheck size={14} style={{ color: "#34d399" }} /> : <Terminal size={14} style={{ color: "#38bdf8" }} />}
              <span>{toolTitle}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button type="button" onClick={() => popOutDesktopPip(activeTool === "vault" ? "/vault" : "/context-studio")} title={isHe ? "צוף מעל כל תוכנה במחשב" : "Float above all desktop apps"} className="btn-ghost" style={{ height: 28, padding: "0 8px", fontSize: 10.5, color: "#38bdf8" }}>
                <PictureInPicture2 size={13} />
              </button>
              <button type="button" onClick={toggleMinimize} title={minimized ? "הגדל" : "מזער"} className="btn-ghost" style={{ height: 28, padding: "0 8px" }}>
                {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
              </button>
              <button type="button" onClick={() => openTool(null)} title={isHe ? "סגור ידנית" : "Close"} className="btn-ghost" style={{ height: 28, padding: "0 8px", color: "#f87171" }}>
                <X size={14} />
              </button>
            </div>
          </div>
          {!minimized && (
            <iframe src={toolUrl} title={toolTitle} style={{ flex: 1, width: "100%", border: "none", background: "#0a0b0e" }} />
          )}
        </div>
      )}
    </>
  );
}