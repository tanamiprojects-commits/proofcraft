"use client";

import React, { useState } from "react";
import {
  GraduationCap, Calculator, ShieldCheck, CalendarCheck, TrendingUp,
  CheckCircle2, Circle, Sparkles, ArrowRight, ArrowLeft, AlertTriangle, DollarSign
} from "lucide-react";

export default function AffiliateUniversityOS({
  isHe,
  onJumpStage,
}: {
  isHe: boolean;
  onJumpStage: (st: 1 | 2 | 3 | 4) => void;
}) {
  const ArrowIcon = isHe ? ArrowLeft : ArrowRight;
  const [moduleTab, setModuleTab] = useState<"money_flow" | "calculator" | "playbook" | "safety" | "roadmap">("money_flow");
  const [dailyClicks, setDailyClicks] = useState<number>(35);
  const [avgOrderPrice, setAvgOrderPrice] = useState<number>(120);
  const [commissionPct, setCommissionPct] = useState<number>(8);
  const [roadmapDone, setRoadmapDone] = useState<Record<string, boolean>>({});

  const monthlyClicks = dailyClicks * 30;
  const estSales = Math.max(1, Math.round(monthlyClicks * 0.035));
  const estMonthlyIncome = Math.round(estSales * avgOrderPrice * (commissionPct / 100));

  const toggleTask = (id: string) => setRoadmapDone((p) => ({ ...p, [id]: !p[id] }));
  const modules = [
    { id: "money_flow" as const, icon: DollarSign, labelHe: "1. איך הכסף עובר אליך", labelEn: "1. How Money Flows" },
    { id: "calculator" as const, icon: Calculator, labelHe: "2. מחשבון פוטנציאל רווח", labelEn: "2. Profit Simulator" },
    { id: "playbook" as const, icon: TrendingUp, labelHe: "3. שיווק בלי עוקבים", labelEn: "3. Zero-Follower Playbook" },
    { id: "safety" as const, icon: ShieldCheck, labelHe: "4. חוקים ומניעת חסימות", labelEn: "4. Anti-Ban & Legal" },
    { id: "roadmap" as const, icon: CalendarCheck, labelHe: "5. תוכנית 30 יום מעשית", labelEn: "5. 30-Day Roadmap" },
  ];

  const roadmapItems = [
    { id: "d1", dayHe: "יום 1–2", dayEn: "Day 1–2", titleHe: "בחירת רשת אחת בלבד (עליאקספרס או אמזון) ואימות מזהה השותף בתחנה 2.", titleEn: "Pick ONE network (AliExpress or Amazon) and verify your Tracking ID in Stage 2." },
    { id: "d3", dayHe: "יום 3–5", dayEn: "Day 3–5", titleHe: "בחירת 5 מוצרים פותרי-בעיה עם דירוג 4.7+ ויצירת 5 קישורים חכמים בתחנה 3.", titleEn: "Select 5 problem-solving products (4.7+ stars) and build 5 Smart Links in Stage 3." },
    { id: "d7", dayHe: "יום 6–10", dayEn: "Day 6–10", titleHe: "פרסום ראשון ל-2 ערוצים (וואטסאפ + פייסבוק/רילס) באמצעות הקישורים המתויגים (?src=).", titleEn: "Launch first posts across 2 channels (WhatsApp + Facebook/Reels) using tagged links." },
    { id: "d15", dayHe: "יום 11–20", dayEn: "Day 11–20", titleHe: "בדיקת הנתונים בבנק הדיגיטלי: זיהוי הקישור עם הכי הרבה קליקים ושכפול ההצלחה לעוד 5 מוצרים.", titleEn: "Audit Digital Bank metrics: identify top-clicked link and replicate with 5 more items." },
    { id: "d30", dayHe: "יום 21–30", dayEn: "Day 21–30", titleHe: "הגעה ל-3 מכירות ראשונות, בדיקת יתרה מאושרת ברשת והגדרת פרטי חשבון בנק / PayPal למשיכה.", titleEn: "Hit first 3 qualifying sales, verify approved balance, and configure Bank / PayPal payout." },
  ];

  return (
    <div className="card-hero" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(56,189,248,0.35)", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(56,189,248,0.16)", color: "#38bdf8", fontSize: 11.5, fontWeight: 800, marginBottom: 6 }}>
            <GraduationCap size={14} /> {isHe ? "אוניברסיטת השותפים של מסלול 1 · מדריך מעשי מאפס" : "TRACK 1 AFFILIATE UNIVERSITY · ZERO-TO-PRO ACADEMY"}
          </span>
          <h2 style={{ fontSize: 19, fontWeight: 900, color: "#f8fafc", margin: 0 }}>
            {isHe ? "כל מה שמתחיל חייב לדעת — מהקליק הראשון ועד שהכסף בחשבון הבנק" : "Everything a Beginner Needs — From First Click to Bank Payout"}
          </h2>
        </div>
        <button type="button" onClick={() => onJumpStage(1)} className="btn-primary" style={{ width: "auto", height: 38, padding: "0 16px", fontSize: 12.5, background: "#34d399", color: "#0a0b0e" }}>
          <span>{isHe ? "מוכן להתחיל? עבור לבחירת רשת" : "Ready? Choose Network"}</span> <ArrowIcon size={14} />
        </button>
      </div>

      {/* Clean Single-Focus Module Switcher */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 8 }}>
        {modules.map((m) => {
          const Icon = m.icon;
          const active = moduleTab === m.id;
          return (
            <button key={m.id} type="button" onClick={() => setModuleTab(m.id)} className={active ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 12.5, fontWeight: 800 }}>
              <Icon size={14} /> <span>{isHe ? m.labelHe : m.labelEn}</span>
            </button>
          );
        })}
      </div>

      {moduleTab === "money_flow" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
          {[
            { step: "01", titleHe: "הקלקה ושמירת עוגייה (Cookie)", titleEn: "Click & Cookie Attribution", bodyHe: "כשגולש לוחץ על הקישור החכם שלך, הדפדפן שלו שומר קוד זיהוי שקוף שמקשר אותו אליך למשך 24 שעות (אמזון) ועד 30 יום (עליאקספרס ורשתות ישראליות).", bodyEn: "When a visitor clicks your smart link, a tracking cookie links their session to your ID for 24h (Amazon) up to 30 days." },
            { step: "02", titleHe: "רכישה ורישום עמלה (Pending)", titleEn: "Purchase & Pending Commission", bodyHe: "גם אם הלקוח קנה מוצר אחר באותו אתר בתוך חלון הזמן — העמלה נרשמת לזכותך בלוח הבקרה של הרשת תחת סטטוס 'ממתין לאישור אספקה'.", bodyEn: "Even if the buyer purchases other items during the cookie window, commissions appear in your network dashboard as Pending." },
            { step: "03", titleHe: "אישור סופי (Approved Balance)", titleEn: "Order Delivery & Approval", bodyHe: "לאחר שהמוצר נמסר ללקוח וחלפה תקופת ההחזרות (לרוב 15–30 יום), הסכום עובר מ-'ממתין' ל-'יתרה מאושרת למשיכה'.", bodyEn: "Once delivered and past the return window (15–30 days), funds move from Pending to Approved Balance." },
            { step: "04", titleHe: "העברה לחשבון שלך (Payout)", titleEn: "Direct Payout to Your Account", bodyHe: "בהגיעך לסף המינימום (לרוב $10–$20), הרשת מעבירה את הכסף ישירות לחשבון הבנק הישראלי, PayPal או Payoneer שלך.", bodyEn: "Once you reach the payout threshold ($10–$20), funds transfer directly to your Bank, PayPal, or Payoneer." },
          ].map((card) => (
            <div key={card.step} style={{ padding: 18, borderRadius: 16, background: "rgba(10,11,14,0.88)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#34d399" }}>STEP {card.step}</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc", margin: 0 }}>{isHe ? card.titleHe : card.titleEn}</h3>
              <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.65, margin: 0 }}>{isHe ? card.bodyHe : card.bodyEn}</p>
            </div>
          ))}
        </div>
      )}
      {moduleTab === "calculator" && (
        <div style={{ padding: 20, borderRadius: 16, background: "rgba(10,11,14,0.88)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#34d399" }}>{isHe ? "סימולטור הכנסה חודשית (הזז את המחוונים לראות איך מספרים קטנים מצטברים):" : "Monthly Income Simulator (Adjust sliders to model real results):"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12.5, color: "#e2e8f0", marginBottom: 6 }}>{isHe ? `קליקים ביום: ${dailyClicks}` : `Daily Clicks: ${dailyClicks}`}</label>
              <input type="range" min={5} max={500} value={dailyClicks} onChange={(e) => setDailyClicks(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12.5, color: "#e2e8f0", marginBottom: 6 }}>{isHe ? `מחיר מוצר ממוצע: ₪${avgOrderPrice}` : `Avg Order Value: ₪${avgOrderPrice}`}</label>
              <input type="range" min={30} max={1000} step={10} value={avgOrderPrice} onChange={(e) => setAvgOrderPrice(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12.5, color: "#e2e8f0", marginBottom: 6 }}>{isHe ? `אחוז עמלה: ${commissionPct}%` : `Commission Rate: ${commissionPct}%`}</label>
              <input type="range" min={2} max={25} value={commissionPct} onChange={(e) => setCommissionPct(Number(e.target.value))} style={{ width: "100%" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 12, background: "#05070a" }}><div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "קליקים בחודש" : "Monthly Clicks"}</div><div style={{ fontSize: 22, fontWeight: 900, color: "#38bdf8" }}>{monthlyClicks}</div></div>
            <div style={{ padding: 14, borderRadius: 12, background: "#05070a" }}><div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "מכירות משוערות (3.5%)" : "Est. Sales (3.5%)"}</div><div style={{ fontSize: 22, fontWeight: 900, color: "#fbbf24" }}>{estSales}</div></div>
            <div style={{ padding: 14, borderRadius: 12, background: "#05070a", border: "1px solid rgba(52,211,153,0.4)" }}><div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "הכנסה חודשית משוערת" : "Est. Monthly Income"}</div><div style={{ fontSize: 24, fontWeight: 900, color: "#34d399" }}>₪{estMonthlyIncome.toLocaleString()}</div></div>
          </div>
        </div>
      )}

      {moduleTab === "playbook" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {[
            { titleHe: "נוסחת הפוסט הממיר (ללא שיווק אגרסיבי)", titleEn: "High-Converting Post Formula", bodyHe: "1) פתיח שמזהה בעיה יומיומית -> 2) איך המוצר פותר אותה ב-10 שניות -> 3) השוואת מחיר אמיתית -> 4) קישור חכם + גילוי נאות. לעולם אל תכתוב 'תקנו עכשיו!'.", bodyEn: "1) Relatable daily problem -> 2) How the item solves it -> 3) Price value proof -> 4) Tracked link + disclosure." },
            { titleHe: "5 מקורות תנועה חינמיים מהיום הראשון", titleEn: "5 Free Traffic Channels From Day 1", bodyHe: "• קבוצות וואטסאפ של דילים ומשפחה\n• קבוצות פייסבוק ממוקדות נישה (גאדג'טים, הורות, רכב)\n• סטורי באינסטגרם עם מדבקת קישור\n• סרטוני רילס/טיקטוק קצרים (15 שניות) עם הפניה לביו\n• חנות הדילים הציבורית שלך כאן בפלטפורמה.", bodyEn: "• WhatsApp deal groups\n• Niche Facebook groups\n• Instagram Story link stickers\n• 15s Reels/TikTok pointing to Bio\n• Your hosted ProofCraft Deal Storefront." },
            { titleHe: "הסוד של תתי-מעקב (Sub-IDs)", titleEn: "The Secret of Channel Sub-IDs", bodyHe: "במקום להשתמש בקישור אחד לכל מקום, בתחנה 3 המערכת מוסיפה ?src=wa או ?src=fb. כך תדע בדיוק איזה ערוץ מביא כסף ותשקיע רק במה שעובד.", bodyEn: "Instead of one generic link, Stage 3 tags ?src=wa or ?src=fb so you double down only on winning channels." },
          ].map((p, i) => (
            <div key={i} style={{ padding: 18, borderRadius: 16, background: "rgba(10,11,14,0.88)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: "#38bdf8", marginBottom: 8 }}>{isHe ? p.titleHe : p.titleEn}</h3>
              <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.65, whiteSpace: "pre-line", margin: 0 }}>{isHe ? p.bodyHe : p.bodyEn}</p>
            </div>
          ))}
        </div>
      )}

      {moduleTab === "safety" && (
        <div style={{ padding: 18, borderRadius: 16, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.35)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#fca5a5" }}><AlertTriangle size={16} style={{ display: "inline", marginInlineEnd: 6 }} />{isHe ? "5 כללי ברזל שמונעים חסימת חשבון ואובדן עמלות:" : "5 Golden Rules to Prevent Account Bans & Lost Commissions:"}</div>
          {(isHe ? [
            "1. איסור רכישה עצמית: לעולם אל תקנה דרך הקישור של עצמך ואל תבקש מבני בית באותו Wi-Fi לקנות דרכו.",
            "2. גילוי נאות חובה: תמיד ציין 'גילוי נאות: קישור שותפים' — המערכת מוסיפה זאת אוטומטית למודעות שלך.",
            "3. עדכון כתובת האתר ברשת: הזן את כתובת חנות הדילים הציבורית שלך בהגדרות החשבון באמזון/עליאקספרס.",
            "4. בלי קיצורי כתובות חיצוניים (Bitly): רשתות רבות חוסמות Bitly; השתמש אך ורק בקישורי /go/ המאומתים של המערכת.",
            "5. כלל 180 הימים באמזון: באמזון חובה להשלים 3 מכירות ראשונות תוך 180 יום כדי שהחשבון יאושר לצמיתות.",
          ] : [
            "1. No Self-Referrals: Never buy through your own affiliate link or from the same household IP.",
            "2. Mandatory Disclosure: Always include affiliate disclosure—auto-injected by our ad generator.",
            "3. Register Your Storefront URL: List your public ProofCraft deal storefront in your network profile.",
            "4. Avoid Third-Party Shorteners: Use only our compliant /go/ links.",
            "5. Amazon 180-Day Rule: Complete 3 qualifying sales within 180 days for permanent account approval.",
          ]).map((rule, idx) => (
            <div key={idx} style={{ fontSize: 13, color: "#fee2e2", lineHeight: 1.6 }}>{rule}</div>
          ))}
        </div>
      )}

      {moduleTab === "roadmap" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {roadmapItems.map((item) => {
            const done = Boolean(roadmapDone[item.id]);
            return (
              <div key={item.id} onClick={() => toggleTask(item.id)} style={{ padding: "14px 16px", borderRadius: 12, cursor: "pointer", background: done ? "rgba(52,211,153,0.12)" : "#0a0b0e", border: `1px solid ${done ? "rgba(52,211,153,0.45)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", gap: 12 }}>
                {done ? <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0 }} /> : <Circle size={18} color="#64748b" style={{ flexShrink: 0 }} />}
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 900, color: "#38bdf8", marginInlineEnd: 8 }}>{isHe ? item.dayHe : item.dayEn}</span>
                  <span style={{ fontSize: 13.5, color: done ? "#a7f3d0" : "#f8fafc", fontWeight: 700 }}>{isHe ? item.titleHe : item.titleEn}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}