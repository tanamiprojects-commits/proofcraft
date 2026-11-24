"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";

interface GlobalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryLabel?: string;
  onPrimaryAction?: () => void;
}

export default function GlobalModal({ isOpen, onClose, title, children, primaryLabel, onPrimaryAction }: GlobalModalProps) {
  const { isHe, dir, t } = useStudioLang();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div dir={dir} role="dialog" aria-modal="true" onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 600, maxHeight: "90vh", borderRadius: 20, background: "#0b0f17", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 56, padding: "0 16px", background: "#141923", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            {isHe ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            <span>{t("Back", "חזרה")}</span>
          </button>
          <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#f8fafc", textAlign: "center" }}>{title}</h2>
          <button onClick={onClose} aria-label={t("Close", "סגור")} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", color: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={15} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>{children}</div>
        <div style={{ height: 64, padding: "0 16px", background: "#141923", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
          <button onClick={onClose} className="btn-ghost" style={{ height: 40, padding: "0 18px" }}>{t("Close", "סגור")}</button>
          {primaryLabel && onPrimaryAction && (
            <button onClick={onPrimaryAction} className="btn-primary" style={{ width: "auto", height: 40, padding: "0 20px" }}>
              {primaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
