"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, ArrowLeft } from "lucide-react";

interface Props {
  isHe: boolean;
  isAdmin?: boolean;
}

export default function GlobalQuickJump({ isHe, isAdmin = false }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const routes = [
    { href: "/", title: isHe ? "\u05D3\u05E3 \u05D4\u05D1\u05D9\u05EA \u05D4\u05E8\u05D0\u05E9\u05D9" : "Home Launchpad", tag: isHe ? "\u05E8\u05D0\u05E9\u05D9" : "Home" },
    { href: "/workspace", title: isHe ? "\u05E1\u05D8\u05D5\u05D3\u05D9\u05D5 AI \u05D5\u05D4\u05D2\u05E9\u05EA \u05E4\u05E8\u05D5\u05D9\u05E7\u05D8\u05D9\u05DD (v1.0-v4.0)" : "AI Builder Studio (v1.0-v4.0)", tag: isHe ? "\u05E1\u05D8\u05D5\u05D3\u05D9\u05D5" : "Studio" },
    { href: "/affiliate", title: isHe ? "\u05DE\u05E8\u05DB\u05D6 \u05E9\u05D5\u05EA\u05E4\u05D9\u05DD, \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05D7\u05DB\u05DE\u05D9\u05DD \u05D5\u05D4\u05E4\u05E0\u05D9\u05D5\u05EA" : "Affiliate Hub, Smart Links & Referrals", tag: isHe ? "\u05E9\u05D5\u05EA\u05E4\u05D9\u05DD" : "Affiliate" },
    { href: "/portfolio/live", title: isHe ? "\u05EA\u05D9\u05E7 \u05E2\u05D1\u05D5\u05D3\u05D5\u05EA \u05DE\u05D0\u05D5\u05DE\u05EA \u05D5\u05EA\u05E2\u05D5\u05D3\u05EA \u05D4\u05E1\u05DE\u05DB\u05D4" : "Verified Portfolio & Official Credential", tag: isHe ? "\u05E4\u05D5\u05E8\u05D8\u05E4\u05D5\u05DC\u05D9\u05D5" : "Portfolio" },
    { href: "/creators", title: isHe ? "\u05D0\u05D9\u05E0\u05D3\u05E7\u05E1 \u05D9\u05D5\u05E6\u05E8\u05D9\u05DD \u05D5\u05D7\u05E0\u05D5\u05D9\u05D5\u05EA \u05D3\u05D9\u05DC\u05D9\u05DD" : "Verified Creators & Storefronts Directory", tag: isHe ? "\u05D9\u05D5\u05E6\u05E8\u05D9\u05DD" : "Directory" },
    { href: "/feed", title: isHe ? "\u05E4\u05D9\u05D3 \u05D4\u05E7\u05D4\u05D9\u05DC\u05D4 \u05D5\u05E7\u05D9\u05D3\u05D5\u05DD \u05E4\u05E8\u05E1\u05D5\u05DE\u05D9\u05DD" : "Public Proof & Deals Feed Wall", tag: isHe ? "\u05E4\u05D9\u05D3" : "Feed" },
    { href: "/toolkit", title: isHe ? "\u05D0\u05E8\u05D2\u05D6 \u05DB\u05DC\u05D9 AI \u05D5\u05E4\u05E8\u05D5\u05DE\u05E4\u05D8\u05D9\u05DD" : "AI Stack & Prompt Vault Toolkit", tag: isHe ? "\u05DB\u05DC\u05D9\u05DD" : "Toolkit" },
    { href: "/method", title: isHe ? "\u05E9\u05D9\u05D8\u05EA Proof-of-Execution" : "Proof-of-Execution Methodology", tag: isHe ? "\u05DE\u05EA\u05D5\u05D3\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4" : "Method" },
    ...(isAdmin ? [{ href: "/admin", title: isHe ? "\u05DE\u05E8\u05DB\u05D6 \u05E9\u05DC\u05D9\u05D8\u05D4 \u05D5\u05E0\u05D9\u05D4\u05D5\u05DC \u05D0\u05D3\u05DE\u05D9\u05DF" : "Admin Governance & CRM Control Center", tag: "ADMIN" }] : []),
  ];

  const matches = routes.filter((r) => !q.trim() || r.title.toLowerCase().includes(q.toLowerCase()) || r.tag.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <button
        type="button"
        onClick={() => { setQ(""); setOpen(true); }}
        className="btn-ghost"
        style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}
      >
        <Search size={12} />
        <span>{isHe ? "\u05D7\u05D9\u05E4\u05D5\u05E9 \u05DE\u05D4\u05D9\u05E8" : "Quick Jump"}</span>
      </button>

      {open && (
        <div
          dir={isHe ? "rtl" : "ltr"}
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            background: "rgba(2,6,23,0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "64px 16px 16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card-hero"
            style={{ width: "100%", maxWidth: 520, padding: 16, textAlign: isHe ? "right" : "left" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Search size={16} color="#38bdf8" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={isHe ? "\u05D7\u05E4\u05E9 \u05E2\u05DE\u05D5\u05D3, \u05DB\u05DC\u05D9 \u05D0\u05D5 \u05E4\u05E2\u05D5\u05DC\u05D4..." : "Jump to Studio, Affiliate Hub, Portfolio, Admin..."}
                className="input-dark"
                style={{ flex: 1, height: 38, fontSize: 13 }}
              />
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost" style={{ height: 36, padding: "0 10px" }}>
                <X size={15} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }}>
              {matches.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => { setOpen(false); router.push(item.href); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(15,23,42,0.85)",
                    border: "1px solid rgba(148,163,184,0.16)",
                    color: "#f8fafc",
                    cursor: "pointer",
                    textAlign: isHe ? "right" : "left",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{item.title}</span>
                  <span style={{ fontSize: 11, color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                    {item.tag} {isHe ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}