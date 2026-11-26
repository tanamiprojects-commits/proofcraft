"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpRight, Maximize2, Minimize2, PictureInPicture2, ShieldCheck, Sparkles, Terminal, X } from "lucide-react";

interface ToolState { open: boolean; minimized: boolean; }

export default function PersistentFloatingToolsDock({ isHe = true }: { isHe?: boolean }) {
  const [vault, setVault] = useState<ToolState>({ open: false, minimized: false });
  const [ctx, setCtx] = useState<ToolState>({ open: false, minimized: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    try {
      const v = localStorage.getItem("pc_dock_vault_v3");
      const c = localStorage.getItem("pc_dock_ctx_v3");
      if (v) setVault(JSON.parse(v));
      if (c) setCtx(JSON.parse(c));
    } catch {}
    return () => window.removeEventListener("resize", check);
  }, []);

  const updateVault = (next: ToolState) => {
    setVault(next);
    try { localStorage.setItem("pc_dock_vault_v3", JSON.stringify(next)); } catch {}
  };

  const updateCtx = (next: ToolState) => {
    setCtx(next);
    try { localStorage.setItem("pc_dock_ctx_v3", JSON.stringify(next)); } catch {}
  };

  const popOutDesktopPip = async (path: string, winName: string) => {
    try {
      const w = window as unknown as { documentPictureInPicture?: { requestWindow: (o: { width: number; height: number }) => Promise<Window> } };
      if (w.documentPictureInPicture) {
        const pip = await w.documentPictureInPicture.requestWindow({ width: 540, height: 680 });
        pip.location.href = `${path}?floating=1`;
      } else {
        window.open(`${path}?floating=1`, winName, "width=560,height=700,top=60,left=60");
      }
    } catch { window.open(`${path}?floating=1`, "_blank"); }
  };
  const renderWindow = (
    key: "vault" | "ctx",
    state: ToolState,
    setState: (s: ToolState) => void,
    cfg: { title: string; badge: string; url: string; accent: string; glow: string; footerText: string; footerLinkText: string; footerHref: string }
  ) => {
    if (!state.open) return null;
    const isVault = key === "vault";
    return (
      <div key={key} style={{
        width: state.minimized ? (isMobile ? "calc(100vw - 24px)" : 310) : (isMobile ? "calc(100vw - 20px)" : "min(490px, 46vw)"),
        height: state.minimized ? 48 : (isMobile ? "72vh" : "min(620px, calc(100vh - 104px))"),
        borderRadius: 16,
        background: "linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(9,11,16,0.99) 100%)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${cfg.accent}`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.88), 0 0 28px ${cfg.glow}`,
        display: "flex", flexDirection: "column", overflow: "hidden", pointerEvents: "auto", transition: "all 0.2s ease"
      }}>
        <div style={{
          height: 48, padding: "0 12px",
          background: isVault ? "linear-gradient(90deg, rgba(16,185,129,0.16), rgba(15,23,42,0.95))" : "linear-gradient(90deg, rgba(56,189,248,0.16), rgba(15,23,42,0.95))",
          borderBottom: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: isVault ? "rgba(16,185,129,0.2)" : "rgba(56,189,248,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isVault ? <ShieldCheck size={14} style={{ color: "#34d399" }} /> : <Terminal size={14} style={{ color: "#38bdf8" }} />}
            </div>
            <span style={{ fontSize: 12, fontWeight: 900, color: "#f8fafc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cfg.title}</span>
            {!isMobile && <span style={{ fontSize: 9.5, fontWeight: 800, padding: "2px 6px", borderRadius: 99, background: "rgba(255,255,255,0.07)", color: isVault ? "#6ee7b7" : "#7dd3fc", flexShrink: 0 }}>{cfg.badge}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            {!isMobile && (
              <button type="button" onClick={() => popOutDesktopPip(cfg.url, `ProofCraft_${key}`)} title={isHe ? "צוף מעל כל תוכנה במחשב" : "Float above desktop apps"} className="btn-ghost" style={{ height: 30, padding: "0 8px", color: "#38bdf8" }}>
                <PictureInPicture2 size={13} />
              </button>
            )}
            <button type="button" onClick={() => setState({ ...state, minimized: !state.minimized })} title={state.minimized ? "הגדל" : "מזער"} className="btn-ghost" style={{ height: 30, padding: "0 8px" }}>
              {state.minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            </button>
            <button type="button" onClick={() => setState({ open: false, minimized: false })} title={isHe ? "סגור" : "Close"} className="btn-ghost" style={{ height: 30, padding: "0 8px", color: "#f87171" }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {!state.minimized && (
          <>
            <iframe src={`${cfg.url}?floating=1`} title={cfg.title} style={{ flex: 1, width: "100%", border: "none", background: "#0a0b0e" }} />
            <div style={{
              padding: "6px 12px", background: "#0d1017", borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 10.5
            }}>
              <span style={{ color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <Sparkles size={11} style={{ color: isVault ? "#34d399" : "#38bdf8", flexShrink: 0 }} /> {cfg.footerText}
              </span>
              <a href={cfg.footerHref} style={{ color: isVault ? "#34d399" : "#38bdf8", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 2, flexShrink: 0, textDecoration: "none" }}>
                <span>{cfg.footerLinkText}</span> <ArrowUpRight size={11} />
              </a>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div dir={isHe ? "rtl" : "ltr"} style={{
        position: "fixed", bottom: isMobile ? 68 : 74, [isHe ? "left" : "right"]: isMobile ? 10 : 16, zIndex: 9990,
        display: "flex", flexDirection: "column", gap: 8
      }}>
        <button type="button" onClick={() => updateVault(isMobile ? { open: !vault.open, minimized: false } : { open: !vault.open, minimized: false })}
          className="btn-primary" style={{
            height: 40, padding: "0 14px", fontSize: 12, borderRadius: 12,
            boxShadow: "0 10px 28px rgba(0,0,0,0.65)",
            background: vault.open ? "linear-gradient(135deg,#059669,#047857)" : "linear-gradient(135deg,#0f172a,#1e293b)",
            border: "1px solid rgba(52,211,153,0.5)"
          }}>
          <ShieldCheck size={15} style={{ color: "#34d399" }} />
          <span>{isHe ? "כספת צפה" : "Floating Vault"}</span>
        </button>

        <button type="button" onClick={() => updateCtx({ open: !ctx.open, minimized: false })}
          className="btn-primary" style={{
            height: 40, padding: "0 14px", fontSize: 12, borderRadius: 12,
            boxShadow: "0 10px 28px rgba(0,0,0,0.65)",
            background: ctx.open ? "linear-gradient(135deg,#0284c7,#1d4ed8)" : "linear-gradient(135deg,#0f172a,#1e293b)",
            border: "1px solid rgba(56,189,248,0.5)"
          }}>
          <Terminal size={15} style={{ color: "#38bdf8" }} />
          <span>{isHe ? "קובץ לצ׳אט AI" : "AI File Studio"}</span>
        </button>
      </div>

      {(vault.open || ctx.open) && (
        <div dir={isHe ? "rtl" : "ltr"} style={{
          position: "fixed", bottom: isMobile ? 10 : 16, [isHe ? "right" : "left"]: isMobile ? 10 : 16, zIndex: 9999,
          display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: isMobile ? "nowrap" : "wrap",
          alignItems: isMobile ? "stretch" : "flex-end", gap: 12, maxWidth: "calc(100vw - 20px)", pointerEvents: "none"
        }}>
          {renderWindow("vault", vault, updateVault, {
            title: isHe ? "כספת Zero-Knowledge צפה" : "Zero-Knowledge Vault",
            badge: "AES-GCM",
            url: "/vault",
            accent: "rgba(52,211,153,0.5)",
            glow: "rgba(16,185,129,0.16)",
            footerText: isHe ? "הצפנת דפדפן 100% ללא גישת שרת" : "100% Client-Side Encrypted",
            footerLinkText: isHe ? "מסך מלא" : "Full View",
            footerHref: "/vault",
          })}
          {renderWindow("ctx", ctx, updateCtx, {
            title: isHe ? "סטודיו קבצים והקשר לצ׳אט" : "AI Context & File Studio",
            badge: "AI PACKET",
            url: "/context-studio",
            accent: "rgba(56,189,248,0.5)",
            glow: "rgba(56,189,248,0.16)",
            footerText: isHe ? "מוכן להדבקה בכל מודל AI חכם" : "Structured for Any AI Model",
            footerLinkText: isHe ? "לדף השיטה" : "Method",
            footerHref: "/method",
          })}
        </div>
      )}
    </>
  );
}