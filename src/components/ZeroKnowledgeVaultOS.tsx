"use client";
import React, { useEffect, useState } from "react";
import VaultSecurityAndBackupAcademy from "@/components/VaultSecurityAndBackupAcademy";
import { Accessibility, CheckCircle2, ChevronDown, ChevronUp, Copy, Edit3, Eye, EyeOff, FileSpreadsheet, FolderLock, Globe, KeyRound, Lock, Plus, Printer, RefreshCw, RotateCcw, ShieldCheck, Unlock } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";
import { supabase } from "@/lib/supabase";
import { CipherAlgo, decryptVaultJson, EncryptedVaultBlob, encryptVaultJson, recoverVaultWithCode } from "@/lib/zero-knowledge-crypto";
import { generateCustomPassword, VAULT_QUICK_TEMPLATES } from "@/lib/vault-templates-engine";
import { VaultResetTicket } from "@/lib/vault-admin-sync";

export type VaultCategory = "crypto_seed" | "api_secrets" | "passwords" | "project_memory";
export type SubVaultLockMode = "master_only" | "custom_pin" | "memory_riddle";

export interface SubVaultFolder {
  id: string; nameHe: string; nameEn: string;
  lockMode: SubVaultLockMode;
  riddleQuestion?: string;
  lockSecretHash?: string;
}

export interface VaultEntry {
  id: string; subVaultId: string; title: string; category: VaultCategory;
  targetAsset: string; originSource: string; actionUrl: string;
  secretValue: string; purposeNote?: string; createdAt: string;
}

export default function ZeroKnowledgeVaultOS({ userId }: { userId?: string | null; standalone?: boolean }) {
  const { isHe: globalHe, toggleLang } = useStudioLang();
  const [localLang, setLocalLang] = useState<"he" | "en" | null>(null);
  const isHe = localLang ? localLang === "he" : true;
  const subDomain = "https://" + "studio" + ".tanami360.com";
  const storageKey = `pc_zk_vault_v2_${userId || "universal"}`;

  const defaultFolders: SubVaultFolder[] = [
    { id: "general", nameHe: "כללי ואתרים", nameEn: "General & Logins", lockMode: "master_only" },
    { id: "crypto", nameHe: "ארנקי קריפטו (12/24 מילים)", nameEn: "Crypto Seeds", lockMode: "master_only" },
    { id: "dev", nameHe: "פיתוח, שרתים ו-API", nameEn: "Dev & API Keys", lockMode: "master_only" }
  ];

  const [blob, setBlob] = useState<EncryptedVaultBlob | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [showMasterPass, setShowMasterPass] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [cipherAlgo, setCipherAlgo] = useState<CipherAlgo>("AES-GCM");
  const [unlocked, setUnlocked] = useState(false);

  const [subVaults, setSubVaults] = useState<SubVaultFolder[]>(defaultFolders);
  const [activeSubId, setActiveSubId] = useState("general");
  const [unlockedSubIds, setUnlockedSubIds] = useState<Record<string, boolean>>({ general: true, crypto: true, dev: true });
  const [subUnlockInput, setSubUnlockInput] = useState("");

  const [showNewSubForm, setShowNewSubForm] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubMode, setNewSubMode] = useState<SubVaultLockMode>("master_only");
  const [newSubQuestion, setNewSubQuestion] = useState("");
  const [newSubAnswer, setNewSubAnswer] = useState("");

  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"items" | "add" | "tools" | "security">("items");
  const [vaultPersona, setVaultPersona] = useState<"personal" | "dev">("personal");
  const [searchQ, setSearchQ] = useState("");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [govNotice, setGovNotice] = useState("");
  const [govDisabled, setGovDisabled] = useState(false);
  const [requireAdminReset, setRequireAdminReset] = useState(true);
  const [fontScale, setFontScale] = useState<number>(100);
  const [a11yHighContrast, setA11yHighContrast] = useState(false);
  const [exportLang, setExportLang] = useState<"he" | "en" | "both">("he");
  const [masterCertData, setMasterCertData] = useState<{ pass: string; rec: string; date: string } | null>(null);
    const [showSmartGuide, setShowSmartGuide] = useState(false);
  const [reqEmail, setReqEmail] = useState("");
  const [installPromptEvt, setInstallPromptEvt] = useState<{ prompt: () => Promise<void> } | null>(null);
  const [showEntryForge, setShowEntryForge] = useState(false);
  const [genPwLen, setGenPwLen] = useState(20);
  const [genUseNum, setGenUseNum] = useState(true);
  const [genUseSym, setGenUseSym] = useState(true);
  const [isMemoryCipher, setIsMemoryCipher] = useState(false);
  const [activeFieldHelp, setActiveFieldHelp] = useState("");
  const [preFlightItem, setPreFlightItem] = useState<VaultEntry | null>(null);
  const [externalTask, setExternalTask] = useState<{ title: string; targetAsset: string } | null>(null);
  const [genPwPreview, setGenPwPreview] = useState<string>(() => generateCustomPassword(20, true, true));

  const [showRecoverBox, setShowRecoverBox] = useState(false);
  const [oldPassInput, setOldPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");
  const [recUserCode, setRecUserCode] = useState("");
  const [recAdminCode, setRecAdminCode] = useState("");
  const [recNewPass, setRecNewPass] = useState("");
  const [wipeConfirmText, setWipeConfirmText] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<VaultCategory>("passwords");
  const [targetAsset, setTargetAsset] = useState("");
  const [originSource, setOriginSource] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [secretValue, setSecretValue] = useState("");
  const [purposeNote, setPurposeNote] = useState("");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("pc_vault_lang_pref");
      if (savedLang === "he" || savedLang === "en") setLocalLang(savedLang);
      else if (typeof navigator !== "undefined") setLocalLang((navigator.language || "").toLowerCase().startsWith("he") ? "he" : "en");
      const onBip = (e: Event) => { e.preventDefault(); setInstallPromptEvt(e as unknown as { prompt: () => Promise<void> }); }; window.addEventListener("beforeinstallprompt", onBip);
      const raw = localStorage.getItem(storageKey);
      if (raw) { const parsed = JSON.parse(raw); setBlob(parsed); if (parsed.algo) setCipherAlgo(parsed.algo); }
    } catch {}
    (async () => {
      try {
        const r = await fetch("/api/vault-governance", { cache: "no-store" }); const j = await r.json(); const data = { value: j.governance };
        if (data?.value) { setGovDisabled(data.value.enabled === false); setGovNotice(data.value.notice || ""); setRequireAdminReset(data.value.requireAdminForReset !== false); }
      } catch {}
    })();
  }, [storageKey]);

  const installVaultAsApp = async () => { if (installPromptEvt) { await installPromptEvt.prompt(); setInstallPromptEvt(null); return; } setInfoMsg(isHe ? "להתקנה כאפליקציה: באנדרואיד/מחשב לחץ בתפריט הדפדפן התקן אפליקציה; באייפון לחץ שתף ואז הוסף למסך הבית." : "To install as App: tap browser menu -> Install App (or Share -> Add to Home Screen on iOS)."); };
  const switchVaultLanguage = () => { const next = isHe ? "en" : "he"; setLocalLang(next); setExportLang(next); try { localStorage.setItem("pc_vault_lang_pref", next); } catch {} if (toggleLang) toggleLang(); };
  const copyStr = (val: string, id: string) => { navigator.clipboard?.writeText((val || "").trim()); setCopiedId(id); setTimeout(() => setCopiedId(""), 2200); };

  const persistEncrypted = async (nextEntries: VaultEntry[], nextSubs?: SubVaultFolder[], customPass?: string, customRec?: string) => {
    const subsToSave = nextSubs || subVaults;
    setEntries(nextEntries);
    if (nextSubs) setSubVaults(nextSubs);
    const payload = JSON.stringify({ entries: nextEntries, subVaults: subsToSave });
    const nextBlob = await encryptVaultJson(payload, (customPass || passphrase).trim(), cipherAlgo, customRec !== undefined ? customRec : recoveryKey);
    localStorage.setItem(storageKey, JSON.stringify(nextBlob));
    setBlob(nextBlob);
  };

  const parseDecryptedPayload = (plain: string) => {
    const parsed = JSON.parse(plain);
    if (Array.isArray(parsed)) {
      const migrated = parsed.map((e) => ({ ...e, subVaultId: e.subVaultId || "general" }));
      setEntries(migrated); setSubVaults(defaultFolders);
    } else {
      setEntries(Array.isArray(parsed.entries) ? parsed.entries : []);
      setSubVaults(Array.isArray(parsed.subVaults) && parsed.subVaults.length > 0 ? parsed.subVaults : defaultFolders);
    }
  };

  const handleUnlockOrCreate = async (overridePass?: string) => {
    setErrorMsg(""); setInfoMsg("");
    const activePass = (overridePass !== undefined ? overridePass : passphrase).trim();
    if (activePass.length < 8) { setErrorMsg(isHe ? "סיסמת המאסטר חייבת להכיל לפחות 8 תווים." : "Master passphrase must be 8+ characters."); return; }
    try {
      if (!blob) {
        const genRec = generateCustomPassword(24, true, false);
        setPassphrase(activePass); setRecoveryKey(genRec);
        const fresh = await encryptVaultJson(JSON.stringify({ entries: [], subVaults: defaultFolders }), activePass, cipherAlgo, genRec);
        localStorage.setItem(storageKey, JSON.stringify(fresh));
        setBlob(fresh); setEntries([]); setSubVaults(defaultFolders); setUnlocked(true); setActiveTab("add");
        setMasterCertData({ pass: activePass, rec: genRec, date: new Date().toISOString().slice(0, 10) });
        setInfoMsg(isHe ? "הכספת הראשית הוקמה ונפתחה! שמור את תעודת מפתח המאסטר למעלה." : "Master Vault created & unlocked!");
      } else {
        const plain = await decryptVaultJson(blob, activePass);
        setPassphrase(activePass); parseDecryptedPayload(plain); setUnlocked(true); setActiveTab("items");
        setInfoMsg(isHe ? "הכספת הראשית פוענחה בהצלחה!" : "Master Vault decrypted!");
      }
    } catch { setErrorMsg(isHe ? "סיסמת מאסטר שגויה." : "Wrong master passphrase."); }
  };
  const handleCreateSubVault = async () => {
    setErrorMsg("");
    if (!newSubName.trim()) { setErrorMsg(isHe ? "הזן שם לתת-הכספת." : "Enter sub-vault name."); return; }
    if (newSubMode === "custom_pin" && newSubAnswer.trim().length < 4) { setErrorMsg(isHe ? "הזן קוד PIN / סיסמה בת 4 תווים לפחות לתת-הכספת." : "Enter 4+ char PIN/password."); return; }
    if (newSubMode === "memory_riddle" && (!newSubQuestion.trim() || !newSubAnswer.trim())) { setErrorMsg(isHe ? "הזן שאלת זיכרון אישית ותשובה סודית." : "Enter memory question & answer."); return; }
    const id = "sub-" + Date.now().toString(36);
    const folder: SubVaultFolder = {
      id, nameHe: newSubName.trim(), nameEn: newSubName.trim(), lockMode: newSubMode,
      riddleQuestion: newSubMode === "memory_riddle" ? newSubQuestion.trim() : undefined,
      lockSecretHash: newSubMode !== "master_only" ? newSubAnswer.trim().toLowerCase() : undefined
    };
    await persistEncrypted(entries, [...subVaults, folder]);
    setUnlockedSubIds({ ...unlockedSubIds, [id]: true });
    setActiveSubId(id); setShowNewSubForm(false); setNewSubName(""); setNewSubQuestion(""); setNewSubAnswer("");
    setInfoMsg(isHe ? `תת-הכספת "${folder.nameHe}" נוצרה ונשמרה!` : `Sub-vault "${folder.nameEn}" created!`);
  };

  const unlockSubVault = (folder: SubVaultFolder) => {
    if ((subUnlockInput || "").trim().toLowerCase() === (folder.lockSecretHash || "")) {
      setUnlockedSubIds({ ...unlockedSubIds, [folder.id]: true }); setSubUnlockInput(""); setErrorMsg("");
      setInfoMsg(isHe ? `תת-הכספת "${folder.nameHe}" נפתחה!` : `Sub-vault "${folder.nameEn}" unlocked!`);
    } else {
      setErrorMsg(folder.lockMode === "memory_riddle" ? (isHe ? "תשובת הזיכרון האישית שגויה." : "Incorrect memory answer.") : (isHe ? "קוד הגישה לתת-הכספת שגוי." : "Incorrect sub-vault PIN/password."));
    }
  };

  const handleSaveEntry = async () => {
    if (!title.trim() || !secretValue.trim()) { setErrorMsg(isHe ? "מלא שם פריט ואת הסוד/סיסמה." : "Fill item title and secret."); return; }
    setErrorMsg("");
    const cleanAction = actionUrl.trim() ? (actionUrl.trim().startsWith("http") ? actionUrl.trim() : `https://${actionUrl.trim()}`) : "";
    if (editingId) {
      await persistEncrypted(entries.map((item) => item.id === editingId ? { ...item, subVaultId: activeSubId, title: title.trim(), category, targetAsset: targetAsset.trim() || "General", originSource: originSource.trim() || "Manual", actionUrl: cleanAction, secretValue: secretValue.trim(), purposeNote: purposeNote.trim() } : item));
      setEditingId(null); setInfoMsg(isHe ? "הפריט עודכן והוצפן מחדש ✓" : "Item updated ✓");
    } else {
      const item: VaultEntry = { id: `sec-${Date.now()}`, subVaultId: activeSubId, title: title.trim(), category, targetAsset: targetAsset.trim() || (isHe ? "כללי" : "General"), originSource: originSource.trim() || (isHe ? "הזנה ידנית" : "Manual"), actionUrl: cleanAction, secretValue: secretValue.trim(), purposeNote: purposeNote.trim(), createdAt: new Date().toISOString() };
      await persistEncrypted([item, ...entries]);
      setInfoMsg(isHe ? "הפריט הוצפן ונשמר בתת-הכספת ✓" : "Item encrypted & saved in sub-vault ✓");
    }
    setTitle(""); setTargetAsset(""); setOriginSource(""); setActionUrl(""); setSecretValue(""); setPurposeNote(""); setActiveTab("items");
  };

  const copyMasterCertToSheets = () => { if (!masterCertData) return; const row = isHe ? `נכס\tכתובת\tסיסמת מאסטר\tקוד שחזור (24 תווים)\tתאריך\nכספת ProofCraft\t${subDomain}/vault\t${masterCertData.pass}\t${masterCertData.rec}\t${masterCertData.date}` : `Asset\tURL\tMaster Key\tRecovery Key\tDate\nProofCraft Vault\t${subDomain}/vault\t${masterCertData.pass}\t${masterCertData.rec}\t${masterCertData.date}`; copyStr(row, "cert-sheets"); setInfoMsg(isHe ? "תעודת המפתח הועתקה! הדבק (Ctrl+V) ב-Google Sheets." : "Copied! Paste (Ctrl+V) in Google Sheets."); };
  const printMasterCertificate = () => { if (!masterCertData || typeof window === "undefined") return; const w = window.open("", "ProofCraftMasterCert", "width=620,height=560"); if (!w) return; w.document.write(`<html dir="${isHe ? "rtl" : "ltr"}"><body style="font-family:sans-serif;padding:28px;line-height:1.7"><h2>${isHe ? "תעודת מפתח מאסטר וקוד שחזור" : "Master Key & Recovery Certificate"}</h2><p><strong>URL:</strong> ${subDomain}/vault</p><p><strong>${isHe ? "סיסמת מאסטר:" : "Master Key:"}</strong> <code>${masterCertData.pass}</code></p><p><strong>${isHe ? "קוד שחזור:" : "Recovery Key:"}</strong> <code>${masterCertData.rec}</code></p><hr/><p style="color:#b91c1c">${isHe ? "שמור במקום בטוח ומחק קבצים זמניים לאחר ההדפסה." : "Store safely and delete temporary files."}</p></body></html>`); w.document.close(); w.print(); };
  const copyForGoogleSheets = () => { const clean = (v: string) => (v || "").replace(/[\r\n\t]+/g, " ").trim(); const head = exportLang === "he" ? "תת-כספת\tשם הפריט\tקטגוריה\tנכס\tמקור\tמטרה\tסוד / רמז\tקישור" : exportLang === "en" ? "Sub-Vault\tTitle\tCategory\tAsset\tOrigin\tPurpose\tSecret\tURL" : "תת-כספת / Folder\tשם / Title\tקטגוריה / Category\tנכס / Asset\tמקור / Origin\tמטרה / Purpose\tסוד / Secret\tקישור / URL"; const rows = entries.map((e) => { const fName = subVaults.find((s) => s.id === e.subVaultId)?.nameHe || e.subVaultId; return [fName, e.title, e.category, e.targetAsset, e.originSource, e.purposeNote || "-", e.secretValue, e.actionUrl || "-"].map(clean).join("\t"); }); copyStr([head, ...rows].join("\n"), "gsheets"); setInfoMsg(isHe ? "הטבלה הועתקה! פתח Google Sheets ולחץ Ctrl+V." : "Copied! Paste (Ctrl+V) in Google Sheets."); };
  const handleChangeVaultPassword = async () => {
    if (!blob || newPassInput.trim().length < 8) { setErrorMsg(isHe ? "הזן סיסמה חדשה (8+ תווים)." : "Enter 8+ char password."); return; }
    try { await decryptVaultJson(blob, oldPassInput.trim()); setPassphrase(newPassInput.trim()); await persistEncrypted(entries, subVaults, newPassInput.trim(), recoveryKey); setOldPassInput(""); setNewPassInput(""); setInfoMsg(isHe ? "סיסמת הכספת הראשית עודכנה ✓" : "Master password updated ✓"); }
    catch { setErrorMsg(isHe ? "הסיסמה הנוכחית שגויה." : "Current password incorrect."); }
  };
  const handleRecoverVault = async () => {
    if (!blob || recNewPass.trim().length < 8 || recUserCode.trim().length < 12) { setErrorMsg(isHe ? "הזן קוד שחזור אישי וסיסמה חדשה." : "Enter recovery key & new password."); return; }
    try { const plain = await recoverVaultWithCode(blob, recUserCode); parseDecryptedPayload(plain); setPassphrase(recNewPass.trim()); await persistEncrypted(entries, subVaults, recNewPass.trim(), recUserCode); setUnlocked(true); setShowRecoverBox(false); setInfoMsg(isHe ? "הכספת שוחזרה בהצלחה ✓" : "Vault recovered ✓"); }
    catch { setErrorMsg(isHe ? "קוד השחזור שגוי." : "Invalid recovery code."); }
  };
  const executeSafeWipe = async () => {
    if (wipeConfirmText.trim() !== "RESET VAULT") { setErrorMsg(isHe ? "הקלד RESET VAULT במדויק לאישור." : "Type exact RESET VAULT."); return; }
    let mustAdmin = requireAdminReset;
    try { const r = await fetch("/api/vault-governance", { cache: "no-store" }); const j = await r.json(); const data = { value: j.governance }; if (data?.value) mustAdmin = data.value.requireAdminForReset !== false; } catch {}
    if (mustAdmin) {
      if (!recAdminCode.trim()) { setErrorMsg(isHe ? "נדרש קוד אישור אדמין (VLT-...) לאיפוס." : "Admin approval code required."); return; }
      const rt = await fetch("/api/vault-governance", { cache: "no-store" }); const jt = await rt.json(); const data = { value: jt.tickets };
      const list: VaultResetTicket[] = Array.isArray(data?.value) ? data.value : [];
      if (!list.find((t) => t.approvalCode === recAdminCode.trim() && t.status === "approved")) { setErrorMsg(isHe ? "קוד האדמין אינו מאושר." : "Unapproved admin code."); return; }
    }
    localStorage.removeItem(storageKey); setBlob(null); setEntries([]); setUnlocked(false); setShowRecoverBox(false); setWipeConfirmText(""); setErrorMsg(""); setInfoMsg(isHe ? "הכספת אופסה! הקם כעת סיסמת מאסטר חדשה." : "Vault wiped! Create new master key.");
  };
  const lockVaultNow = () => { setUnlocked(false); setEntries([]); setPassphrase(""); setRevealedIds({}); setEditingId(null); setMasterCertData(null); setUnlockedSubIds({ general: true, crypto: true, dev: true }); setInfoMsg(isHe ? "הכספת ננעלה והזיכרון נוקה." : "Vault locked."); };

  const activeFolder = subVaults.find((s) => s.id === activeSubId) || subVaults[0];
  const isSubOpen = activeFolder ? (activeFolder.lockMode === "master_only" || Boolean(unlockedSubIds[activeFolder.id])) : true;
  const catLabels: Record<VaultCategory, string> = isHe ? { passwords: "סיסמאות ואתרים", crypto_seed: "קריפטו (12/24 מילים)", api_secrets: "מפתחות פיתוח ו-API", project_memory: "זיכרון והקשר פרויקט" } : { passwords: "Passwords & Logins", crypto_seed: "Crypto Seed (12/24)", api_secrets: "Dev & API Keys", project_memory: "Project Memory" };
  const visibleEntries = entries.filter((e) => e.subVaultId === activeSubId && (!searchQ.trim() || `${e.title} ${e.targetAsset} ${e.purposeNote || ""}`.toLowerCase().includes(searchQ.trim().toLowerCase())));
  return (
    <section dir={isHe ? "rtl" : "ltr"} className="card-hero" style={{ padding: 24, marginBottom: 24, border: `1px solid ${a11yHighContrast ? "#ffffff" : "rgba(251,191,36,0.35)"}`, background: a11yHighContrast ? "#000000" : undefined, zoom: `${fontScale}%`, textAlign: isHe ? "right" : "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingBottom: 14, marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span className="badge-pill" style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 11.5 }}><KeyRound size={13} /> {isHe ? "כספת Zero-Knowledge מוצפנת" : "ZERO-KNOWLEDGE VAULT"}</span>
          <button type="button" onClick={() => setShowSmartGuide(!showSmartGuide)} className="btn-ghost" style={{ height: 32, padding: "0 11px", fontSize: 11.5, color: "#34d399", borderColor: "rgba(52,211,153,0.4)" }}>{showSmartGuide ? (isHe ? "סגור מדריך ✕" : "Close Guide ✕") : (isHe ? "📘 מדריך למשתמש" : "📘 User Guide")}</button>
          <button type="button" onClick={() => { if (typeof window !== "undefined") window.open(`${subDomain}/vault`, "ProofCraftVaultMini", "width=440,height=720,menubar=no,toolbar=no"); }} className="btn-ghost" style={{ height: 32, padding: "0 11px", fontSize: 11.5, color: "#fbbf24" }}>{isHe ? "📌 חלון צף" : "📌 Floating App"}</button>
          <button type="button" onClick={installVaultAsApp} className="btn-primary" style={{ height: 32, padding: "0 11px", fontSize: 11.5, width: "auto", background: "linear-gradient(135deg, #10b981, #059669)", color: "#05070a", fontWeight: 900 }}>{isHe ? "📲 התקן כאפליקציה" : "📲 Install App"}</button>
          <button type="button" onClick={switchVaultLanguage} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12, color: "#38bdf8" }}><Globe size={13} /> {isHe ? "English" : "עברית"}</button>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <Accessibility size={14} color="#94a3b8" />
          <button type="button" onClick={() => setFontScale((s) => Math.max(85, s - 15))} className="btn-ghost" style={{ height: 30, padding: "0 9px", fontSize: 11.5 }}>A-</button>
          <button type="button" onClick={() => setFontScale(100)} className="btn-ghost" style={{ height: 30, padding: "0 9px", fontSize: 11.5 }}><RotateCcw size={11} /> {fontScale}%</button>
          <button type="button" onClick={() => setFontScale((s) => Math.min(145, s + 15))} className="btn-ghost" style={{ height: 30, padding: "0 9px", fontSize: 11.5 }}>A+</button>
          <button type="button" onClick={() => setA11yHighContrast(!a11yHighContrast)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>{isHe ? "ניגודיות" : "Contrast"}</button>
          {unlocked && <button type="button" onClick={lockVaultNow} className="btn-primary" style={{ height: 32, padding: "0 12px", fontSize: 12, width: "auto", background: "#fbbf24", color: "#0a0b0e" }}><Lock size={12} /> {isHe ? "נעל כספת" : "Lock Vault"}</button>}
        </div>
      </div>



            {showSmartGuide && (
        <div style={{ padding: 16, borderRadius: 14, background: "rgba(14,165,233,0.1)", border: "1px solid rgba(56,189,248,0.4)", marginBottom: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, fontSize: 12, color: "#e2e8f0", lineHeight: 1.6 }}>
          <div style={{ padding: 10, borderRadius: 10, background: "#05070a" }}><strong style={{ color: "#fbbf24" }}>{isHe ? "שלב 1: סיסמת מאסטר אחת" : "Step 1: One Master Key"}</strong><br />{isHe ? "בחר או חולל סיסמת מאסטר אחת. מיד לאחר היצירה תופיע תעודת חירום — שמור אותה ב-Google Sheets או בהדפסה מחוץ לכספת." : "Create one Master Key and save the emergency certificate in Google Sheets or print."}</div>
          <div style={{ padding: 10, borderRadius: 10, background: "#05070a" }}><strong style={{ color: "#38bdf8" }}>{isHe ? "שלב 2: תתי-כספות חכמות" : "Step 2: Smart Sub-Vaults"}</strong><br />{isHe ? "חלק את הפריטים לתיקיות (כללי, קריפטו, פיתוח). לכל תת-כספת תוכל לבחור: פתיחה אוטומטית, קוד PIN אישי, או שאלת זיכרון שרק אתה יודע." : "Organize into Sub-Vaults with Master-key access, PIN, or a Personal Memory Riddle."}</div>
          <div style={{ padding: 10, borderRadius: 10, background: "#05070a" }}><strong style={{ color: "#34d399" }}>{isHe ? "שלב 3: הצפנת רמז זיכרון" : "Step 3: Memory Cipher Clues"}</strong><br />{isHe ? "במקום לכתוב סיסמה גלויה, תוכל לשמור נוסחת רמז אישית מחייך (למשל: שם הרחוב הראשון + 4 ספרות) שאף פורץ לא יבין." : "Store a personal memory formula instead of a raw password for zero exposure."}</div>
          <div style={{ padding: 10, borderRadius: 10, background: "#05070a" }}><strong style={{ color: "#a78bfa" }}>{isHe ? "שלב 4: עבודה מהירה וגיבוי" : "Step 4: Fast Workflow & Backup"}</strong><br />{isHe ? "העתק סוד עם ניקוי לוח אוטומטי תוך 30 שניות, ייצא שורת .env למפתחים, או העתק טבלה מלאה ל-Google Sheets." : "Auto-wipe clipboard in 30s, copy .env lines, or export cleanly to Google Sheets."}</div>
        </div>
      )}
      {govDisabled && <div style={{ padding: 12, borderRadius: 10, background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 12.5, fontWeight: 800, marginBottom: 12 }}>{isHe ? "הכספת בתחזוקה יזומה." : "Vault in maintenance."}</div>}
      {govNotice && <div style={{ padding: 12, borderRadius: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8", fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>{govNotice}</div>}
      {errorMsg && <div style={{ padding: 12, borderRadius: 10, background: "rgba(248,113,113,0.15)", color: "#f87171", fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>{errorMsg}</div>}
      {infoMsg && <div style={{ padding: 12, borderRadius: 10, background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>{infoMsg}</div>}
      {masterCertData && (
        <div style={{ padding: 16, borderRadius: 14, background: "linear-gradient(135deg, rgba(251,191,36,0.16), rgba(16,185,129,0.12))", border: "1.5px solid rgba(251,191,36,0.55)", marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <strong style={{ fontSize: 14.5, color: "#fbbf24" }}>{isHe ? "🔐 תעודת מפתח המאסטר מוכנה — שמור אותה כעת מחוץ לכספת!" : "🔐 Master Key Certificate Ready — Save Outside Vault!"}</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, padding: 10, borderRadius: 10, background: "#05070a", fontSize: 12.5 }}>
            <div><span style={{ color: "#94a3b8" }}>{isHe ? "סיסמת מאסטר:" : "Master Key:"}</span> <code style={{ color: "#34d399", fontWeight: 800 }}>{masterCertData.pass}</code></div>
            <div><span style={{ color: "#94a3b8" }}>{isHe ? "קוד שחזור (24 תווים):" : "Recovery Key:"}</span> <code style={{ color: "#fbbf24", fontWeight: 800 }}>{masterCertData.rec}</code></div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={copyMasterCertToSheets} className="btn-primary" style={{ height: 34, padding: "0 14px", fontSize: 12, width: "auto" }}><FileSpreadsheet size={13} /> {copiedId === "cert-sheets" ? (isHe ? "הועתק לגוגל שיטס ✓" : "Copied ✓") : (isHe ? "העתק תעודת מפתח ל-Google Sheets" : "Copy for Google Sheets")}</button>
            <button type="button" onClick={printMasterCertificate} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#38bdf8" }}><Printer size={13} /> {isHe ? "הדפס תעודת חירום" : "Print Certificate"}</button>
            <button type="button" onClick={() => setMasterCertData(null)} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#34d399" }}>{isHe ? "שמרתי במקום בטוח — המשך ✓" : "I Saved It Safely ✓"}</button>
          </div>
        </div>
      )}

      {!unlocked ? (
        <div style={{ padding: 20, borderRadius: 16, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.28)", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc" }}>{blob ? (isHe ? "הזן את סיסמת המאסטר לפתיחת הכספת הראשית:" : "Enter Master Passphrase to unlock your Vault:") : (isHe ? "הקמת כספת ראשית חדשה — בחר סיסמת מאסטר (או צור אוטומטית ב-1 קליק):" : "Create your Master Vault — enter passphrase (or auto-generate):")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 230, display: "flex", gap: 6 }}>
              <input type={showMasterPass ? "text" : "password"} autoComplete="new-password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder={blob ? (isHe ? "סיסמת מאסטר ראשית..." : "Master passphrase...") : (isHe ? "בחר סיסמת מאסטר (8+ תווים)..." : "Choose master passphrase (8+ chars)...")} className="input-dark" style={{ flex: 1, height: 42, fontSize: 13.5 }} />
              <button type="button" onClick={() => setShowMasterPass(!showMasterPass)} className="btn-ghost" style={{ height: 42, padding: "0 12px" }}>{showMasterPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
            </div>
            <button type="button" onClick={() => handleUnlockOrCreate()} className="btn-primary" style={{ height: 42, padding: "0 20px", fontSize: 13, width: "auto" }}><Unlock size={15} /> {blob ? (isHe ? "פתח כספת" : "Unlock Vault") : (isHe ? "צור ופתח כספת" : "Create & Open")}</button>
            <button type="button" onClick={() => { setGenPwPreview(generateCustomPassword(genPwLen, genUseNum, genUseSym)); setShowEntryForge(!showEntryForge); }} className="btn-ghost" style={{ height: 42, padding: "0 14px", fontSize: 12.5, color: "#34d399", borderColor: "rgba(52,211,153,0.45)" }}><RefreshCw size={14} /> {isHe ? "מחולל סיסמאות מאסטר" : "Master Password Forge"}</button>
            {!blob && <button type="button" onClick={() => handleUnlockOrCreate(generateCustomPassword(18, true, true))} className="btn-ghost" style={{ height: 42, padding: "0 14px", fontSize: 12.5, color: "#34d399", borderColor: "rgba(52,211,153,0.45)" }}><RefreshCw size={14} /> {isHe ? "צור לי סיסמת מאסטר חזקה ופתח מיד" : "Auto-Generate & Open Now"}</button>}
            {blob && <button type="button" onClick={() => setShowRecoverBox(!showRecoverBox)} className="btn-ghost" style={{ height: 42, padding: "0 14px", fontSize: 12, color: "#fbbf24" }}>{isHe ? "שחזור / איפוס" : "Recover / Reset"}</button>}
          </div>
                    {showEntryForge && (
            <div style={{ padding: 14, borderRadius: 12, background: "#05070a", border: "1px solid rgba(52,211,153,0.35)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#34d399" }}>{isHe ? "מחולל סיסמת מאסטר קריפטוגרפית (העתק ושמור לפני היצירה):" : "Cryptographic Master Password Generator:"}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <code style={{ padding: "8px 12px", borderRadius: 8, background: "#0a0b0e", color: "#34d399", fontSize: 13.5, fontWeight: 800 }}>{genPwPreview}</code>
                <label style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "אורך:" : "Len:"} <input type="number" min={12} max={48} value={genPwLen} onChange={(e) => setGenPwLen(Number(e.target.value) || 20)} className="input-dark" style={{ width: 54, height: 30, fontSize: 11.5, padding: "0 6px" }} /></label>
                <label style={{ fontSize: 11.5, color: "#cbd5e1", display: "flex", alignItems: "center", gap: 4 }}><input type="checkbox" checked={genUseNum} onChange={(e) => setGenUseNum(e.target.checked)} /> 0-9</label>
                <label style={{ fontSize: 11.5, color: "#cbd5e1", display: "flex", alignItems: "center", gap: 4 }}><input type="checkbox" checked={genUseSym} onChange={(e) => setGenUseSym(e.target.checked)} /> !@#</label>
                <button type="button" onClick={() => setGenPwPreview(generateCustomPassword(genPwLen, genUseNum, genUseSym))} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11.5 }}><RefreshCw size={12} /> {isHe ? "חולל חדש" : "Regenerate"}</button>
                <button type="button" onClick={() => { setPassphrase(genPwPreview.trim()); copyStr(genPwPreview, "ef-cp"); setInfoMsg(isHe ? "הסיסמה הוזנה והועתקה ללוח ללא רווחים!" : "Inserted & copied cleanly!"); }} className="btn-primary" style={{ height: 32, padding: "0 12px", fontSize: 11.5, width: "auto" }}>{copiedId === "ef-cp" ? (isHe ? "הוזן והועתק ✓" : "Inserted ✓") : (isHe ? "הזן לשדה סיסמת המאסטר" : "Use as Master Key")}</button>
              </div>
            </div>
          )}
          {showRecoverBox && blob && (
            <div style={{ padding: 14, borderRadius: 12, background: "#05070a", border: "1px solid rgba(251,191,36,0.3)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
                <input value={recUserCode} onChange={(e) => setRecUserCode(e.target.value)} placeholder={isHe ? "קוד שחזור אישי (24 תווים)" : "Personal Recovery Code"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
                <input type="password" value={recNewPass} onChange={(e) => setRecNewPass(e.target.value)} placeholder={isHe ? "סיסמת מאסטר חדשה" : "New Master Passphrase"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
                <button type="button" onClick={handleRecoverVault} className="btn-primary" style={{ height: 36, fontSize: 12, width: "auto" }}><ShieldCheck size={13} /> {isHe ? "שחזר כספת" : "Recover Vault"}</button>
              </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
                <span style={{ fontSize: 11.5, color: requireAdminReset ? "#fbbf24" : "#34d399", fontWeight: 700 }}>{requireAdminReset ? (isHe ? "מדיניות אדמין: נדרש קוד אישור (VLT-...) לאיפוס" : "Policy: Admin Approval Code Required") : (isHe ? "מדיניות אדמין: איפוס פתוח למשתמש ללא קוד אדמין" : "Policy: Direct Reset Allowed")}</span>
                <button type="button" onClick={() => { setWipeConfirmText("RESET VAULT"); copyStr("RESET VAULT", "rv-cp"); setInfoMsg(isHe ? "מילת האישור RESET VAULT הוזנה אוטומטית לשדה!" : "RESET VAULT filled automatically!"); }} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}>{copiedId === "rv-cp" ? (isHe ? "הוזן לשדה ✓" : "Filled ✓") : (isHe ? "הזן אוטומטית: RESET VAULT" : "Auto-Fill: RESET VAULT")}</button>
                <input value={wipeConfirmText} onChange={(e) => setWipeConfirmText(e.target.value)} placeholder="RESET VAULT" className="input-dark" style={{ height: 32, fontSize: 11.5, width: 130 }} />
                {requireAdminReset && (
                  <>
                    <input value={reqEmail} onChange={(e) => setReqEmail(e.target.value)} placeholder={isHe ? "האימייל שלך לאישור אדמין..." : "Your email for admin approval..."} className="input-dark" style={{ height: 32, fontSize: 11.5, width: 175 }} />
                    <button type="button" onClick={async () => { if (!reqEmail.trim()) { setErrorMsg(isHe ? "הזן אימייל לבקשת אישור." : "Enter email."); return; } const rt = await fetch("/api/vault-governance", { cache: "no-store" }); const jt = await rt.json(); const data = { value: jt.tickets }; const prev = Array.isArray(data?.value) ? data.value : []; const tk = { id: `tk-${Date.now()}`, userEmail: reqEmail.trim().toLowerCase(), requestType: "full_wipe_reset", verificationNote: "Vault Wipe Verification", status: "pending", approvalCode: "", createdAt: new Date().toISOString() }; await fetch("/api/vault-governance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "vault_reset_tickets", value: [tk, ...prev] }) }); setInfoMsg(isHe ? "הבקשה נשלחה לאדמין! לאחר אישורו לחץ בדוק אישור." : "Sent to Admin!"); }} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#fbbf24" }}>{isHe ? "בקש אישור אדמין" : "Request Admin"}</button>
                    <button type="button" onClick={async () => { const rt = await fetch("/api/vault-governance", { cache: "no-store" }); const jt = await rt.json(); const data = { value: jt.tickets }; const list = Array.isArray(data?.value) ? data.value : []; const ok = list.find((t: { userEmail: string; status: string; approvalCode: string }) => t.userEmail === reqEmail.trim().toLowerCase() && t.status === "approved"); if (ok) { setRecAdminCode(ok.approvalCode); setInfoMsg(isHe ? `אושר! קוד ${ok.approvalCode} הוזן אוטומטית.` : `Approved! ${ok.approvalCode}`); } else { setErrorMsg(isHe ? "ממתין לאישור אדמין..." : "Still pending..."); } }} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#34d399" }}>{isHe ? "בדוק אישור" : "Check Approval"}</button>
                    <input value={recAdminCode} onChange={(e) => setRecAdminCode(e.target.value)} placeholder="VLT-XXXXXX" className="input-dark" style={{ height: 32, fontSize: 11.5, width: 120 }} />
                  </>
                )}
                <button type="button" onClick={executeSafeWipe} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 11.5, color: "#f87171", borderColor: "rgba(248,113,113,0.4)" }}>{isHe ? "השמד כספת ישנה והתחל מאפס" : "Wipe & Start Fresh"}</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {externalTask && (
            <div style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(251,191,36,0.14)", border: "1px solid rgba(251,191,36,0.45)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: 12, color: "#fef3c7" }}>
              <span><strong>{isHe ? "משימה חיצונית פעילה:" : "Active External Task:"}</strong> {externalTask.title} ({externalTask.targetAsset}) — {isHe ? "העתקת מפתח חדש? לחץ להדבקה ועדכון:" : "Copied a new key? Paste & update:"}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={async () => { try { const t = await navigator.clipboard.readText(); if (t) { setSecretValue(t.trim()); setActiveTab("add"); } } catch {} }} className="btn-primary" style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>{isHe ? "קלוט מהלוח ועדכן" : "Paste & Update"}</button>
                <button type="button" onClick={() => setExternalTask(null)} className="btn-ghost" style={{ height: 28, padding: "0 8px", fontSize: 11 }}>✕</button>
              </div>
            </div>
          )}
          {preFlightItem && (
            <div style={{ padding: 14, borderRadius: 12, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.45)", display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5, color: "#e0f2fe" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong>{isHe ? `תדריך הקשר לפני יציאה ליעד: ${preFlightItem.title}` : `Pre-Flight Context: ${preFlightItem.title}`}</strong><button type="button" onClick={() => setPreFlightItem(null)} className="btn-ghost" style={{ height: 26, padding: "0 8px", fontSize: 11 }}>✕</button></div>
              <div>{isHe ? "1. בצע את הפעולה או הפקת המפתח באתר החיצוני והעתק ללוח. 2. חזור לכאן ולחץ על 'קלוט מהלוח ועדכן' בסרגל הצהוב למעלה." : "1. Perform action/generate key outside and copy. 2. Return here and click 'Paste & Update' on the top yellow bar."}</div>
              <a href={preFlightItem.actionUrl} target="_blank" rel="noopener noreferrer" onClick={() => { setExternalTask({ title: preFlightItem.title, targetAsset: preFlightItem.targetAsset }); setPreFlightItem(null); }} className="btn-primary" style={{ height: 32, padding: "0 14px", fontSize: 12, width: "auto", alignSelf: "flex-start" }}>{isHe ? "צא כעת לאתר החיצוני ↗" : "Launch Site Now ↗"}</a>
            </div>
          )}
          <div style={{ padding: 14, borderRadius: 14, background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              <strong style={{ fontSize: 12.5, color: "#38bdf8" }}>{isHe ? "תתי-כספות תחת הכספת הראשית (בחר תיקייה או צור תת-כספת חדשה):" : "Sub-Vaults inside Master Vault:"}</strong>
              <button type="button" onClick={() => setShowNewSubForm(!showNewSubForm)} className="btn-ghost" style={{ height: 30, padding: "0 11px", fontSize: 11.5, color: "#34d399" }}>+ {isHe ? "תת-כספת חדשה" : "New Sub-Vault"}</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {subVaults.map((sv) => (<button key={sv.id} type="button" onClick={() => { setActiveSubId(sv.id); setErrorMsg(""); }} className={activeSubId === sv.id ? "btn-primary" : "btn-ghost"} style={{ height: 34, padding: "0 12px", fontSize: 12, width: "auto" }}><FolderLock size={13} /> {isHe ? sv.nameHe : sv.nameEn} {sv.lockMode !== "master_only" ? (unlockedSubIds[sv.id] ? "🔓" : "🔒") : ""}</button>))}
            </div>
            {showNewSubForm && (
              <div style={{ marginTop: 10, padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.3)", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                  <input autoComplete="off" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} placeholder={isHe ? "שם תת-הכספת (למשל: עסקים / בנק)..." : "Sub-vault name..."} className="input-dark" style={{ height: 36, fontSize: 12 }} />
                  <select value={newSubMode} onChange={(e) => setNewSubMode(e.target.value as SubVaultLockMode)} className="input-dark" style={{ height: 36, fontSize: 12 }}><option value="master_only">{isHe ? "1. פתוח תחת סיסמת המאסטר הראשית" : "1. Open under Master Key"}</option><option value="custom_pin">{isHe ? "2. מוגן בסיסמה / קוד PIN ייעודי" : "2. Protected by Sub-Vault PIN"}</option><option value="memory_riddle">{isHe ? "3. מוגן בחידת זיכרון אישית" : "3. Protected by Memory Riddle"}</option></select>
                </div>
                {newSubMode === "custom_pin" && <input type="password" autoComplete="new-password" value={newSubAnswer} onChange={(e) => setNewSubAnswer(e.target.value)} placeholder={isHe ? "הגדר סיסמה / PIN לתת-הכספת (4+ תווים)..." : "Set Sub-Vault PIN..."} className="input-dark" style={{ height: 36, fontSize: 12 }} />}
                {newSubMode === "memory_riddle" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}><input value={newSubQuestion} onChange={(e) => setNewSubQuestion(e.target.value)} placeholder={isHe ? "שאלת זיכרון אישית..." : "Personal memory question..."} className="input-dark" style={{ height: 36, fontSize: 12 }} /><input value={newSubAnswer} onChange={(e) => setNewSubAnswer(e.target.value)} placeholder={isHe ? "התשובה הסודית שלך..." : "Your secret answer..."} className="input-dark" style={{ height: 36, fontSize: 12 }} /></div>}
                <button type="button" onClick={handleCreateSubVault} className="btn-primary" style={{ height: 34, padding: "0 14px", fontSize: 12, width: "auto", alignSelf: "flex-start" }}>{isHe ? "צור תת-כספת ושמור" : "Create Sub-Vault"}</button>
              </div>
            )}
          </div>
          {!isSubOpen && activeFolder ? (
            <div style={{ padding: 20, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.4)", display: "flex", flexDirection: "column", gap: 10 }}>
              <strong style={{ fontSize: 14.5, color: "#fbbf24" }}>{isHe ? `תת-הכספת "${activeFolder.nameHe}" נעולה:` : `Sub-Vault "${activeFolder.nameEn}" is Protected:`}</strong>
              {activeFolder.lockMode === "memory_riddle" && <div style={{ fontSize: 13, color: "#38bdf8" }}><strong>{isHe ? "שאלת הזיכרון שלך:" : "Memory Riddle:"}</strong> {activeFolder.riddleQuestion}</div>}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><input type="password" value={subUnlockInput} onChange={(e) => setSubUnlockInput(e.target.value)} placeholder={isHe ? "הזן קוד / תשובה לפתיחה..." : "Enter PIN / answer..."} className="input-dark" style={{ flex: 1, minWidth: 200, height: 38, fontSize: 13 }} /><button type="button" onClick={() => unlockSubVault(activeFolder)} className="btn-primary" style={{ height: 38, padding: "0 16px", fontSize: 12.5, width: "auto" }}><Unlock size={14} /> {isHe ? "פתח תת-כספת" : "Unlock"}</button></div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10 }}>
                <button type="button" onClick={() => setActiveTab("items")} className={activeTab === "items" ? "btn-primary" : "btn-ghost"} style={{ height: 36, padding: "0 14px", fontSize: 12.5, width: "auto" }}>{isHe ? `1. פריטים בתיקייה (${visibleEntries.length})` : `1. Items (${visibleEntries.length})`}</button>
                <button type="button" onClick={() => setActiveTab("add")} className={activeTab === "add" ? "btn-primary" : "btn-ghost"} style={{ height: 36, padding: "0 14px", fontSize: 12.5, width: "auto" }}>{editingId ? (isHe ? "2. עריכת פריט" : "2. Edit") : (isHe ? "2. + הוסף פריט חדש" : "2. + Add Item")}</button>
                <button type="button" onClick={() => setActiveTab("tools")} className={activeTab === "tools" ? "btn-primary" : "btn-ghost"} style={{ height: 36, padding: "0 14px", fontSize: 12.5, width: "auto" }}>{isHe ? "3. מחולל סיסמאות ו-Google Sheets" : "3. Forge & Sheets"}</button>
                <button type="button" onClick={() => setActiveTab("security")} className={activeTab === "security" ? "btn-primary" : "btn-ghost"} style={{ height: 36, padding: "0 14px", fontSize: 12.5, width: "auto" }}>{isHe ? "4. אבטחה וקוד שחזור" : "4. Security"}</button>
              </div>
              {activeTab === "add" && (
                <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.28)", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><button type="button" onClick={() => setVaultPersona("personal")} className={vaultPersona === "personal" ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>{isHe ? "תבניות יום-יום" : "Personal"}</button><button type="button" onClick={() => setVaultPersona("dev")} className={vaultPersona === "dev" ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>{isHe ? "תבניות מפתחים" : "Dev"}</button>{VAULT_QUICK_TEMPLATES.filter((t) => t.persona === vaultPersona).map((tpl) => (<button key={tpl.id} type="button" onClick={() => { setTitle(isHe ? tpl.labelHe : tpl.labelEn); setCategory(tpl.category); setTargetAsset(tpl.targetAsset); setOriginSource(tpl.originSource); setActionUrl(tpl.actionUrl); setPurposeNote(isHe ? tpl.purposeHe : tpl.purposeEn); }} className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11 }}>{isHe ? tpl.labelHe : tpl.labelEn}</button>))}</div>
                  <div style={{ fontSize: 11.5, color: "#94a3b8", background: "rgba(255,255,255,0.03)", padding: "8px 10px", borderRadius: 8 }}>{isHe ? "טיפ למשתמש: מלא את הנכס, המקור ומטרת הפריט כדי שתמיד תזכור למה נוצר. במקום סיסמה אמיתית תוכל לרשום נוסחת זיכרון אישית שרק אתה מבין." : "Tip: Fill Asset, Origin & Purpose for full context, or store a personal memory clue instead of a raw password."}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                    <select value={category} onChange={(e) => setCategory(e.target.value as VaultCategory)} className="input-dark" style={{ height: 38, fontSize: 12.5 }}>{(Object.keys(catLabels) as VaultCategory[]).map((k) => (<option key={k} value={k}>{catLabels[k]}</option>))}</select>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isHe ? "שם הפריט..." : "Item Title..."} className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
                    <input value={targetAsset} onChange={(e) => setTargetAsset(e.target.value)} placeholder={isHe ? "שייך לנכס / אתר..." : "Target Asset..."} className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
                    <input value={originSource} onChange={(e) => setOriginSource(e.target.value)} placeholder={isHe ? "מאיפה התקבל?" : "Origin Source..."} className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
                    <input value={purposeNote} onChange={(e) => setPurposeNote(e.target.value)} placeholder={isHe ? "מטרת הפריט והשימוש (הקשר מלא)..." : "Purpose & Context..."} className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
                    <input value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} placeholder="https://..." className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: 6, flexWrap: "wrap" }}><input type="text" value={secretValue} onChange={(e) => setSecretValue(e.target.value)} placeholder={isHe ? "הסוד / סיסמה / 12-24 מילים / או רמז זיכרון אישי..." : "Secret / Password / 12-24 Words..."} className="input-dark" style={{ flex: 1, minWidth: 220, height: 40, fontSize: 13 }} /><button type="button" onClick={() => setSecretValue(generateCustomPassword(20, true, true))} className="btn-ghost" style={{ height: 40, padding: "0 12px", fontSize: 12, color: "#34d399" }}><RefreshCw size={13} /> {isHe ? "חולל סיסמה" : "Generate"}</button><button type="button" onClick={async () => { try { const t = await navigator.clipboard.readText(); if (t) { setSecretValue(t.trim()); setInfoMsg(isHe ? "הסוד נקלט מהלוח!" : "Captured from clipboard!"); } } catch { setErrorMsg(isHe ? "אשר גישה ללוח או הדבק ידנית." : "Allow clipboard or paste manually."); } }} className="btn-ghost" style={{ height: 40, padding: "0 12px", fontSize: 12, color: "#38bdf8" }}>{isHe ? "📋 קלוט מהלוח" : "📋 Clip Paste"}</button></div>
                  </div>
                  <button type="button" onClick={handleSaveEntry} className="btn-primary" style={{ height: 40, fontSize: 13, width: "auto", alignSelf: "flex-start", padding: "0 22px" }}><Plus size={14} /> {editingId ? (isHe ? "עדכן והצפן" : "Update") : (isHe ? "הצפן ושמור בתת-הכספת" : "Encrypt & Save")}</button>
                </div>
              )}
              {activeTab === "items" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder={isHe ? "חיפוש בתוך תת-הכספת..." : "Search folder..."} className="input-dark" style={{ height: 34, fontSize: 12.5, maxWidth: 260 }} />
                  {visibleEntries.length === 0 ? (<div style={{ padding: 24, textAlign: "center", borderRadius: 12, background: "#0a0b0e", color: "#94a3b8", fontSize: 13 }}>{isHe ? "תת-כספת זו ריקה. לחץ על '2. + הוסף פריט חדש' כדי לשמור פריט." : "Folder empty."}</div>) : visibleEntries.map((item) => {
                    const isShown = Boolean(revealedIds[item.id]); const isExpanded = Boolean(expandedIds[item.id]);
                    return (<div key={item.id} style={{ borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}><div onClick={() => setExpandedIds({ ...expandedIds, [item.id]: !isExpanded })} style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}><div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>{catLabels[item.category]}</span><strong style={{ fontSize: 14.5, color: "#f8fafc" }}>{item.title}</strong><span style={{ fontSize: 12, color: "#94a3b8" }}>· {item.targetAsset}</span></div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><button type="button" onClick={(e) => { e.stopPropagation(); copyStr(item.secretValue, item.id); }} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#34d399" }}>{copiedId === item.id ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק" : "Copy")}</button>{isExpanded ? <ChevronUp size={16} color="#38bdf8" /> : <ChevronDown size={16} color="#94a3b8" />}</div></div>{isExpanded && (<div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 10 }}>{item.purposeNote && <div style={{ padding: 10, borderRadius: 8, background: "rgba(251,191,36,0.08)", fontSize: 12.5, color: "#fef3c7" }}><strong>{isHe ? "מטרת הפריט:" : "Purpose:"}</strong> {item.purposeNote}</div>}<div style={{ fontSize: 12, color: "#94a3b8" }}><strong>{isHe ? "נכס:" : "Asset:"}</strong> {item.targetAsset} · <strong>{isHe ? "מקור:" : "Origin:"}</strong> {item.originSource}</div><div style={{ padding: 10, borderRadius: 8, background: "#05070a", fontFamily: "monospace", fontSize: 13, color: isShown ? "#34d399" : "#64748b", wordBreak: "break-all" }}>{isShown ? item.secretValue : "••••••••••••••••••••••••"}</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" onClick={() => { copyStr(item.secretValue, `w-${item.id}`); setInfoMsg(isHe ? "הועתק! הלוח ינוקה אוטומטית תוך 30 שניות." : "Copied! Auto-wiping in 30s."); setTimeout(() => { try { navigator.clipboard?.writeText(""); } catch {} }, 30000); }} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#10b981" }}>{copiedId === `w-${item.id}` ? (isHe ? "ינוקה תוך 30 שנ׳ ✓" : "Auto-Wipe 30s!") : (isHe ? "העתק + ניקוי לוח (30 שנ׳)" : "Copy + 30s Wipe")}</button>
                              <button type="button" onClick={() => { const k = item.title.toUpperCase().replace(/[^A-Z0-9]+/g, "_") || "SECRET"; copyStr(`${k}="${item.secretValue}"`, `env-${item.id}`); setInfoMsg(isHe ? `הועתק כמשתנה סביבה (${k})` : `Copied ${k}`); }} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#a78bfa" }}>{copiedId === `env-${item.id}` ? (isHe ? "הועתק .env ✓" : "Copied .env!") : (isHe ? "העתק כ-.env" : "Copy .env")}</button>
                              <button type="button" onClick={() => setRevealedIds({ ...revealedIds, [item.id]: !isShown })} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>{isShown ? (isHe ? "הסתר" : "Hide") : (isHe ? "חשוף" : "Reveal")}</button><button type="button" onClick={() => { setEditingId(item.id); setTitle(item.title); setCategory(item.category); setTargetAsset(item.targetAsset); setOriginSource(item.originSource); setActionUrl(item.actionUrl); setSecretValue(item.secretValue); setPurposeNote(item.purposeNote || ""); setActiveTab("add"); }} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#38bdf8" }}><Edit3 size={12} /> {isHe ? "ערוך" : "Edit"}</button>{item.actionUrl && <button type="button" onClick={() => setPreFlightItem(item)} className="btn-primary" style={{ height: 30, padding: "0 12px", fontSize: 11.5, width: "auto" }}>{isHe ? "תדריך ויציאה ליעד ↗" : "Briefing & Open ↗"}</button>}<button type="button" onClick={() => persistEncrypted(entries.filter((x) => x.id !== item.id))} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#f87171" }}>{isHe ? "מחק" : "Delete"}</button></div></div>)}</div>);
                  })}
                </div>
              )}
              {activeTab === "tools" && (
                <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.3)", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><code style={{ padding: "8px 12px", borderRadius: 8, background: "#05070a", color: "#34d399", fontSize: 13 }}>{genPwPreview}</code><button type="button" onClick={() => setGenPwPreview(generateCustomPassword(20, true, true))} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12 }}><RefreshCw size={12} /> {isHe ? "חולל חדש" : "New"}</button><button type="button" onClick={() => copyStr(genPwPreview, "t-pw")} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#38bdf8" }}>{copiedId === "t-pw" ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק" : "Copy")}</button><button type="button" onClick={() => { setSecretValue(genPwPreview); setActiveTab("add"); }} className="btn-primary" style={{ height: 34, padding: "0 14px", fontSize: 12, width: "auto" }}>{isHe ? "שמור בתת-הכספת" : "Save to Sub-Vault"}</button></div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}><select value={exportLang} onChange={(e) => setExportLang(e.target.value as "he" | "en" | "both")} className="input-dark" style={{ height: 34, fontSize: 12, padding: "0 10px" }}><option value="he">{isHe ? "עברית (HE)" : "Hebrew"}</option><option value="en">{isHe ? "אנגלית (EN)" : "English"}</option><option value="both">{isHe ? "דו-לשוני (HE+EN)" : "Bilingual"}</option></select><button type="button" onClick={copyForGoogleSheets} className="btn-primary" style={{ height: 34, padding: "0 14px", fontSize: 12, width: "auto" }}><FileSpreadsheet size={13} /> {copiedId === "gsheets" ? (isHe ? "הועתק לגוגל שיטס!" : "Copied!") : (isHe ? "העתק ל-Google Sheets" : "Copy for Google Sheets")}</button><button type="button" onClick={() => window.print()} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12 }}><Printer size={13} /> {isHe ? "הדפסה" : "Print"}</button></div>
                </div>
              )}
              {activeTab === "security" && (
                <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.3)", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 12.5, color: "#fef3c7" }}><strong>{isHe ? "קוד השחזור האישי שלך (24 תווים):" : "Recovery Key:"}</strong> <code>{recoveryKey || (isHe ? "הונפק בעת יצירת הכספת" : "Generated on creation")}</code></div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}><input type="password" value={oldPassInput} onChange={(e) => setOldPassInput(e.target.value)} placeholder={isHe ? "סיסמת מאסטר נוכחית..." : "Current password..."} className="input-dark" style={{ height: 36, fontSize: 12 }} /><input type="password" value={newPassInput} onChange={(e) => setNewPassInput(e.target.value)} placeholder={isHe ? "סיסמת מאסטר חדשה..." : "New password..."} className="input-dark" style={{ height: 36, fontSize: 12 }} /><button type="button" onClick={handleChangeVaultPassword} className="btn-primary" style={{ height: 36, fontSize: 12, width: "auto" }}>{isHe ? "שנה סיסמה ראשית" : "Update Password"}</button></div>
                  <div style={{ borderTop: "1px solid rgba(248,113,113,0.25)", paddingTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><input value={recAdminCode} onChange={(e) => setRecAdminCode(e.target.value)} placeholder={isHe ? "קוד אישור אדמין" : "Admin code"} className="input-dark" style={{ height: 32, fontSize: 11.5, width: 150 }} /><input value={wipeConfirmText} onChange={(e) => setWipeConfirmText(e.target.value)} placeholder="RESET VAULT" className="input-dark" style={{ height: 32, fontSize: 11.5, width: 130 }} /><button type="button" onClick={executeSafeWipe} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 11.5, color: "#f87171" }}>{isHe ? "השמד כספת" : "Wipe Vault"}</button></div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    <VaultSecurityAndBackupAcademy isHe={isHe} />
    </section>
  );
}
