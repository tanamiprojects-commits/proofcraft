"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_META, ContextStudioConfig, DEFAULT_STUDIO_CONFIG, PacketCategory,
  SupportedLang, buildContextPackets, detectLanguageFromText, matchSmartRecommendations,
} from "@/lib/context-packet-engine";
import {
  Check, ClipboardPaste, Copy, Download, ExternalLink, FileCode2,
  Languages, PictureInPicture2, ShieldAlert, Sparkles, Terminal, Trash2,
} from "lucide-react";

interface Props {
  embeddedInMethod?: boolean;
  defaultStageLabel?: string;
  externalLang?: SupportedLang;
}

export default function ProofCraftContextStudio({ embeddedInMethod = false, defaultStageLabel = "", externalLang }: Props) {
  const [config, setConfig] = useState<ContextStudioConfig>(DEFAULT_STUDIO_CONFIG);
  const [rawInput, setRawInput] = useState("");
  const [category, setCategory] = useState<PacketCategory>("terminal_output");
  const [langMode, setLangMode] = useState<"auto" | SupportedLang>("auto");
  const [projectTitle, setProjectTitle] = useState("ProofCraft & Tanami360");
  const [stageLabel] = useState(defaultStageLabel);
  const [maskSecrets, setMaskSecrets] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activePart, setActivePart] = useState(0);
  const [pipNotice, setPipNotice] = useState("");

  useEffect(() => {
    fetch("/api/context-studio-config")
      .then((r) => r.json())
      .then((d) => { if (d?.ok && d?.config) setConfig(d.config); })
      .catch(() => {});
  }, []);

  const effectiveLang: SupportedLang = useMemo(() => {
    if (langMode !== "auto") return langMode;
    if (externalLang && !rawInput.trim()) return externalLang;
    if (!config.autoDetectLanguage) return "he";
    return detectLanguageFromText(rawInput, "he");
  }, [langMode, rawInput, config.autoDetectLanguage, externalLang]);

  const isHe = effectiveLang === "he";
  const result = useMemo(() => buildContextPackets({
    rawInput, category, lang: effectiveLang, projectTitle, stageLabel,
    chunkLimit: config.defaultChunkLimit || 12000, maskSecrets,
  }), [rawInput, category, effectiveLang, projectTitle, stageLabel, config.defaultChunkLimit, maskSecrets]);

  const smartRecs = useMemo(() => {
    if (!config.enableSmartEcosystemLinks || !rawInput.trim()) return [];
    return matchSmartRecommendations(rawInput, config.recommendations).slice(0, 1);
  }, [rawInput, config]);
  const handlePasteClipboard = async () => {
    try { const txt = await navigator.clipboard.readText(); if (txt) { setRawInput(txt); setActivePart(0); } } catch {}
  };
  const handleCopyPacket = async (idx: number) => {
    const pkt = result.packets[idx]; if (!pkt) return;
    await navigator.clipboard.writeText(pkt.content); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2500);
  };
  const handleDownloadPacket = (idx: number) => {
    const pkt = result.packets[idx]; if (!pkt) return;
    const blob = new Blob([pkt.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = pkt.filename; a.click(); URL.revokeObjectURL(url);
  };
  const openFloatingWindow = async () => {
    try {
      const w = window as unknown as { documentPictureInPicture?: { requestWindow: (o: { width: number; height: number }) => Promise<Window> } };
      if (w.documentPictureInPicture) {
        const pipWin = await w.documentPictureInPicture.requestWindow({ width: 540, height: 680 });
        pipWin.location.href = "/context-studio?floating=1";
        setPipNotice(isHe ? "נפתח חלון צף מעל כל המסכים ✓" : "Floating window opened on top ✓");
      } else {
        window.open("/context-studio?floating=1", "ProofCraftContextPIP", "width=560,height=720,top=80,left=80");
        setPipNotice(isHe ? "נפתח חלון עבודה מהיר ✓" : "Quick popup opened ✓");
      }
      setTimeout(() => setPipNotice(""), 3500);
    } catch { window.open("/context-studio?floating=1", "_blank"); }
  };

  if (!config.enabled) return null;
  const currentPacket = result.packets[Math.min(activePart, result.packets.length - 1)] || result.packets;
  return (
    <section dir={isHe ? "rtl" : "ltr"} className="card-surface" style={{ padding: 20, border: "1px solid rgba(56,189,248,0.28)", background: "#0a0b0e", color: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingBottom: 14, marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(56,189,248,0.14)", border: "1px solid rgba(56,189,248,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}>
            <Terminal size={18} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>{isHe ? "סטודיו חבילות הקשר חכם לצ׳אט (Context Packet Studio)" : "Smart AI Context Packet Studio"}</h2>
              <span className="badge-pill" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", fontSize: 10.5 }}>{isHe ? "מוכן לכל AI" : "Universal AI"}</span>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{isHe ? "הדבק כל פלט ארוך וקבל תבנית מקוטלגת מוכנה להדבקה או הורדת קובץ" : "Paste any long output and generate an AI-ready structured packet or file"}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: 3, borderRadius: 10, background: "#11131a", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Languages size={13} style={{ color: "#94a3b8", marginInline: 4 }} />
            {(["auto", "he", "en"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setLangMode(m)} className={langMode === m ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>
                {m === "auto" ? (isHe ? "אוטומטי" : "Auto") : m.toUpperCase()}
              </button>
            ))}
          </div>
          {!embeddedInMethod && <a href="/method" className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 11.5 }}>{isHe ? "חזרה לדף השיטה" : "Back to Method"}</a>}
          <button type="button" onClick={openFloatingWindow} className="btn-primary" style={{ height: 34, padding: "0 14px", fontSize: 11.5, width: "auto", background: "linear-gradient(135deg,#0284c7,#4f46e5)" }}>
            <PictureInPicture2 size={14} /> {isHe ? "חלון צף מעל כל מסך" : "Float On Top"}
          </button>
        </div>
      </div>
      {pipNotice && <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(56,189,248,0.14)", border: "1px solid rgba(56,189,248,0.35)", color: "#38bdf8", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>{pipNotice}</div>}      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{isHe ? "סוג התבנית וכותרת הקובץ" : "Template & File Header"}</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value as PacketCategory); setActivePart(0); }} className="input-dark" style={{ height: 38, fontSize: 12, width: "100%", paddingInline: 12 }}>
                {(Object.keys(CATEGORY_META) as PacketCategory[]).map((key) => (
                  <option key={key} value={key}>{isHe ? CATEGORY_META[key].labelHe : CATEGORY_META[key].labelEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{isHe ? "שם הפרויקט / הקשר" : "Project / Context Name"}</label>
              <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="input-dark" style={{ height: 38, fontSize: 12, width: "100%", paddingInline: 12 }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={handlePasteClipboard} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 11.5, color: "#38bdf8" }}>
                <ClipboardPaste size={13} /> {isHe ? "הדבק מהלוח" : "Paste Clipboard"}
              </button>
              {rawInput && (
                <button type="button" onClick={() => { setRawInput(""); setActivePart(0); }} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11.5, color: "#f87171" }}>
                  <Trash2 size={13} /> {isHe ? "נקה" : "Clear"}
                </button>
              )}
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#cbd5e1", cursor: "pointer" }}>
              <input type="checkbox" checked={maskSecrets} onChange={(e) => setMaskSecrets(e.target.checked)} />
              <span>{isHe ? "הסתר מפתחות API אוטומטית" : "Auto-mask API secrets"}</span>
            </label>
          </div>
          <textarea rows={10} value={rawInput} onChange={(e) => { setRawInput(e.target.value); setActivePart(0); }} className="input-dark"
            placeholder={isHe ? "הדבק כאן כל פלט ארוך מ-PowerShell, שגיאת בנייה, קוד מקור או מסמך הקשר..." : "Paste any long PowerShell output, build error, source code, or context..."}
            style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.55 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6, padding: "8px 12px", borderRadius: 10, background: "#11131a", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11.5 }}>
            <span style={{ color: "#94a3b8" }}>{isHe ? `תווים: ${result.totalChars.toLocaleString()} | אומדן טוקנים: ~${result.estimatedTokens.toLocaleString()}` : `Chars: ${result.totalChars.toLocaleString()} | Est. Tokens: ~${result.estimatedTokens.toLocaleString()}`}</span>
            <strong style={{ color: "#34d399" }}>{result.packets.length > 1 ? (isHe ? `פוצל ל-${result.packets.length} חלקים` : `Split into ${result.packets.length} parts`) : (isHe ? "חלק 1 שלם" : "1 Complete Packet")}</strong>
          </div>
          {result.maskedSecretsCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.35)", color: "#fde68a", fontSize: 11.5 }}>
              <ShieldAlert size={14} /> <span>{isHe ? `הוסתרו ${result.maskedSecretsCount} מפתחות רגישים מהפלט.` : `Masked ${result.maskedSecretsCount} sensitive secret(s).`}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#38bdf8" }}>
                <FileCode2 size={14} /> <span dir="ltr">{currentPacket?.filename}</span>
              </span>
              {result.packets.length > 1 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {result.packets.map((p, i) => (
                    <button key={p.partIndex} type="button" onClick={() => setActivePart(i)} className={activePart === i ? "btn-primary" : "btn-ghost"} style={{ height: 26, padding: "0 8px", fontSize: 11, width: "auto" }}>
                      {isHe ? `חלק ${p.partIndex}/${p.totalParts}` : `Part ${p.partIndex}/${p.totalParts}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <pre dir={isHe ? "rtl" : "ltr"} style={{ height: 250, overflow: "auto", padding: 12, borderRadius: 10, background: "#05070a", border: "1px solid rgba(56,189,248,0.25)", color: "#e2e8f0", fontSize: 11.5, lineHeight: 1.55, whiteSpace: "pre-wrap", margin: 0 }}>
              {currentPacket?.content}
            </pre>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button type="button" onClick={() => handleCopyPacket(activePart)} className="btn-primary" style={{ height: 38, fontSize: 12 }}>
                {copiedIdx === activePart ? <Check size={14} /> : <Copy size={14} />}
                {copiedIdx === activePart ? (isHe ? "הועתק! הדבק בצ׳אט" : "Copied! Paste in Chat") : (isHe ? "העתק חבילה לצ׳אט" : "Copy AI Packet")}
              </button>
              <button type="button" onClick={() => handleDownloadPacket(activePart)} className="btn-ghost" style={{ height: 38, fontSize: 12, color: "#38bdf8", borderColor: "rgba(56,189,248,0.35)" }}>
                <Download size={14} /> {isHe ? "הורד קובץ מוכן לצ׳אט (.md)" : "Download AI File (.md)"}
              </button>
            </div>
          </div>
          {smartRecs.map((rec) => (
            <div key={rec.id} style={{ padding: 12, borderRadius: 12, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div>
                <span className="badge-pill" style={{ background: "rgba(56,189,248,0.16)", color: "#38bdf8", fontSize: 10, marginBottom: 4 }}><Sparkles size={11} /> {isHe ? rec.badgeHe : rec.badgeEn}</span>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#f8fafc" }}>{isHe ? rec.titleHe : rec.titleEn}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{isHe ? rec.descHe : rec.descEn}</div>
              </div>
              <a href={rec.href} target={rec.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="btn-primary" style={{ height: 32, padding: "0 12px", fontSize: 11.5, width: "auto", flexShrink: 0 }}>
                <span>{isHe ? "פתח" : "Open"}</span> <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}