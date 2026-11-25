"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, X, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw, Compass } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";

interface Props { context?: "workspace" | "affiliate"; }

export default function UserGuideDrawer({ context = "workspace" }: Props) {
  const { isHe } = useStudioLang();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const triggerSync = () => {
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("proofcraft:sync-now"));
    setOpen(false);
  };

  const steps: { step: string; title: string; badge: string; points: string[]; cta: string; action: () => void }[] = [
    {
      step: "01",
      title: isHe ? "׳™׳¦׳™׳¨׳× ׳§׳™׳©׳•׳¨׳™ ׳©׳•׳×׳₪׳™׳ ׳—׳›׳׳™׳ ׳•׳“׳™׳׳™׳ ׳׳׳•׳׳×׳™׳" : "Smart Affiliate Links & Verified Deal Cards",
      badge: isHe ? "׳”׳›׳ ׳¡׳” ׳™׳©׳™׳¨׳”" : "MONETIZATION",
      points: isHe
        ? ["1. ׳‘׳—׳¨ ׳¨׳©׳× ׳©׳•׳×׳₪׳™׳ (AliExpress, Amazon, Temu, eBay, WeSell) ׳•׳”׳“׳‘׳§ ׳§׳™׳©׳•׳¨.", "2. ׳”׳׳¢׳¨׳›׳× ׳׳™׳™׳¦׳¨׳× ׳§׳™׳©׳•׳¨ ׳׳¢׳§׳‘ ׳§׳¦׳¨ (/go/slug) ׳•׳ ׳•׳¡׳— ׳₪׳¨׳¡׳•׳ ׳׳•׳›׳ ׳׳©׳™׳×׳•׳£.", "3. ׳•׳“׳ ׳׳™׳©׳•׳¨ HTTPS ׳™׳¨׳•׳§ ׳‘׳¡׳•׳¨׳§ ׳”׳‘׳¨׳™׳׳•׳× ׳׳₪׳ ׳™ ׳₪׳¨׳¡׳•׳."]
        : ["1. Pick an affiliate network (AliExpress, Amazon, Temu, eBay, WeSell) and paste URL.", "2. Generate a clean tracked link (/go/slug) plus instant social promo copy.", "3. Confirm green HTTPS status in Link Health Watchdog before sharing."],
      cta: isHe ? "׳₪׳×׳— ׳׳¨׳›׳– ׳©׳•׳×׳₪׳™׳ ׳•׳§׳™׳©׳•׳¨׳™׳" : "Open Affiliate Hub",
      action: () => { setOpen(false); router.push("/affiliate"); }
    },
    {
      step: "02",
      title: isHe ? "׳”׳–׳׳ ׳× ׳—׳‘׳¨׳™׳ ׳•׳¦׳‘׳™׳¨׳× +25 Boost Credits ׳׳•׳˜׳•׳׳˜׳™׳×" : "Invite Friends & Earn +25 Boost Credits Automatically",
      badge: "+25 CREDITS",
      points: isHe
        ? ["1. ׳”׳¢׳×׳§ ׳׳× ׳§׳™׳©׳•׳¨ ׳”׳”׳–׳׳ ׳” ׳”׳׳™׳©׳™ ׳׳›׳¨׳˜׳™׳¡ ׳”׳”׳₪׳ ׳™׳•׳× ׳‘׳׳¨׳›׳– ׳”׳©׳•׳×׳₪׳™׳.", "2. ׳›׳ ׳—׳‘׳¨ ׳©׳ ׳¨׳©׳ ׳׳–׳›׳” ׳׳× ׳©׳ ׳™׳›׳ ׳׳•׳˜׳•׳׳˜׳™׳× ׳‘-25 ׳§׳¨׳“׳™׳˜׳™׳ ׳׳§׳™׳“׳•׳.", "3. ׳¢׳§׳•׳‘ ׳׳—׳¨ ׳›׳ ׳×׳ ׳•׳¢׳” ׳‘׳™׳•׳׳ ׳”׳§׳¨׳“׳™׳˜׳™׳ ׳”׳©׳§׳•׳£ (Karma Ledger)."]
        : ["1. Copy your personal invite URL from Referral Reward Card in Affiliate Hub.", "2. Every friend who joins automatically credits both accounts with +25 Credits.", "3. Track every reward entry inside your transparent Karma Ledger."],
      cta: isHe ? "׳¢׳‘׳•׳¨ ׳׳›׳¨׳˜׳™׳¡ ׳”׳”׳₪׳ ׳™׳•׳× (+25)" : "Go to Referral Card (+25)",
      action: () => { setOpen(false); router.push("/affiliate"); }
    },
    {
      step: "03",
      title: isHe ? "׳§׳™׳“׳•׳ ׳•׳”׳§׳₪׳¦׳× ׳₪׳•׳¡׳˜׳™׳ ׳•׳“׳™׳׳™׳ ׳‘׳₪׳™׳“ ׳”׳¦׳™׳‘׳•׳¨׳™ (+10)" : "Boost Posts & Deals on the Public Feed (+10 Credits)",
      badge: isHe ? "׳—׳©׳™׳₪׳” ׳׳•׳¨׳’׳ ׳™׳×" : "ORGANIC REACH",
      points: isHe
        ? ["1. ׳₪׳¨׳¡׳ ׳”׳©׳§׳× ׳₪׳¨׳•׳™׳§׳˜ ׳׳• ׳“׳™׳ ׳׳׳•׳׳× ׳‘׳§׳™׳¨ ׳”׳₪׳™׳“ ׳”׳¦׳™׳‘׳•׳¨׳™ (/feed).", "2. ׳׳—׳¥ Boost ׳׳׳™׳׳•׳© 10 ׳§׳¨׳“׳™׳˜׳™׳ ׳•׳”׳¢׳׳׳× ׳”׳₪׳•׳¡׳˜ ׳׳¨׳׳© ׳”׳₪׳™׳“.", "3. ׳”׳₪׳¥ ׳‘׳׳”׳™׳¨׳•׳× ׳׳•׳•׳׳˜׳¡׳׳₪ ׳•׳׳׳™׳ ׳§׳“׳׳™׳ ׳“׳¨׳ ׳¡׳¨׳’׳ ׳”׳©׳™׳×׳•׳£."]
        : ["1. Publish a live project milestone or approved deal to the Feed Wall (/feed).", "2. Click Boost to redeem 10 Credits and elevate your post visibility.", "3. Distribute rich preview cards to WhatsApp & LinkedIn in 1 click."],
      cta: isHe ? "׳¢׳‘׳•׳¨ ׳׳₪׳™׳“ ׳”׳¦׳™׳‘׳•׳¨׳™" : "Open Live Feed Wall",
      action: () => { setOpen(false); router.push("/feed"); }
    },
    {
      step: "04",
      title: isHe ? "השלמת פרויקטים והפקת תעודת הסמכה רשמית" : "Ship Live Tiers & Export Verified Builder Credential",
      badge: "v1.0 -> v4.0",
      points: isHe
        ? ["1. התקדם במסלולי הבנייה בסטודיו (/workspace) והזן קישור חי לכל שלב.", "2. לאחר אימות הפרויקט, הפק תעודת הסמכה רשמית עם מזהה PC-XXXX.", "3. הורד קובץ PDF להדפסה או הטמע תג אימות ב-GitHub README."]
        : ["1. Complete engineering tracks in Studio (/workspace) and submit live URLs.", "2. Once verified, unlock your official Verified Credential (PC-XXXX).", "3. Export a print-ready PDF certificate or embed the badge in GitHub README."],
      cta: isHe ? "פתח סטודיו ותעודת הסמכה" : "Open Builder Studio",
      action: () => { setOpen(false); router.push("/workspace"); }
    },
    {
      step: "05",
      title: isHe ? "סנכרון חוצה-מכשירים וקודי QR בין נייד למחשב" : "Cross-Device Cloud Sync & Instant QR Mobile Handoff",
      badge: "MOBILE <-> PC",
      points: isHe
        ? ["1. צור קוד QR מיידי לפורטפוליו או לחנות הדילים שלך בלחיצה אחת.", "2. סרוק מהטלפון הנייד כדי לפתוח ולשתף ישירות לסטטוס או לקבוצות.", "3. לחץ 'סנכרון חי' בכל שלב כדי לרענן נתונים בזמן אמת בין כל המסכים."]
        : ["1. Generate an instant QR code for your public Portfolio or Deal Store.", "2. Scan with your phone to open and share straight to mobile apps.", "3. Hit Sync Now anytime to refresh cloud state across all open devices."],
      cta: isHe ? "הפעל סנכרון ענן עכשיו" : "Run Cloud Sync Now",
      action: triggerSync
    }
  ];

  return (
    <>
      <div dir={isHe ? "rtl" : "ltr"} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, padding: "10px 14px", marginBottom: 14, borderRadius: 12, background: "linear-gradient(90deg, rgba(56,189,248,0.12), rgba(16,185,129,0.10))", border: "1px solid rgba(56,189,248,0.32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 12.5 }}>
          <Compass size={16} color="#38bdf8" />
          <strong style={{ color: "#f8fafc" }}>{isHe ? (context === "affiliate" ? "מדריך הפעלה מהיר למרכז השותפים" : "מדריך הפעלה מהיר לסטודיו וליוצרים") : (context === "affiliate" ? "Affiliate Hub Quick-Start Playbook" : "Creator Studio Interactive Playbook")}</strong>
          <span style={{ color: "#94a3b8", fontSize: 11.5 }}>{isHe ? "· בונוס +25, קישורים חכמים, קידום בפיד ותעודת הסמכה" : "· +25 referrals, smart links, feed boosts & verified credentials"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={triggerSync} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11.5 }}><RefreshCw size={12} /><span>{isHe ? "סנכרון חי" : "Sync Now"}</span></button>
          <button type="button" onClick={() => setOpen(true)} className="btn-primary" style={{ width: "auto", height: 32, padding: "0 14px", fontSize: 12 }}><BookOpen size={13} /><span>{isHe ? "פתח מדריך והנעות לפעולה" : "Open Interactive Guide"}</span></button>
        </div>
      </div>

      {open && (
        <div dir={isHe ? "rtl" : "ltr"} onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 140, background: "rgba(2,6,23,0.82)", backdropFilter: "blur(6px)", display: "flex", justifyContent: isHe ? "flex-start" : "flex-end" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 520, height: "100%", overflowY: "auto", background: "#0a0f1d", borderInlineStart: "1px solid rgba(56,189,248,0.28)", padding: 20, textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={18} color="#38bdf8" /><h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", margin: 0 }}>{isHe ? "מדריך תפעול וצמיחה ליוצרים ושותפים" : "Creator & Affiliate Growth Playbook"}</h2></div>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost" style={{ height: 34, padding: "0 10px" }}><X size={16} /></button>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(52,211,153,0.3)", fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#34d399", fontWeight: 800, marginBottom: 4 }}><CheckCircle2 size={14} /><span>{isHe ? "איך מפיקים מקסימום תוצאות מהמערכת?" : "How to Maximize Your Results on ProofCraft?"}</span></div>
              {isHe ? "כל פעולה במערכת מחוברת אוטומטית: צור קישור שותפים או השק פרויקט, שתף עם קוד QR או כרטיס ויראלי, וצבור קרדיטים להקפצה אורגנית בפיד." : "Every module works together automatically: launch a verified app or tracked affiliate link, share via QR or social preview card, and redeem credits to boost visibility."}
            </div>
            {steps.map((item) => (
              <div key={item.step} className="card-surface" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}><span style={{ fontSize: 11, fontWeight: 900, color: "#38bdf8" }}>STEP {item.step}</span><span className="badge-pill" style={{ fontSize: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>{item.badge}</span></div>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: "#f8fafc", margin: 0 }}>{item.title}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{item.points.map((pt, idx) => (<div key={idx}>{pt}</div>))}</div>
                <button type="button" onClick={item.action} className="btn-primary" style={{ height: 34, fontSize: 12, marginTop: 4 }}><span>{item.cta}</span>{isHe ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}