"use client";
import React, { useCallback, useEffect, useState } from "react";
import { BookOpen, ShieldCheck, X, ArrowRight, ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { runAutonomousMaintenance, WatchdogReport } from "@/lib/autonomous-watchdog";
import { useStudioLang } from "@/lib/i18n-engine";

export type AdminTabKey = "queue" | "users" | "support" | "feed" | "tracks" | "broadcast";

interface Props {
  onNavigateTab: (tab: AdminTabKey) => void;
  onNotify: (msg: string) => void;
}

export default function AdminGuideDrawer({ onNavigateTab, onNotify }: Props) {
  const { isHe, dir } = useStudioLang();
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState<WatchdogReport | null>(null);
  const [sweeping, setSweeping] = useState(false);

  const executeSweep = useCallback(async (manual = false) => {
    setSweeping(true);
    try {
      const res = await runAutonomousMaintenance(!manual);
      setReport(res);
      if (manual) {
        onNotify(isHe ? `\u05E1\u05E8\u05D9\u05E7\u05EA \u05D0\u05D1\u05D8\u05D7\u05D4 24/7 \u05D4\u05D5\u05E9\u05DC\u05DE\u05D4 (${res.checkedLinks} \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD)` : `24/7 Watchdog sweep complete (${res.checkedLinks} links audited)`);
      }
    } finally {
      setSweeping(false);
    }
  }, [isHe, onNotify]);

  useEffect(() => {
    executeSweep(false);
    const onSync = () => executeSweep(false);
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [executeSweep]);
  const guides: { step: string; title: string; badge: string; actions: string[]; tab: AdminTabKey; cta: string }[] = [
    {
      step: "01",
      title: isHe ? "\u05E1\u05D9\u05E0\u05D5\u05DF \u05D5\u05D0\u05D9\u05E9\u05D5\u05E8 \u05D3\u05D9\u05DC\u05D9\u05DD \u05D5\u05E4\u05E8\u05E1\u05D5\u05DE\u05D9\u05DD \u05DE\u05DE\u05EA\u05D9\u05E0\u05D9\u05DD" : "Moderation & Security Screening Queue",
      badge: report && report.pendingModeration > 0 ? `${report.pendingModeration} ${isHe ? "\u05DE\u05DE\u05EA\u05D9\u05E0\u05D9\u05DD" : "PENDING"}` : (isHe ? "\u05E0\u05E7\u05D9" : "CLEAR"),
      actions: isHe
        ? ["1. \u05D1\u05D3\u05D5\u05E7 \u05D1\u05E8\u05D0\u05E9 \u05D4\u05DE\u05E1\u05DA \u05D0\u05DD \u05DE\u05D5\u05E4\u05D9\u05E2\u05D4 \u05EA\u05D9\u05D1\u05EA \u05D4\u05D0\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05D4\u05E6\u05D4\u05D5\u05D1\u05D4.", "2. \u05D5\u05D3\u05D0 \u05E9\u05D4\u05E7\u05D9\u05E9\u05D5\u05E8 \u05DE\u05EA\u05D7\u05D9\u05DC \u05D1-HTTPS \u05D5\u05E2\u05D5\u05DE\u05D3 \u05D1\u05DB\u05DC\u05DC\u05D9 \u05D4\u05D2\u05D9\u05DC\u05D5\u05D9 \u05D4\u05E0\u05D0\u05D5\u05EA.", "3. \u05DC\u05D7\u05E5 '\u05D0\u05E9\u05E8' \u05DC\u05E4\u05E8\u05E1\u05D5\u05DD \u05D1\u05E4\u05D9\u05D3 \u05D0\u05D5 '\u05D3\u05D7\u05D4' \u05DC\u05D4\u05E1\u05E8\u05D4."]
        : ["1. Check the yellow Security Screening box at the top of the Moderation tab.", "2. Confirm destination URL uses HTTPS and complies with disclosure rules.", "3. Click 'Approve' to publish live to the Feed Wall or 'Reject' to purge."],
      tab: "queue",
      cta: isHe ? "\u05E2\u05D1\u05D5\u05E8 \u05DC\u05EA\u05D5\u05E8 \u05D4\u05D0\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD" : "Open Moderation Queue",
    },
    {
      step: "02",
      title: isHe ? "\u05D4\u05E1\u05DE\u05DB\u05EA \u05D9\u05D5\u05E6\u05E8\u05D9\u05DD, \u05E2\u05D3\u05DB\u05D5\u05DF \u05E8\u05DE\u05D5\u05EA \u05D5\u05DE\u05E2\u05E0\u05E7\u05D9 +25 Credits" : "Builder Certification, Tier Upgrades & +25 Credit Grants",
      badge: isHe ? "\u05E0\u05D9\u05D4\u05D5\u05DC CRM" : "CRM CONTROL",
      actions: isHe
        ? ["1. \u05D7\u05E4\u05E9 \u05D9\u05D5\u05E6\u05E8 \u05DC\u05E4\u05D9 \u05E9\u05DD \u05D0\u05D5 \u05D4\u05EA\u05DE\u05D7\u05D5\u05EA \u05D1\u05E9\u05D5\u05E8\u05EA \u05D4\u05D7\u05D9\u05E4\u05D5\u05E9.", "2. \u05DC\u05D7\u05E5 'Portfolio' \u05DC\u05E6\u05E4\u05D9\u05D9\u05D4 \u05D1\u05EA\u05D9\u05E7 \u05D4\u05E2\u05D1\u05D5\u05D3\u05D5\u05EA \u05D4\u05D7\u05D9 \u05E9\u05DC\u05D5.", "3. \u05DC\u05D7\u05E5 'Verify Builder' \u05DC\u05D4\u05E1\u05DE\u05DB\u05D4 \u05D0\u05D5 '+25 Credits' \u05DC\u05EA\u05D2\u05DE\u05D5\u05DC \u05DE\u05D9\u05D9\u05D3\u05D9."]
        : ["1. Filter or search builders by name or specialty in Global Builders CRM.", "2. Click 'Portfolio' to inspect their live production deployments.", "3. Click 'Verify Builder' to certify or '+25 Credits' to reward activity."],
      tab: "users",
      cta: isHe ? "\u05E4\u05EA\u05D7 \u05E0\u05D9\u05D4\u05D5\u05DC \u05D9\u05D5\u05E6\u05E8\u05D9\u05DD" : "Open Builders CRM",
    },
    {
      step: "03",
      title: isHe ? "\u05DE\u05E2\u05E0\u05D4 \u05DC\u05E4\u05E0\u05D9\u05D5\u05EA \u05EA\u05DE\u05D9\u05DB\u05D4, \u05DC\u05D9\u05D3\u05D9\u05DD \u05D5\u05E7\u05DE\u05E4\u05D9\u05D9\u05E0\u05D9\u05DD" : "Support Replies, Upgrade Leads & Commercial Quotes",
      badge: report && report.openTickets > 0 ? `${report.openTickets} ${isHe ? "\u05E4\u05EA\u05D5\u05D7\u05D5\u05EA" : "OPEN"}` : (isHe ? "\u05DE\u05E2\u05D5\u05D3\u05DB\u05DF" : "SYNCED"),
      actions: isHe
        ? ["1. \u05E1\u05E7\u05D5\u05E8 \u05DC\u05D9\u05D3\u05D9\u05DD \u05D7\u05DE\u05D9\u05DD \u05D1\u05E8\u05D0\u05E9 \u05D4\u05DC\u05E9\u05D5\u05E0\u05D9\u05EA (Upgrade Leads).", "2. \u05DC\u05D7\u05E5 'Reply with Template', \u05D1\u05D7\u05E8 \u05EA\u05D1\u05E0\u05D9\u05EA \u05D5\u05E9\u05DC\u05D7.", "3. \u05D4\u05EA\u05E9\u05D5\u05D1\u05D4 \u05DE\u05D5\u05E4\u05D9\u05E2\u05D4 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05D1\u05EA\u05D9\u05D1\u05EA \u05D4\u05DE\u05E9\u05EA\u05DE\u05E9 \u05D1\u05E1\u05D8\u05D5\u05D3\u05D9\u05D5."]
        : ["1. Review incoming Upgrade Leads at the top of the Support tab.", "2. Click 'Reply with Template' on any ticket to send an instant response.", "3. Your reply syncs automatically to the user's Support Inbox in Studio."],
      tab: "support",
      cta: isHe ? "\u05E4\u05EA\u05D7 \u05EA\u05D9\u05D1\u05EA \u05E4\u05E0\u05D9\u05D5\u05EA \u05D5\u05DC\u05D9\u05D3\u05D9\u05DD" : "Open Support & Leads",
    },
    {
      step: "04",
      title: isHe ? "\u05E9\u05D9\u05D3\u05D5\u05E8 \u05D4\u05D5\u05D3\u05E2\u05D5\u05EA, \u05D1\u05D3\u05D9\u05E7\u05EA \u05EA\u05E7\u05D9\u05E0\u05D5\u05EA \u05D5\u05D9\u05D9\u05E6\u05D5\u05D0 CSV" : "Live Broadcasts, System Self-Test & CSV Backups",
      badge: isHe ? "\u05D1\u05E7\u05E8\u05D4 24/7" : "DIAGNOSTICS",
      actions: isHe
        ? ["1. \u05DC\u05D7\u05E5 '\u05D4\u05E8\u05E5 \u05D1\u05D3\u05D9\u05E7\u05EA \u05DE\u05E2\u05E8\u05DB\u05EA' \u05DC\u05D0\u05D9\u05DE\u05D5\u05EA 5 \u05D8\u05D1\u05DC\u05D0\u05D5\u05EA Supabase.", "2. \u05E4\u05E8\u05E1\u05DD \u05D1\u05D0\u05E0\u05E8 \u05E2\u05D3\u05DB\u05D5\u05DF \u05D7\u05D9 \u05DC\u05DB\u05DC \u05D4\u05DE\u05E9\u05EA\u05DE\u05E9\u05D9\u05DD.", "3. \u05D4\u05D5\u05E8\u05D3 \u05D2\u05D9\u05D1\u05D5\u05D9 CSV \u05DE\u05DC\u05D0 \u05E9\u05DC \u05D9\u05D5\u05DE\u05DF \u05D4\u05D1\u05D9\u05E7\u05D5\u05E8\u05EA \u05D5\u05D4\u05DE\u05E9\u05EA\u05DE\u05E9\u05D9\u05DD."]
        : ["1. Run Self-Test to verify live latency across all 5 core database tables.", "2. Publish global announcement banners to all active users.", "3. Export full UTF-8 BOM CSV audit & CRM logs in 1 click."],
      tab: "broadcast",
      cta: isHe ? "\u05E4\u05EA\u05D7 \u05D0\u05D1\u05D7\u05D5\u05DF \u05D5\u05D9\u05D5\u05DE\u05DF \u05D1\u05D9\u05E7\u05D5\u05E8\u05EA" : "Open Diagnostics & Audit",
    },
  ];
  return (
    <>
      <div dir={isHe ? "rtl" : "ltr"} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, padding: "8px 14px", marginBottom: 12, borderRadius: 12, background: "linear-gradient(90deg, rgba(16,185,129,0.12), rgba(56,189,248,0.10))", border: "1px solid rgba(52,211,153,0.32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
          <ShieldCheck size={16} color="#34d399" />
          <strong style={{ color: "#34d399" }}>{isHe ? "\u05D4\u05D2\u05E0\u05D4 \u05D5\u05EA\u05D7\u05D6\u05D5\u05E7\u05D4 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA 24/7 \u05E4\u05E2\u05D9\u05DC\u05D4" : "24/7 Autonomous Security & Maintenance Active"}</strong>
          {report && <span style={{ color: "#94a3b8" }}>· {isHe ? `\u05E0\u05E1\u05E8\u05E7\u05D5 ${report.checkedLinks} \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD` : `${report.checkedLinks} links verified`}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <button type="button" onClick={() => executeSweep(true)} disabled={sweeping} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>
            <RefreshCw size={12} /><span>{sweeping ? (isHe ? "\u05E1\u05D5\u05E8\u05E7..." : "Sweeping...") : (isHe ? "\u05E1\u05E8\u05D9\u05E7\u05EA \u05D4\u05D2\u05E0\u05D4 \u05E2\u05DB\u05E9\u05D9\u05D5" : "Run 24/7 Sweep")}</span>
          </button>
          <button type="button" onClick={() => setOpen(true)} className="btn-primary" style={{ width: "auto", height: 30, padding: "0 12px", fontSize: 11.5 }}>
            <BookOpen size={12} /><span>{isHe ? "\u05DE\u05D3\u05E8\u05D9\u05DA \u05EA\u05E4\u05E2\u05D5\u05DC \u05D5\u05D4\u05E0\u05E2\u05D5\u05EA \u05DC\u05E4\u05E2\u05D5\u05DC\u05D4" : "Admin Operations Playbook"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div dir={isHe ? "rtl" : "ltr"} onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 140, background: "rgba(2,6,23,0.82)", backdropFilter: "blur(6px)", display: "flex", justifyContent: isHe ? "flex-start" : "flex-end" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 500, height: "100%", overflowY: "auto", background: "#0a0f1d", borderInlineStart: "1px solid rgba(56,189,248,0.28)", padding: 20, textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={18} color="#38bdf8" />
                <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", margin: 0 }}>{isHe ? "\u05DE\u05D3\u05E8\u05D9\u05DA \u05EA\u05E4\u05E2\u05D5\u05DC \u05D0\u05D3\u05DE\u05D9\u05DF \u05D5\u05D0\u05D5\u05D8\u05D5\u05DE\u05E6\u05D9\u05D4 24/7" : "Admin Operations & 24/7 Autopilot Guide"}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost" style={{ height: 34, padding: "0 10px" }}><X size={16} /></button>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(52,211,153,0.3)", fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34d399", fontWeight: 800, marginBottom: 4 }}><CheckCircle2 size={14} /><span>{isHe ? "\u05DE\u05D4 \u05D4\u05DE\u05E2\u05E8\u05DB\u05EA \u05DE\u05D1\u05E6\u05E2\u05EA \u05E2\u05D1\u05D5\u05E8\u05DA \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA 24/7?" : "What Runs Automatically 24/7 Without Manual Effort?"}</span></div>
              {isHe ? "\u05D4\u05DE\u05E2\u05E8\u05DB\u05EA \u05E1\u05D5\u05E8\u05E7\u05EA \u05D1\u05D0\u05D5\u05E4\u05DF \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9 \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05DC\u05DC\u05D0 HTTPS, \u05D7\u05D5\u05E1\u05DE\u05EA \u05D4\u05D6\u05E8\u05E7\u05D5\u05EA \u05E7\u05D5\u05D3, \u05DE\u05D6\u05DB\u05D4 \u05D1\u05D5\u05E0\u05D5\u05E1\u05D9 \u05D4\u05E4\u05E0\u05D9\u05D5\u05EA (+25), \u05D5\u05DE\u05EA\u05E2\u05D3\u05EA \u05DB\u05DC \u05D7\u05E8\u05D9\u05D2\u05D4 \u05D1\u05D9\u05D5\u05DE\u05DF \u05D4\u05D1\u05D9\u05E7\u05D5\u05E8\u05EA \u05E9\u05DC\u05DA." : "The platform automatically audits non-HTTPS links, blocks XSS payloads, credits +25 referral rewards, and logs every anomaly to your Audit Log."}
            </div>
            {guides.map((g) => (
              <div key={g.step} className="card-surface" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}><span style={{ fontSize: 11, fontWeight: 900, color: "#38bdf8" }}>STEP {g.step}</span><span className="badge-pill" style={{ fontSize: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>{g.badge}</span></div>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: "#f8fafc", margin: 0 }}>{g.title}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{g.actions.map((act, idx) => (<div key={idx}>{act}</div>))}</div>
                <button type="button" onClick={() => { setOpen(false); onNavigateTab(g.tab); }} className="btn-primary" style={{ height: 34, fontSize: 12, marginTop: 4 }}><span>{g.cta}</span>{isHe ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
