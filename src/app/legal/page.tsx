"use client";
import React from "react";
import Link from "next/link";
import { ShieldCheck, Scale, Lock, Eye, AlertCircle, ArrowLeft, ArrowRight, FileCheck2, Cpu, Landmark } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";

export default function LegalCompliancePage() {
  const { isHe, dir } = useStudioLang();
  const BackArrow = isHe ? ArrowRight : ArrowLeft;
  const sections = isHe
    ? [
        { icon: Scale, title: "1. תנאי שימוש ורישיון פלטפורמה (Terms of Service)", body: "ProofCraft Fintech OS היא תשתית תוכנה להנדסת מוצרי AI, בניית תיקי עבודות מאומתים וניהול קישורי שותפים חכמים. המשתמש אחראי בלעדית לתקינות הקישורים, התכנים וההצעות שהוא מפרסם, ומתחייב לפעול בהתאם לדין החל ולתנאי הרשתות החיצוניות." },
        { icon: AlertCircle, title: "2. גילוי נאות רשמי לשותפים (Amazon Associates & FTC Disclosure)", body: "חלק מהקישורים המוצגים בלוחות הדילים, בתיקי העבודות ובפיד הקהילתי הם קישורי שותפים (Affiliate Links). כשותפי Amazon Associates ורשתות מסחר מאומתות, יוצרי התוכן או הפלטפורמה עשויים לקבל עמלה מרכישות מזכות — ללא כל עלות נוספת מצד הרוכש." },
        { icon: Landmark, title: "3. היעדר הבטחת רווחים ואי-מתן ייעוץ פיננסי או משפטי (No Earnings Guarantee)", body: "הפלטפורמה מספקת כלים טכנולוגיים למדידה, ניהול ואימות בלבד. אין בנתונים, במחשבונים או בתבניות משום הבטחה להכנסה, אישור אוטומטי ברשתות שותפים, או ייעוץ השקעות, מס או ייעוץ משפטי." },
        { icon: Cpu, title: "4. הגבלת אחריות על פלט AI, פרומפטים והרצת קוד (AI & Code Disclaimer)", body: "הפרומפטים, תבניות התוכן וסקריפטי הטרמינל בכספת נועדו לסיוע הנדסי ולימודי. המשתמש מתחייב לבדוק כל קוד או פקודה בסביבת פיתוח מבוקרת, לבצע גיבוי מלא ולהגן על מפתחות סודיים (.env.local) לפני הרצה בייצור." },
        { icon: Lock, title: "5. מדיניות פרטיות, הצפנה ובידוד נתונים (Privacy & RLS Security)", body: "אנו אוספים אך ורק נתונים הנחוצים להפעלת החשבון, אימות תיק העבודות ומדידת קליקים אנונימית (סוג מכשיר, דפדפן ומדינת מקור). כל הרשומות מוגנות ברמת מסד הנתונים באמצעות מדיניות Row-Level Security (RLS) ותקשורת מוצפנת HTTPS." },
        { icon: ShieldCheck, title: "6. מניעת ספאם ותקשורת הוגנת (חוק התקשורת סעיף 30א)", body: "השימוש במחוללי ההודעות ובכלי השיתוף הוויראליים של הפלטפורמה מיועד להפצה בהסכמה בלבד. חל איסור מוחלט על שליחת הודעות פרסומיות המוניות ללא הסכמה מוקדמת של הנמען בהתאם לחוק התקשורת (בזק ושידורים), התשמ\"ב-1982." },
        { icon: FileCheck2, title: "7. קניין רוחני, הגבלת אחריות ושיפוי (IP & Limitation of Liability)", body: "כל זכויות הקניין הרוחני בממשק, במנועי האימות ובעיצוב המערכת שמורות ל-ProofCraft Fintech OS. הפלטפורמה מסופקת כמות שהיא (AS-IS) והמשתמש מתחייב לשפות את מפעילי האתר בגין כל תביעה הנובעת מהפרת תנאים אלו או מדין חל על ידו." },
        { icon: Eye, title: "8. הצהרת נגישות (תקן ישראלי 5568 ו-WCAG 2.2 AA)", body: "הפלטפורמה פותחה עם מרכז נגישות פינטק מובנה הכולל הגדלת גופן (100%–125%), מצב ניגודיות גבוהה, הדגשת קישורים, עצירת אנימציות וריווח קריאות מותאם. לפנייה בנושא נגישות או תמיכה ניתן ליצור קשר דרך כפתור התמיכה הישירה." }
      ]
    : [
        { icon: Scale, title: "1. Terms of Service & Platform Governance", body: "ProofCraft Fintech OS provides software infrastructure for AI product engineering, verified execution portfolios, and smart affiliate link management. Users retain sole responsibility for the accuracy, legality, and compliance of all submitted URLs, deals, and public artifacts." },
        { icon: AlertCircle, title: "2. Official Affiliate & FTC / Amazon Associates Disclosure", body: "Certain links across verified deal storefronts, builder tech stacks, and community posts are affiliate links. As an Amazon Associate and verified partner network participant, creators or the platform may earn a commission from qualifying purchases at zero additional cost to the buyer." },
        { icon: Landmark, title: "3. No Earnings Guarantee & Non-Advisory Notice", body: "ProofCraft provides technical workflow and analytics tools only. Nothing on the platform constitutes financial, tax, investment, or legal advice, nor does it guarantee earnings, conversion rates, or third-party affiliate network approval." },
        { icon: Cpu, title: "4. AI Output, Prompt Vault & Terminal Script Disclaimer", body: "Prompts, templates, and terminal scripts in the Vault are provided for engineering guidance. Users must review, back up, and test all generated code or commands in isolated environments and enforce .env secret isolation prior to production execution." },
        { icon: Lock, title: "5. Privacy Policy & Row-Level Security (RLS)", body: "We collect only essential account telemetry and aggregated, privacy-safe click analytics (device category, browser type, and country). All user records are isolated at the PostgreSQL database layer via strict Row-Level Security (RLS) and HTTPS encryption." },
        { icon: ShieldCheck, title: "6. Anti-Spam & Fair Marketing Compliance", body: "Multi-channel ad templates and viral share bars are intended strictly for permission-based sharing. Unsolicited bulk messaging is strictly prohibited under global anti-spam regulations and applicable communications laws." },
        { icon: FileCheck2, title: "7. Intellectual Property, Limitation of Liability & Indemnification", body: "All intellectual property rights in the platform architecture, verification engines, and UI belong to ProofCraft Fintech OS. Services are provided AS-IS, and users agree to indemnify the platform against claims arising from user-submitted content or regulatory non-compliance." },
        { icon: Eye, title: "8. Accessibility Statement (WCAG 2.2 AA & IS 5568)", body: "ProofCraft Fintech OS includes a built-in Fintech Accessibility Center supporting 100%–125% font scaling, high-contrast mode, link highlighting, reduced motion, and readable text spacing. For accessibility inquiries, reach out via the direct support channel." }
      ];
  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left", maxWidth: 880, margin: "0 auto" }}>
      <div className="card-hero" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <span className="badge-pill" style={{ background: "rgba(56, 189, 248, 0.14)", color: "#38bdf8", fontSize: 11 }}><ShieldCheck size={13} /> {isHe ? "מרכז ציות, פרטיות, גילוי נאות ונגישות" : "LEGAL, COMPLIANCE, DISCLOSURE & ACCESSIBILITY CENTER"}</span>
          <Link href="/" className="btn-ghost" style={{ minHeight: 34, fontSize: 12 }}><BackArrow size={13} /> {isHe ? "חזרה לדף הבית" : "Back to Studio"}</Link>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{isHe ? "תנאי שימוש, פרטיות, הגבלת אחריות, גילוי נאות והצהרת נגישות" : "Terms of Service, Privacy, Liability Disclaimers, Disclosure & Accessibility"}</h1>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>{isHe ? "עודכן לאחרונה: נובמבר 2026 · ProofCraft Fintech OS" : "Last Updated: November 2026 · ProofCraft Fintech OS"}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sections.map((sec, idx) => { const IconComp = sec.icon; return (<div key={idx} className="card-surface" style={{ padding: 20 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><IconComp size={16} color="#34d399" /><h2 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc" }}>{sec.title}</h2></div><p style={{ fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.65 }}>{sec.body}</p></div>); })}
      </div>
    </div>
  );
}