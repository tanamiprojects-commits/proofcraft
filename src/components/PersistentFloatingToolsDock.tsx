"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, GripHorizontal, Maximize2, Minimize2, PictureInPicture2, ShieldCheck, Sparkles, Terminal, X } from "lucide-react";

interface ToolState { open: boolean; minimized: boolean; x: number; y: number; w: number; h: number; }

export default function PersistentFloatingToolsDock({ isHe = true }: { isHe?: boolean }) {
  const [vault, setVault] = useState<ToolState>({ open: false, minimized: false, x: 24, y: 80, w: 460, h: 580 });
  const [ctx, setCtx] = useState<ToolState>({ open: false, minimized: false, x: 500, y: 80, w: 460, h: 580 });
  const [isMobile, setIsMobile] = useState(false);
  const dragRef = useRef<{ key: "vault" | "ctx"; startX: number; startY: number; origX: number; origY: number } | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    try {
      const v = localStorage.getItem("pc_dock_vault_v4");
      const c = localStorage.getItem("pc_dock_ctx_v4");
      if (v) setVault((prev) => ({ ...prev, ...JSON.parse(v) }));
      if (c) setCtx((prev) => ({ ...prev, ...JSON.parse(c) }));
    } catch {}
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { key, startX, startY, origX, origY } = dragRef.current;
      const nx = Math.max(8, Math.min(window.innerWidth - 280, origX + (e.clientX - startX)));
      const ny = Math.max(8, Math.min(window.innerHeight - 60, origY + (e.clientY - startY)));
      if (key === "vault") setVault((p) => ({ ...p, x: nx, y: ny }));
      else setCtx((p) => ({ ...p, x: nx, y: ny }));
    };
    const onUp = () => {
      if (!dragRef.current) return;
      const key = dragRef.current.key;
      dragRef.current = null;
      if (key === "vault") setVault((p) => { try { localStorage.setItem("pc_dock_vault_v4", JSON.stringify(p)); } catch {} return p; });
      else setCtx((p) => { try { localStorage.setItem("pc_dock_ctx_v4", JSON.stringify(p)); } catch {} return p; });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, []);

  const saveVault = (next: ToolState) => { setVault(next); try { localStorage.setItem("pc_dock_vault_v4", JSON.stringify(next)); } catch {} };
  const saveCtx = (next: ToolState) => { setCtx(next); try { localStorage.setItem("pc_dock_ctx_v4", JSON.stringify(next)); } catch {} };
  const popOutDesktopPip = async (path: string, title: string, winName: string) => {
    const fullUrl = `${window.location.origin}${path}?floating=1`;
    try {
      const w = window as unknown as { documentPictureInPicture?: { requestWindow: (o: { width: number; height: number }) => Promise<Window> } };
      if (w.documentPictureInPicture) {
        const pip = await w.documentPictureInPicture.requestWindow({ width: 520, height: 660 });
        pip.document.title = title;
        pip.document.body.style.cssText = "margin:0;padding:0;background:#0a0b0e;overflow:hidden;height:100vh;";
        const ifr = pip.document.createElement("iframe");
        ifr.src = fullUrl;
        ifr.style.cssText = "width:100%;height:100%;border:none;background:#0a0b0e;";
        pip.document.body.appendChild(ifr);
        return;
      }
    } catch {}
    window.open(fullUrl, winName, "width=540,height=680,top=70,left=70,resizable=yes,scrollbars=yes");
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
      <div key={key} dir={isHe ? "rtl" : "ltr"} style={{
        position: "fixed",
        left: isMobile ? 10 : state.x,
        top: isMobile ? (isVault ? 56 : 112) : state.y,
        width: state.minimized ? (isMobile ? "calc(100vw - 20px)" : 300) : (isMobile ? "calc(100vw - 20px)" : state.w),
        height: state.minimized ? 46 : (isMobile ? "72vh" : state.h),
        minWidth: 300, minHeight: state.minimized ? 46 : 320, maxWidth: "calc(100vw - 16px)", maxHeight: "calc(100vh - 16px)",
        resize: isMobile || state.minimized ? "none" : "both",
        zIndex: isVault ? 9998 : 9999,
        borderRadius: 16,
        background: "linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(9,11,16,0.99) 100%)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${cfg.accent}`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.88), 0 0 28px ${cfg.glow}`,
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        <div
          onPointerDown={(e) => {
            if (isMobile || (e.target as HTMLElement).closest("button")) return;
            dragRef.current = { key, startX: e.clientX, startY: e.clientY, origX: state.x, origY: state.y };
          }}
          style={{
            height: 46, padding: "0 12px", cursor: isMobile ? "default" : "grab", userSelect: "none",
            background: isVault ? "linear-gradient(90deg, rgba(16,185,129,0.18), rgba(15,23,42,0.96))" : "linear-gradient(90deg, rgba(56,189,248,0.18), rgba(15,23,42,0.96))",
            borderBottom: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            {!isMobile && <GripHorizontal size={14} style={{ color: "#64748b", flexShrink: 0 }} />}
            {isVault ? <ShieldCheck size={14} style={{ color: "#34d399", flexShrink: 0 }} /> : <Terminal size={14} style={{ color: "#38bdf8", flexShrink: 0 }} />}
            <span style={{ fontSize: 12, fontWeight: 900, color: "#f8fafc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cfg.title}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <button type="button" onClick={() => popOutDesktopPip(cfg.url, cfg.title, `ProofCraft_${key}`)} title={isHe ? "פתח כחלון עצמאי מעל כל תוכנה במחשב" : "Pop out above all desktop apps"} className="btn-ghost" style={{ height: 28, padding: "0 8px", color: "#38bdf8", fontSize: 10.5, display: "inline-flex", alignItems: "center", gap: 4 }}>
              <PictureInPicture2 size={13} />
              <span>{isHe ? "מעל כל מסך" : "Pop Out"}</span>
            </button>
            <button type="button" onClick={() => setState({ ...state, minimized: !state.minimized })} title={state.minimized ? "הגדל" : "מזער"} className="btn-ghost" style={{ height: 28, padding: "0 7px" }}>
              {state.minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            </button>
            <button type="button" onClick={() => setState({ ...state, open: false, minimized: false })} title={isHe ? "סגור" : "Close"} className="btn-ghost" style={{ height: 28, padding: "0 7px", color: "#f87171" }}>
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
              <span style={{ color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={11} style={{ color: isVault ? "#34d399" : "#38bdf8" }} /> {isMobile ? cfg.footerText : (isHe ? "גרור כותרת להזזה · משוך פינה לשינוי גודל" : "Drag header to move · Drag corner to resize")}
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
      <div dir={isHe ? "rtl" : "ltr"} style={{ position: "fixed", bottom: isMobile ? 68 : 74, [isHe ? "left" : "right"]: isMobile ? 10 : 16, zIndex: 9990, display: "flex", flexDirection: "column", gap: 8 }}>
        <button type="button" onClick={() => saveVault({ ...vault, open: !vault.open, minimized: false })} className="btn-primary" style={{ height: 40, padding: "0 14px", fontSize: 12, borderRadius: 12, boxShadow: "0 10px 28px rgba(0,0,0,0.65)", background: vault.open ? "linear-gradient(135deg,#059669,#047857)" : "linear-gradient(135deg,#0f172a,#1e293b)", border: "1px solid rgba(52,211,153,0.5)" }}>
          <ShieldCheck size={15} style={{ color: "#34d399" }} /> <span>{isHe ? "כספת צפה" : "Floating Vault"}</span>
        </button>
        <button type="button" onClick={() => saveCtx({ ...ctx, open: !ctx.open, minimized: false })} className="btn-primary" style={{ height: 40, padding: "0 14px", fontSize: 12, borderRadius: 12, boxShadow: "0 10px 28px rgba(0,0,0,0.65)", background: ctx.open ? "linear-gradient(135deg,#0284c7,#1d4ed8)" : "linear-gradient(135deg,#0f172a,#1e293b)", border: "1px solid rgba(56,189,248,0.5)" }}>
          <Terminal size={15} style={{ color: "#38bdf8" }} /> <span>{isHe ? "קובץ לצ׳אט AI" : "AI File Studio"}</span>
        </button>
      </div>
      {renderWindow("vault", vault, saveVault, { title: isHe ? "כספת Zero-Knowledge" : "Zero-Knowledge Vault", badge: "AES-GCM", url: "/vault", accent: "rgba(52,211,153,0.5)", glow: "rgba(16,185,129,0.16)", footerText: isHe ? "הצפנת דפדפן 100%" : "Client-Side Encrypted", footerLinkText: isHe ? "מסך מלא" : "Full View", footerHref: "/vault" })}
      {renderWindow("ctx", ctx, saveCtx, { title: isHe ? "סטודיו קבצים לצ׳אט AI" : "AI Context & File Studio", badge: "AI PACKET", url: "/context-studio", accent: "rgba(56,189,248,0.5)", glow: "rgba(56,189,248,0.16)", footerText: isHe ? "מוכן לכל מודל AI" : "Ready for Any AI", footerLinkText: isHe ? "לדף השיטה" : "Method", footerHref: "/method" })}
    </>
  );
}