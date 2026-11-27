"use client";

import React, { useState } from "react";
import {
  Briefcase, TrendingUp, Download, Send, CheckCircle2, Circle,
  Rocket, ExternalLink, ShieldCheck, Copy, DollarSign
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AffLink, AffUserAccount } from "@/lib/affiliate-store";

export default function BusinessExitAndTrafficOS({
  userId,
  links,
  accounts,
  originUrl,
  isHe,
  onNotify,
}: {
  userId: string | null;
  links: AffLink[];
  accounts: AffUserAccount[];
  originUrl: string;
  isHe: boolean;
  onNotify: (msg: string) => void;
}) {
  const [viewMode, setViewMode] = useState<"traffic" | "valuation" | "exit">("traffic");
  const [askingPriceIls, setAskingPriceIls] = useState<string>("");
  const [sellerNote, setSellerNote] = useState<string>("");
  const [exitChecklist, setExitChecklist] = useState<Record<string, boolean>>({});
  const [listingSent, setListingSent] = useState<boolean>(false);

  const totalClicks = links.reduce((s, l) => s + Number(l.click_count || 0), 0);
  const estMonthlyProfitIls = Math.max(150, Math.round(totalClicks * 0.035 * 115 * 0.08));
  const estAssetValuationIls = estMonthlyProfitIls * 24;
  const readinessScore = Math.min(
    100,
    (accounts.length > 0 ? 30 : 0) +
      Math.min(40, links.length * 10) +
      Math.min(30, Math.round(totalClicks / 2))
  );
  const copySpreadsheetExport = () => {
    const header = "Product Title\tNetwork\tFolder\tSmart URL\tDestination URL\tClicks\tPrice";
    const rows = links.map(
      (l) => `${l.product_title}\t${l.network_slug}\t${l.folder_name}\t${originUrl}/go/${l.slug}\t${l.destination_url}\t${l.click_count}\t${l.price_display || ""}`
    );
    navigator.clipboard?.writeText([header, ...rows].join("\n"));
    onNotify(isHe ? "תיק הנכסים הועתק בפורמט טבלה — הדבק (Ctrl+V) ב-Google Sheets!" : "Portfolio TSV copied—paste directly into Google Sheets!");
  };

  const submitAssetForSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return onNotify(isHe ? "נא להתחבר תחילה." : "Please sign in first.");
    await supabase.from("site_settings").upsert({
      key: `affiliate_exit_listing_${userId}`,
      value: {
        user_id: userId,
        links_count: links.length,
        total_clicks: totalClicks,
        est_valuation_ils: estAssetValuationIls,
        asking_price_ils: Number(askingPriceIls) || estAssetValuationIls,
        seller_note: sellerNote,
        status: "pending_admin_review",
        submitted_at: new Date().toISOString(),
      },
    });
    setListingSent(true);
    onNotify(isHe ? "הנכס הוגש לאישור האדמין לצורך הצגה לקונים!" : "Business asset submitted to Admin for buyer review!");
  };

  const handoffSteps = [
    { id: "h1", he: "1. ייצוא קטלוג הקישורים המלא לטבלת Google Sheets מסודרת לקונה.", en: "1. Export full smart link catalog to Google Sheets for buyer handoff." },
    { id: "h2", he: "2. החלפת קישורי היעד לקישורי השותף של הקונה תוך 5 דקות (הקישור החכם /go/ נשאר זהה!).", en: "2. Swap destination URLs to buyer's partner links—all /go/ short links stay intact!" },
    { id: "h3", he: "3. העברת קישור חנות הדילים הציבורית ודפי המוצר המאומתים לבעלות הקונה.", en: "3. Transfer public Deal Storefront and hosted product pages to the buyer." },
    { id: "h4", he: "4. מסירת קובץ המודעות המוכנות (WhatsApp / Facebook / Reels) להמשך הזרמת טרפיק מיידית.", en: "4. Hand over saved multi-channel ad templates for uninterrupted traffic." },
  ];

  return (
    <div className="card-hero" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(251,191,36,0.35)", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 11.5, fontWeight: 800, marginBottom: 6 }}>
            <Briefcase size={14} /> {isHe ? "מנוע טרפיק, הערכת שווי ומכירת הנכס כעסק עצמאי (BUSINESS EXIT OS)" : "TRAFFIC ENGINE, VALUATION & BUSINESS EXIT OS"}
          </span>
          <h2 style={{ fontSize: 19, fontWeight: 900, color: "#f8fafc", margin: 0 }}>
            {isHe ? "הגדלת טרפיק חכמה + בניית נכס עסקי סחיר שניתן למכור בכל רגע" : "Smart Traffic Scaling + Tradable Business Asset Ready for Exit"}
          </h2>
        </div>
        <div style={{ padding: "8px 14px", borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.4)", fontSize: 12.5, fontWeight: 900, color: "#34d399" }}>
          {isHe ? `מוכנות עסקית: ${readinessScore}% · שווי מוערך: ₪${estAssetValuationIls.toLocaleString()}` : `Exit Readiness: ${readinessScore}% · Est. Value: ₪${estAssetValuationIls.toLocaleString()}`}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 8 }}>
        <button type="button" onClick={() => setViewMode("traffic")} className={viewMode === "traffic" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>
          <Rocket size={14} /> {isHe ? "1. מנוע טרפיק 3 גלים" : "1. 3-Wave Traffic Engine"}
        </button>
        <button type="button" onClick={() => setViewMode("valuation")} className={viewMode === "valuation" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>
          <DollarSign size={14} /> {isHe ? "2. מחשבון שווי הנכס למכירה" : "2. Live Asset Valuation"}
        </button>
        <button type="button" onClick={() => setViewMode("exit")} className={viewMode === "exit" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>
          <ShieldCheck size={14} /> {isHe ? "3. חבילת מכירה והעברת בעלות" : "3. Sell & Transfer Business"}
        </button>
      </div>

      {viewMode === "traffic" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {[
            { wave: "WAVE 01", titleHe: "גל 1: הצתה מיידית (0–24 שעות)", titleEn: "Wave 1: Instant Ignition (0–24h)", bodyHe: "קח את הקישור המתויג (?src=wa) ושלח אותו ל-3 קבוצות וואטסאפ או חברים שמחפשים בדיוק את הפתרון הזה. המטרה: 10 קליקים ראשונים ובדיקת המרה.", bodyEn: "Share your tagged link (?src=wa) in 3 relevant WhatsApp groups to capture your first 10 real clicks." },
            { wave: "WAVE 02", titleHe: "גל 2: הרחבה חברתית (ימים 2–7)", titleEn: "Wave 2: Social Expansion (Days 2–7)", bodyHe: "פרסם פוסט ערך בפייסבוק (?src=fb) וסטורי קצר באינסטגרם עם מדבקת קישור לחנות הדילים שלך. הקישור החכם (/go/) מרכז את כל הנתונים במקום אחד.", bodyEn: "Publish a value post on Facebook (?src=fb) and an Instagram Story linking to your Deal Storefront." },
            { wave: "WAVE 03", titleHe: "גל 3: נכס אורגני מניב (מתמשך)", titleEn: "Wave 3: Evergreen Organic Asset", bodyHe: "הגש את הדילים החזקים שלך לפיד הציבורי (/feed) ושתף סרטוני רילס קצרים המפנים לביו (?src=bio) — כך התנועה ממשיכה לזרום 24/7 גם כשאינך מחובר.", bodyEn: "Submit top deals to the public feed (/feed) and point short Reels to your bio (?src=bio) for 24/7 evergreen clicks." },
          ].map((w) => (
            <div key={w.wave} style={{ padding: 18, borderRadius: 16, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.25)" }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#38bdf8" }}>{w.wave}</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc", margin: "6px 0 8px" }}>{isHe ? w.titleHe : w.titleEn}</h3>
              <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{isHe ? w.bodyHe : w.bodyEn}</p>
            </div>
          ))}
        </div>
      )}
      {viewMode === "valuation" && (
        <div style={{ padding: 20, borderRadius: 16, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.3)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 12, background: "#05070a" }}><div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "קישורים פעילים בנכס" : "Active Smart Links"}</div><div style={{ fontSize: 22, fontWeight: 900, color: "#38bdf8" }}>{links.length}</div></div>
            <div style={{ padding: 14, borderRadius: 12, background: "#05070a" }}><div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "רווח חודשי מוערך" : "Est. Monthly Net"}</div><div style={{ fontSize: 22, fontWeight: 900, color: "#fbbf24" }}>₪{estMonthlyProfitIls.toLocaleString()}</div></div>
            <div style={{ padding: 14, borderRadius: 12, background: "#05070a", border: "1px solid rgba(52,211,153,0.45)" }}><div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "שווי מכירה מומלץ (מכפיל x24)" : "Recommended Exit Price (24x)"}</div><div style={{ fontSize: 24, fontWeight: 900, color: "#34d399" }}>₪{estAssetValuationIls.toLocaleString()}</div></div>
          </div>
          <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
            {isHe ? "אתרי נישה וחנויות דילים דיגיטליות עם קישורים מוכנים, היסטוריית קליקים ומודעות ממירות נמכרים בשוק לפי מכפיל של 18 עד 30 חודשי רווח." : "Curated deal storefronts with tracked links and proven click history trade at 18x–30x monthly net profit."}
          </p>
        </div>
      )}

      {viewMode === "exit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {handoffSteps.map((st) => {
              const checked = Boolean(exitChecklist[st.id]);
              return (
                <div key={st.id} onClick={() => setExitChecklist({ ...exitChecklist, [st.id]: !checked })} style={{ padding: "12px 14px", borderRadius: 12, cursor: "pointer", background: checked ? "rgba(52,211,153,0.12)" : "#0a0b0e", border: `1px solid ${checked ? "rgba(52,211,153,0.45)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: checked ? "#a7f3d0" : "#e2e8f0" }}>
                  {checked ? <CheckCircle2 size={16} color="#34d399" /> : <Circle size={16} color="#64748b" />}
                  <span>{isHe ? st.he : st.en}</span>
                </div>
              );
            })}
          </div>
          <button type="button" onClick={copySpreadsheetExport} className="btn-ghost" style={{ width: "fit-content", height: 40, padding: "0 16px", fontSize: 13, borderColor: "rgba(56,189,248,0.45)", color: "#38bdf8" }}>
            <Download size={14} /> {isHe ? "ייצא תיק נכסים מלא ל-Google Sheets (TSV)" : "Export Full Asset Ledger (Google Sheets)"}
          </button>
          <form onSubmit={submitAssetForSale} style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.35)", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 900, color: "#fbbf24" }}>{isHe ? "העמד את סביבת העבודה שלך למכירה כעסק פעיל (באישור ופיקוח אדמין):" : "List Your Workspace for Sale as a Turnkey Business:"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
              <input type="number" value={askingPriceIls} onChange={(e) => setAskingPriceIls(e.target.value)} placeholder={isHe ? `מחיר מבוקש בש״ח (מומלץ: ${estAssetValuationIls})` : `Asking Price ILS (Rec: ${estAssetValuationIls})`} className="input-dark" style={{ fontSize: 13 }} />
              <input type="text" value={sellerNote} onChange={(e) => setSellerNote(e.target.value)} placeholder={isHe ? "תיאור הנישה ויתרונות הנכס לקונה..." : "Describe niche & buyer advantages..."} className="input-dark" style={{ fontSize: 13 }} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "fit-content", height: 40, padding: "0 18px", fontSize: 13, background: "#fbbf24", color: "#0a0b0e" }}>
              <Send size={14} /> {listingSent ? (isHe ? "הנכס הוגש לאדמין ✓" : "Submitted to Admin ✓") : (isHe ? "הגש את הנכס למכירה" : "Submit Business Asset for Sale")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}