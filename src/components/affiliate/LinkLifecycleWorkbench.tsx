"use client";

import React, { useRef, useState } from "react";
import { CheckCircle2, Circle, Copy, ExternalLink, ShieldAlert, Share2, Tag, Globe, ArrowUpRight, Info } from "lucide-react";
import { AffLink } from "@/lib/affiliate-store";

const CHANNELS = [
  { id: "whatsapp", labelHe: "וואטסאפ", labelEn: "WhatsApp", tag: "wa", tipHe: "שתף בקבוצות דילים רלוונטיות עם ערך ברור — לעולם לא הודעות ספאם פרטיות.", tipEn: "Share in relevant deal groups with clear value—never unsolicited DMs." },
  { id: "facebook", labelHe: "פייסבוק", labelEn: "Facebook", tag: "fb", tipHe: "פרסם פוסט ערך והוסף גילוי נאות ברור כדי למנוע הגבלת חשיפה.", tipEn: "Post value-first content with a clear affiliate disclosure." },
  { id: "reels", labelHe: "רילס / ביו", labelEn: "Reels / Bio", tag: "bio", tipHe: "הפנה מהסרטון לקישור בביו — שיעור ההמרה הגבוה ביותר.", tipEn: "Direct viewers from short video to your bio link." },
  { id: "telegram", labelHe: "טלגרם", labelEn: "Telegram", tag: "tg", tipHe: "הדגש מחיר מבצע ויתרון מרכזי לקליקים חוזרים.", tipEn: "Highlight deal price and key benefit." },
];

export default function LinkLifecycleWorkbench({ links, originUrl, isHe, onInspectLink, onNotify }: {
  links: AffLink[]; originUrl: string; isHe: boolean; onInspectLink: (lnk: AffLink) => void; onNotify: (msg: string) => void;
}) {
  const [selectedLinkId, setSelectedLinkId] = useState<string>(links[0]?.id || "");
  const [subMode, setSubMode] = useState<"share" | "organic" | "checklist">("share");
  const [activeChannel, setActiveChannel] = useState<string>("whatsapp");
  const [doneActions, setDoneActions] = useState<Record<string, boolean>>({});
  const [exitBrief, setExitBrief] = useState<boolean>(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const currentLink = links.find((l) => l.id === selectedLinkId) || links[0];
  if (!currentLink) return null;

  const ch = CHANNELS.find((c) => c.id === activeChannel) || CHANNELS[0];
  const trackedUrl = `${originUrl}/go/${currentLink.slug}?src=${ch.tag}`;
  const organicDealPageUrl = `${originUrl}/affiliate/deal/${currentLink.slug}`;

  const toggleAction = (key: string) => setDoneActions((prev) => ({ ...prev, [key]: !prev[key] }));
  const switchMode = (m: "share" | "organic" | "checklist") => {
    setSubMode(m);
    setTimeout(() => boxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };
  const copyTrackedWithCopy = () => {
    const adText = activeChannel === "whatsapp" ? currentLink.saved_ad_copy?.whatsapp : activeChannel === "facebook" ? currentLink.saved_ad_copy?.facebook : currentLink.saved_ad_copy?.tiktok;
    const base = adText || `${currentLink.product_title}\n${trackedUrl}`;
    const finalPayload = base.includes("/go/") ? base.replace(/\/go\/[a-z0-9-]+/i, `/go/${currentLink.slug}?src=${ch.tag}`) : `${base}\n${trackedUrl}`;
    navigator.clipboard?.writeText(finalPayload);
    toggleAction(`${currentLink.id}_subid`);
    onNotify(isHe ? `הקישור המתויג (?src=${ch.tag}) + המודעה הועתקו!` : `Tagged link (?src=${ch.tag}) + ad copied!`);
  };

  const checklist = [
    { key: "disclosure", labelHe: "אימות גילוי נאות (מונע חסימת חשבון באמזון וברשתות)", labelEn: "Affiliate disclosure verified (prevents account bans)" },
    { key: "subid", labelHe: "העתקת קישור מתויג לערוץ פרסום למדידת מקור הקליקים", labelEn: "Copy channel-tagged link to track traffic source" },
    { key: "organic", labelHe: "שיתוף כרטיס הדיל האורגני (מביא גולשים חדשים ומגדיל אמון)", labelEn: "Share organic deal card (builds trust & organic reach)" },
    { key: "live_test", labelHe: "בדיקת פתיחת יעד חיה (מוודא שהמוצר במלאי)", labelEn: "Live destination check (ensures product is in stock)" },
  ];

  return (
    <div ref={boxRef} className="card-hero" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(56,189,248,0.35)", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header + Link Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 900, color: "#38bdf8", marginBottom: 4 }}>{isHe ? "סביבת עבודה ממוקדת לקישור פעיל" : "FOCUSED LINK WORKSPACE"}</div>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", margin: 0 }}>{currentLink.product_title}</h3>
        </div>
        <select value={currentLink.id} onChange={(e) => setSelectedLinkId(e.target.value)} className="input-dark" style={{ maxWidth: 280, height: 42, fontSize: 13, fontWeight: 700 }}>
          {links.map((lk) => <option key={lk.id} value={lk.id}>{lk.product_title} ({lk.click_count} {isHe ? "קליקים" : "clicks"})</option>)}
        </select>
      </div>

      {/* Clean 3-Pill Switcher (Only 1 Area Visible at a Time!) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        {[
          { id: "share" as const, labelHe: "1. הפצה ומעקב ערוצים", labelEn: "1. Channel Tracking" },
          { id: "organic" as const, labelHe: "2. כרטיס דיל אורגני", labelEn: "2. Organic Deal Card" },
          { id: "checklist" as const, labelHe: "3. אימות ובטיחות", labelEn: "3. Safety Checklist" },
        ].map((tab) => (
          <button key={tab.id} type="button" onClick={() => switchMode(tab.id)} className={subMode === tab.id ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13, fontWeight: 800 }}>
            {isHe ? tab.labelHe : tab.labelEn}
          </button>
        ))}
      </div>

      {/* VIEW 1: Channel Sub-ID & Ad Copy */}
      {subMode === "share" && (
        <div style={{ padding: 20, borderRadius: 16, background: "rgba(10,11,14,0.85)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CHANNELS.map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveChannel(item.id)} className={activeChannel === item.id ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 38, padding: "0 16px", fontSize: 13 }}>
                <Tag size={13} /> {isHe ? item.labelHe : item.labelEn}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "#cbd5e1", background: "rgba(56,189,248,0.08)", padding: "12px 14px", borderRadius: 12, lineHeight: 1.6 }}>
            <Info size={14} color="#38bdf8" style={{ display: "inline", marginInlineEnd: 6 }} />{isHe ? ch.tipHe : ch.tipEn}
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 12, background: "#05070a", border: "1px solid rgba(52,211,153,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <code dir="ltr" style={{ fontSize: 12.5, color: "#34d399", wordBreak: "break-all" }}>{trackedUrl}</code>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={copyTrackedWithCopy} className="btn-primary" style={{ width: "auto", height: 38, padding: "0 16px", fontSize: 12.5 }}>
                <Copy size={14} /> {isHe ? "העתק קישור + מודעה מוכנה" : "Copy Link + Ready Ad"}
              </button>
              <button type="button" onClick={() => setExitBrief(!exitBrief)} className="btn-ghost" style={{ height: 38, padding: "0 14px", fontSize: 12.5 }}>
                <ExternalLink size={14} /> {isHe ? "בדיקת יעד בחוץ" : "Test Destination"}
              </button>
            </div>
          </div>
          {exitBrief && (
            <div style={{ padding: 16, borderRadius: 14, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.4)", display: "flex", flexDirection: "column", gap: 10 }}>
              <strong style={{ fontSize: 13.5, color: "#fbbf24" }}><ShieldAlert size={15} style={{ display: "inline", marginInlineEnd: 6 }} />{isHe ? "תדריך לפני יציאה מהדף:" : "Pre-Exit Briefing:"}</strong>
              <p style={{ fontSize: 13, color: "#fef3c7", margin: 0, lineHeight: 1.6 }}>
                {isHe ? "וודא שהמוצר במלאי ושמזהה השותף מופיע בכתובת. לעולם אל תבצע רכישה עצמית דרך הקישור שלך. בסיום חזור לכאן." : "Verify stock and partner tag in URL. Never buy through your own link. Return here afterward."}
              </p>
              <a href={trackedUrl} target="_blank" rel="noopener noreferrer" onClick={() => toggleAction(`${currentLink.id}_live_test`)} className="btn-primary" style={{ width: "fit-content", height: 38, padding: "0 16px", fontSize: 12.5, background: "#fbbf24", color: "#0a0b0e" }}>
                <ExternalLink size={14} /> {isHe ? "פתח קישור בחלון חדש" : "Open External Link"}
              </a>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Organic Public Deal Card */}
      {subMode === "organic" && (
        <div style={{ padding: 20, borderRadius: 16, background: "rgba(10,11,14,0.85)", border: "1px solid rgba(129,140,248,0.35)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#a5b4fc" }}><Globe size={15} style={{ display: "inline", marginInlineEnd: 6 }} />{isHe ? "דף נחיתה ציבורי מאומת לדיל שלך (צמיחה אורגנית):" : "Your Hosted Public Deal Card (Organic Growth):"}</div>
          <p style={{ fontSize: 13, color: "#cbd5e1", margin: 0, lineHeight: 1.65 }}>
            {isHe ? "שתף את דף הדיל הזה ברשתות החברתיות: הגולשים מקבלים כרטיס מוצר אמין עם גילוי נאות מובנה, והפלטפורמה שלך צומחת אורגנית מכל שיתוף." : "Share this hosted deal card on social media for higher buyer trust, built-in disclosure, and organic platform growth."}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={() => { navigator.clipboard?.writeText(organicDealPageUrl); toggleAction(`${currentLink.id}_organic`); onNotify(isHe ? "קישור דף הדיל האורגני הועתק!" : "Organic card link copied!"); }} className="btn-primary" style={{ width: "auto", height: 40, padding: "0 16px", fontSize: 13 }}>
              <Share2 size={14} /> {isHe ? "העתק קישור לכרטיס הדיל" : "Copy Deal Card Link"}
            </button>
            <a href={organicDealPageUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 40, padding: "0 16px", fontSize: 13 }}>
              <ArrowUpRight size={14} /> {isHe ? "צפה בדף החי" : "Open Live Page"}
            </a>
          </div>
        </div>
      )}

      {/* VIEW 3: Safety & Action Checklist */}
      {subMode === "checklist" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {checklist.map((item) => {
            const checked = Boolean(doneActions[`${currentLink.id}_${item.key}`]);
            return (
              <div key={item.key} onClick={() => toggleAction(`${currentLink.id}_${item.key}`)} style={{ padding: "14px 16px", borderRadius: 12, cursor: "pointer", background: checked ? "rgba(52,211,153,0.12)" : "#0a0b0e", border: `1px solid ${checked ? "rgba(52,211,153,0.45)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: checked ? "#a7f3d0" : "#e2e8f0" }}>
                {checked ? <CheckCircle2 size={17} color="#34d399" style={{ flexShrink: 0 }} /> : <Circle size={17} color="#64748b" style={{ flexShrink: 0 }} />}
                <span>{isHe ? item.labelHe : item.labelEn}</span>
              </div>
            );
          })}
          <button type="button" onClick={() => onInspectLink(currentLink)} className="btn-ghost" style={{ height: 40, fontSize: 13, marginTop: 4 }}>
            {isHe ? "פתח פאנל 360° מלא לעריכת מודעות ->" : "Open Full 360° Ad Editor ->"}
          </button>
        </div>
      )}
    </div>
  );
}