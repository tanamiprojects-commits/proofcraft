"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FileSpreadsheet, Printer, Copy, CheckCircle2, ShieldCheck, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";

interface Props {
  userId: string | null;
}

export default function ExecutiveReportCard({ userId }: Props) {
  const { isHe } = useStudioLang();
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [steps, setSteps] = useState(0);
  const [links, setLinks] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [verified, setVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadMetrics = useCallback(async () => {
    if (!userId) return;
    const [pRes, lRes, cRes] = await Promise.all([
      supabase.from("profiles").select("full_name, headline, completed_step_ids, admin_verified").eq("id", userId).single(),
      supabase.from("aff_links").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("aff_clicks").select("id", { count: "exact", head: true }).eq("user_id", userId)
    ]);

    setName(pRes.data?.full_name || "");
    setHeadline(pRes.data?.headline || "");
    setSteps(Array.isArray(pRes.data?.completed_step_ids) ? pRes.data.completed_step_ids.length : 0);
    setVerified(Boolean(pRes.data?.admin_verified));
    setLinks(lRes.count || 0);
    setClicks(cRes.count || 0);
  }, [userId]);

  useEffect(() => {
    loadMetrics();
    const onSync = () => loadMetrics();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [loadMetrics]);
  if (!userId) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://" + "proofcraft-seven" + ".vercel.app";
  const portfolioUrl = `${origin}/portfolio/${userId.slice(0, 8)}`;
  const serialId = `PC-${userId.slice(0, 4).toUpperCase()}-V43`;

  const exportCsv = () => {
    const header = isHe ? "מזהה אימות,שם יוצר,כותרת,שלבים מאומתים,קישורים פעילים,קליקים שנמדדו,סטטוס אימות,קישור פורטפוליו" : "Serial ID,Creator Name,Headline,Verified Steps,Active Links,Tracked Clicks,Verification Status,Portfolio URL";
    const row = [
      serialId,
      `"${(name || "ProofCraft Builder").replace(/"/g, '""')}"`,
      `"${(headline || "AI Product & Growth Studio").replace(/"/g, '""')}"`,
      steps,
      links,
      clicks,
      verified ? (isHe ? "מאומת" : "Verified") : (isHe ? "פעיל" : "Active"),
      portfolioUrl
    ].join(",");
    const bom = "\uFEFF";
    const blob = new Blob([bom + header + "\n" + row], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proofcraft-executive-report-${serialId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySummary = async () => {
    const text = isHe
      ? `דוח ביצועים מאומת — ProofCraft Fintech OS (${serialId})\nיוצר: ${name || "יוצר מאומת"}\nשלבים מאומתים: ${steps} | קישורים פעילים: ${links} | קליקים שנמדדו: ${clicks}\nאימות חי: ${portfolioUrl}`
      : `Verified Executive Performance Report — ProofCraft Fintech OS (${serialId})\nCreator: ${name || "Verified Builder"}\nVerified Steps: ${steps} | Active Links: ${links} | Tracked Clicks: ${clicks}\nLive Proof: ${portfolioUrl}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div dir={isHe ? "rtl" : "ltr"} className="card-surface" style={{ padding: 16, marginBottom: 18, border: "1px solid rgba(148,163,184,0.28)", background: "rgba(15,23,42,0.92)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart3 size={18} color="#38bdf8" />
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc", margin: 0 }}>
              {isHe ? "דוח ביצועים ותעודת אימות מסכמת (Executive Report)" : "Executive Performance & Verification Report"}
            </h3>
            <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>
              {isHe ? `מזהה אימות רשמי: ${serialId} · מוכן להצגה ללקוחות, מעסיקים ושותפים` : `Official Verification ID: ${serialId} · Ready for clients, employers & partners`}
            </p>
          </div>
        </div>
        <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(52,211,153,0.14)", color: "#34d399", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <ShieldCheck size={12} /> {verified ? (isHe ? "מאומת מערכת" : "SYSTEM VERIFIED") : (isHe ? "סנכרון חי פעיל" : "LIVE CLOUD SYNC")}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 12 }}>
        <div style={{ padding: 10, borderRadius: 10, background: "rgba(2,6,23,0.65)", border: "1px solid rgba(56,189,248,0.2)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{isHe ? "שלבי בנייה" : "Verified Steps"}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#38bdf8" }}>{steps}</div>
        </div>
        <div style={{ padding: 10, borderRadius: 10, background: "rgba(2,6,23,0.65)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{isHe ? "קישורים פעילים" : "Active Links"}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#34d399" }}>{links}</div>
        </div>
        <div style={{ padding: 10, borderRadius: 10, background: "rgba(2,6,23,0.65)", border: "1px solid rgba(251,191,36,0.2)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{isHe ? "קליקים שנמדדו" : "Tracked Clicks"}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fbbf24" }}>{clicks}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button type="button" onClick={exportCsv} className="btn-primary" style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12 }}>
          <FileSpreadsheet size={13} />
          <span>{isHe ? "ייצוא דוח Excel (CSV)" : "Export Excel Report (CSV)"}</span>
        </button>
        <button type="button" onClick={() => typeof window !== "undefined" && window.print()} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12 }}>
          <Printer size={13} />
          <span>{isHe ? "הדפסה / שמירה כ-PDF" : "Print / Save as PDF"}</span>
        </button>
        <button type="button" onClick={copySummary} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12 }}>
          {copied ? <CheckCircle2 size={13} color="#34d399" /> : <Copy size={13} />}
          <span>{copied ? (isHe ? "התקציר הועתק!" : "Summary Copied!") : (isHe ? "העתק תקציר אימות" : "Copy Verified Summary")}</span>
        </button>
      </div>
    </div>
  );
}