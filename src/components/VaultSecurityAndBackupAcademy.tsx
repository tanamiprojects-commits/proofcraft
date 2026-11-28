"use client";

import React, { useState } from "react";
import { ShieldAlert, HardDriveDownload, Smartphone, WifiOff, KeyRound, Lock, CheckCircle2 } from "lucide-react";

export default function VaultSecurityAndBackupAcademy({ isHe }: { isHe: boolean }) {
  const [tab, setTab] = useState<"benefits" | "backup_sync" | "wifi_warnings">("backup_sync");

  return (
    <div dir={isHe ? "rtl" : "ltr"} className="card-hero" style={{ padding: 22, borderRadius: 18, border: "1px solid rgba(56,189,248,0.32)", background: "#0a0b0e", color: "#f8fafc", display: "flex", flexDirection: "column", gap: 16, marginTop: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 11, fontWeight: 800, marginBottom: 6 }}>
            <ShieldAlert size={13} /> {isHe ? "מדריך אבטחה, גיבוי והגנה על נכסים דיגיטליים (חובה לקרוא)" : "DIGITAL ASSET SECURITY & BACKUP ACADEMY"}
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>
            {isHe ? "איך להגן על הסיסמאות שלך ב-100%, לגבות בין מחשב לטלפון ולהימנע מאובדן מידע" : "How to Protect Your Secrets, Back Up Across Devices & Prevent Data Loss"}
          </h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
        <button type="button" onClick={() => setTab("backup_sync")} className={tab === "backup_sync" ? "btn-primary" : "btn-ghost"} style={{ height: 40, fontSize: 12.5 }}>
          <HardDriveDownload size={14} /> {isHe ? "1. גיבוי, אובדן מחשב וטלפון" : "1. Backup & Phone/PC Sync"}
        </button>
        <button type="button" onClick={() => setTab("wifi_warnings")} className={tab === "wifi_warnings" ? "btn-primary" : "btn-ghost"} style={{ height: 40, fontSize: 12.5 }}>
          <WifiOff size={14} /> {isHe ? "2. אזהרות Wi-Fi ונכסים דיגיטליים" : "2. Public Wi-Fi & Asset Rules"}
        </button>
        <button type="button" onClick={() => setTab("benefits")} className={tab === "benefits" ? "btn-primary" : "btn-ghost"} style={{ height: 40, fontSize: 12.5 }}>
          <Lock size={14} /> {isHe ? "3. יתרונות Zero-Knowledge ושימוש" : "3. Zero-Knowledge Benefits"}
        </button>
      </div>
      {tab === "backup_sync" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          <div style={{ padding: 16, borderRadius: 14, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.35)" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#fca5a5", marginBottom: 6 }}>{isHe ? "אזהרה #1: אין שחזור מפתח ראשי!" : "Warning #1: No Master Key Reset!"}</div>
            <p style={{ fontSize: 12.5, color: "#fee2e2", lineHeight: 1.65, margin: 0 }}>
              {isHe
                ? "הכספת פועלת בשיטת Zero-Knowledge — המפתח הראשי שלך לעולם לא נשלח לשרת. אם תשכח את המפתח הראשי, אף אחד בעולם לא יוכל לפתוח את הכספת. רשום אותו על פתק פיזי ושמור במקום נעול בבית."
                : "Your Master Key never leaves your browser. If forgotten, nobody can decrypt your vault. Write it on physical paper and lock it safely."}
            </p>
          </div>

          <div style={{ padding: 16, borderRadius: 14, background: "#11131a", border: "1px solid rgba(52,211,153,0.35)" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#34d399", marginBottom: 6 }}>{isHe ? "מה קורה אם המחשב הלך או נמחק הדפדפן?" : "What if Your PC Crashes or Browser Clears?"}</div>
            <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.65, margin: 0 }}>
              {isHe
                ? "הנתונים נשמרים מקומית בדפדפן. אם הדיסק נהרס או מחקת נתוני גלישה (Clear Browser Data) ללא גיבוי — הפריטים יימחקו! חובה לייצא 'קובץ גיבוי מוצפן' לאחר כל הוספת פריטים ולשמור ב-2 מקומות (ענן אישי + דיסק אונקי)."
                : "Data lives in local browser storage. Always export an Encrypted Backup file to Cloud Drive + USB after adding critical keys."}
            </p>
          </div>

          <div style={{ padding: 16, borderRadius: 14, background: "#11131a", border: "1px solid rgba(56,189,248,0.35)" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#38bdf8", marginBottom: 6 }}><Smartphone size={14} style={{ display: "inline", marginInlineEnd: 5 }} />{isHe ? "איך עובדים גם מהטלפון וגם מהמחשב?" : "How to Sync Between Phone & PC?"}</div>
            <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.65, margin: 0 }}>
              {isHe
                ? "כדי למנוע פריצות ענן, אין סנכרון אוטומטי ברקע. מייצאים קובץ גיבוי מוצפן מהמחשב -> שומרים ב-Google Drive / iCloud -> פותחים את הכספת בטלפון, בוחרים 'ייבוא גיבוי' ומזינים את אותו מפתח ראשי."
                : "Export your encrypted backup file to Drive/iCloud from PC, then import it on your phone using the exact same Master Key."}
            </p>
          </div>
        </div>
      )}

      {tab === "wifi_warnings" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          <div style={{ padding: 16, borderRadius: 14, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.35)" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#fbbf24", marginBottom: 6 }}>{isHe ? "סכנת Wi-Fi ציבורי או Wi-Fi של עסק חיצוני" : "Public & Business Wi-Fi Dangers"}</div>
            <p style={{ fontSize: 12.5, color: "#fef3c7", lineHeight: 1.65, margin: 0 }}>
              {isHe
                ? "ברשת Wi-Fi של בית קפה, מלון או עסק זר, בעל הראוטר או תוקף ברשת עלולים לבצע מתקפת התחזות (Evil Twin), לנטר כתובות DNS, או לבקש התקנת 'תעודת אבטחה'. מחוץ לבית: גלוש תמיד דרך נקודה אישית מהטלפון (Hotspot 4G/5G) או VPN!"
                : "Untrusted public or business Wi-Fi exposes you to Evil Twin spoofing and DNS monitoring. Always use your phone's cellular Hotspot or a trusted VPN."}
            </p>
          </div>

          <div style={{ padding: 16, borderRadius: 14, background: "#11131a", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#a5b4fc", marginBottom: 6 }}><KeyRound size={14} style={{ display: "inline", marginInlineEnd: 5 }} />{isHe ? "כללי ברזל לנכסים דיגיטליים רגישים" : "Golden Rules for Digital Assets"}</div>
            <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.65 }}>
              <li>{isHe ? "ביטויי קריפטו (12/24 מילים): גבה תמיד גם על נייר פיזי ולא רק דיגיטלית." : "Crypto Seed Phrases: Always keep an offline paper backup."}</li>
              <li>{isHe ? "קודי שחזור 2FA: שמור בתת-כספת נפרדת מהסיסמה של אותו חשבון." : "2FA Backup Codes: Store in a separate Sub-Vault from the main login."}</li>
              <li>{isHe ? "מפתחות API: לעולם אל תדביק בצ׳אט חיצוני בלי להסתיר דרך Context Studio." : "API Keys: Never paste raw keys in AI chats—mask via Context Studio."}</li>
            </ul>
          </div>
        </div>
      )}

      {tab === "benefits" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {[
            { titleHe: "הצפנת AES-256-GCM מקומית", titleEn: "Local AES-256-GCM Encryption", bodyHe: "הדפדפן שלך מצפין ומפענח הכל מקומית. לשרת או לאדמין אין שום גישה טכנית לסיסמאות שלך.", bodyEn: "Your browser encrypts everything locally. Neither server nor admin can ever read your secrets." },
            { titleHe: "תתי-כספות חכמות (Sub-Vaults)", titleEn: "Smart Sub-Vault Organization", bodyHe: "הפרדה מוחלטת בין חשבונות אישיים, ארנקי קריפטו ומפתחות פיתוח/API — עם אפשרות לנעילה כפולה.", bodyEn: "Separate personal logins, crypto seeds, and dev API keys with optional secondary PIN/riddle locks." },
            { titleHe: "ייצוא מהיר ל-.env ונעילה אוטומטית", titleEn: "1-Click .env Export & Auto-Lock", bodyHe: "מפתחים יכולים לייצא משתני סביבה מוכנים לפרויקט בלחיצה, ולנעול את הכספת לניקוי מלא מהזיכרון.", bodyEn: "Developers export clean .env lines in one click and lock the vault to wipe memory." },
          ].map((b, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 14, background: "#11131a", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#34d399", marginBottom: 6 }}><CheckCircle2 size={14} style={{ display: "inline", marginInlineEnd: 5 }} />{isHe ? b.titleHe : b.titleEn}</div>
              <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{isHe ? b.bodyHe : b.bodyEn}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}