"use client";
import React, { useEffect, useState } from "react";
import { HelpCircle, ShieldCheck, Wallet, Share2, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Compass } from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface HubGovernanceConfig {
  hero_notice_he: string;
  hero_notice_en: string;
  preflight_checklist_he: string[];
  preflight_checklist_en: string[];
  custom_faqs: { q_he: string; a_he: string; q_en: string; a_en: string }[];
}

export const DEFAULT_GOVERNANCE: HubGovernanceConfig = {
  hero_notice_he: "ברוכים הבאים למסלול 1: סביבת עבודה ממוקדת להכנסה מקישורים שיתופיים — 100% בחינם, ללא צורך בקוד או ניסיון.",
  hero_notice_en: "Welcome to Track 1: Focused workspace for affiliate income — 100% free, zero coding or prior experience required.",
  preflight_checklist_he: [
    "התחבר לחשבון האימייל האישי הקבוע שלך לפני פתיחת אתר ההרשמה החיצוני.",
    "ההרשמה לכל תוכניות השותפים היא בחינם לחלוטין — לעולם אל תזין פרטי אשראי להרשמה.",
    "כשתתבקש להזין קישור לאתר או פרופיל — תוכל להדביק את כתובת חנות הדילים האישית שלך כאן.",
    "מיד בסיום ההרשמה, העתק את מזהה השותף (Tracking ID) וחזור לכאן כדי לאמת ולנעול אותו.",
  ],
  preflight_checklist_en: [
    "Sign into your primary email before opening the external registration page.",
    "Joining affiliate programs is 100% free — never enter credit card details to register.",
    "When asked for a website or profile URL, paste your personal ProofCraft Deal Storefront link.",
    "Once approved, copy your Tracking ID and return here to verify and lock it.",
  ],
  custom_faqs: [
    {
      q_he: "האם זה עולה כסף להתחיל? האם צריך אתר או עוקבים?",
      a_he: "השימוש במסלול 1 וההצטרפות לרשתות השותפים הם בחינם לגמרי. אין צורך באתר או באלפי עוקבים — אתה מקבל חנות דילים מוכנה ויכול לשתף קישורים בוואטסאפ, פייסבוק וסטורי.",
      q_en: "Does it cost money to start? Do I need a website or followers?",
      a_en: "Starting in Track 1 and joining partner networks is 100% free. You get a ready-to-share public deal storefront and can share links on WhatsApp, Facebook, or Reels.",
    },
    {
      q_he: "איך הרשת יודעת שהקונה הגיע דרכי ואיך הכסף מגיע אליי?",
      a_he: "בכל קישור מוטמע מזהה השותף שלך (Tracking ID). בלחיצה נשמרת 'עוגייה' (Cookie) ל-24 שעות עד 30 יום, וכל רכישה נזקפת לזכותך ונמשכת לבנק, PayPal או Payoneer.",
      q_en: "How does the network track my sales and pay me?",
      a_en: "Every smart link embeds your Tracking ID. Clicks store a tracking cookie (24h–30d), crediting purchases to your network dashboard for Bank, PayPal, or Payoneer payout.",
    },
    {
      q_he: "איך מפרסמים קישור בצורה מקצועית בלי להיחסם?",
      a_he: "לעולם אל תזרוק קישור יבש לבד. בשלב 4 (אשף הקמפיינים), המערכת מייצרת 3 נוסחים מוכנים (פייסבוק, וואטסאפ ורילס) שנותנים ערך אמיתי וכוללים גילוי נאות.",
      q_en: "How do I promote links without getting banned for spam?",
      a_en: "Never post a bare link alone. Stage 4 generates 3 tailored templates (Facebook, WhatsApp, and Reels) with real value and proper disclosure.",
    },
  ],
};
export default function AffiliateBeginnerAcademy({ isHe, activeStage, onJumpStage }: { isHe: boolean; activeStage: 1 | 2 | 3 | 4; onJumpStage: (st: 1 | 2 | 3 | 4) => void }) {
  const [gov, setGov] = useState<HubGovernanceConfig>(DEFAULT_GOVERNANCE);
  const [faqOpen, setFaqOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "affiliate_hub_governance").single().then(({ data }) => {
      if (data?.value) setGov({ ...DEFAULT_GOVERNANCE, ...data.value });
    });
  }, []);

  const stageGuide = {
    1: { titleHe: "תחנה 1 מתוך 4 — בחירת רשת שותפים והבנת הכללים", titleEn: "Stage 1 of 4 — Choose Partner Network & Rules", tipHe: "השווה בין הרשתות למטה (עליאקספרס מומלצת להתחלה מיידית) ולחץ על 'המשך לתחנה 2'.", tipEn: "Compare networks below (AliExpress is best for instant start) and click Continue to Stage 2." },
    2: { titleHe: "תחנה 2 מתוך 4 — הרשמה מאובטחת ואימות מזהה השותף", titleEn: "Stage 2 of 4 — Guided Registration & ID Verification", tipHe: "עבור על נקודות האימות לפני פתיחת האתר החיצוני, הירשם בחינם, וחזור לאמת את מזהה השותף.", tipEn: "Check pre-flight rules before opening the external site, register free, then verify your Tracking ID." },
    3: { titleHe: "תחנה 3 מתוך 4 — יצירת קישור חכם ותיק נכסים", titleEn: "Stage 3 of 4 — Create Smart Links & Portfolio", tipHe: "הדבק קישור של מוצר משתלם וצור קישור חכם (/go/...) עם מעקב קליקים ובדיקת תקינות.", tipEn: "Paste a product URL and generate a tracked /go/... link with 24/7 health checks." },
    4: { titleHe: "תחנה 4 מתוך 4 — אשף הפצה, קמפיינים ומעקב רווחים", titleEn: "Stage 4 of 4 — Campaign Wizard, Ads & Analytics", tipHe: "בחר קישור מתחנה 3, העתק מודעה מוכנה לוואטסאפ, פייסבוק או רילס בלחיצה, ושתף את חנות הדילים שלך.", tipEn: "Pick a link from Stage 3, copy ready-to-post WhatsApp, Facebook, or Reels ads, and share." },
  }[activeStage];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
      <div className="card-surface" style={{ padding: "14px 18px", borderRadius: 16, background: "linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(15,23,42,0.92) 100%)", border: "1px solid rgba(52,211,153,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 740 }}>
          <Sparkles size={18} color="#34d399" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13.5, color: "#ecfdf5", fontWeight: 700, lineHeight: 1.5, margin: 0 }}>{isHe ? gov.hero_notice_he : gov.hero_notice_en}</p>
        </div>
        <button type="button" onClick={() => setFaqOpen(!faqOpen)} className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12.5, fontWeight: 800, borderColor: "rgba(56,189,248,0.45)", color: "#38bdf8", background: "rgba(56,189,248,0.08)" }}>
          <HelpCircle size={14} />
          <span>{isHe ? (faqOpen ? "סגור מדריך למתחילים" : "איך מתחילים ואיך מרוויחים? (מדריך מלא)") : (faqOpen ? "Close Guide" : "How It Works & FAQ")}</span>
          {faqOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <div style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(15,23,42,0.88)", border: "1px solid rgba(56,189,248,0.28)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 900, color: "#38bdf8", marginBottom: 2 }}>
            <Compass size={14} style={{ display: "inline", marginInlineEnd: 6 }} />
            {isHe ? stageGuide.titleHe : stageGuide.titleEn}
          </div>
          <div style={{ fontSize: 13, color: "#cbd5e1" }}>{isHe ? stageGuide.tipHe : stageGuide.tipEn}</div>
        </div>
        {activeStage < 4 && (
          <button type="button" onClick={() => onJumpStage((activeStage + 1) as 1 | 2 | 3 | 4)} className="btn-primary" style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12, background: "#38bdf8", color: "#0a0b0e" }}>
            {isHe ? `המשך לתחנה ${activeStage + 1}` : `Next: Stage ${activeStage + 1}`}
          </button>
        )}
      </div>

      {faqOpen && (
        <div className="card-hero" style={{ padding: 20, borderRadius: 18, border: "1px solid rgba(56,189,248,0.4)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.25)" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#34d399", marginBottom: 4 }}><ShieldCheck size={14} style={{ display: "inline", marginInlineEnd: 5 }} />{isHe ? "1. עלות הקמה: 0 ₪" : "1. Setup Cost: $0"}</div>
              <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>{isHe ? "ללא רכישת מלאי, ללא מנוי חובה וללא פתיחת תיק מראש." : "No inventory, no upfront fees, and no risk."}</p>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.25)" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#38bdf8", marginBottom: 4 }}><Wallet size={14} style={{ display: "inline", marginInlineEnd: 5 }} />{isHe ? "2. משיכת כספים לחשבון" : "2. Direct Payouts"}</div>
              <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>{isHe ? "העמלות נצברות ברשת ונמשכות לבנק, PayPal או Payoneer." : "Commissions withdraw to Bank, PayPal, or Payoneer."}</p>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.25)" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fbbf24", marginBottom: 4 }}><Share2 size={14} style={{ display: "inline", marginInlineEnd: 5 }} />{isHe ? "3. הפצה ללא עוקבים" : "3. Zero-Audience Sharing"}</div>
              <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>{isHe ? "אשף הקמפיינים כותב עבורך מודעות מוכנות לקבוצות וסטורי." : "Stage 4 writes ready-to-post copy for groups and stories."}</p>
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)" }}>
            <div style={{ fontSize: 12.5, fontWeight: 900, color: "#fbbf24", marginBottom: 6 }}>{isHe ? "נקודות אימות חובה לפני יציאה להרשמה חיצונית:" : "Mandatory Pre-Flight Checkpoints:"}</div>
            {(isHe ? gov.preflight_checklist_he : gov.preflight_checklist_en).map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "#fef3c7", marginBottom: 4 }}>
                <CheckCircle2 size={14} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} /><span>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {gov.custom_faqs.map((item, idx) => (
              <div key={idx} style={{ borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
                <button type="button" onClick={() => setOpenIdx(openIdx === idx ? null : idx)} style={{ width: "100%", padding: "11px 14px", background: "transparent", border: "none", color: "#f8fafc", fontSize: 13, fontWeight: 800, textAlign: isHe ? "right" : "left", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <span>{isHe ? item.q_he : item.q_en}</span>
                  {openIdx === idx ? <ChevronUp size={14} color="#38bdf8" /> : <ChevronDown size={14} color="#94a3b8" />}
                </button>
                {openIdx === idx && <div style={{ padding: "0 14px 12px", fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.6 }}>{isHe ? item.a_he : item.a_en}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}