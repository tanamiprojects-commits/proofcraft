"use client";
import React, { useEffect, useState } from "react";
import { Accessibility, ArrowUpRight, CheckCircle2, Copy, Download, Edit3, Eye, ChevronDown, ChevronUp, EyeOff, ExternalLink, Info, FileSpreadsheet, Globe, KeyRound, Lock, Plus, Printer, RefreshCw, RotateCcw, Search, Share2, ShieldCheck, Sliders, Trash2, Unlock } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";
import { supabase } from "@/lib/supabase";
import { CipherAlgo, decryptVaultJson, EncryptedVaultBlob, encryptVaultJson, recoverVaultWithCode } from "@/lib/zero-knowledge-crypto";
import { generateCustomPassword, generateStrongPassword, PERSONAL_CIPHER_CLUES, VAULT_QUICK_TEMPLATES } from "@/lib/vault-templates-engine";

export type VaultCategory = "crypto_seed" | "api_secrets" | "passwords" | "project_memory";
export interface VaultEntry { id: string; title: string; category: VaultCategory; targetAsset: string; originSource: string; actionUrl: string; secretValue: string; createdAt: string; }

export default function ZeroKnowledgeVaultOS({ userId, standalone = false }: { userId?: string | null; standalone?: boolean }) {
  const { isHe: globalHe, toggleLang } = useStudioLang();
  const [localLang, setLocalLang] = useState<"he" | "en" | null>(null);
  const isHe = localLang ? localLang === "he" : globalHe;
  const storageKey = `pc_zk_vault_v2_${userId || "universal"}`;
  const mainDomain = "https://" + "tanami360.com";
  const subDomain = "https://" + "studio" + ".tanami360.com";

  const [blob, setBlob] = useState<EncryptedVaultBlob | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [cipherAlgo, setCipherAlgo] = useState<CipherAlgo>("AES-GCM");
  const [unlocked, setUnlocked] = useState(false);
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [filterCat, setFilterCat] = useState<"all" | VaultCategory>("all");
  const [searchQ, setSearchQ] = useState("");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [activeFieldHelp, setActiveFieldHelp] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [govNotice, setGovNotice] = useState("");
  const [govDisabled, setGovDisabled] = useState(false);
  const [fontScale, setFontScale] = useState<number>(100);
  const [a11yHighContrast, setA11yHighContrast] = useState(false);
  const [showHelperDeck, setShowHelperDeck] = useState(false);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [showRecoverBox, setShowRecoverBox] = useState(false);
  const [exportLang, setExportLang] = useState<"he" | "en" | "both">("he");
  const [externalTask, setExternalTask] = useState<{ itemId: string; title: string; targetAsset: string; url: string } | null>(null);

  const [oldPassInput, setOldPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");
  const [recUserCode, setRecUserCode] = useState("");
  const [recAdminCode, setRecAdminCode] = useState("");
  const [recNewPass, setRecNewPass] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<VaultCategory>("crypto_seed");
  const [targetAsset, setTargetAsset] = useState("");
  const [originSource, setOriginSource] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [secretValue, setSecretValue] = useState("");
  const [showPwForge, setShowPwForge] = useState(false);
  const [genPwLen, setGenPwLen] = useState<number>(20);
  const [genUseNum, setGenUseNum] = useState(true);
  const [genUseSym, setGenUseSym] = useState(true);
  const [genPwPreview, setGenPwPreview] = useState<string>(() => generateCustomPassword(20, true, true));
  const [targetUpdateId, setTargetUpdateId] = useState("");
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("pc_vault_lang_pref");
      if (savedLang === "he" || savedLang === "en") setLocalLang(savedLang);
      else if (typeof navigator !== "undefined") setLocalLang((navigator.language || "").toLowerCase().startsWith("he") ? "he" : "en");
      const raw = localStorage.getItem(storageKey);
      if (raw) { const parsed = JSON.parse(raw); setBlob(parsed); if (parsed.algo) setCipherAlgo(parsed.algo); }
    } catch {}
    (async () => {
      try {
        const { data } = await supabase.from("site_settings").select("value").eq("key", "vault_governance").single();
        if (data?.value) { if (data.value.enabled === false) setGovDisabled(true); if (data.value.notice) setGovNotice(data.value.notice); }
      } catch {}
    })();
  }, [storageKey]);

  const switchVaultLanguage = () => { const next = isHe ? "en" : "he"; setLocalLang(next); setExportLang(next); try { localStorage.setItem("pc_vault_lang_pref", next); } catch {} if (toggleLang) toggleLang(); };

  const persistEncrypted = async (nextList: VaultEntry[], customPass?: string, customAlgo?: CipherAlgo, customRec?: string) => {
    setEntries(nextList);
    const p = customPass || passphrase;
    const a = customAlgo || cipherAlgo;
    const r = customRec !== undefined ? customRec : recoveryKey;
    const nextBlob = await encryptVaultJson(JSON.stringify(nextList), p, a, r);
    localStorage.setItem(storageKey, JSON.stringify(nextBlob));
    setBlob(nextBlob);
  };

  const handleUnlockOrCreate = async () => {
    setErrorMsg(""); setInfoMsg("");
    if (passphrase.trim().length < 8) { setErrorMsg(isHe ? "סיסמת המאסטר חייבת להכיל לפחות 8 תווים." : "Master passphrase must be 8+ characters."); return; }
    try {
      if (!blob) {
        const genRec = generateStrongPassword(24);
        setRecoveryKey(genRec);
        const fresh = await encryptVaultJson(JSON.stringify([]), passphrase, cipherAlgo, genRec);
        localStorage.setItem(storageKey, JSON.stringify(fresh));
        setBlob(fresh); setEntries([]); setUnlocked(true);
        setInfoMsg(isHe ? "הכספת הוקמה! שמור את קוד השחזור האישי שלך המוצג מטה." : "Vault initialized! Save your Personal Recovery Code shown below.");
      } else {
        const plain = await decryptVaultJson(blob, passphrase);
        setEntries(JSON.parse(plain)); setUnlocked(true);
        setInfoMsg(isHe ? "הכספת פוענחה בהצלחה בדפדפן שלך בלבד." : "Vault decrypted locally.");
      }
    } catch { setErrorMsg(isHe ? "סיסמת מאסטר שגויה — לא ניתן לפענח." : "Wrong master passphrase."); }
  };

  const handleChangeVaultPassword = async () => {
    setErrorMsg(""); setInfoMsg("");
    if (!blob || newPassInput.trim().length < 8) { setErrorMsg(isHe ? "הזן סיסמה חדשה בת 8 תווים לפחות." : "New password must be 8+ chars."); return; }
    try {
      const verifiedPlain = await decryptVaultJson(blob, oldPassInput);
      const parsed: VaultEntry[] = JSON.parse(verifiedPlain);
      setPassphrase(newPassInput);
      await persistEncrypted(parsed, newPassInput, cipherAlgo, recoveryKey);
      setOldPassInput(""); setNewPassInput(""); setShowSecurityPanel(false);
      setInfoMsg(isHe ? `סיסמת הכספת שונתה והוצפנה מחדש ב-${cipherAlgo} 256-bit ✓` : `Vault password changed & re-encrypted with ${cipherAlgo} 256-bit ✓`);
    } catch { setErrorMsg(isHe ? "הסיסמה הקודמת שהזנת שגויה." : "Previous password is incorrect."); }
  };

  const handleRecoverVault = async () => {
    setErrorMsg(""); setInfoMsg("");
    if (!blob || recNewPass.trim().length < 8 || recUserCode.trim().length < 12) { setErrorMsg(isHe ? "הזן קוד שחזור אישי תקין וסיסמה חדשה (8+ תווים)." : "Enter valid personal recovery key & new password."); return; }
    try {
      if (recAdminCode.trim()) {
        const { data } = await supabase.from("site_settings").select("value").eq("key", "vault_recovery_auth").single();
        if (!data?.value || data.value.code !== recAdminCode.trim()) { setErrorMsg(isHe ? "קוד אישור האדמין שגוי או פג תוקף." : "Invalid Admin Recovery Auth code."); return; }
      }
      const recoveredPlain = await recoverVaultWithCode(blob, recUserCode);
      const parsed: VaultEntry[] = JSON.parse(recoveredPlain);
      setPassphrase(recNewPass);
      await persistEncrypted(parsed, recNewPass, cipherAlgo, recUserCode);
      setUnlocked(true); setShowRecoverBox(false);
      setInfoMsg(isHe ? "הכספת שוחזרה בהצלחה וסיסמת המאסטר החדשה הוגדרה!" : "Vault recovered & new master passphrase set!");
    } catch { setErrorMsg(isHe ? "שחזור נכשל — בדוק את קוד השחזור האישי." : "Recovery failed — check your Personal Recovery Code."); }
  };
  const handleSaveEntry = async () => {
    if (!title.trim() || !secretValue.trim()) return;
    const cleanAction = actionUrl.trim() ? (actionUrl.trim().startsWith("http") ? actionUrl.trim() : `https://${actionUrl.trim()}`) : "";
    if (editingId) {
      await persistEncrypted(entries.map((item) => item.id === editingId ? { ...item, title: title.trim(), category, targetAsset: targetAsset.trim() || "General", originSource: originSource.trim() || "Manual", actionUrl: cleanAction, secretValue: secretValue.trim() } : item));
      setEditingId(null); setExternalTask(null);
      setInfoMsg(isHe ? "הפריט עודכן והוצפן מחדש בכספת." : "Entry updated & re-encrypted.");
    } else {
      const item: VaultEntry = { id: `sec-${Date.now()}`, title: title.trim(), category, targetAsset: targetAsset.trim() || (isHe ? "כללי" : "General"), originSource: originSource.trim() || (isHe ? "הזנה ידנית" : "Manual"), actionUrl: cleanAction, secretValue: secretValue.trim(), createdAt: new Date().toISOString() };
      await persistEncrypted([item, ...entries]);
      setInfoMsg(isHe ? "הפריט הוצפן יחד עם כל ההקשר שלו ונשמר." : "Entry & context encrypted and saved.");
    }
    setTitle(""); setTargetAsset(""); setOriginSource(""); setActionUrl(""); setSecretValue("");
  };

  const rotateItemPassword = async (id: string) => {
    const freshPw = generateStrongPassword(20);
    await persistEncrypted(entries.map((x) => (x.id === id ? { ...x, secretValue: freshPw } : x)));
    setRevealedIds({ ...revealedIds, [id]: true });
    navigator.clipboard?.writeText(freshPw);
    setInfoMsg(isHe ? "נוצרה סיסמה חזקה חדשה, הוצפנה בכרטיס והועתקה ללוח!" : "New 20-char password generated, saved & copied!");
  };

  const startEditEntry = (item: VaultEntry) => { setEditingId(item.id); setTitle(item.title); setCategory(item.category); setTargetAsset(item.targetAsset); setOriginSource(item.originSource); setActionUrl(item.actionUrl); setSecretValue(item.secretValue); };
  const cleanCell = (v: string) => (v || "").replace(/[\r\n\t]+/g, " ").trim();
  const buildGoogleSheetsTable = (sep: "\t" | ",") => {
    const catHe: Record<VaultCategory, string> = { crypto_seed: "ארנק קריפטו (12/24 מילים)", api_secrets: "מפתחות API וסודות", passwords: "סיסמאות וחשבונות", project_memory: "זיכרון והקשר פרויקט" };
    const catEn: Record<VaultCategory, string> = { crypto_seed: "Crypto Seed (12/24)", api_secrets: "API & Dev Secrets", passwords: "Passwords", project_memory: "Project Memory" };
    const headers = exportLang === "he" ? ["שם הפריט", "קטגוריה", "שייך לנכס", "מקור הפריט", "הסוד / הרמז המוצפן", "קישור פעולה", "תאריך"] : exportLang === "en" ? ["Item Title", "Category", "Target Asset", "Origin Source", "Secret / Clue", "Action URL", "Date"] : ["שם הפריט / Title", "קטגוריה / Category", "שייך לנכס / Asset", "מקור / Origin", "הסוד / Secret", "קישור / URL", "תאריך / Date"];
    const rows = entries.map((e) => { const catCell = exportLang === "he" ? catHe[e.category] : exportLang === "en" ? catEn[e.category] : `${catHe[e.category]} | ${catEn[e.category]}`; return [e.title, catCell, e.targetAsset, e.originSource, e.secretValue, e.actionUrl || "-", e.createdAt.slice(0, 10)].map((c) => sep === "," ? `"${cleanCell(c).replace(/"/g, '""')}"` : cleanCell(c)).join(sep); });
    return [headers.join(sep), ...rows].join("\n");
  };
  const copyForGoogleSheets = () => { navigator.clipboard?.writeText(buildGoogleSheetsTable("\t")); setCopiedId("gsheets"); setTimeout(() => setCopiedId(""), 2500); setInfoMsg(isHe ? "הטבלה הועתקה! פתח Google Sheets ולחץ Ctrl+V." : "Table copied! Press Ctrl+V in Google Sheets."); };
  const downloadUtf8BomCsv = () => { const url = URL.createObjectURL(new Blob(["\uFEFF" + buildGoogleSheetsTable(",")], { type: "text/csv;charset=utf-8;" })); const a = document.createElement("a"); a.href = url; a.download = `tanami360-vault-${exportLang}.csv`; a.click(); };
  const lockVaultNow = () => { setUnlocked(false); setEntries([]); setPassphrase(""); setRevealedIds({}); setEditingId(null); setExternalTask(null); setInfoMsg(isHe ? "הכספת ננעלה והזיכרון נוקה." : "Vault locked & memory cleared."); };
  const copyStr = (val: string, id: string) => { navigator.clipboard?.writeText(val); setCopiedId(id); setTimeout(() => setCopiedId(""), 2200); };
  const exportEncryptedBackup = () => { if (!blob) return; const url = URL.createObjectURL(new Blob([JSON.stringify(blob, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = "tanami360-zk-vault-backup.json"; a.click(); };
  const shareVaultText = isHe ? `כלי אבטחה חינמי ושימושי: כספת Zero-Knowledge מוצפנת (AES-256) לשמירת סיסמאות, מפתחות וביטויי 12/24 מילים של קריפטו עם הקשר מלא + ייצוא ל-Google Sheets:\n${subDomain}/vault` : `Free Zero-Knowledge AES-256 Vault with full context, personal cipher clues & Google Sheets export:\n${subDomain}/vault`;
  const catLabels: Record<VaultCategory, string> = isHe ? { crypto_seed: "ארנק קריפטו (12/24 מילים)", api_secrets: "מפתחות API וסודות", passwords: "סיסמאות וחשבונות", project_memory: "זיכרון והקשר פרויקט" } : { crypto_seed: "Crypto Seed (12/24)", api_secrets: "API & Dev Secrets", passwords: "Passwords & Logins", project_memory: "Project Memory" };
  const visibleEntries = entries.filter((e) => (filterCat === "all" || e.category === filterCat) && (!searchQ.trim() || `${e.title} ${e.targetAsset} ${e.originSource}`.toLowerCase().includes(searchQ.trim().toLowerCase())));
  const waShareUrl = "https://" + "://whatsapp.com" + "/send?text=" + encodeURIComponent(shareVaultText);
  const liShareUrl = "https://" + "://linkedin.com" + "/sharing/share-offsite/?url=" + encodeURIComponent(`${subDomain}/vault`);
  const renderSecretDisplay = (item: VaultEntry) => {
    if (item.category === "crypto_seed") {
      const words = item.secretValue.split(/[\s,]+/).filter(Boolean);
      return (<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(95px, 1fr))", gap: 6, marginTop: 6 }}>{words.map((w, idx) => (<div key={idx} style={{ padding: "5px 8px", borderRadius: 6, background: "#05070a", border: "1px solid rgba(52,211,153,0.25)", fontFamily: "monospace", fontSize: "0.85em", color: "#34d399" }}><span style={{ color: "#64748b", marginInlineEnd: 4 }}>#{idx + 1}</span>{w}</div>))}</div>);
    }
    return <div style={{ marginTop: 6, padding: "8px 10px", borderRadius: 8, background: "#05070a", fontFamily: "monospace", fontSize: "0.88em", color: "#34d399", wordBreak: "break-all" }}>{item.secretValue}</div>;
  };

  return (
    <section dir={isHe ? "rtl" : "ltr"} className="card-hero" style={{ padding: 20, marginBottom: 20, border: `1px solid ${a11yHighContrast ? "#ffffff" : "rgba(251,191,36,0.38)"}`, background: a11yHighContrast ? "#000000" : undefined, zoom: `${fontScale}%`, textAlign: isHe ? "right" : "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, paddingBottom: 10, marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span className="badge-pill" style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 11 }}><KeyRound size={12} /> {isHe ? `כספת ${cipherAlgo} 256-bit` : `ZERO-KNOWLEDGE ${cipherAlgo}`}</span>
          <button type="button" onClick={switchVaultLanguage} className="btn-ghost" style={{ height: 32, padding: "0 11px", fontSize: 11.5, color: "#38bdf8", borderColor: "rgba(56,189,248,0.4)" }}><Globe size={12} /> {isHe ? "English" : "עברית"}</button>
          {!standalone && <a href="/vault" className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#34d399" }}><ExternalLink size={11} /> {isHe ? "מצב מסך נקי" : "Standalone"}</a>}
          {unlocked && <button type="button" onClick={() => setShowHelperDeck(!showHelperDeck)} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#fbbf24" }}>{showHelperDeck ? (isHe ? "סגור תבניות ורמזים" : "Hide Templates") : (isHe ? "תבניות ורמזי הצפנה" : "Templates & Clues")}</button>}
          {unlocked && <button type="button" onClick={() => setShowSecurityPanel(!showSecurityPanel)} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}><Sliders size={11} /> {isHe ? "סיסמת כספת והצפנה" : "Vault Cipher & Password"}</button>}
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
          <Accessibility size={13} color="#94a3b8" />
          <button type="button" onClick={() => setFontScale((s) => Math.max(85, s - 15))} className="btn-ghost" style={{ height: 30, padding: "0 8px", fontSize: 11 }}>A-</button>
          <button type="button" onClick={() => setFontScale(100)} className="btn-ghost" style={{ height: 30, padding: "0 8px", fontSize: 11, color: fontScale !== 100 ? "#38bdf8" : undefined }}><RotateCcw size={11} /> {fontScale}%</button>
          <button type="button" onClick={() => setFontScale((s) => Math.min(145, s + 15))} className="btn-ghost" style={{ height: 30, padding: "0 8px", fontSize: 11 }}>A+</button>
          <button type="button" onClick={() => setA11yHighContrast(!a11yHighContrast)} className="btn-ghost" style={{ height: 30, padding: "0 9px", fontSize: 11 }}>{isHe ? "ניגודיות" : "Contrast"}</button>
          {unlocked && <button type="button" onClick={lockVaultNow} className="btn-primary" style={{ height: 30, padding: "0 10px", fontSize: 11, width: "auto", background: "#fbbf24", color: "#0a0b0e" }}><Lock size={11} /> {isHe ? "נעל" : "Lock"}</button>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, alignItems: "center", padding: 14, borderRadius: 14, background: "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,27,75,0.55))", border: "1px solid rgba(56,189,248,0.28)", marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 18.5, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{isHe ? "כספת חכמה עם זיכרון מלא, מחולל סיסמאות וייצוא ל-Google Sheets" : "Context-Rich Vault, Built-in Password Generator & Google Sheets Export"}</h2>
          <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>{isHe ? "הצפנה מקומית בדפדפן (AES-GCM / AES-CBC 256-bit), מחולל סיסמאות מובנה בכל פריט, רמזי הצפנה אישיים, ומנגנון שחזור כפול ללא חשיפת מידע." : "Client-side 256-bit encryption, instant password generator per item, personal cipher clues & zero-knowledge recovery."}</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            <a href={mainDomain} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11 }}>{isHe ? "פורטל Tanami360" : "Tanami360 Portal"} <ArrowUpRight size={11} /></a>
            <a href={`${mainDomain}/upload`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11 }}>{isHe ? "מילוי PDF חינם" : "Free PDF Filler"} <ArrowUpRight size={11} /></a>
            <a href={`${mainDomain}/studio`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11 }}>{isHe ? "הסטודיו לפיתוח" : "Engineering Studio"} <ArrowUpRight size={11} /></a>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
          <img src="/vault/vault-hero.png" alt="AES-256 Vault" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} style={{ width: "62%", maxHeight: 155, objectFit: "contain", background: "rgba(5,7,10,0.6)", padding: 6, borderRadius: 12, border: "1px solid rgba(56,189,248,0.35)" }} />
          <img src="/vault/vault-context.png" alt="Context Pin Vault" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} style={{ width: "35%", maxHeight: 155, objectFit: "contain", background: "rgba(5,7,10,0.6)", padding: 6, borderRadius: 12, border: "1px solid rgba(168,85,247,0.35)" }} />
        </div>
      </div>

      {externalTask && (
        <div style={{ padding: 12, borderRadius: 12, background: "rgba(251,191,36,0.14)", border: "1px solid rgba(251,191,36,0.45)", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, color: "#fef3c7" }}><strong>{isHe ? "משימה פעילה מחוץ לכספת:" : "Active External Task:"}</strong> {externalTask.title} ({externalTask.targetAsset})</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" onClick={() => { const found = entries.find((x) => x.id === externalTask.itemId); if (found) startEditEntry(found); }} className="btn-primary" style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>{isHe ? "עדכן ערך בכספת" : "Update Entry"}</button>
            <button type="button" onClick={() => setExternalTask(null)} className="btn-ghost" style={{ height: 28, padding: "0 8px", fontSize: 11 }}>{isHe ? "סיום" : "Done"}</button>
          </div>
        </div>
      )}

      {govDisabled && <div style={{ padding: 10, borderRadius: 10, background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 12, fontWeight: 800, marginBottom: 10 }}>{isHe ? "הכספת בתחזוקה יזומה. הנתונים המוצפנים שלך שמורים בבטחה." : "Vault in scheduled maintenance."}</div>}
      {govNotice && <div style={{ padding: 10, borderRadius: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{govNotice}</div>}
      {errorMsg && <div style={{ padding: 10, borderRadius: 10, background: "rgba(248,113,113,0.15)", color: "#f87171", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{errorMsg}</div>}
      {infoMsg && <div style={{ padding: 10, borderRadius: 10, background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{infoMsg}</div>}
      {recoveryKey && unlocked && <div style={{ padding: 10, borderRadius: 10, background: "rgba(251,191,36,0.14)", border: "1px solid rgba(251,191,36,0.4)", color: "#fef3c7", fontSize: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}><span><strong>{isHe ? "קוד השחזור האישי שלך (שמור במקום בטוח):" : "Your Personal Recovery Key:"}</strong> <code>{recoveryKey}</code></span><button type="button" onClick={() => copyStr(recoveryKey, "rec-key")} className="btn-ghost" style={{ height: 26, padding: "0 8px", fontSize: 11 }}>{copiedId === "rec-key" ? "Copied!" : "Copy Key"}</button></div>}
            {showPwForge && (
        <div style={{ padding: 14, borderRadius: 14, background: "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(15,23,42,0.95))", border: "1px solid rgba(52,211,153,0.4)", marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <strong style={{ fontSize: 13.5, color: "#34d399" }}>{isHe ? "מחולל סיסמאות קריפטוגרפי חכם (Fintech Password Forge)" : "Smart Cryptographic Password Forge"}</strong>
            <span className="badge-pill" style={{ background: "rgba(52,211,153,0.16)", color: "#34d399", fontSize: 10.5 }}>{genPwLen >= 20 ? (isHe ? "חוזק: מקסימלי (256-Bit)" : "Strength: MAXIMUM") : (isHe ? "חוזק: גבוה" : "Strength: HIGH")}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <code style={{ flex: 1, minWidth: 220, padding: "8px 12px", borderRadius: 10, background: "#05070a", color: "#34d399", fontSize: 13.5, border: "1px solid rgba(52,211,153,0.3)", wordBreak: "break-all" }}>{genPwPreview}</code>
            <button type="button" onClick={() => setGenPwPreview(generateCustomPassword(genPwLen, genUseNum, genUseSym))} className="btn-ghost" style={{ height: 36, padding: "0 12px", fontSize: 12 }}><RefreshCw size={12} /> {isHe ? "חולל חדש" : "Regenerate"}</button>
            <button type="button" onClick={() => copyStr(genPwPreview, "forge-cp")} className="btn-ghost" style={{ height: 36, padding: "0 12px", fontSize: 12, color: "#38bdf8" }}><Copy size={12} /> {copiedId === "forge-cp" ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק" : "Copy")}</button>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", fontSize: 11.5, color: "#cbd5e1" }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{isHe ? "אורך:" : "Length:"} <select value={genPwLen} onChange={(e) => { const n = Number(e.target.value); setGenPwLen(n); setGenPwPreview(generateCustomPassword(n, genUseNum, genUseSym)); }} className="input-dark" style={{ height: 28, fontSize: 11, padding: "0 8px" }}><option value={12}>12</option><option value={16}>16</option><option value={20}>20</option><option value={24}>24</option><option value={32}>32</option></select></label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}><input type="checkbox" checked={genUseNum} onChange={(e) => { setGenUseNum(e.target.checked); setGenPwPreview(generateCustomPassword(genPwLen, e.target.checked, genUseSym)); }} /> {isHe ? "מספרים (0-9)" : "Numbers"}</label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}><input type="checkbox" checked={genUseSym} onChange={(e) => { setGenUseSym(e.target.checked); setGenPwPreview(generateCustomPassword(genPwLen, genUseNum, e.target.checked)); }} /> {isHe ? "סימנים (!@#$)" : "Symbols"}</label>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
            {!unlocked && <button type="button" onClick={() => { setPassphrase(genPwPreview); copyStr(genPwPreview, "forge-cp"); setInfoMsg(isHe ? "הסיסמה הוזנה כשדה מאסטר והועתקה ללוח — שמור אותה כעת!" : "Inserted as Master Passphrase & copied!"); }} className="btn-primary" style={{ height: 32, padding: "0 12px", fontSize: 11.5, width: "auto" }}>{isHe ? "השתמש כסיסמת מאסטר לכספת" : "Use as Vault Master Key"}</button>}
            {unlocked && <button type="button" onClick={() => { setSecretValue(genPwPreview); setInfoMsg(isHe ? "הסיסמה הוזנה לשדה הסוד בטופס ההוספה/עריכה!" : "Inserted into item form!"); }} className="btn-primary" style={{ height: 32, padding: "0 12px", fontSize: 11.5, width: "auto" }}>{isHe ? "הזן לטופס פריט חדש / עריכה" : "Insert into Item Form"}</button>}
            {unlocked && entries.length > 0 && (
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <select value={targetUpdateId} onChange={(e) => setTargetUpdateId(e.target.value)} className="input-dark" style={{ height: 32, fontSize: 11, padding: "0 8px" }}>
                  <option value="">{isHe ? "בחר פריט קיים לעדכון סיסמה..." : "Select existing item to update..."}</option>
                  {entries.map((it) => (<option key={it.id} value={it.id}>{it.title} ({it.targetAsset})</option>))}
                </select>
                {targetUpdateId && <button type="button" onClick={async () => { await persistEncrypted(entries.map((x) => x.id === targetUpdateId ? { ...x, secretValue: genPwPreview } : x)); setRevealedIds({ ...revealedIds, [targetUpdateId]: true }); setInfoMsg(isHe ? "הסיסמה של הפריט עודכנה והוצפנה בכספת ✓" : "Item password updated & encrypted ✓"); }} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#fbbf24" }}>{isHe ? "עדכן ושמור בפריט הנבחר" : "Save to Selected Item"}</button>}
              </div>
            )}
          </div>
        </div>
      )}
      {!unlocked ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <select value={cipherAlgo} onChange={(e) => setCipherAlgo(e.target.value as CipherAlgo)} className="input-dark" style={{ height: 40, fontSize: 12, padding: "0 10px" }}><option value="AES-GCM">AES-GCM 256-bit</option><option value="AES-CBC">AES-CBC 256-bit</option></select>
            <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder={blob ? (isHe ? "הזן סיסמת מאסטר לפענוח הכספת..." : "Enter master passphrase...") : (isHe ? "בחר סיסמת מאסטר (8+ תווים) ליצירת כספת..." : "Create master passphrase (8+ chars)...")} className="input-dark" style={{ flex: 1, minWidth: 210, height: 40, fontSize: 13 }} />
            <button type="button" onClick={handleUnlockOrCreate} className="btn-primary" style={{ height: 40, padding: "0 18px", fontSize: 12.5, width: "auto" }}><Unlock size={14} /> {blob ? (isHe ? "פענח ופתח כספת" : "Decrypt & Unlock") : (isHe ? "צור כספת מוצפנת בחינם" : "Create Free Vault")}</button>
            <button type="button" onClick={() => { setGenPwPreview(generateCustomPassword(genPwLen, genUseNum, genUseSym)); setShowPwForge(!showPwForge); }} className="btn-ghost" style={{ height: 40, padding: "0 14px", fontSize: 12.5, color: "#34d399", borderColor: "rgba(52,211,153,0.45)" }}><RefreshCw size={13} /> {isHe ? "מחולל סיסמאות" : "Password Forge"}</button>
            {blob && <button type="button" onClick={() => setShowRecoverBox(!showRecoverBox)} className="btn-ghost" style={{ height: 40, padding: "0 12px", fontSize: 12, color: "#fbbf24" }}>{isHe ? "שכחתי סיסמה / שחזור" : "Recover Vault"}</button>}
          </div>
          {showRecoverBox && blob && (
            <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.35)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
              <input value={recUserCode} onChange={(e) => setRecUserCode(e.target.value)} placeholder={isHe ? "קוד שחזור אישי (24 תווים)" : "Personal Recovery Code (24 chars)"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
              <input value={recAdminCode} onChange={(e) => setRecAdminCode(e.target.value)} placeholder={isHe ? "קוד אישור אדמין (אופציונלי)" : "Admin Auth Code (optional)"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
              <input type="password" value={recNewPass} onChange={(e) => setRecNewPass(e.target.value)} placeholder={isHe ? "סיסמת מאסטר חדשה (8+ תווים)" : "New Master Passphrase"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
              <button type="button" onClick={handleRecoverVault} className="btn-primary" style={{ height: 36, fontSize: 12, width: "auto" }}><ShieldCheck size={13} /> {isHe ? "שחזר כספת והגדר סיסמה" : "Recover & Reset"}</button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
          {showSecurityPanel && (
            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.35)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 8, alignItems: "center" }}>
              <select value={cipherAlgo} onChange={(e) => setCipherAlgo(e.target.value as CipherAlgo)} className="input-dark" style={{ height: 34, fontSize: 12 }}><option value="AES-GCM">AES-GCM 256-bit (Recommended)</option><option value="AES-CBC">AES-CBC 256-bit</option></select>
              <input type="password" value={oldPassInput} onChange={(e) => setOldPassInput(e.target.value)} placeholder={isHe ? "סיסמת כספת נוכחית..." : "Current Vault Password..."} className="input-dark" style={{ height: 34, fontSize: 12 }} />
              <input type="password" value={newPassInput} onChange={(e) => setNewPassInput(e.target.value)} placeholder={isHe ? "סיסמת כספת חדשה (8+ תווים)..." : "New Vault Password (8+ chars)..."} className="input-dark" style={{ height: 34, fontSize: 12 }} />
              <button type="button" onClick={handleChangeVaultPassword} className="btn-primary" style={{ height: 34, fontSize: 12, width: "auto" }}>{isHe ? "שנה סיסמה והצפן מחדש" : "Change Password & Re-Encrypt"}</button>
            </div>
          )}
          {showHelperDeck && (
            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.3)", display: "flex", flexDirection: "column", gap: 8 }}>
              <strong style={{ fontSize: 12, color: "#fbbf24" }}>{isHe ? "תבניות מהירות למפתחים וליום-יום:" : "Quick Dev & Daily Templates:"}</strong>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{VAULT_QUICK_TEMPLATES.map((tpl) => (<button key={tpl.id} type="button" onClick={() => { setTitle(isHe ? tpl.labelHe : tpl.labelEn); setCategory(tpl.category); setTargetAsset(tpl.targetAsset); setOriginSource(tpl.originSource); setActionUrl(tpl.actionUrl); }} className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11 }}>{isHe ? tpl.labelHe : tpl.labelEn}</button>))}</div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#38bdf8" }}>{isHe ? "הצפנת רמז אישי (לחץ להזנה):" : "Personal Cipher Clue Ideas:"}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{PERSONAL_CIPHER_CLUES.map((cl, i) => (<button key={i} type="button" onClick={() => setSecretValue(isHe ? cl.he : cl.en)} className="btn-ghost" style={{ height: "auto", padding: "4px 9px", fontSize: 10.5, textAlign: isHe ? "right" : "left" }}>{isHe ? cl.he : cl.en}</button>))}</div>
            </div>
          )}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))", gap: 10, padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.28)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label onClick={() => setActiveFieldHelp(isHe ? "בחר את סוג הנכס (ארנק קריפטו, מפתח API, סיסמה או זיכרון פרויקט)" : "Select item category")} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} title={isHe ? "בחר את סוג הנכס (ארנק קריפטו, מפתח API, סיסמה או זיכרון פרויקט)" : "Select item category"}><Info size={12} color="#38bdf8" /> {isHe ? "סוג הפריט (קטגוריה)" : "Category"}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as VaultCategory)} className="input-dark" style={{ height: 38, fontSize: 12.5, padding: "0 10px" }}>{(Object.keys(catLabels) as VaultCategory[]).map((k) => (<option key={k} value={k}>{catLabels[k]}</option>))}</select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label onClick={() => setActiveFieldHelp(isHe ? "שם מזהה ברור לפריט (למשל: ארנק Ledger ראשי או מפתח Supabase)" : "Clear title for this item")} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} title={isHe ? "שם מזהה ברור לפריט (למשל: ארנק Ledger ראשי או מפתח Supabase)" : "Clear title for this item"}><Info size={12} color="#38bdf8" /> {isHe ? "שם הפריט לזיהוי" : "Item Title"}</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isHe ? "למשל: ארנק MetaMask / כניסה לבנק" : "e.g. MetaMask / Bank Login"} className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label onClick={() => setActiveFieldHelp(isHe ? "לאיזה אתר, רשת בלוקצ'יין או פרויקט הפריט הזה שייך" : "Which project, website or network this belongs to")} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} title={isHe ? "לאיזה אתר, רשת בלוקצ'יין או פרויקט הפריט הזה שייך" : "Which project, website or network this belongs to"}><Info size={12} color="#38bdf8" /> {isHe ? "לאיזה נכס / פרויקט שייך?" : "Target Asset / Network"}</label>
              <input value={targetAsset} onChange={(e) => setTargetAsset(e.target.value)} placeholder={isHe ? "למשל: רשת Ethereum / פרויקט Tanami360" : "e.g. Ethereum / Tanami360"} className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label onClick={() => setActiveFieldHelp(isHe ? "תיעוד איך ומאיפה קיבלת את המפתח/סיסמה (למשל: הופק באפליקציה, נשלח במייל אימות)" : "Where and how you obtained this secret")} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} title={isHe ? "תיעוד איך ומאיפה קיבלת את המפתח/סיסמה (למשל: הופק באפליקציה, נשלח במייל אימות)" : "Where and how you obtained this secret"}><Info size={12} color="#38bdf8" /> {isHe ? "מקור: מאיפה ואיך התקבל?" : "Origin: How Obtained?"}</label>
              <input value={originSource} onChange={(e) => setOriginSource(e.target.value)} placeholder={isHe ? "למשל: הופק בדשבורד Vercel / אפליקציית ארנק" : "e.g. Generated in Vercel / Wallet App"} className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label onClick={() => setActiveFieldHelp(isHe ? "קישור ישיר לאתר היעד שבו משתמשים בפריט (מפעיל מעקב חזרה אוטומטי)" : "Direct target URL for 1-click launch & return tracking")} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} title={isHe ? "קישור ישיר לאתר היעד שבו משתמשים בפריט (מפעיל מעקב חזרה אוטומטי)" : "Direct target URL for 1-click launch & return tracking"}><Info size={12} color="#38bdf8" /> {isHe ? "קישור פעולה ישיר (אופציונלי)" : "Direct Action URL"}</label>
              <input value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} placeholder="https://..." className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label onClick={() => setActiveFieldHelp(isHe ? "הסיסמה, 12/24 מילים של ארנק קריפטו, או רמז הצפנה אישי שרק אתה מבין" : "Password, 12/24 seed words, or personal cipher clue")} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} title={isHe ? "הסיסמה, 12/24 מילים של ארנק קריפטו, או רמז הצפנה אישי שרק אתה מבין" : "Password, 12/24 seed words, or personal cipher clue"}><Info size={12} color="#34d399" /> {isHe ? "הסוד / סיסמה / רמז הצפנה" : "Secret / Password / Clue"}</label>
              <div style={{ display: "flex", gap: 5 }}><input type="text" value={secretValue} onChange={(e) => setSecretValue(e.target.value)} placeholder={category === "crypto_seed" ? (isHe ? "הדבק 12 או 24 מילים..." : "Paste 12/24 words...") : (isHe ? "הזן ערך או לחץ לחולל ->" : "Enter value or generate ->")} className="input-dark" style={{ flex: 1, height: 38, fontSize: 12.5 }} /><button type="button" onClick={() => { setSecretValue(generateCustomPassword(genPwLen, genUseNum, genUseSym)); setInfoMsg(isHe ? "חוללה סיסמה חזקה!" : "Strong password generated!"); }} className="btn-ghost" style={{ height: 38, padding: "0 10px", fontSize: 11, color: "#34d399" }} title="Generate Strong Password"><RefreshCw size={13} /></button></div>
            </div>
            {activeFieldHelp && <div style={{ gridColumn: "1 / -1", padding: "8px 12px", borderRadius: 10, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.35)", fontSize: 12, color: "#e0f2fe" }}>ℹ️ {activeFieldHelp}</div>}
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="button" onClick={handleSaveEntry} className="btn-primary" style={{ height: 38, fontSize: 12.5, width: "100%" }}><Plus size={14} /> {editingId ? (isHe ? "עדכן והצפן בכספת" : "Update & Encrypt") : (isHe ? "הצפן ושמור בכספת" : "Encrypt & Save")}</button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: 10, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.25)" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: "#34d399" }}>{isHe ? "ייצוא:" : "Export:"}</span>
              <select value={exportLang} onChange={(e) => setExportLang(e.target.value as "he" | "en" | "both")} className="input-dark" style={{ height: 30, fontSize: 11, padding: "0 8px" }}><option value="he">{isHe ? "עברית (HE)" : "Hebrew (HE)"}</option><option value="en">{isHe ? "אנגלית (EN)" : "English (EN)"}</option><option value="both">{isHe ? "דו-לשוני (HE+EN)" : "Bilingual"}</option></select>
              <button type="button" onClick={copyForGoogleSheets} className="btn-primary" style={{ height: 30, padding: "0 11px", fontSize: 11, width: "auto" }}><FileSpreadsheet size={12} /> {copiedId === "gsheets" ? (isHe ? "הועתק!" : "Copied!") : "Google Sheets"}</button>
              <button type="button" onClick={downloadUtf8BomCsv} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}><Download size={11} /> CSV</button>
              <button type="button" onClick={() => window.print()} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11 }}><Printer size={11} /> {isHe ? "הדפסה" : "Print"}</button>
              <button type="button" onClick={exportEncryptedBackup} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#fbbf24" }}>JSON</button>
            </div>
            <div style={{ position: "relative", minWidth: 170 }}><Search size={12} color="#94a3b8" style={{ position: "absolute", left: 10, top: 9 }} /><input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder={isHe ? "חיפוש..." : "Search..."} className="input-dark" style={{ height: 30, paddingLeft: 28, fontSize: 11.5, width: "100%" }} /></div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setFilterCat("all")} className={filterCat === "all" ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>{isHe ? `הכל (${entries.length})` : `All (${entries.length})`}</button>
            {(Object.keys(catLabels) as VaultCategory[]).map((k) => (<button key={k} type="button" onClick={() => setFilterCat(k)} className={filterCat === k ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>{catLabels[k]}</button>))}
          </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visibleEntries.map((item) => {
              const isShown = Boolean(revealedIds[item.id]);
              const isExpanded = Boolean(expandedIds[item.id]);
              return (
                <div key={item.id} style={{ borderRadius: 12, background: "#0a0b0e", border: `1px solid ${isExpanded ? "rgba(56,189,248,0.45)" : "rgba(255,255,255,0.10)"}`, overflow: "hidden" }}>
                  <div onClick={() => setExpandedIds({ ...expandedIds, [item.id]: !isExpanded })} style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, cursor: "pointer", background: isExpanded ? "rgba(56,189,248,0.06)" : "transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>{catLabels[item.category]}</span>
                      <strong style={{ fontSize: 14.5, color: "#f8fafc" }}>{item.title}</strong>
                      <span style={{ fontSize: 11.5, color: "#94a3b8" }}>· {item.targetAsset}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button type="button" onClick={(e) => { e.stopPropagation(); copyStr(item.secretValue, item.id); }} className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11, color: "#34d399" }}>{copiedId === item.id ? <CheckCircle2 size={11} /> : <Copy size={11} />} {copiedId === item.id ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק מהיר" : "Quick Copy")}</button>
                      {isExpanded ? <ChevronUp size={16} color="#38bdf8" /> : <ChevronDown size={16} color="#94a3b8" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8, fontSize: 12, color: "#cbd5e1" }}>
                        <div><strong style={{ color: "#94a3b8" }}>{isHe ? "שייך לנכס / רשת:" : "Target Asset:"}</strong> {item.targetAsset}</div>
                        <div><strong style={{ color: "#94a3b8" }}>{isHe ? "מקור (מאיפה התקבל):" : "Origin Source:"}</strong> {item.originSource}</div>
                        <div><strong style={{ color: "#94a3b8" }}>{isHe ? "נוצר בתאריך:" : "Created:"}</strong> {item.createdAt.slice(0, 10)}</div>
                      </div>
                      {isShown ? renderSecretDisplay(item) : <div style={{ padding: "8px 12px", borderRadius: 8, background: "#05070a", fontFamily: "monospace", fontSize: 12.5, color: "#64748b" }}>••••••••••••••••••••••••••••••••</div>}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 4 }}>
                        <button type="button" onClick={() => setRevealedIds({ ...revealedIds, [item.id]: !isShown })} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>{isShown ? <EyeOff size={12} /> : <Eye size={12} />} {isShown ? (isHe ? "הסתר ערך" : "Hide") : (isHe ? "חשוף ערך" : "Reveal")}</button>
                        <button type="button" onClick={() => copyStr(item.secretValue, item.id)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#34d399" }}><Copy size={12} /> {isHe ? "העתק סוד" : "Copy Secret"}</button>
                        <button type="button" onClick={() => copyStr(`${item.title} | ${item.targetAsset} | ${item.originSource} -> ${item.secretValue}`, `ctx-${item.id}`)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>{copiedId === `ctx-${item.id}` ? (isHe ? "הקשר הועתק!" : "Context Copied!") : (isHe ? "העתק הקשר מלא" : "Copy Full Context")}</button>
                        <button type="button" onClick={() => rotateItemPassword(item.id)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#fbbf24" }}><RefreshCw size={12} /> {isHe ? "החלף לסיסמה חדשה" : "Rotate Password"}</button>
                        <button type="button" onClick={() => startEditEntry(item)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#38bdf8" }}><Edit3 size={12} /> {isHe ? "ערוך פריט" : "Edit"}</button>
                        {item.actionUrl && <a href={item.actionUrl} target="_blank" rel="noopener noreferrer" onClick={() => setExternalTask({ itemId: item.id, title: item.title, targetAsset: item.targetAsset, url: item.actionUrl })} className="btn-primary" style={{ height: 30, padding: "0 12px", fontSize: 11.5, width: "auto" }}><ExternalLink size={12} /> {isHe ? "פתח יעד + מעקב חזרה" : "Open & Track"}</a>}
                        <button type="button" onClick={() => persistEncrypted(entries.filter((x) => x.id !== item.id))} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#f87171" }}><Trash2 size={12} /> {isHe ? "מחק" : "Delete"}</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div style={{ padding: 12, borderRadius: 12, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 11.5, color: "#cbd5e1" }}><strong style={{ color: "#34d399" }}>{isHe ? "שתף את הכספת החינמית בעולם:" : "Share Free Vault Globally:"}</strong> {isHe ? "הפץ את הכספת המוצפנת למשתמשים ומפתחים בישראל ובעולם (עברית + English)." : "Share standalone Zero-Knowledge Vault worldwide."}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><button type="button" onClick={() => copyStr(shareVaultText, "share-vault")} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#34d399" }}><Share2 size={12} /> {copiedId === "share-vault" ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק פוסט שיתוף" : "Copy Share Post")}</button><a href={waShareUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 30, padding: "0 9px", fontSize: 11 }}>WhatsApp</a><a href={liShareUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 30, padding: "0 9px", fontSize: 11 }}>LinkedIn</a></div>
      </div>
    </section>
  );
}