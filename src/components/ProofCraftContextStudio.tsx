"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SurgicalFilterMode, analyzeAndFilterContext, validateAndInspectMediaFile } from "@/lib/context-smart-analyzer";
import ContextIntelligencePanel from "@/components/ContextIntelligencePanel";
import { CATEGORY_META, ContextStudioConfig, DEFAULT_STUDIO_CONFIG, PacketCategory, SupportedLang, buildContextPackets, detectLanguageFromText } from "@/lib/context-packet-engine";
import { ArrowDownCircle, Check, ChevronDown, ChevronUp, ClipboardPaste, Copy, Download, FileCode2, FolderUp, HelpCircle, Languages, PictureInPicture2, ShieldCheck, Terminal, Trash2 } from "lucide-react";

interface Props { embeddedInMethod?: boolean; defaultStageLabel?: string; externalLang?: SupportedLang; }

export default function ProofCraftContextStudio({ defaultStageLabel = "", externalLang }: Props) {
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
  const [guideOpen, setGuideOpen] = useState(false);
  const [handoffActive, setHandoffActive] = useState(false);
  const [filterMode, setFilterMode] = useState<SurgicalFilterMode>("full_with_summary");
  const [scanFileName, setScanFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [showPacketPreview, setShowPacketPreview] = useState(false);
  const resultsStationRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    fetch("/api/context-studio-config").then((r) => r.json()).then((d) => { if (d?.ok && d?.config) setConfig(d.config); }).catch(() => {});
  }, []);

  const effectiveLang: SupportedLang = useMemo(() => {
    if (langMode !== "auto") return langMode;
    if (externalLang && !rawInput.trim()) return externalLang;
    if (!config.autoDetectLanguage) return "he";
    return detectLanguageFromText(rawInput, "he");
  }, [langMode, rawInput, config.autoDetectLanguage, externalLang]);

  const isHe = effectiveLang === "he";
  const hasInput = rawInput.trim().length > 0;
  const lineCount = useMemo(() => (rawInput ? rawInput.split("\n").length : 0), [rawInput]);
  const analysis = useMemo(() => analyzeAndFilterContext(rawInput, filterMode), [rawInput, filterMode]);
  const enrichedInput = useMemo(() => (hasInput ? `${isHe ? analysis.executiveBriefHe : analysis.executiveBriefEn}\n\n${analysis.filteredText}\n\n---\nPackaged with Tanami360 Smart Context Method (https://tanami360.com)` : ""), [hasInput, isHe, analysis]);
  const result = useMemo(() => buildContextPackets({ rawInput: enrichedInput, category, lang: effectiveLang, projectTitle, stageLabel, chunkLimit: Math.max(config.defaultChunkLimit || 1500000, 1500000), maskSecrets }), [enrichedInput, category, effectiveLang, projectTitle, stageLabel, config.defaultChunkLimit, maskSecrets]);

  const scrollToResults = () => { setTimeout(() => { resultsStationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 110); };
  const handleLoadLiveDemo = () => {
    const demoLog = [
      "PS S:\\Projects\\demo-app> npm run build",
      "Creating an optimized production build ...",
      "Running TypeScript ...",
      "src/app/checkout/page.tsx(42,18): error TS2339: Property 'discountAmount' does not exist on type 'CartSummary'.",
      "Failed to type check.",
      `STRIPE_SECRET_KEY=${["sk", "live", "51DemoKeyExample987654321"].join("_")}`
    ].join("\n");
    setScanFileName("build-log-demo.txt");
    setRawInput(demoLog);
    setActivePart(0);
    scrollToResults();
  };

  const handlePasteClipboard = async () => { try { const txt = await navigator.clipboard.readText(); if (txt) { setScanFileName(""); setRawInput(txt); setActivePart(0); scrollToResults(); } } catch {} };
  const processIncomingFile = async (file: File) => {
    setScanFileName(file.name);
    const check = await validateAndInspectMediaFile(file, isHe);
    if (!check.ok) { setPipNotice(check.error || "Blocked"); setTimeout(() => setPipNotice(""), 4000); return; }
    if (check.summaryText) { setRawInput(check.summaryText); setActivePart(0); scrollToResults(); return; }
    const reader = new FileReader();
    reader.onload = () => { setRawInput(String(reader.result || "")); setActivePart(0); scrollToResults(); };
    reader.readAsText(file);
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.item(0); if (f) await processIncomingFile(f); };
  const handleCopyPacket = async (idx: number) => { const pkt = result.packets[idx]; if (!pkt) return; await navigator.clipboard.writeText(pkt.content); setCopiedIdx(idx); setHandoffActive(true); setTimeout(() => setCopiedIdx(null), 3000); };
  const handleDownloadPacket = (idx: number) => { const pkt = result.packets[idx]; if (!pkt) return; const blob = new Blob([pkt.content], { type: "text/markdown;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = pkt.filename; a.click(); URL.revokeObjectURL(url); };
  const openFloatingWindow = async () => {
    try {
      const w = window as unknown as { documentPictureInPicture?: { requestWindow: (o: { width: number; height: number }) => Promise<Window> } };
      if (w.documentPictureInPicture) { const pipWin = await w.documentPictureInPicture.requestWindow({ width: 540, height: 680 }); pipWin.location.href = "/context-studio?floating=1"; }
      else { window.open("/context-studio?floating=1", "ProofCraftContextPIP", "width=560,height=720,top=80,left=80"); }
      setPipNotice(isHe ? "נפתח חלון צף מעל כל מסך ✓" : "Floating window opened ✓"); setTimeout(() => setPipNotice(""), 3000);
    } catch { window.open("/context-studio?floating=1", "_blank"); }
  };
  if (!config.enabled) return null;
  const currentPacket = result.packets[Math.min(activePart, result.packets.length - 1)] || result.packets;
  const activeMeta = CATEGORY_META[category];
  return (
    <section dir={isHe ? "rtl" : "ltr"} className="card-hero" style={{ padding: 22, borderRadius: 20, border: "1px solid rgba(56,189,248,0.32)", background: "#0a0b0e", color: "#f8fafc", display: "flex", flexDirection: "column", gap: 18, maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(56,189,248,0.14)", border: "1px solid rgba(56,189,248,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}><Terminal size={20} /></div>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 900, margin: 0 }}>{isHe ? "סטודיו חבילות הקשר חכם לצ׳אט (Context Studio)" : "Smart AI Context Packet Studio"}</h1>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "3px 0 0" }}>{isHe ? "3 צעדים פשוטים: מזינים פלט או קובץ ← מקבלים ניתוח וניקוי אוטומטי ← מעתיקים או מורידים לצ׳אט החכם" : "3 simple steps: Input logs/files -> Auto-analyze & clean -> Copy or download for AI chat"}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setGuideOpen(!guideOpen)} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#38bdf8" }}><HelpCircle size={14} /> {isHe ? (guideOpen ? "סגור הסבר" : "איך זה עובד? (30 שניות)") : "How it works"}</button>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: 3, borderRadius: 10, background: "#11131a", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Languages size={13} style={{ color: "#94a3b8", marginInline: 4 }} />
            {(["auto", "he", "en"] as const).map((m) => (<button key={m} type="button" onClick={() => setLangMode(m)} className={langMode === m ? "btn-primary" : "btn-ghost"} style={{ height: 26, padding: "0 8px", fontSize: 11, width: "auto" }}>{m === "auto" ? (isHe ? "אוטומטי" : "Auto") : m.toUpperCase()}</button>))}
          </div>
          <button type="button" onClick={openFloatingWindow} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#a5b4fc" }}><PictureInPicture2 size={14} /> {isHe ? "חלון צף" : "Float"}</button>
        </div>
      </div>
      {pipNotice && <div style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(56,189,248,0.14)", border: "1px solid rgba(56,189,248,0.35)", color: "#38bdf8", fontSize: 12.5, fontWeight: 700 }}>{pipNotice}</div>}
      {guideOpen && (
        <div style={{ padding: 16, borderRadius: 14, background: "rgba(15,23,42,0.92)", border: "1px solid rgba(56,189,248,0.35)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 10, background: "#0a0b0e" }}><div style={{ fontSize: 12.5, fontWeight: 900, color: "#38bdf8", marginBottom: 4 }}>{isHe ? "צעד 1: מזינים חומר גלם" : "Step 1: Add Input"}</div><p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>{isHe ? "מדביקים פלט טרמינל, קוד ארוך, או גוררים תמונה/סרטון/קובץ." : "Paste terminal logs, code, or drop an image/video/file."}</p></div>
          <div style={{ padding: 12, borderRadius: 10, background: "#0a0b0e" }}><div style={{ fontSize: 12.5, fontWeight: 900, color: "#34d399", marginBottom: 4 }}>{isHe ? "צעד 2: המערכת מסדרת ומגנה" : "Step 2: Auto-Analysis & Safety"}</div><p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>{isHe ? "המנוע מאתר שגיאות, מסתיר מפתחות API אוטומטית ומכין תקציר ברור." : "Detects errors, masks API secrets, and builds an executive summary."}</p></div>
          <div style={{ padding: 12, borderRadius: 10, background: "#0a0b0e" }}><div style={{ fontSize: 12.5, fontWeight: 900, color: "#fbbf24", marginBottom: 4 }}>{isHe ? "צעד 3: מעתיקים לצ׳אט וממשיכים" : "Step 3: Send to AI Chat"}</div><p style={{ fontSize: 12, color: "#cbd5e1", margin: 0 }}>{isHe ? "לוחצים 'העתק חבילה לצ׳אט' או מורידים קובץ .md ומדביקים בשיחה." : "Copy the structured packet or download .md and paste into your AI chat."}</p></div>
        </div>
      )}
      <div style={{ padding: 18, borderRadius: 16, background: "#11131a", border: "1px solid rgba(56,189,248,0.28)", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 24, height: 24, borderRadius: "50%", background: "#38bdf8", color: "#0a0b0e", fontWeight: 900, fontSize: 12.5, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>1</span><strong style={{ fontSize: 15, color: "#f8fafc" }}>{isHe ? "הזן את הפלט, הקוד או הקובץ שלך" : "Step 1: Provide Your Output, Code, or File"}</strong></div>
          {hasInput && (<button type="button" onClick={() => { setRawInput(""); setScanFileName(""); setActivePart(0); setHandoffActive(false); setShowAdvancedTools(false); }} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#fca5a5", borderColor: "rgba(248,113,113,0.4)" }}><Trash2 size={13} /> {isHe ? "נקה והתחל מחדש" : "Clear & Start Over"}</button>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{isHe ? "מה תרצה שהצ׳אט החכם יעשה עם החומר?" : "What should the AI chat do?"}</label><select value={category} onChange={(e) => { setCategory(e.target.value as PacketCategory); setActivePart(0); }} className="input-dark" style={{ height: 40, fontSize: 12.5, width: "100%" }}>{(Object.keys(CATEGORY_META) as PacketCategory[]).map((key) => (<option key={key} value={key}>{isHe ? CATEGORY_META[key].labelHe : CATEGORY_META[key].labelEn}</option>))}</select></div>
          <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{isHe ? "שם הפרויקט (לזיהוי מהיר)" : "Project Name"}</label><input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="input-dark" style={{ height: 40, fontSize: 12.5, width: "100%" }} /></div>
        </div>
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={async (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.item(0); if (f) await processIncomingFile(f); }} style={{ padding: 14, borderRadius: 12, border: dragOver ? "1.5px dashed #34d399" : "1px dashed rgba(56,189,248,0.4)", background: dragOver ? "rgba(52,211,153,0.12)" : "rgba(56,189,248,0.04)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={handlePasteClipboard} className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12.5 }}><ClipboardPaste size={14} /> {isHe ? "הדבק מהלוח (Ctrl+V)" : "Paste from Clipboard"}</button><button type="button" onClick={handleLoadLiveDemo} className="btn-ghost" style={{ height: 36, padding: "0 12px", fontSize: 12.5, color: "#fbbf24", borderColor: "rgba(251,191,36,0.4)" }}>{isHe ? "נסה עם דוגמה חיה ✨" : "Try Live Demo ✨"}</button>
              <label className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12.5, color: "#34d399", borderColor: "rgba(52,211,153,0.4)", cursor: "pointer" }}><input type="file" accept=".txt,.log,.md,.json,.ts,.tsx,.js,.csv,.png,.jpg,.jpeg,.webp,.mp4,.webm" style={{ display: "none" }} onChange={handleFileUpload} /><FolderUp size={14} /> {isHe ? "בחר קובץ / תמונה / סרטון" : "Upload File / Image / Video"}</label>
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#cbd5e1", cursor: "pointer" }}><input type="checkbox" checked={maskSecrets} onChange={(e) => setMaskSecrets(e.target.checked)} /><span>{isHe ? "הסתר מפתחות API אוטומטית" : "Auto-mask API keys"}</span></label>
          </div>
          <textarea rows={5} value={rawInput} onPaste={scrollToResults} onChange={(e) => { setRawInput(e.target.value); setActivePart(0); }} placeholder={isHe ? "או הדבק כאן ישירות טקסט, פלט מ-PowerShell, קוד, או גרור לכאן קובץ / צילום מסך..." : "Or paste logs/code directly here, or drag & drop a file/screenshot..."} className="input-dark" style={{ fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.5, height: 125, minHeight: 125, maxHeight: 145, overflowY: "auto", resize: "none" }} />
        </div>
      </div>
      {!hasInput ? (
        <div style={{ padding: 20, borderRadius: 16, background: "rgba(15,23,42,0.55)", border: "1px dashed rgba(148,163,184,0.3)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <ArrowDownCircle size={24} color="#38bdf8" />
          <div style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0" }}>{isHe ? "ממתין לחומר הגלם שלך בתחנה 1" : "Waiting for your input in Step 1"}</div>
          <p style={{ fontSize: 12.5, color: "#94a3b8", maxWidth: 520, margin: 0, lineHeight: 1.6 }}>{isHe ? "ברגע שתדביק פלט או תגרור קובץ, יופיעו כאן אוטומטית: (2) סיכום הממצאים, זיהוי השגיאות וניקוי המפתחות, ו-(3) כפתור העתקה והורדה של החבילה המוכנה לצ׳אט." : "Once you paste text or drop a file, Step 2 and Step 3 will appear right here."}</p>
        </div>
      ) : (
        <div ref={resultsStationRef} style={{ scrollMarginTop: 84, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: 18, borderRadius: 16, background: "#11131a", border: "1px solid rgba(52,211,153,0.35)", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 24, height: 24, borderRadius: "50%", background: "#34d399", color: "#0a0b0e", fontWeight: 900, fontSize: 12.5, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>2</span><strong style={{ fontSize: 15, color: "#f8fafc" }}>{isHe ? "מה המערכת מצאה בחומר שהזנת" : "Step 2: What We Found"}</strong></div>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{scanFileName ? `${isHe ? "קובץ:" : "File:"} ${scanFileName} · ` : ""}{isHe ? `${lineCount.toLocaleString()} שורות · ~${result.estimatedTokens.toLocaleString()} טוקנים` : `${lineCount.toLocaleString()} lines`}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}><div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "מצב תקינות ושגיאות" : "Health & Errors"}</div><div style={{ fontSize: 14, fontWeight: 900, color: analysis.errorLines.length > 0 ? "#f87171" : "#34d399", marginTop: 2 }}>{analysis.errorLines.length > 0 ? (isHe ? `זוהו ${analysis.errorLines.length} שורות שגיאה` : `${analysis.errorLines.length} Errors`) : (isHe ? "נקי משגיאות בנייה ✓" : "Clean ✓")}</div></div>
              <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}><div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "הגנת פרטיות ומפתחות" : "Secret Protection"}</div><div style={{ fontSize: 14, fontWeight: 900, color: result.maskedSecretsCount > 0 ? "#fbbf24" : "#38bdf8", marginTop: 2 }}>{result.maskedSecretsCount > 0 ? (isHe ? `הוסתרו ${result.maskedSecretsCount} מפתחות רגישים` : `${result.maskedSecretsCount} Masked`) : (isHe ? "לא נחשפו מפתחות API ✓" : "Safe ✓")}</div></div>
              <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}><div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "הנחיית הביצוע שנבחרה" : "Selected Directive"}</div><div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc", marginTop: 2 }}>{isHe ? activeMeta.labelHe : activeMeta.labelEn}</div></div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 12.5, color: "#e2e8f0" }}><strong style={{ color: "#38bdf8" }}>{isHe ? "המלצת המערכת עבורך: " : "Recommended: "}</strong>{analysis.errorLines.length > 0 ? (isHe ? "סנן רק את שורות השגיאה והעתק לצ׳אט לקבלת תיקון מיידי." : "Isolate errors and copy.") : (isHe ? "החבילה מלאה ונקייה — עבור לתחנה 3 למטה והעתק או הורד לצ׳אט החכם." : "Packet is ready below.")}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {analysis.errorLines.length > 0 && (<button type="button" onClick={() => { setFilterMode("errors_only"); setActivePart(0); setTimeout(() => handleCopyPacket(0), 60); }} className="btn-primary" style={{ width: "auto", height: 32, padding: "0 12px", fontSize: 12, background: "#ef4444" }}>{isHe ? `סנן ${analysis.errorLines.length} שגיאות והעתק` : `Isolate Errors`}</button>)}
                {result.maskedSecretsCount > 0 && (<a href="/vault" className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12, color: "#34d399", textDecoration: "none" }}><ShieldCheck size={13} /> {isHe ? "שמור מפתחות בכספת" : "Save in Vault"}</a>)}
                <button type="button" onClick={() => setShowAdvancedTools(!showAdvancedTools)} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12, color: "#cbd5e1" }}>{showAdvancedTools ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {isHe ? (showAdvancedTools ? "הסתר כלים מתקדמים" : "כלים מתקדמים (סינון, מפתחות ויומן מעקב)") : "Advanced Tools"}</button>
              </div>
            </div>
            {showAdvancedTools && (<div style={{ paddingTop: 6 }}><ContextIntelligencePanel rawInput={rawInput} projectTitle={projectTitle} analysis={analysis} filterMode={filterMode} isHe={isHe} onChangeFilter={(m: SurgicalFilterMode) => { setFilterMode(m); setActivePart(0); }} onLoadSnapshot={(txt: string, ttl: string) => { setRawInput(txt); setProjectTitle(ttl); setActivePart(0); }} onNotify={(m: string) => { setPipNotice(m); setTimeout(() => setPipNotice(""), 3000); }} /></div>)}
          </div>
          <div style={{ padding: 18, borderRadius: 16, background: "#11131a", border: "1px solid rgba(56,189,248,0.4)", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 24, height: 24, borderRadius: "50%", background: "#a5b4fc", color: "#0a0b0e", fontWeight: 900, fontSize: 12.5, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>3</span><strong style={{ fontSize: 15, color: "#f8fafc" }}>{isHe ? "העבר את החבילה המוכנה לצ׳אט החכם" : "Step 3: Send to AI Chat"}</strong></div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#38bdf8" }}><FileCode2 size={14} /> <span dir="ltr">{currentPacket?.filename}</span></span>
            </div>
            {result.packets.length > 1 && (<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{result.packets.map((p, i) => (<button key={p.partIndex} type="button" onClick={() => setActivePart(i)} className={activePart === i ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11.5, width: "auto" }}>{isHe ? `חלק ${p.partIndex}/${p.totalParts}` : `Part ${p.partIndex}/${p.totalParts}`}</button>))}</div>)}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              <button type="button" onClick={() => handleCopyPacket(activePart)} className="btn-primary" style={{ height: 46, fontSize: 14, fontWeight: 900 }}>{copiedIdx === activePart ? <Check size={16} /> : <Copy size={16} />} {copiedIdx === activePart ? (isHe ? "הועתק! הדבק בצ׳אט החכם ✓" : "Copied! ✓") : (isHe ? "העתק חבילה לצ׳אט החכם" : "Copy Packet for AI Chat")}</button>
              <button type="button" onClick={() => handleDownloadPacket(activePart)} className="btn-ghost" style={{ height: 46, fontSize: 14, fontWeight: 800, color: "#38bdf8", borderColor: "rgba(56,189,248,0.45)" }}><Download size={16} /> {isHe ? "הורד קובץ (.md)" : "Download File (.md)"}</button>
            </div>
            {handoffActive && (<div style={{ padding: 12, borderRadius: 12, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.4)", fontSize: 12.5, color: "#ecfdf5", lineHeight: 1.6 }}><strong style={{ color: "#34d399" }}>{isHe ? "מעולה! החבילה שמורה כעת בלוח ההעתקה שלך: " : "Copied: "}</strong>{isHe ? "עבור לחלון הצ׳אט החכם והדבק (Ctrl+V). כשתקבל תשובה או פלט חדש, חזור לכאן ולחץ 'נקה והתחל מחדש' למעלה." : "Paste (Ctrl+V) in AI chat and return here for the next output."}</div>)}
            <div>
              <button type="button" onClick={() => setShowPacketPreview(!showPacketPreview)} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12, color: "#94a3b8" }}>{showPacketPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />} {isHe ? (showPacketPreview ? "הסתר תצוגה מקדימה של הקובץ" : "צפה בתוכן הקובץ לפני שליחה (אופציונלי)") : "Preview Packet Content"}</button>
              {showPacketPreview && (<pre dir={isHe ? "rtl" : "ltr"} style={{ marginTop: 10, height: 240, overflow: "auto", padding: 14, borderRadius: 12, background: "#05070a", border: "1px solid rgba(56,189,248,0.25)", color: "#e2e8f0", fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{currentPacket && currentPacket.content.length > 18000 ? `${currentPacket.content.slice(0, 11000)}\n\n... [תצוגה מקדימה — הקובץ המלא יירד בשלמותו בלחיצה על הורד קובץ] ...\n\n${currentPacket.content.slice(-3500)}` : currentPacket?.content}</pre>)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}