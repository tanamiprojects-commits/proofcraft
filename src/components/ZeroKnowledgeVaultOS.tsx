"use client";
import React, { useEffect, useState } from "react";
import { Accessibility, CheckCircle2, Copy, Download, Edit3, Eye, EyeOff, ExternalLink, FileSpreadsheet, KeyRound, Lock, Plus, Printer, RefreshCw, Search, Share2, ShieldAlert, Trash2, Unlock } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";
import { supabase } from "@/lib/supabase";
import { decryptVaultJson, EncryptedVaultBlob, encryptVaultJson } from "@/lib/zero-knowledge-crypto";
import { generateStrongPassword, PERSONAL_CIPHER_CLUES, VAULT_QUICK_TEMPLATES } from "@/lib/vault-templates-engine";

export type VaultCategory = "crypto_seed" | "api_secrets" | "passwords" | "project_memory";

export interface VaultEntry {
  id: string; title: string; category: VaultCategory;
  targetAsset: string; originSource: string; actionUrl: string;
  secretValue: string; createdAt: string;
}

export default function ZeroKnowledgeVaultOS({ userId, standalone = false }: { userId?: string | null; standalone?: boolean }) {
  const { isHe } = useStudioLang();
  const storageKey = `pc_zk_vault_v2_${userId || "universal"}`;
  const subDomain = "https://" + "studio" + ".tanami360.com";

  const [blob, setBlob] = useState<EncryptedVaultBlob | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [filterCat, setFilterCat] = useState<"all" | VaultCategory>("all");
  const [searchQ, setSearchQ] = useState("");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [govNotice, setGovNotice] = useState("");
  const [govDisabled, setGovDisabled] = useState(false);

  const [a11yLargeText, setA11yLargeText] = useState(false);
  const [a11yHighContrast, setA11yHighContrast] = useState(false);
  const [showHelperDeck, setShowHelperDeck] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<VaultCategory>("crypto_seed");
  const [targetAsset, setTargetAsset] = useState("");
  const [originSource, setOriginSource] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [secretValue, setSecretValue] = useState("");
  const [exportLang, setExportLang] = useState<"he" | "en" | "both">("he");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setBlob(JSON.parse(raw));
    } catch {}
    (async () => {
      try {
        const { data } = await supabase.from("site_settings").select("value").eq("key", "vault_governance").single();
        if (data?.value) { if (data.value.enabled === false) setGovDisabled(true); if (data.value.notice) setGovNotice(data.value.notice); }
      } catch {}
    })();
  }, [storageKey]);

  const handleUnlockOrCreate = async () => {
    setErrorMsg(""); setInfoMsg("");
    if (passphrase.trim().length < 8) { setErrorMsg(isHe ? "סיסמת המאסטר חייבת להכיל לפחות 8 תווים." : "Master passphrase must be 8+ characters."); return; }
    try {
      if (!blob) {
        const fresh = await encryptVaultJson(JSON.stringify([]), passphrase);
        localStorage.setItem(storageKey, JSON.stringify(fresh));
        setBlob(fresh); setEntries([]); setUnlocked(true);
        setInfoMsg(isHe ? "הכספת האישית שלך הוקמה והוצפנה מקומית ב-AES-GCM 256-bit." : "Personal AES-GCM 256-bit vault initialized.");
      } else {
        const plain = await decryptVaultJson(blob, passphrase);
        setEntries(JSON.parse(plain)); setUnlocked(true);
        setInfoMsg(isHe ? "הכספת פוענחה בהצלחה בדפדפן שלך בלבד." : "Vault decrypted locally in your browser.");
      }
    } catch { setErrorMsg(isHe ? "סיסמת מאסטר שגויה — לא ניתן לפענח." : "Wrong master passphrase."); }
  };

  const persistEncrypted = async (nextList: VaultEntry[]) => {
    setEntries(nextList);
    const nextBlob = await encryptVaultJson(JSON.stringify(nextList), passphrase);
    localStorage.setItem(storageKey, JSON.stringify(nextBlob));
    setBlob(nextBlob);
  };
  const handleSaveEntry = async () => {
    if (!title.trim() || !secretValue.trim()) return;
    const cleanAction = actionUrl.trim() ? (actionUrl.trim().startsWith("http") ? actionUrl.trim() : `https://${actionUrl.trim()}`) : "";
    if (editingId) {
      const updated = entries.map((item) => item.id === editingId ? { ...item, title: title.trim(), category, targetAsset: targetAsset.trim() || "General", originSource: originSource.trim() || "Manual", actionUrl: cleanAction, secretValue: secretValue.trim() } : item);
      await persistEncrypted(updated);
      setEditingId(null);
      setInfoMsg(isHe ? "הפריט עודכן והוצפן מחדש בכספת." : "Entry updated & re-encrypted.");
    } else {
      const item: VaultEntry = { id: `sec-${Date.now()}`, title: title.trim(), category, targetAsset: targetAsset.trim() || (isHe ? "כללי" : "General"), originSource: originSource.trim() || (isHe ? "הזנה ידנית" : "Manual"), actionUrl: cleanAction, secretValue: secretValue.trim(), createdAt: new Date().toISOString() };
      await persistEncrypted([item, ...entries]);
      setInfoMsg(isHe ? "הפריט הוצפן יחד עם כל ההקשר שלו ונשמר בכספת." : "Entry & context encrypted and saved.");
    }
    setTitle(""); setTargetAsset(""); setOriginSource(""); setActionUrl(""); setSecretValue("");
  };

  const startEditEntry = (item: VaultEntry) => {
    setEditingId(item.id); setTitle(item.title); setCategory(item.category);
    setTargetAsset(item.targetAsset); setOriginSource(item.originSource);
    setActionUrl(item.actionUrl); setSecretValue(item.secretValue);
  };

  const cleanCell = (v: string) => (v || "").replace(/[\r\n\t]+/g, " ").trim();
  const buildGoogleSheetsTable = (sep: "\t" | ",") => {
    const catHe: Record<VaultCategory, string> = { crypto_seed: "ארנק קריפטו (12/24 מילים)", api_secrets: "מפתחות API וסודות", passwords: "סיסמאות וחשבונות", project_memory: "זיכרון והקשר פרויקט" };
    const catEn: Record<VaultCategory, string> = { crypto_seed: "Crypto Seed (12/24)", api_secrets: "API & Dev Secrets", passwords: "Passwords", project_memory: "Project Memory" };
    const headers = exportLang === "he" ? ["שם הפריט", "קטגוריה", "שייך לנכס", "מקור הפריט", "הסוד / הרמז המוצפן", "קישור פעולה", "תאריך"] : exportLang === "en" ? ["Item Title", "Category", "Target Asset", "Origin Source", "Secret / Personal Clue", "Action URL", "Date"] : ["שם הפריט / Title", "קטגוריה / Category", "שייך לנכס / Asset", "מקור / Origin", "הסוד או הרמז / Secret or Clue", "קישור / URL", "תאריך / Date"];
    const rows = entries.map((e) => {
      const catCell = exportLang === "he" ? catHe[e.category] : exportLang === "en" ? catEn[e.category] : `${catHe[e.category]} | ${catEn[e.category]}`;
      return [e.title, catCell, e.targetAsset, e.originSource, e.secretValue, e.actionUrl || "-", e.createdAt.slice(0, 10)].map((c) => sep === "," ? `"${cleanCell(c).replace(/"/g, '""')}"` : cleanCell(c)).join(sep);
    });
    return [headers.join(sep), ...rows].join("\n");
  };

  const copyForGoogleSheets = () => {
    navigator.clipboard?.writeText(buildGoogleSheetsTable("\t"));
    setCopiedId("gsheets"); setTimeout(() => setCopiedId(""), 2500);
    setInfoMsg(isHe ? "הטבלה הועתקה ללוח! פתח גיליון חדש ב-Google Sheets ולחץ Ctrl+V להדבקה מעוצבת." : "Table copied! Open Google Sheets and press Ctrl+V.");
  };

  const downloadUtf8BomCsv = () => {
    const bomCsv = "\uFEFF" + buildGoogleSheetsTable(",");
    const url = URL.createObjectURL(new Blob([bomCsv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = `tanami360-vault-${exportLang}.csv`; a.click();
    setInfoMsg(isHe ? "קובץ CSV עם תמיכת עברית מלאה (UTF-8 BOM) ירד. מומלץ למחוק אותו לאחר ההדפסה." : "UTF-8 BOM CSV downloaded. Delete file after printing for security.");
  };
  const lockVaultNow = () => { setUnlocked(false); setEntries([]); setPassphrase(""); setRevealedIds({}); setEditingId(null); setInfoMsg(isHe ? "הכספת ננעלה והזיכרון נוקה." : "Vault locked & memory cleared."); };
  const copyStr = (val: string, id: string) => { navigator.clipboard?.writeText(val); setCopiedId(id); setTimeout(() => setCopiedId(""), 2200); };
  const exportEncryptedBackup = () => { if (!blob) return; const url = URL.createObjectURL(new Blob([JSON.stringify(blob, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = "tanami360-zk-vault-backup.json"; a.click(); };
  const shareVaultText = isHe ? `כלי אבטחה חינמי ושימושי: כספת Zero-Knowledge מוצפנת (AES-256) לשמירת סיסמאות, מפתחות פרויקטים וביטויי 12/24 מילים של קריפטו עם הקשר מלא + ייצוא ל-Google Sheets:\n${subDomain}/vault` : `Free Zero-Knowledge AES-256 Vault with full context, personal cipher clues & Google Sheets export:\n${subDomain}/vault`;
  const catLabels: Record<VaultCategory, string> = isHe ? { crypto_seed: "ארנק קריפטו (12/24 מילים)", api_secrets: "מפתחות API וסודות", passwords: "סיסמאות וחשבונות", project_memory: "זיכרון והקשר פרויקט" } : { crypto_seed: "Crypto Seed (12/24)", api_secrets: "API & Dev Secrets", passwords: "Passwords", project_memory: "Project Memory" };
  const visibleEntries = entries.filter((e) => (filterCat === "all" || e.category === filterCat) && (!searchQ.trim() || `${e.title} ${e.targetAsset} ${e.originSource}`.toLowerCase().includes(searchQ.trim().toLowerCase())));

  const renderSecretDisplay = (item: VaultEntry) => {
    if (item.category === "crypto_seed") {
      const words = item.secretValue.split(/[\s,]+/).filter(Boolean);
      return (<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 6, marginTop: 6 }}>{words.map((w, idx) => (<div key={idx} style={{ padding: "4px 7px", borderRadius: 6, background: "#05070a", border: "1px solid rgba(52,211,153,0.25)", fontFamily: "monospace", fontSize: 11.5, color: "#34d399" }}><span style={{ color: "#64748b", marginInlineEnd: 4 }}>#{idx + 1}</span>{w}</div>))}</div>);
    }
    return <div style={{ marginTop: 6, padding: "7px 10px", borderRadius: 8, background: "#05070a", fontFamily: "monospace", fontSize: 12, color: "#34d399", wordBreak: "break-all" }}>{item.secretValue}</div>;
  };

  return (
    <section dir={isHe ? "rtl" : "ltr"} className="card-hero" style={{ padding: 20, marginBottom: 20, border: `1px solid ${a11yHighContrast ? "#ffffff" : "rgba(251,191,36,0.38)"}`, background: a11yHighContrast ? "#000000" : undefined, fontSize: a11yLargeText ? "112%" : "100%", textAlign: isHe ? "right" : "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, paddingBottom: 10, marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span className="badge-pill" style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 11 }}><KeyRound size={12} /> {isHe ? "כספת Zero-Knowledge AES-256" : "ZERO-KNOWLEDGE VAULT"}</span>
          {!standalone && <a href="/vault" className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}><ExternalLink size={11} /> {isHe ? "מצב מסך נקי" : "Standalone"}</a>}
          {unlocked && <button type="button" onClick={() => setShowHelperDeck(!showHelperDeck)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#fbbf24" }}>{showHelperDeck ? (isHe ? "סגור תבניות ורמזים" : "Hide Templates") : (isHe ? "תבניות ומחולל סיסמאות" : "Templates & Generator")}</button>}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" onClick={() => setA11yLargeText(!a11yLargeText)} className="btn-ghost" style={{ height: 30, padding: "0 9px", fontSize: 11 }} aria-label="Toggle Text Size"><Accessibility size={12} /> {isHe ? (a11yLargeText ? "טקסט רגיל" : "הגדל טקסט") : "A+"}</button>
          <button type="button" onClick={() => setA11yHighContrast(!a11yHighContrast)} className="btn-ghost" style={{ height: 30, padding: "0 9px", fontSize: 11 }}>{isHe ? "ניגודיות" : "Contrast"}</button>
          {unlocked && <button type="button" onClick={lockVaultNow} className="btn-primary" style={{ height: 30, padding: "0 10px", fontSize: 11, width: "auto", background: "#fbbf24", color: "#0a0b0e" }}><Lock size={11} /> {isHe ? "נעל" : "Lock"}</button>}
        </div>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginBottom: 8 }}>{isHe ? "כספת חכמה עם זיכרון מלא, הצפנת רמזים וייצוא ל-Google Sheets" : "Context-Rich Vault, Personal Cipher Clues & Google Sheets Export"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 8, padding: 10, borderRadius: 12, background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.22)", fontSize: 11.5, color: "#cbd5e1", marginBottom: 12 }}>
        <div><strong style={{ color: "#38bdf8" }}>{isHe ? "הצפנת רמז אישי:" : "Personal Cipher Clues:"}</strong> {isHe ? "במקום לשמור סיסמה גלויה, שמור רמז שרק אתה מבין (כמו תאריך לידה של חיית מחמד)." : "Save a personal clue only you understand instead of a raw password."}</div>
        <div><strong style={{ color: "#34d399" }}>{isHe ? "ייצוא ל-Google Sheets:" : "Google Sheets Ready:"}</strong> {isHe ? "העתק בלחיצה טבלה מסודרת בעברית, באנגלית או בשתי השפות יחד והדבק ישירות בגיליון." : "1-click copy in Hebrew, English, or Bilingual format for Google Sheets."}</div>
        <div><strong style={{ color: "#fbbf24" }}>{isHe ? "אזהרת אבטחה:" : "Security Notice:"}</strong> {isHe ? "סיסמת המאסטר לא נשמרת בשרת. מחק קובצי CSV לאחר הדפסה או הוספת פריט חדש." : "Master passphrase is never stored. Delete exported files after printing."}</div>
      </div>
      {govDisabled && <div style={{ padding: 10, borderRadius: 10, background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{isHe ? "הכספת בתחזוקה יזומה. הנתונים המוצפנים שלך שמורים בבטחה." : "Vault in scheduled maintenance."}</div>}
      {govNotice && <div style={{ padding: 10, borderRadius: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{govNotice}</div>}
      {errorMsg && <div style={{ padding: 10, borderRadius: 10, background: "rgba(248,113,113,0.15)", color: "#f87171", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{errorMsg}</div>}
      {infoMsg && <div style={{ padding: 10, borderRadius: 10, background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{infoMsg}</div>}
      {!unlocked ? (
        <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder={blob ? (isHe ? "הזן סיסמת מאסטר לפענוח הכספת..." : "Enter master passphrase...") : (isHe ? "בחר סיסמת מאסטר (8+ תווים) ליצירת כספת חינמית..." : "Create master passphrase (8+ chars)...")} className="input-dark" style={{ flex: 1, minWidth: 230, height: 40, fontSize: 13 }} />
          <button type="button" onClick={handleUnlockOrCreate} className="btn-primary" style={{ height: 40, padding: "0 18px", fontSize: 12.5, width: "auto" }}><Unlock size={14} /> {blob ? (isHe ? "פענח ופתח כספת" : "Decrypt & Unlock") : (isHe ? "צור כספת מוצפנת בחינם" : "Create Free Vault")}</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
          {showHelperDeck && (
            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.3)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}><strong style={{ fontSize: 12, color: "#fbbf24" }}>{isHe ? "תבניות מהירות למפתחים וליום-יום:" : "Quick Dev & Daily Templates:"}</strong><button type="button" onClick={() => { setSecretValue(generateStrongPassword(20)); setInfoMsg(isHe ? "נוצרה סיסמה חזקה בת 20 תווים!" : "Generated 20-char password!"); }} className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11, color: "#34d399" }}><RefreshCw size={11} /> {isHe ? "חולל סיסמה חזקה (20 תווים)" : "Generate Strong Password"}</button></div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{VAULT_QUICK_TEMPLATES.map((tpl) => (<button key={tpl.id} type="button" onClick={() => { setTitle(isHe ? tpl.labelHe : tpl.labelEn); setCategory(tpl.category); setTargetAsset(tpl.targetAsset); setOriginSource(tpl.originSource); setActionUrl(tpl.actionUrl); }} className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11 }}>{isHe ? tpl.labelHe : tpl.labelEn}</button>))}</div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#38bdf8" }}>{isHe ? "הצפנת רמז אישי (לחץ להזנה):" : "Personal Cipher Clue Ideas:"}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{PERSONAL_CIPHER_CLUES.map((cl, i) => (<button key={i} type="button" onClick={() => setSecretValue(isHe ? cl.he : cl.en)} className="btn-ghost" style={{ height: "auto", padding: "4px 9px", fontSize: 10.5, textAlign: isHe ? "right" : "left" }}>{isHe ? cl.he : cl.en}</button>))}</div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 8, padding: 12, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.25)" }}>
            <select value={category} onChange={(e) => setCategory(e.target.value as VaultCategory)} className="input-dark" style={{ height: 36, fontSize: 12 }}>{(Object.keys(catLabels) as VaultCategory[]).map((k) => (<option key={k} value={k}>{catLabels[k]}</option>))}</select>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isHe ? "שם הפריט" : "Item Title"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <input value={targetAsset} onChange={(e) => setTargetAsset(e.target.value)} placeholder={isHe ? "לאיזה נכס שייך?" : "Target Asset"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <input value={originSource} onChange={(e) => setOriginSource(e.target.value)} placeholder={isHe ? "מאיפה התקבל?" : "Origin Source"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <input value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} placeholder={isHe ? "קישור פעולה (https://...)" : "Action URL"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <input type="text" value={secretValue} onChange={(e) => setSecretValue(e.target.value)} placeholder={category === "crypto_seed" ? (isHe ? "12 או 24 מילים מופרדות ברווח..." : "12 or 24 words...") : (isHe ? "הסוד / הסיסמה / רמז ההצפנה..." : "Secret / Password / Clue...")} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <button type="button" onClick={handleSaveEntry} className="btn-primary" style={{ height: 36, fontSize: 12, width: "auto" }}><Plus size={13} /> {editingId ? (isHe ? "עדכן והצפן" : "Update & Encrypt") : (isHe ? "הצפן ושמור" : "Encrypt & Save")}</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: 10, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.25)" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: "#34d399" }}>{isHe ? "ייצוא ל-Google Sheets / הדפסה:" : "Export:"}</span>
              <select value={exportLang} onChange={(e) => setExportLang(e.target.value as "he" | "en" | "both")} className="input-dark" style={{ height: 30, fontSize: 11, padding: "0 8px" }}><option value="he">{isHe ? "עברית תקינה (HE)" : "Hebrew (HE)"}</option><option value="en">{isHe ? "אנגלית תקינה (EN)" : "English (EN)"}</option><option value="both">{isHe ? "שתי השפות (HE + EN)" : "Bilingual (HE+EN)"}</option></select>
              <button type="button" onClick={copyForGoogleSheets} className="btn-primary" style={{ height: 30, padding: "0 11px", fontSize: 11, width: "auto" }}><FileSpreadsheet size={12} /> {copiedId === "gsheets" ? (isHe ? "הועתק לגוגל שיטס!" : "Copied!") : (isHe ? "העתק ל-Google Sheets" : "Copy Google Sheets")}</button>
              <button type="button" onClick={downloadUtf8BomCsv} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}><Download size={11} /> {isHe ? "קובץ CSV עברית" : "UTF-8 CSV"}</button>
              <button type="button" onClick={() => window.print()} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11 }}><Printer size={11} /> {isHe ? "הדפסה" : "Print"}</button>
              <button type="button" onClick={exportEncryptedBackup} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#fbbf24" }}>{isHe ? "גיבוי מוצפן JSON" : "Encrypted JSON"}</button>
            </div>
            <div style={{ position: "relative", minWidth: 180 }}><Search size={12} color="#94a3b8" style={{ position: "absolute", left: 10, top: 9 }} /><input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder={isHe ? "חיפוש בכספת..." : "Search vault..."} className="input-dark" style={{ height: 30, paddingLeft: 28, fontSize: 11.5, width: "100%" }} /></div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setFilterCat("all")} className={filterCat === "all" ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>{isHe ? `הכל (${entries.length})` : `All (${entries.length})`}</button>
            {(Object.keys(catLabels) as VaultCategory[]).map((k) => (<button key={k} type="button" onClick={() => setFilterCat(k)} className={filterCat === k ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>{catLabels[k]}</button>))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(265px, 1fr))", gap: 10 }}>
            {visibleEntries.map((item) => {
              const isShown = Boolean(revealedIds[item.id]);
              return (
                <div key={item.id} style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}><span className="badge-pill" style={{ fontSize: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>{catLabels[item.category]}</span><div style={{ display: "flex", gap: 6 }}><button type="button" onClick={() => startEditEntry(item)} style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer" }}><Edit3 size={13} /></button><button type="button" onClick={() => persistEncrypted(entries.filter((x) => x.id !== item.id))} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><Trash2 size={13} /></button></div></div>
                    <div style={{ fontSize: 14.5, fontWeight: 900, color: "#f8fafc", marginTop: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}><div><strong style={{ color: "#cbd5e1" }}>{isHe ? "שייך ל:" : "Asset:"}</strong> {item.targetAsset}</div><div><strong style={{ color: "#cbd5e1" }}>{isHe ? "מקור:" : "Origin:"}</strong> {item.originSource}</div></div>
                    {isShown ? renderSecretDisplay(item) : <div style={{ marginTop: 6, padding: "6px 10px", borderRadius: 8, background: "#05070a", fontFamily: "monospace", fontSize: 12, color: "#64748b" }}>••••••••••••••••••••••••</div>}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}>
                    <button type="button" onClick={() => setRevealedIds({ ...revealedIds, [item.id]: !isShown })} className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11 }}>{isShown ? <EyeOff size={11} /> : <Eye size={11} />} {isShown ? (isHe ? "הסתר" : "Hide") : (isHe ? "חשוף" : "Reveal")}</button>
                    <button type="button" onClick={() => copyStr(item.secretValue, item.id)} className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11, color: "#34d399" }}>{copiedId === item.id ? <CheckCircle2 size={11} /> : <Copy size={11} />} {copiedId === item.id ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק" : "Copy")}</button>
                    {item.actionUrl && <a href={item.actionUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11, color: "#38bdf8" }}><ExternalLink size={11} /> {isHe ? "פתח יעד" : "Open Target"}</a>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div style={{ padding: 12, borderRadius: 12, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 11.5, color: "#cbd5e1" }}><strong style={{ color: "#34d399" }}>{isHe ? "שתף את הכספת החינמית:" : "Share Free Vault:"}</strong> {isHe ? "הפץ את הכספת המוצפנת לחברים ומפתחים — כולל ייצוא ל-Google Sheets ורמזי הצפנה אישיים." : "Share standalone Zero-Knowledge Vault."}</div>
        <button type="button" onClick={() => copyStr(shareVaultText, "share-vault")} className="btn-ghost" style={{ height: 30, padding: "0 12px", fontSize: 11.5, color: "#34d399" }}><Share2 size={12} /> {copiedId === "share-vault" ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק הודעת שיתוף" : "Copy Share Post")}</button>
      </div>
    </section>
  );
}