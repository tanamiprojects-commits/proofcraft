"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, Copy, Download, Eye, EyeOff, ExternalLink, KeyRound, Lock, Plus, Share2, ShieldAlert, ShieldCheck, Trash2, Unlock } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";
import { supabase } from "@/lib/supabase";
import { decryptVaultJson, EncryptedVaultBlob, encryptVaultJson } from "@/lib/zero-knowledge-crypto";

export type VaultCategory = "crypto_seed" | "api_secrets" | "passwords" | "project_memory";

export interface VaultEntry {
  id: string;
  title: string;
  category: VaultCategory;
  targetAsset: string;
  originSource: string;
  actionUrl: string;
  secretValue: string;
  createdAt: string;
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
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [govNotice, setGovNotice] = useState("");
  const [govDisabled, setGovDisabled] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<VaultCategory>("crypto_seed");
  const [targetAsset, setTargetAsset] = useState("");
  const [originSource, setOriginSource] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [secretValue, setSecretValue] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setBlob(JSON.parse(raw)); (async () => { try { const { data } = await supabase.from("site_settings").select("value").eq("key", "vault_governance").single(); if (data?.value) { if (data.value.enabled === false) setGovDisabled(true); if (data.value.notice) setGovNotice(data.value.notice); } } catch {} })();
    } catch {}
  }, [storageKey]);

  const handleUnlockOrCreate = async () => {
    setErrorMsg(""); setInfoMsg("");
    if (passphrase.trim().length < 8) {
      setErrorMsg(isHe ? "סיסמת המאסטר חייבת להכיל לפחות 8 תווים." : "Master passphrase must be at least 8 characters.");
      return;
    }
    try {
      if (!blob) {
        const freshBlob = await encryptVaultJson(JSON.stringify([]), passphrase);
        localStorage.setItem(storageKey, JSON.stringify(freshBlob));
        setBlob(freshBlob); setEntries([]); setUnlocked(true);
        setInfoMsg(isHe ? "הכספת האישית שלך הוקמה והוצפנה מקומית ב-AES-GCM 256-bit." : "Your personal AES-GCM 256-bit vault is ready.");
      } else {
        const plain = await decryptVaultJson(blob, passphrase);
        setEntries(JSON.parse(plain)); setUnlocked(true);
        setInfoMsg(isHe ? "הכספת פוענחה בהצלחה בדפדפן שלך בלבד." : "Vault decrypted locally in your browser.");
      }
    } catch {
      setErrorMsg(isHe ? "סיסמת מאסטר שגויה — לא ניתן לפענח את הכספת." : "Wrong master passphrase — decryption failed.");
    }
  };
  const persistEncrypted = async (nextList: VaultEntry[]) => {
    setEntries(nextList);
    const nextBlob = await encryptVaultJson(JSON.stringify(nextList), passphrase);
    localStorage.setItem(storageKey, JSON.stringify(nextBlob));
    setBlob(nextBlob);
  };

  const handleAddEntry = async () => {
    if (!title.trim() || !secretValue.trim()) return;
    const cleanAction = actionUrl.trim() ? (actionUrl.trim().startsWith("http") ? actionUrl.trim() : `https://${actionUrl.trim()}`) : "";
    const item: VaultEntry = { id: `sec-${Date.now()}`, title: title.trim(), category, targetAsset: targetAsset.trim() || (isHe ? "כללי" : "General"), originSource: originSource.trim() || (isHe ? "הזנה ידנית" : "Manual entry"), actionUrl: cleanAction, secretValue: secretValue.trim(), createdAt: new Date().toISOString() };
    await persistEncrypted([item, ...entries]);
    setTitle(""); setTargetAsset(""); setOriginSource(""); setActionUrl(""); setSecretValue("");
    setInfoMsg(isHe ? "הפריט הוצפן יחד עם כל ההקשר שלו ונשמר בכספת." : "Item & full context encrypted and saved.");
  };

  const lockVaultNow = () => { setUnlocked(false); setEntries([]); setPassphrase(""); setRevealedIds({}); setInfoMsg(isHe ? "הכספת ננעלה והזיכרון נוקה מיידית." : "Vault locked & memory cleared."); };
  const copyStr = (val: string, id: string) => { navigator.clipboard?.writeText(val); setCopiedId(id); setTimeout(() => setCopiedId(""), 2200); };
  const exportEncryptedBackup = () => { if (!blob) return; const url = URL.createObjectURL(new Blob([JSON.stringify(blob, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = "tanami360-zk-vault-backup.json"; a.click(); };
  const shareVaultText = isHe ? `כלי אבטחה חינמי ושימושי: כספת Zero-Knowledge מוצפנת (AES-256) לשמירת סיסמאות, מפתחות פרויקטים וביטויי 12/24 מילים של ארנקי קריפטו עם הקשר מלא — עובד 100% בדפדפן בלי לשמור כלום בשרת:\n${subDomain}/vault` : `Free Zero-Knowledge AES-256 Vault for passwords, project keys & 12/24-word crypto recovery phrases with full context — runs 100% locally in your browser:\n${subDomain}/vault`;
  const catLabels: Record<VaultCategory, string> = isHe ? { crypto_seed: "ארנק קריפטו (12/24 מילים)", api_secrets: "מפתחות API וסודות פיתוח", passwords: "סיסמאות וחשבונות", project_memory: "זיכרון והקשר פרויקט" } : { crypto_seed: "Crypto Seed (12/24 Words)", api_secrets: "API Keys & Dev Secrets", passwords: "Passwords & Accounts", project_memory: "Project Memory & Context" };
  const visibleEntries = entries.filter((e) => filterCat === "all" || e.category === filterCat);

  const renderSecretDisplay = (item: VaultEntry) => {
    if (item.category === "crypto_seed") {
      const words = item.secretValue.split(/[\s,]+/).filter(Boolean);
      return (<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: 6, marginTop: 6 }}>{words.map((w, idx) => (<div key={idx} style={{ padding: "4px 7px", borderRadius: 6, background: "#05070a", border: "1px solid rgba(52,211,153,0.25)", fontFamily: "monospace", fontSize: 11.5, color: "#34d399" }}><span style={{ color: "#64748b", marginInlineEnd: 4 }}>#{idx + 1}</span>{w}</div>))}</div>);
    }
    return <div style={{ marginTop: 6, padding: "7px 10px", borderRadius: 8, background: "#05070a", fontFamily: "monospace", fontSize: 12, color: "#34d399", wordBreak: "break-all" }}>{item.secretValue}</div>;
  };
  return (
    <section dir={isHe ? "rtl" : "ltr"} className="card-hero" style={{ padding: 20, marginBottom: 20, border: "1px solid rgba(251,191,36,0.38)", textAlign: isHe ? "right" : "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)", fontSize: 11 }}><KeyRound size={12} /> {isHe ? "כספת סודות, קריפטו והקשר · ZERO-KNOWLEDGE AES-256" : "ZERO-KNOWLEDGE CONTEXT & CRYPTO VAULT"}</span>
          <h2 style={{ fontSize: 19, fontWeight: 900, color: "#f8fafc", marginTop: 6 }}>{isHe ? "הכספת החכמה: שמירה מוצפנת עם זיכרון מלא (למה, מאיפה ולאן זה שייך)" : "Context-Rich Encrypted Vault"}</h2>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!standalone && <a href="/vault" className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 11.5, color: "#38bdf8" }}><ExternalLink size={12} /> {isHe ? "פתח כספת במצב עצמאי נקי" : "Standalone Vault"}</a>}
          {unlocked && <button type="button" onClick={exportEncryptedBackup} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 11.5, color: "#34d399" }}><Download size={12} /> {isHe ? "ייצא גיבוי מוצפן" : "Export Backup"}</button>}
          {unlocked && <button type="button" onClick={lockVaultNow} className="btn-primary" style={{ height: 34, padding: "0 12px", fontSize: 11.5, width: "auto", background: "#fbbf24", color: "#0a0b0e" }}><Lock size={12} /> {isHe ? "נעל כספת" : "Lock Vault"}</button>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, padding: 12, borderRadius: 12, background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.22)", fontSize: 11.5, color: "#cbd5e1", marginBottom: 12 }}>
        <div><strong style={{ color: "#38bdf8" }}>{isHe ? "1. למה הכספת הזו שונה?" : "1. Context-First Memory:"}</strong> {isHe ? "לכל סיסמה, מפתח API או 12/24 מילים של קריפטו מצמידים הקשר מלא (מאיפה התקבל, לאיזה נכס שייך וקישור פעולה)." : "Attach origin, target asset & direct action link to every secret or seed."}</div>
        <div><strong style={{ color: "#34d399" }}>{isHe ? "2. הצפנת Zero-Knowledge:" : "2. True Zero-Knowledge:"}</strong> {isHe ? "המידע מוצפן בדפדפן שלך (PBKDF2 250k + AES-256). גם במקרה של פריצה לשרת — רואים רק בלוק מוצפן בלתי קריא." : "Encrypted locally in browser. Server breach reveals only unreadable ciphertext."}</div>
        <div><strong style={{ color: "#fbbf24" }}>{isHe ? "3. אזהרת אחריות מחייבת:" : "3. Mandatory Responsibility:"}</strong> {isHe ? "סיסמת המאסטר לא נשמרת בשום שרת. אובדן הסיסמה מונע שחזור לצמיתות — הורד גיבוי מוצפן ושמור אותו במקום בטוח." : "Master passphrase is never stored. Keep an encrypted backup safe."}</div>
      </div>
      {govDisabled && <div style={{ padding: 12, borderRadius: 10, background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 12.5, fontWeight: 800, marginBottom: 10 }}>{isHe ? "הכספת נמצאת כרגע בתחזוקה יזומה על ידי מנהל המערכת. הנתונים המוצפנים שלך שמורים בבטחה." : "Vault is currently in scheduled maintenance. Your encrypted data remains safe."}</div>}{govNotice && <div style={{ padding: 10, borderRadius: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{govNotice}</div>}
      {errorMsg && <div style={{ padding: 10, borderRadius: 10, background: "rgba(248,113,113,0.15)", color: "#f87171", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{errorMsg}</div>}
      {infoMsg && <div style={{ padding: 10, borderRadius: 10, background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{infoMsg}</div>}
      {!unlocked ? (
        <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder={blob ? (isHe ? "הזן סיסמת מאסטר לפענוח הכספת שלך..." : "Enter master passphrase...") : (isHe ? "בחר סיסמת מאסטר אישית (8+ תווים) ליצירת כספת חינמית..." : "Create master passphrase (8+ chars)...")} className="input-dark" style={{ flex: 1, minWidth: 240, height: 40, fontSize: 13 }} />
          <button type="button" onClick={handleUnlockOrCreate} className="btn-primary" style={{ height: 40, padding: "0 18px", fontSize: 12.5, width: "auto" }}><Unlock size={14} /> {blob ? (isHe ? "פענח ופתח כספת" : "Decrypt & Unlock") : (isHe ? "צור כספת מוצפנת בחינם" : "Create Free Vault")}</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.25)" }}>
            <select value={category} onChange={(e) => setCategory(e.target.value as VaultCategory)} className="input-dark" style={{ height: 36, fontSize: 12 }}>{(Object.keys(catLabels) as VaultCategory[]).map((k) => (<option key={k} value={k}>{catLabels[k]}</option>))}</select>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isHe ? "שם הפריט (ארנק Ledger / מפתח API)" : "Item Title"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <input value={targetAsset} onChange={(e) => setTargetAsset(e.target.value)} placeholder={isHe ? "לאיזה נכס/רשת שייך? (ETH / Tanami360)" : "Target Asset"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <input value={originSource} onChange={(e) => setOriginSource(e.target.value)} placeholder={isHe ? "מאיפה ואיך התקבל? (MetaMask / Vercel)" : "Origin & Source"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <input value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} placeholder={isHe ? "קישור פעולה ישיר (https://...)" : "Direct Action URL"} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <input type="password" value={secretValue} onChange={(e) => setSecretValue(e.target.value)} placeholder={category === "crypto_seed" ? (isHe ? "הדבק 12 או 24 מילים מופרדות ברווח..." : "Paste 12 or 24 words...") : (isHe ? "הסוד / הסיסמה / המפתח להצפנה..." : "Secret to encrypt...")} className="input-dark" style={{ height: 36, fontSize: 12 }} />
            <button type="button" onClick={handleAddEntry} className="btn-primary" style={{ height: 36, fontSize: 12, width: "auto" }}><Plus size={13} /> {isHe ? "הצפן ושמור עם הקשר" : "Encrypt & Save"}</button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setFilterCat("all")} className={filterCat === "all" ? "btn-primary" : "btn-ghost"} style={{ height: 30, padding: "0 10px", fontSize: 11, width: "auto" }}>{isHe ? `הכל (${entries.length})` : `All (${entries.length})`}</button>
            {(Object.keys(catLabels) as VaultCategory[]).map((k) => (<button key={k} type="button" onClick={() => setFilterCat(k)} className={filterCat === k ? "btn-primary" : "btn-ghost"} style={{ height: 30, padding: "0 10px", fontSize: 11, width: "auto" }}>{catLabels[k]}</button>))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 10 }}>
            {visibleEntries.map((item) => {
              const isShown = Boolean(revealedIds[item.id]);
              return (
                <div key={item.id} style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}><span className="badge-pill" style={{ fontSize: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>{catLabels[item.category]}</span><button type="button" onClick={() => persistEncrypted(entries.filter((x) => x.id !== item.id))} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><Trash2 size={13} /></button></div>
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
        <div style={{ fontSize: 11.5, color: "#cbd5e1" }}><strong style={{ color: "#34d399" }}>{isHe ? "שתף את הכספת החינמית והגדל חשיפה אורגנית:" : "Share Free Vault:"}</strong> {isHe ? "הפץ את הכספת המוצפנת לחברים, מפתחים ומשקיעי קריפטו — ללא צורך בהרשמה." : "Share standalone Zero-Knowledge Vault—free, no signup."}</div>
        <button type="button" onClick={() => copyStr(shareVaultText, "share-vault")} className="btn-ghost" style={{ height: 30, padding: "0 12px", fontSize: 11.5, color: "#34d399" }}><Share2 size={12} /> {copiedId === "share-vault" ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק הודעת שיתוף לכספת" : "Copy Share Post")}</button>
      </div>
    </section>
  );
}