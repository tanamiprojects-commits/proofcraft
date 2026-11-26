"use client";
import { VaultResetTicket } from "@/lib/vault-admin-sync";

import React, { useEffect, useState } from "react";
import { Accessibility, ArrowUpRight, CheckCircle2, Copy, Download, Edit3, Eye, ChevronDown, ChevronUp, EyeOff, ExternalLink, Info, FileSpreadsheet, Globe, KeyRound, Lock, Plus, Printer, RefreshCw, RotateCcw, Search, Share2, ShieldCheck, Sliders, Trash2, Unlock } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";
import { supabase } from "@/lib/supabase";
import { CipherAlgo, decryptVaultJson, EncryptedVaultBlob, encryptVaultJson, recoverVaultWithCode } from "@/lib/zero-knowledge-crypto";
import { generateCustomPassword, generateStrongPassword, PERSONAL_CIPHER_CLUES, VAULT_QUICK_TEMPLATES } from "@/lib/vault-templates-engine";

export type VaultCategory = "crypto_seed" | "api_secrets" | "passwords" | "project_memory";
export interface VaultEntry { id: string; title: string; category: VaultCategory; targetAsset: string; originSource: string; actionUrl: string; secretValue: string; purposeNote?: string; envTag?: string; isMemoryCipher?: boolean; createdAt: string; }

export default function ZeroKnowledgeVaultOS({ userId, standalone = false }: { userId?: string | null; standalone?: boolean }) {
  const { isHe: globalHe, toggleLang } = useStudioLang();
  const [localLang, setLocalLang] = useState<"he" | "en" | null>(null);
  const isHe = localLang ? localLang === "he" : globalHe;
  const storageKey = `pc_zk_vault_v2_${userId || "universal"}`;
  const mainDomain = "https://" + "tanami360.com";
  const subDomain = "https://" + "studio" + ".tanami360.com";

  const [blob, setBlob] = useState<EncryptedVaultBlob | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [showMasterPass, setShowMasterPass] = useState(false);
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
  const [showSmartGuide, setShowSmartGuide] = useState(false);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [showRecoverBox, setShowRecoverBox] = useState(false);
  const [exportLang, setExportLang] = useState<"he" | "en" | "both">("he");
  const [externalTask, setExternalTask] = useState<{ itemId: string; title: string; targetAsset: string; url: string } | null>(null);

  const [oldPassInput, setOldPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");
  const [recUserCode, setRecUserCode] = useState("");
  const [recAdminCode, setRecAdminCode] = useState("");
  const [recNewPass, setRecNewPass] = useState("");
  const [requireAdminReset, setRequireAdminReset] = useState(true);
  const [reqEmail, setReqEmail] = useState("");
  const [reqNote, setReqNote] = useState("");
  const [reqType, setReqType] = useState<"recover_with_key" | "full_wipe_reset">("recover_with_key");
  const [wipeConfirmText, setWipeConfirmText] = useState("");
  const [masterCertData, setMasterCertData] = useState<{ pass: string; rec: string; algo: string; date: string } | null>(null);
  const [installPromptEvt, setInstallPromptEvt] = useState<{ prompt: () => Promise<void> } | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<VaultCategory>("crypto_seed");
  const [targetAsset, setTargetAsset] = useState("");
  const [originSource, setOriginSource] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [secretValue, setSecretValue] = useState("");
  const [vaultPersona, setVaultPersona] = useState<"personal" | "dev">("personal");
  const [projectScale, setProjectScale] = useState<"mvp" | "enterprise">("mvp");
  const [purposeNote, setPurposeNote] = useState("");
  const [envTag, setEnvTag] = useState("Production / ראשי");
  const [isMemoryCipher, setIsMemoryCipher] = useState(false);
  const [preFlightItem, setPreFlightItem] = useState<VaultEntry | null>(null);
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
            const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const incomingTitle = params?.get("clipTitle") || params?.get("title") || "";
      const incomingUrl = params?.get("clipUrl") || params?.get("url") || "";
      const incomingText = params?.get("text") || "";
      if (incomingTitle) setTitle(incomingTitle);
      if (incomingUrl) { setActionUrl(incomingUrl); setOriginSource(incomingUrl); }
      if (incomingText) setSecretValue(incomingText);
      const onBip = (e: Event) => { e.preventDefault(); setInstallPromptEvt(e as unknown as { prompt: () => Promise<void> }); };
      window.addEventListener("beforeinstallprompt", onBip);
      const raw = localStorage.getItem(storageKey);
      if (raw) { const parsed = JSON.parse(raw); setBlob(parsed); if (parsed.algo) setCipherAlgo(parsed.algo); }
    } catch {}
    (async () => {
      try {
        const { data } = await supabase.from("site_settings").select("value").eq("key", "vault_governance").single();
        if (data?.value) { if (data.value.enabled === false) setGovDisabled(true); if (data.value.notice) setGovNotice(data.value.notice); if (data.value.requireAdminForReset === false) setRequireAdminReset(false); }
      } catch {}
    })();
  }, [storageKey]);

    const installVaultAsApp = async () => {
    if (installPromptEvt) { await installPromptEvt.prompt(); setInstallPromptEvt(null); return; }
    setInfoMsg(isHe ? "להתקנה כאפליקציה: באנדרואיד/מחשב לחץ בתפריט הדפדפן התקן אפליקציה; באייפון לחץ שתף ואז הוסף למסך הבית." : "To install as App: tap browser menu -> Install App (or Share -> Add to Home Screen on iOS).");
  };

  const launchAlwaysOnTopWidget = async () => {
    if (typeof window === "undefined") return;
    const pipApi = (window as unknown as { documentPictureInPicture?: { requestWindow: (opts: { width: number; height: number }) => Promise<Window> } }).documentPictureInPicture;
    if (pipApi) {
      try {
        const pipWin = await pipApi.requestWindow({ width: 430, height: 680 });
        pipWin.document.body.style.margin = "0"; pipWin.document.body.style.background = "#05070a";
        const ifr = pipWin.document.createElement("iframe");
        ifr.src = `${subDomain}/vault`; ifr.style.width = "100%"; ifr.style.height = "100vh"; ifr.style.border = "none";
        pipWin.document.body.appendChild(ifr);
        setInfoMsg(isHe ? "הכספת הצפה פועלת כעת מעל כל חלון במחשב (Always-on-Top)!" : "Always-on-Top Floating Widget active!");
        return;
      } catch {}
    }
    window.open(`${subDomain}/vault`, "ProofCraftAlwaysOnTopVault", "width=440,height=720,menubar=no,toolbar=no,location=no,status=no");
  };

  const smartPasteFromClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText && clipText.trim()) { setSecretValue(clipText.trim()); setInfoMsg(isHe ? "הסוד נקלט אוטומטית מהלוח! השלם שם ונכס ולחץ הצפן ושמור." : "Captured from clipboard!"); }
    } catch { setErrorMsg(isHe ? "אשר גישה ללוח בדפדפן או הדבק ידנית (Ctrl+V)." : "Allow clipboard access or paste manually."); }
  };
    const copyMasterCertToSheets = () => {
    if (!masterCertData) return;
    const row = isHe
      ? `נכס\tכתובת כניסה\tסיסמת מאסטר\tקוד שחזור אישי (24 תווים)\tהצפנה\tתאריך\nכספת ProofCraft\t${subDomain}/vault\t${masterCertData.pass}\t${masterCertData.rec}\t${masterCertData.algo} 256-bit\t${masterCertData.date}`
      : `Asset\tVault URL\tMaster Passphrase\tPersonal Recovery Key (24 chars)\tEncryption\tDate\nProofCraft Vault\t${subDomain}/vault\t${masterCertData.pass}\t${masterCertData.rec}\t${masterCertData.algo} 256-bit\t${masterCertData.date}`;
    copyStr(row, "cert-sheets");
    setInfoMsg(isHe ? "תעודת המפתח הועתקה ללוח! פתח Google Sheets ולחץ Ctrl+V לשמירה בטוחה מחוץ לכספת." : "Master Key Certificate copied! Paste (Ctrl+V) into Google Sheets.");
  };

  const printMasterCertificate = () => {
    if (!masterCertData || typeof window === "undefined") return;
    const w = window.open("", "ProofCraftMasterCert", "width=640,height=620");
    if (!w) return;
    w.document.write(`<html dir="${isHe ? "rtl" : "ltr"}"><body style="font-family:sans-serif;padding:28px;line-height:1.7"><h2>${isHe ? "תעודת מפתח מאסטר וקוד שחזור — כספת ProofCraft" : "Master Key & Recovery Certificate — ProofCraft Vault"}</h2><p><strong>${isHe ? "כתובת הכספת:" : "Vault URL:"}</strong> ${subDomain}/vault</p><p><strong>${isHe ? "סיסמת המאסטר:" : "Master Passphrase:"}</strong> <code style="font-size:15px;background:#f1f5f9;padding:4px 8px">${masterCertData.pass}</code></p><p><strong>${isHe ? "קוד שחזור אישי (24 תווים):" : "Personal Recovery Code:"}</strong> <code style="font-size:15px;background:#f1f5f9;padding:4px 8px">${masterCertData.rec}</code></p><p><strong>${isHe ? "תאריך הקמה:" : "Created:"}</strong> ${masterCertData.date}</p><hr/><p style="color:#b91c1c;font-size:13px">${isHe ? "אזהרת אבטחה: שמור דף זה בכספת פיזית או בגיליון מאובטח. מחק קבצים זמניים לאחר ההדפסה." : "Security Notice: Store this printout safely and delete temporary files."}</p></body></html>`);
    w.document.close(); w.print();
  };
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
        const fresh = await encryptVaultJson(JSON.stringify([]), passphrase.trim(), cipherAlgo, genRec);
        localStorage.setItem(storageKey, JSON.stringify(fresh));
        setBlob(fresh); setEntries([]); setUnlocked(true); setMasterCertData({ pass: passphrase.trim(), rec: genRec, algo: cipherAlgo, date: new Date().toISOString().slice(0, 10) });
        setInfoMsg(isHe ? "הכספת הוקמה! שמור את קוד השחזור האישי שלך המוצג מטה." : "Vault initialized! Save your Personal Recovery Code shown below.");
      } else {
        const plain = await decryptVaultJson(blob, passphrase.trim());
        setEntries(JSON.parse(plain)); setUnlocked(true);
        setInfoMsg(isHe ? "הכספת פוענחה בהצלחה בדפדפן שלך בלבד." : "Vault decrypted locally.");
      }
    } catch { setErrorMsg(isHe ? "סיסמת מאסטר שגויה — לא ניתן לפענח." : "Wrong master passphrase."); }
  };

  const handleChangeVaultPassword = async () => {
    setErrorMsg(""); setInfoMsg("");
    if (!blob || newPassInput.trim().length < 8) { setErrorMsg(isHe ? "הזן סיסמה חדשה בת 8 תווים לפחות." : "New password must be 8+ chars."); return; }
    try {
      const verifiedPlain = await decryptVaultJson(blob, oldPassInput.trim());
      const parsed: VaultEntry[] = JSON.parse(verifiedPlain);
      setPassphrase(newPassInput.trim());
      await persistEncrypted(parsed, newPassInput.trim(), cipherAlgo, recoveryKey);
      setOldPassInput(""); setNewPassInput(""); setShowSecurityPanel(false);
      setInfoMsg(isHe ? `סיסמת הכספת שונתה והוצפנה מחדש ב-${cipherAlgo} 256-bit ✓` : `Vault password changed & re-encrypted with ${cipherAlgo} 256-bit ✓`);
    } catch { setErrorMsg(isHe ? "הסיסמה הקודמת שהזנת שגויה." : "Previous password is incorrect."); }
  };

    const submitResetRequestToAdmin = async () => {
    setErrorMsg(""); setInfoMsg("");
    if (!reqEmail.trim() || !reqNote.trim()) { setErrorMsg(isHe ? "הזן אימייל ופרט זיהוי לאימות מול מנהל המערכת." : "Enter email & identity note for admin verification."); return; }
    try {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "vault_reset_tickets").single();
      const existing: VaultResetTicket[] = Array.isArray(data?.value) ? data.value : [];
      const ticket: VaultResetTicket = { id: `tk-${Date.now()}`, userEmail: reqEmail.trim().toLowerCase(), requestType: reqType, verificationNote: reqNote.trim(), status: "pending", approvalCode: "", createdAt: new Date().toISOString() };
      await supabase.from("site_settings").upsert({ key: "vault_reset_tickets", value: [ticket, ...existing], updated_at: new Date().toISOString() });
      setInfoMsg(isHe ? "בקשת האימות נשלחה לאדמין! לאחר אימות זהותך לחץ על 'בדוק אישור אדמין'." : "Verification request sent to Admin! Click 'Check Admin Approval' once verified.");
    } catch { setErrorMsg(isHe ? "שגיאה בשליחת הבקשה." : "Failed to submit request."); }
  };

  const checkAdminApprovalStatus = async () => {
    if (!reqEmail.trim()) { setErrorMsg(isHe ? "הזן את האימייל שאיתו הגשת בקשה." : "Enter the email used in your request."); return; }
    const { data } = await supabase.from("site_settings").select("value").eq("key", "vault_reset_tickets").single();
    const list: VaultResetTicket[] = Array.isArray(data?.value) ? data.value : [];
    const approved = list.find((t) => t.userEmail === reqEmail.trim().toLowerCase() && t.status === "approved" && t.approvalCode);
    if (approved) { setRecAdminCode(approved.approvalCode); setInfoMsg(isHe ? `בקשתך אושרה! קוד האימות (${approved.approvalCode}) הוזן אוטומטית.` : `Approved! Code (${approved.approvalCode}) auto-filled.`); }
    else { setErrorMsg(isHe ? "הבקשה עדיין ממתינה לאימות מול מנהל המערכת." : "Request is still pending admin identity verification."); }
  };
  const handleRecoverVault = async () => {
    setErrorMsg(""); setInfoMsg("");
    if (!blob || recNewPass.trim().length < 8 || recUserCode.trim().length < 12) { setErrorMsg(isHe ? "הזן קוד שחזור אישי תקין וסיסמה חדשה (8+ תווים)." : "Enter valid personal recovery key & new password."); return; }
    try {
      if (requireAdminReset && !recAdminCode.trim()) { setErrorMsg(isHe ? "מדיניות האבטחה מחייבת אישור אדמין לפני שחזור או איפוס." : "Security policy requires Admin verification code."); return; } if (recAdminCode.trim()) {
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
      await persistEncrypted(entries.map((item) => item.id === editingId ? { ...item, title: title.trim(), category, targetAsset: targetAsset.trim() || "General", originSource: originSource.trim() || "Manual", actionUrl: cleanAction, secretValue: secretValue.trim(), purposeNote: purposeNote.trim(), envTag: envTag.trim(), isMemoryCipher } : item));
      setEditingId(null); setExternalTask(null);
      setInfoMsg(isHe ? "הפריט עודכן והוצפן מחדש בכספת." : "Entry updated & re-encrypted.");
    } else {
      const item: VaultEntry = { id: `sec-${Date.now()}`, title: title.trim(), category, targetAsset: targetAsset.trim() || (isHe ? "כללי" : "General"), originSource: originSource.trim() || (isHe ? "הזנה ידנית" : "Manual"), actionUrl: cleanAction, secretValue: secretValue.trim(), purposeNote: purposeNote.trim(), envTag: envTag.trim(), isMemoryCipher, createdAt: new Date().toISOString() };
      await persistEncrypted([item, ...entries]);
      setInfoMsg(isHe ? "הפריט הוצפן יחד עם כל ההקשר שלו ונשמר." : "Entry & context encrypted and saved.");
    }
    setTitle(""); setTargetAsset(""); setOriginSource(""); setActionUrl(""); setSecretValue(""); setPurposeNote(""); setIsMemoryCipher(false);
  };

  const rotateItemPassword = async (id: string) => {
    const freshPw = generateStrongPassword(20);
    await persistEncrypted(entries.map((x) => (x.id === id ? { ...x, secretValue: freshPw } : x)));
    setRevealedIds({ ...revealedIds, [id]: true });
    navigator.clipboard?.writeText(freshPw);
    setInfoMsg(isHe ? "נוצרה סיסמה חזקה חדשה, הוצפנה בכרטיס והועתקה ללוח!" : "New 20-char password generated, saved & copied!");
  };

    const copyWithAutoWipe = (val: string, id: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedId(id);
    setInfoMsg(isHe ? "הסוד הועתק! לוח ההעתקות ינוקה אוטומטית בעוד 30 שניות לאבטחה מקסימלית." : "Copied! Clipboard will auto-wipe in 30s for maximum security.");
    setTimeout(() => { setCopiedId(""); try { navigator.clipboard?.writeText(""); } catch {} }, 30000);
  };

  const copyAsEnvVar = (item: VaultEntry) => {
    const keyName = item.title.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "VAULT_SECRET";
    copyStr(`${keyName}="${item.secretValue}"`, `env-${item.id}`);
    setInfoMsg(isHe ? `הועתק כמשתנה סביבה (${keyName}) להדבקה ישירה בקובץ .env` : `Copied as .env variable (${keyName})`);
  };

  const duplicateEntry = async (item: VaultEntry) => {
    const copyItem: VaultEntry = { ...item, id: `sec-${Date.now()}`, title: `${item.title} (${isHe ? "עותק" : "Copy"})`, createdAt: new Date().toISOString() };
    await persistEncrypted([copyItem, ...entries]);
    setInfoMsg(isHe ? "הפריט שוכפל בהצלחה — לחץ ערוך לעדכון הערך." : "Item duplicated — click Edit to update value.");
  };
  const startEditEntry = (item: VaultEntry) => { setEditingId(item.id); setTitle(item.title); setCategory(item.category); setTargetAsset(item.targetAsset); setOriginSource(item.originSource); setActionUrl(item.actionUrl); setSecretValue(item.secretValue); setPurposeNote(item.purposeNote || ""); setEnvTag(item.envTag || "Production / ראשי"); setIsMemoryCipher(Boolean(item.isMemoryCipher)); };
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
  const copyStr = (val: string, id: string) => { navigator.clipboard?.writeText((val || "").trim()); setCopiedId(id); setTimeout(() => setCopiedId(""), 2200); };
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
          <button type="button" onClick={installVaultAsApp} className="btn-primary" style={{ height: 32, padding: "0 11px", fontSize: 11, width: "auto", background: "linear-gradient(135deg, #10b981, #059669)", color: "#05070a", fontWeight: 900 }}>{isHe ? "📲 התקן כאפליקציה" : "📲 Install App"}</button>
          <button type="button" onClick={launchAlwaysOnTopWidget} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#fbbf24", borderColor: "rgba(251,191,36,0.45)" }}><ExternalLink size={11} /> {isHe ? "ווידג׳ט צף (מחשב)" : "Floating Widget"}</button>
          <button type="button" onClick={() => setShowSmartGuide(!showSmartGuide)} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#38bdf8", borderColor: "rgba(56,189,248,0.45)" }}>{showSmartGuide ? (isHe ? "סגור מדריך חכם ✕" : "Close Smart Guide ✕") : (isHe ? "📘 מדריך חכם למשתמש" : "📘 Smart User Guide")}</button>
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
            {masterCertData && (
        <div style={{ padding: 16, borderRadius: 14, background: "linear-gradient(135deg, rgba(251,191,36,0.16), rgba(16,185,129,0.12))", border: "1.5px solid rgba(251,191,36,0.55)", marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <strong style={{ fontSize: 14, color: "#fbbf24" }}>{isHe ? "🔐 תעודת מפתח המאסטר שלך מוכנה — שמור אותה כעת מחוץ לכספת!" : "🔐 Your Master Key Certificate is Ready — Save It Outside the Vault Now!"}</strong>
            <span className="badge-pill" style={{ background: "rgba(251,191,36,0.2)", color: "#fef3c7", fontSize: 10.5 }}>{isHe ? "חובה לגבות לפני סגירה" : "Backup Required"}</span>
          </div>
          <p style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.55 }}>{isHe ? "מכיוון שהכספת פועלת בשיטת Zero-Knowledge, סיסמת המאסטר אינה נשמרת בשרתים שלנו. בחר כעת דרך בטוחה לשמור את סיסמת המאסטר ואת קוד השחזור מחוץ לכספת:" : "Because this is a Zero-Knowledge vault, your master key is never stored on our servers. Save your Master Passphrase & Recovery Key outside the vault now:"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, padding: 10, borderRadius: 10, background: "#05070a", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }}>
            <div><span style={{ color: "#94a3b8" }}>{isHe ? "סיסמת מאסטר:" : "Master Passphrase:"}</span> <code style={{ color: "#34d399", fontWeight: 800 }}>{masterCertData.pass}</code></div>
            <div><span style={{ color: "#94a3b8" }}>{isHe ? "קוד שחזור (24 תווים):" : "Recovery Key:"}</span> <code style={{ color: "#fbbf24", fontWeight: 800 }}>{masterCertData.rec}</code></div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" onClick={copyMasterCertToSheets} className="btn-primary" style={{ height: 34, padding: "0 14px", fontSize: 12, width: "auto" }}><FileSpreadsheet size={13} /> {copiedId === "cert-sheets" ? (isHe ? "הועתק לגוגל שיטס ✓" : "Copied for Sheets ✓") : (isHe ? "העתק תעודת מפתח ל-Google Sheets" : "Copy Certificate for Google Sheets")}</button>
            <button type="button" onClick={printMasterCertificate} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#38bdf8" }}><Printer size={13} /> {isHe ? "הדפס תעודת חירום / שמור PDF" : "Print / Save PDF Certificate"}</button>
            <button type="button" onClick={() => setMasterCertData(null)} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#34d399", borderColor: "rgba(52,211,153,0.45)" }}>{isHe ? "שמרתי במקום בטוח — המשך לכספת ✓" : "I Saved It Safely — Continue ✓"}</button>
          </div>
        </div>
      )}
      {recoveryKey && unlocked && <div style={{ padding: 10, borderRadius: 10, background: "rgba(251,191,36,0.14)", border: "1px solid rgba(251,191,36,0.4)", color: "#fef3c7", fontSize: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}><span><strong>{isHe ? "קוד השחזור האישי שלך (שמור במקום בטוח):" : "Your Personal Recovery Key:"}</strong> <code>{recoveryKey}</code></span><button type="button" onClick={() => copyStr(recoveryKey, "rec-key")} className="btn-ghost" style={{ height: 26, padding: "0 8px", fontSize: 11 }}>{copiedId === "rec-key" ? "Copied!" : "Copy Key"}</button></div>}
                  {showSmartGuide && (
        <div style={{ padding: 16, borderRadius: 14, background: "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(15,23,42,0.96))", border: "1px solid rgba(56,189,248,0.45)", marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 14, color: "#38bdf8" }}>{isHe ? "מדריך מהיר: איך להפיק מקסימום מהכספת החכמה (גם ללא ניסיון טכני)" : "Smart Vault Academy: Master Every Feature in 60 Seconds"}</strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, fontSize: 11.5, color: "#e2e8f0", lineHeight: 1.55 }}>
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(5,7,10,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}><strong style={{ color: "#fbbf24" }}>{isHe ? "1. למה הכספת שלנו חסינה מפריצות?" : "1. True Zero-Knowledge:"}</strong><br />{isHe ? "הסיסמה הראשית שלך לעולם לא נשמרת בשרת. הכל מוצפן מקומית בדפדפן ב-AES-256. שמור את קוד השחזור (24 תווים) במקום בטוח!" : "Your master passphrase never leaves your browser. Save your 24-char recovery key safely."}</div>
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(5,7,10,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}><strong style={{ color: "#34d399" }}>{isHe ? "2. שיטת 'רמז הצפנה אישי':" : "2. Personal Cipher Clues:"}</strong><br />{isHe ? "במקום לכתוב סיסמה אמיתית, לחץ על 'תבניות ורמזי הצפנה' ושמור רמז שרק אתה מבין (למשל: 'תאריך הלידה של הכלב + 4 ספרות ראשונות')." : "Store a personal clue only you understand instead of a raw password."}</div>
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(5,7,10,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}><strong style={{ color: "#38bdf8" }}>{isHe ? "3. עבודה צפה מכל מקום:" : "3. Floating & Mobile Workflow:"}</strong><br />{isHe ? "לחץ 'ווידג׳ט צף (מחשב)' להצמדת הכספת מעל כל תוכנה, או 'התקן כאפליקציה' בטלפון לשיתוף סודות ישירות מכל אפליקציה." : "Pin the Always-on-Top widget on desktop or install as a mobile app with Share Target."}</div>
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(5,7,10,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}><strong style={{ color: "#f472b6" }}>{isHe ? "4. גיבוי Google Sheets + ניקוי עקבות:" : "4. Google Sheets & Auto-Wipe:"}</strong><br />{isHe ? "העתק בלחיצה טבלה מסודרת בעברית תקינה לגוגל שיטס, והשתמש ב-'העתק + ניקוי לוח תוך 30 שניות' למניעת דליפת סיסמאות." : "1-click export to Google Sheets in Hebrew/English + 30s auto-wiping clipboard."}</div>
          </div>
        </div>
      )}
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
      <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(56,189,248,0.08)", border: "1px dashed rgba(56,189,248,0.35)", fontSize: 11.5, color: "#cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <span>{isHe ? "מחשב: גרור לסרגל הסימניות לשמירה מכל אתר | טלפון: השתמש בתפריט שתף (Share) מכל אפליקציה אל הכספת:" : "Desktop: Drag to bookmarks bar | Mobile: Use system Share from any app to Vault:"}</span>
        <a href="javascript:(function(){var t=encodeURIComponent(document.title);var u=encodeURIComponent(location.href);window.open('https://studio://');})();" onClick={(e) => e.preventDefault()} className="badge-pill" style={{ background: "#0f172a", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.5)", cursor: "grab", textDecoration: "none", fontWeight: 800 }}>🔐 {isHe ? "שמור בכספת ProofCraft" : "Clip to ProofCraft Vault"}</a>
      </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 12px", borderRadius: 12, background: "rgba(15,23,42,0.85)", border: "1px solid rgba(56,189,248,0.28)", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: "#94a3b8" }}>{isHe ? "מצב עבודה חכם:" : "Workspace Persona:"}</span>
          <button type="button" onClick={() => setVaultPersona("personal")} className={vaultPersona === "personal" ? "btn-primary" : "btn-ghost"} style={{ height: 30, padding: "0 12px", fontSize: 11.5, width: "auto" }}>{isHe ? "👤 שימוש אישי ואתרים (יום-יום)" : "👤 Personal & Everyday Logins"}</button>
          <button type="button" onClick={() => setVaultPersona("dev")} className={vaultPersona === "dev" ? "btn-primary" : "btn-ghost"} style={{ height: 30, padding: "0 12px", fontSize: 11.5, width: "auto" }}>{isHe ? "💻 מפתחים ופרויקטים (Dev & API)" : "💻 Developers & Projects"}</button>
        </div>
        {vaultPersona === "dev" && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#fbbf24", fontWeight: 700 }}>{isHe ? "היקף פרויקט:" : "Project Scale:"}</span>
            <select value={projectScale} onChange={(e) => setProjectScale(e.target.value as "mvp" | "enterprise")} className="input-dark" style={{ height: 28, fontSize: 11, padding: "0 8px" }}>
              <option value="mvp">{isHe ? "פרויקט MVP / סטארטאפ קטן" : "Small MVP / Startup"}</option>
              <option value="enterprise">{isHe ? "Enterprise מרובה-סביבות" : "Multi-Env Enterprise"}</option>
            </select>
          </div>
        )}
      </div>

      {preFlightItem && (
        <div style={{ padding: 14, borderRadius: 14, background: "linear-gradient(135deg, rgba(56,189,248,0.14), rgba(15,23,42,0.96))", border: "1px solid rgba(56,189,248,0.5)", marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
            <strong style={{ fontSize: 13.5, color: "#38bdf8" }}>{isHe ? `תדריך הקשר לפני יציאה מהכספת: ${preFlightItem.title}` : `Pre-Flight Context Briefing: ${preFlightItem.title}`}</strong>
            <button type="button" onClick={() => setPreFlightItem(null)} className="btn-ghost" style={{ height: 26, padding: "0 8px", fontSize: 11 }}>✕</button>
          </div>
          <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.55 }}>
            <div><strong>{isHe ? "1. מטרת הפעולה בחוץ:" : "1. External Action Goal:"}</strong> {preFlightItem.purposeNote || (isHe ? `התחברות או הפקת מפתח מעודכן עבור ${preFlightItem.targetAsset}` : `Authenticate or generate key for ${preFlightItem.targetAsset}`)}</div>
            <div><strong>{isHe ? "2. מה לעשות באתר החיצוני?" : "2. What to do outside?"}</strong> {isHe ? "היכנס לחשבון/דשבורד, העתק את הסיסמה או המפתח החדש ללוח (Copy), וחזור לכאן." : "Log in or generate your new key, copy it to clipboard, and return here."}</div>
            <div><strong>{isHe ? "3. בחזרה לכספת:" : "3. Upon Return:"}</strong> {isHe ? "סרגל המעקב הצהוב ימתין לך בראש הכספת לעדכון הערך ב-1 קליק בלי לאבד הקשר." : "The pinned yellow return bar will let you update the secret in 1 click."}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={preFlightItem.actionUrl} target="_blank" rel="noopener noreferrer" onClick={() => { setExternalTask({ itemId: preFlightItem.id, title: preFlightItem.title, targetAsset: preFlightItem.targetAsset, url: preFlightItem.actionUrl }); setPreFlightItem(null); }} className="btn-primary" style={{ height: 32, padding: "0 14px", fontSize: 12, width: "auto" }}><ExternalLink size={12} /> {isHe ? "אישור ויציאה לאתר החיצוני ↗" : "Launch External Site Now ↗"}</a>
            <button type="button" onClick={() => { copyStr(preFlightItem.secretValue, preFlightItem.id); }} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 11.5, color: "#34d399" }}>{isHe ? "העתק ערך קיים לפני יציאה" : "Copy Current Value First"}</button>
          </div>
        </div>
      )}
      {!unlocked ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <select value={cipherAlgo} onChange={(e) => setCipherAlgo(e.target.value as CipherAlgo)} className="input-dark" style={{ height: 40, fontSize: 12, padding: "0 10px" }}><option value="AES-GCM">AES-GCM 256-bit</option><option value="AES-CBC">AES-CBC 256-bit</option></select>
            <div style={{ flex: 1, minWidth: 210, display: "flex", gap: 4 }}><input type={showMasterPass ? "text" : "password"} value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder={blob ? (isHe ? "הזן סיסמת מאסטר לפענוח הכספת..." : "Enter master passphrase...") : (isHe ? "בחר סיסמת מאסטר (8+ תווים) ליצירת כספת..." : "Create master passphrase (8+ chars)...")} className="input-dark" style={{ flex: 1, height: 40, fontSize: 13 }} /><button type="button" onClick={() => setShowMasterPass(!showMasterPass)} className="btn-ghost" style={{ height: 40, padding: "0 10px" }}>{showMasterPass ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>
            <button type="button" onClick={handleUnlockOrCreate} className="btn-primary" style={{ height: 40, padding: "0 18px", fontSize: 12.5, width: "auto" }}><Unlock size={14} /> {blob ? (isHe ? "פענח ופתח כספת" : "Decrypt & Unlock") : (isHe ? "צור כספת מוצפנת בחינם" : "Create Free Vault")}</button>
            <button type="button" onClick={() => { setGenPwPreview(generateCustomPassword(genPwLen, genUseNum, genUseSym)); setShowPwForge(!showPwForge); }} className="btn-ghost" style={{ height: 40, padding: "0 14px", fontSize: 12.5, color: "#34d399", borderColor: "rgba(52,211,153,0.45)" }}><RefreshCw size={13} /> {isHe ? "מחולל סיסמאות" : "Password Forge"}</button>
            {blob && <button type="button" onClick={() => setShowRecoverBox(!showRecoverBox)} className="btn-ghost" style={{ height: 40, padding: "0 12px", fontSize: 12, color: "#fbbf24" }}>{isHe ? "שכחתי סיסמה / שחזור" : "Recover Vault"}</button>}
          </div>
                    {showRecoverBox && blob && (
            <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.35)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24" }}>{isHe ? "1. בקשת אימות זהות מול מנהל המערכת (מונע התחזות ופריצה):" : "1. Request Identity Verification from Admin:"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8 }}>
                <input value={reqEmail} onChange={(e) => setReqEmail(e.target.value)} placeholder={isHe ? "האימייל שלך לאימות..." : "Your email..."} className="input-dark" style={{ height: 34, fontSize: 12 }} />
                <select value={reqType} onChange={(e) => setReqType(e.target.value as "recover_with_key" | "full_wipe_reset")} className="input-dark" style={{ height: 36, fontSize: 12, padding: "0 10px", minWidth: 190 }}><option value="recover_with_key">{isHe ? "שחזור עם קוד אישי" : "Recover with Key"}</option><option value="full_wipe_reset">{isHe ? "איפוס מלא מאפס" : "Full Wipe Reset"}</option></select>
                <input value={reqNote} onChange={(e) => setReqNote(e.target.value)} placeholder={isHe ? "פרט זיהוי לאימות מול האדמין (טלפון/הערה)..." : "Identity verification note..."} className="input-dark" style={{ height: 34, fontSize: 12 }} />
                <div style={{ display: "flex", gap: 6 }}><button type="button" onClick={submitResetRequestToAdmin} className="btn-ghost" style={{ height: 34, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}>{isHe ? "שלח בקשה לאדמין" : "Request Approval"}</button><button type="button" onClick={checkAdminApprovalStatus} className="btn-ghost" style={{ height: 34, padding: "0 10px", fontSize: 11, color: "#34d399" }}>{isHe ? "בדוק אישור" : "Check Status"}</button></div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#34d399" }}>{isHe ? "2. ביצוע שחזור עם קוד אישי + קוד אישור אדמין:" : "2. Execute Recovery with Personal Key + Admin Code:"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8 }}>
                <input value={recUserCode} onChange={(e) => setRecUserCode(e.target.value)} placeholder={isHe ? "קוד שחזור אישי (24 תווים)" : "Personal Recovery Code"} className="input-dark" style={{ height: 34, fontSize: 12 }} />
                <input value={recAdminCode} onChange={(e) => setRecAdminCode(e.target.value)} placeholder={isHe ? "קוד אישור אדמין (VLT-...)" : "Admin Approval Code"} className="input-dark" style={{ height: 34, fontSize: 12 }} />
                <input type="password" value={recNewPass} onChange={(e) => setRecNewPass(e.target.value)} placeholder={isHe ? "סיסמת מאסטר חדשה (8+ תווים)" : "New Master Passphrase"} className="input-dark" style={{ height: 34, fontSize: 12 }} />
                <button type="button" onClick={handleRecoverVault} className="btn-primary" style={{ height: 34, fontSize: 12, width: "auto" }}><ShieldCheck size={13} /> {isHe ? "שחזר והגדר סיסמה" : "Recover & Set Password"}</button>
              </div>
              <div style={{ borderTop: "1px solid rgba(248,113,113,0.25)", paddingTop: 8, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#fca5a5" }}>{isHe ? "איפוס הרסני מאפס (מוחק לצמיתות את כל הנתונים): הקלד RESET VAULT:" : "Permanent Wipe Reset (destroys all data): Type RESET VAULT:"}</span>
                <input value={wipeConfirmText} onChange={(e) => setWipeConfirmText(e.target.value)} placeholder="RESET VAULT" className="input-dark" style={{ width: 130, height: 30, fontSize: 11 }} />
                <button type="button" onClick={async () => { if (wipeConfirmText.trim() !== "RESET VAULT") { setErrorMsg(isHe ? "הקלד RESET VAULT במדויק לאישור." : "Type exact RESET VAULT."); return; } if (requireAdminReset) { if (!recAdminCode.trim()) { setErrorMsg(isHe ? "נדרש קוד אישור אדמין (VLT-...) לביצוע איפוס." : "Admin approval code required."); return; } const { data } = await supabase.from("site_settings").select("value").eq("key", "vault_reset_tickets").single(); const list: VaultResetTicket[] = Array.isArray(data?.value) ? data.value : []; const ok = list.find((t) => t.approvalCode === recAdminCode.trim() && t.status === "approved"); if (!ok) { setErrorMsg(isHe ? "קוד האדמין אינו מאושר או שגוי." : "Invalid or unapproved admin code."); return; } } localStorage.removeItem(storageKey); setBlob(null); setEntries([]); setUnlocked(false); setShowRecoverBox(false); setWipeConfirmText(""); setErrorMsg(""); setInfoMsg(isHe ? "הכספת הישנה הושמדה לצמיתות באישור. הקם כספת חדשה כעת." : "Old vault wiped with authorization. Create a new vault now."); }} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#f87171" }}>{isHe ? "השמד כספת ישנה והתחל מאפס" : "Wipe & Start Fresh"}</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
          {showSecurityPanel && (
            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.35)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 8, alignItems: "center" }}>
              <div style={{ gridColumn: "1 / -1", padding: "8px 10px", borderRadius: 8, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", fontSize: 11.5, color: "#fef3c7", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}><span><strong>{isHe ? "קוד שחזור אישי פעיל (שמור במקום בטוח):" : "Active Personal Recovery Key:"}</strong> <code>{recoveryKey || (isHe ? "נוצר בעת הקמת הכספת" : "Generated on creation")}</code></span>{recoveryKey && <button type="button" onClick={() => copyStr(recoveryKey, "sec-rec")} className="btn-ghost" style={{ height: 26, padding: "0 8px", fontSize: 11 }}>{copiedId === "sec-rec" ? "Copied!" : (isHe ? "העתק" : "Copy")}</button>}</div>
              <select value={cipherAlgo} onChange={(e) => setCipherAlgo(e.target.value as CipherAlgo)} className="input-dark" style={{ height: 34, fontSize: 12 }}><option value="AES-GCM">AES-GCM 256-bit (Recommended)</option><option value="AES-CBC">AES-CBC 256-bit</option></select>
              <input type="password" value={oldPassInput} onChange={(e) => setOldPassInput(e.target.value)} placeholder={isHe ? "סיסמת כספת נוכחית..." : "Current Vault Password..."} className="input-dark" style={{ height: 34, fontSize: 12 }} />
              <input type="password" value={newPassInput} onChange={(e) => setNewPassInput(e.target.value)} placeholder={isHe ? "סיסמת כספת חדשה (8+ תווים)..." : "New Vault Password (8+ chars)..."} className="input-dark" style={{ height: 34, fontSize: 12 }} />
              <button type="button" onClick={handleChangeVaultPassword} className="btn-primary" style={{ height: 34, fontSize: 12, width: "auto" }}>{isHe ? "שנה סיסמה והצפן מחדש" : "Change Password & Re-Encrypt"}</button>
            </div>
          )}
          {showHelperDeck && (
            <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.3)", display: "flex", flexDirection: "column", gap: 8 }}>
              <strong style={{ fontSize: 12, color: "#fbbf24" }}>{isHe ? "תבניות מהירות למפתחים וליום-יום:" : "Quick Dev & Daily Templates:"}</strong>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{VAULT_QUICK_TEMPLATES.filter((t) => t.persona === vaultPersona).map((tpl) => (<button key={tpl.id} type="button" onClick={() => { setTitle(isHe ? tpl.labelHe : tpl.labelEn); setCategory(tpl.category); setTargetAsset(tpl.targetAsset); setOriginSource(tpl.originSource); setActionUrl(tpl.actionUrl); setPurposeNote(isHe ? tpl.purposeHe : tpl.purposeEn); }} className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11 }}>{isHe ? tpl.labelHe : tpl.labelEn}</button>))}</div>
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
              <div style={{ display: "flex", gap: 5 }}><input type="text" value={secretValue} onChange={(e) => setSecretValue(e.target.value)} placeholder={category === "crypto_seed" ? (isHe ? "הדבק 12 או 24 מילים..." : "Paste 12/24 words...") : (isHe ? "הזן ערך או לחץ לחולל ->" : "Enter value or generate ->")} className="input-dark" style={{ flex: 1, height: 38, fontSize: 12.5 }} /><button type="button" onClick={() => { setSecretValue(generateCustomPassword(genPwLen, genUseNum, genUseSym)); setInfoMsg(isHe ? "חוללה סיסמה חזקה!" : "Strong password generated!"); }} className="btn-ghost" style={{ height: 38, padding: "0 10px", fontSize: 11, color: "#34d399" }} title="Generate Strong Password"><RefreshCw size={13} /></button><button type="button" onClick={smartPasteFromClipboard} className="btn-ghost" style={{ height: 38, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}>{isHe ? "קלוט מהלוח" : "Clip Paste"}</button></div>
            </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label onClick={() => setActiveFieldHelp(isHe ? "הסבר ברור למה הפריט הזה נוצר ואיזו פעולה עסקית או טכנית הוא משרת." : "Clear explanation of why this item exists and its purpose.")} style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}><Info size={12} color="#fbbf24" /> {isHe ? "מטרת הפריט והשימוש (הקשר מלא)" : "Item Purpose & Full Context"}</label>
              <input value={purposeNote} onChange={(e) => setPurposeNote(e.target.value)} placeholder={vaultPersona === "dev" ? (isHe ? "למשל: מפתח חיבור ל-Production DB + גיבוי" : "e.g. Production DB connection key") : (isHe ? "למשל: כניסה לחשבון ראשי להורדת דוחות" : "e.g. Main account login for statements")} className="input-dark" style={{ height: 38, fontSize: 12.5 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label onClick={() => setActiveFieldHelp(isHe ? "במצב 'הצפנת זיכרון אישי' אינך שומר את הסיסמה האמיתית אלא נוסחת רמז שרק אתה מבין מהחיים האישיים!" : "In Personal Memory Cipher mode, store a personal life clue only you can decode — never the raw password!")} style={{ fontSize: 11, fontWeight: 700, color: "#34d399", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}><Info size={12} color="#34d399" /> {isHe ? "מצב אבטחה: סיסמה או רמז זיכרון אישי?" : "Security Mode: Secret or Memory Clue?"}</label>
              <button type="button" onClick={() => setIsMemoryCipher(!isMemoryCipher)} className="btn-ghost" style={{ height: 38, fontSize: 11.5, color: isMemoryCipher ? "#34d399" : "#cbd5e1", borderColor: isMemoryCipher ? "rgba(52,211,153,0.5)" : undefined }}>{isMemoryCipher ? (isHe ? "🧠 פעיל: רמז זיכרון אישי (ללא סיסמה גלויה)" : "🧠 Active: Personal Memory Clue") : (isHe ? "🔐 שמירת ערך מוצפן רגיל" : "🔐 Standard Encrypted Value")}</button>
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
                      {item.purposeNote && <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", fontSize: 12, color: "#fef3c7" }}><strong>{isHe ? "מטרת הפריט והשימוש המקצועי:" : "Purpose & Scope:"}</strong> {item.purposeNote}</div>}
                      {isShown ? renderSecretDisplay(item) : <div style={{ padding: "8px 12px", borderRadius: 8, background: "#05070a", fontFamily: "monospace", fontSize: 12.5, color: "#64748b" }}>••••••••••••••••••••••••••••••••</div>}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 4 }}>
                        <button type="button" onClick={() => setRevealedIds({ ...revealedIds, [item.id]: !isShown })} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>{isShown ? <EyeOff size={12} /> : <Eye size={12} />} {isShown ? (isHe ? "הסתר ערך" : "Hide") : (isHe ? "חשוף ערך" : "Reveal")}</button>
                        <button type="button" onClick={() => copyStr(item.secretValue, item.id)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#34d399" }}><Copy size={12} /> {isHe ? "העתק סוד" : "Copy Secret"}</button>
                        <button type="button" onClick={() => copyStr(`${item.title} | ${item.targetAsset} | ${item.originSource} -> ${item.secretValue}`, `ctx-${item.id}`)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>{copiedId === `ctx-${item.id}` ? (isHe ? "הקשר הועתק!" : "Context Copied!") : (isHe ? "העתק הקשר מלא" : "Copy Full Context")}</button>
                        <button type="button" onClick={() => copyWithAutoWipe(item.secretValue, `wipe-${item.id}`)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#10b981", borderColor: "rgba(16,185,129,0.4)" }}>{copiedId === `wipe-${item.id}` ? (isHe ? "הועתק (יימחק תוך 30 שנ׳)" : "Auto-Wipe 30s!") : (isHe ? "העתק + ניקוי לוח (30 שנ׳)" : "Copy + 30s Wipe")}</button>
                        <button type="button" onClick={() => copyAsEnvVar(item)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#a78bfa" }}>{copiedId === `env-${item.id}` ? (isHe ? "הועתק כ-.env!" : "Copied .env!") : (isHe ? "העתק כ-.env" : "Copy .env")}</button>
                        <button type="button" onClick={() => duplicateEntry(item)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>{isHe ? "שכפל פריט" : "Duplicate"}</button>
                        <button type="button" onClick={() => rotateItemPassword(item.id)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#fbbf24" }}><RefreshCw size={12} /> {isHe ? "החלף לסיסמה חדשה" : "Rotate Password"}</button>
                        <button type="button" onClick={() => startEditEntry(item)} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#38bdf8" }}><Edit3 size={12} /> {isHe ? "ערוך פריט" : "Edit"}</button>
                        {item.actionUrl && <button type="button" onClick={() => setPreFlightItem(item)} className="btn-primary" style={{ height: 30, padding: "0 12px", fontSize: 11.5, width: "auto" }}><ExternalLink size={12} /> {isHe ? "תדריך ויציאה ליעד ↗" : "Briefing & Launch ↗"}</button>}
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
      <div style={{ position: "sticky", bottom: 10, zIndex: 50, marginTop: 14, padding: "8px 10px", borderRadius: 14, background: "rgba(10,11,14,0.94)", backdropFilter: "blur(8px)", border: "1px solid rgba(56,189,248,0.35)", display: "flex", justifyContent: "space-around", alignItems: "center", gap: 6 }}>
        <button type="button" onClick={smartPasteFromClipboard} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}>{isHe ? "📋 קלוט מהלוח" : "📋 Clip Paste"}</button>
        <button type="button" onClick={() => { setGenPwPreview(generateCustomPassword(genPwLen, genUseNum, genUseSym)); setShowPwForge(!showPwForge); }} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11, color: "#34d399" }}>{isHe ? "🔑 מחולל סיסמאות" : "🔑 Password Forge"}</button>
        <button type="button" onClick={installVaultAsApp} className="btn-primary" style={{ height: 32, padding: "0 11px", fontSize: 11, width: "auto" }}>{isHe ? "📲 התקן אפליקציה" : "📲 Install App"}</button>
      </div>
    </section>
  );
}