"use client";

import React, { useState, useEffect } from "react";
import { Accessibility, RotateCcw, X } from "lucide-react";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [stopMotion, setStopMotion] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.style.fontSize = largeText ? "115%" : "100%";
    html.style.filter = highContrast ? "contrast(1.25)" : "none";
    if (highlightLinks) html.classList.add("a11y-links");
    else html.classList.remove("a11y-links");
    if (stopMotion) html.classList.add("a11y-stop-motion");
    else html.classList.remove("a11y-stop-motion");
  }, [largeText, highContrast, highlightLinks, stopMotion]);

  const resetAll = () => {
    setLargeText(false);
    setHighContrast(false);
    setHighlightLinks(false);
    setStopMotion(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="תפריט נגישות"
        title="הגדרות נגישות"
        style={{
          position: "fixed", bottom: 76, left: 16, zIndex: 45,
          width: 42, height: 42, borderRadius: "50%",
          background: "#2481cc", border: "2px solid rgba(255,255,255,0.2)",
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.45)", cursor: "pointer"
        }}
      >
        <Accessibility size={20} />
      </button>

      {open && (
        <div
          dir="rtl"
          role="dialog"
          aria-label="אפשרויות נגישות"
          style={{
            position: "fixed", bottom: 126, left: 16, zIndex: 50,
            width: 250, padding: 14, borderRadius: 16,
            background: "#131a26", border: "1px solid rgba(151,117,250,0.4)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.65)", color: "#fff"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800 }}>הצהרת והתאמות נגישות</span>
            <button onClick={() => setOpen(false)} aria-label="סגור נגישות" style={{ background: "none", border: "none", color: "#7a8699", cursor: "pointer" }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
            {[
              { label: "הגדלת גופנים (115%)", active: largeText, toggle: () => setLargeText(!largeText) },
              { label: "ניגודיות גבוהה", active: highContrast, toggle: () => setHighContrast(!highContrast) },
              { label: "הדגשת קישורים וכפתורים", active: highlightLinks, toggle: () => setHighlightLinks(!highlightLinks) },
              { label: "עצירת אנימציות", active: stopMotion, toggle: () => setStopMotion(!stopMotion) },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.toggle}
                style={{
                  padding: "8px 10px", borderRadius: 10, textAlign: "right", fontWeight: 700, cursor: "pointer",
                  background: item.active ? "rgba(81,207,102,0.18)" : "#0b0f17",
                  border: `1px solid ${item.active ? "#51cf66" : "rgba(255,255,255,0.08)"}`,
                  color: item.active ? "#51cf66" : "#e6edf7"
                }}
              >
                {item.active ? "✓ " : ""}{item.label}
              </button>
            ))}

            <button onClick={resetAll} className="btn-ghost" style={{ height: 34, marginTop: 4 }}>
              <RotateCcw size={13} /> איפוס הגדרות נגישות
            </button>
          </div>
        </div>
      )}
    </>
  );
}
