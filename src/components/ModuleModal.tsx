"use client";

import React, { useEffect } from "react";
import { ArrowRight, X } from "lucide-react";

interface ModuleModalProps {
  open: boolean;
  title: string;
  icon: string;
  onClose: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  children: React.ReactNode;
}

export default function ModuleModal({
  open,
  title,
  icon,
  onClose,
  primaryActionLabel,
  onPrimaryAction,
  children,
}: ModuleModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      dir="rtl"
      className="fixed inset-0 z-[9999] flex justify-center bg-[rgba(0,0,0,0.78)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[600px] h-full flex flex-col bg-[#0b0f17] border-x border-[rgba(255,255,255,0.08)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header 56px */}
        <div className="sticky top-0 z-10 h-[56px] px-4 flex items-center justify-between bg-[#1e293b]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)]">
          <button
            onClick={onClose}
            aria-label="חזרה"
            className="flex items-center gap-1.5 text-[13px] font-bold text-[#b8c1cf] hover:text-white"
          >
            <ArrowRight className="w-4 h-4" />
            <span>חזרה</span>
          </button>

          <div className="flex items-center gap-2 text-[16px] font-extrabold text-white">
            <span>{icon}</span>
            <span>{title}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="סגור חלון"
            className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#b8c1cf] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {children}
        </div>

        {/* Sticky Footer 64px */}
        <div className="sticky bottom-0 z-10 h-[64px] px-4 flex items-center justify-between gap-3 bg-[#1e293b]/95 backdrop-blur-md border-t border-[rgba(255,255,255,0.08)]">
          <button
            onClick={onClose}
            className="h-[42px] px-5 rounded-[12px] border border-[rgba(255,255,255,0.12)] text-[13px] font-bold text-[#b8c1cf] hover:text-white"
          >
            סגור
          </button>
          {primaryActionLabel && onPrimaryAction && (
            <button
              onClick={onPrimaryAction}
              className="h-[42px] px-5 rounded-[12px] bg-[#2481cc] hover:bg-[#1e6eb0] text-[13px] font-bold text-white shadow"
            >
              {primaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
