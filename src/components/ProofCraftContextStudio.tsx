"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORY_META, ContextStudioConfig, DEFAULT_STUDIO_CONFIG, PacketCategory,
  SupportedLang, buildContextPackets, detectLanguageFromText, matchSmartRecommendations,
} from "@/lib/context-packet-engine";
import {
  Check, ClipboardPaste, Copy, Download, ExternalLink, FileCode2, FolderUp,
  HelpCircle, Languages, PictureInPicture2, ShieldAlert, Sparkles, Terminal, Trash2, Compass, ShieldCheck
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
  const [guideOpen, setGuideOpen] = useState(false);
  const [handoffActive, setHandoffActive] = useState(false);
  const outputRef = useRef<HTMLDivElement | null>(null);

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
  const lineCount = useMemo(() => (rawInput ? rawInput.split("\n").length : 0), [rawInput]);
  const result = useMemo(() => buildContextPackets({
    rawInput, category, lang: effectiveLang, projectTitle, stageLabel,
    chunkLimit: Math.max(config.defaultChunkLimit || 500000, 500000), maskSecrets,
  }), [rawInput, category, effectiveLang, projectTitle, stageLabel, config.defaultChunkLimit, maskSecrets]);

  const smartRecs = useMemo(() => {
    if (!config.enableSmartEcosystemLinks || !rawInput.trim()) return [];
    return matchSmartRecommendations(rawInput, config.recommendations).slice(0, 1);
  }, [rawInput, config]);

  const handlePasteClipboard = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      if (txt) {
        setRawInput(txt); setActivePart(0);
        setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
      }
    } catch {}
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawInput(String(reader.result || ""));
      setActivePart(0);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
    };
    reader.readAsText(file);
  };

  const handleCopyPacket = async (idx: number) => {
    const pkt = result.packets[idx];
    if (!pkt) return;
    await navigator.clipboard.writeText(pkt.content);
    setCopiedIdx(idx);
    setHandoffActive(true);
    setTimeout(() => setCopiedIdx(null), 3000);
  };

  const handleDownloadPacket = (idx: number) => {
    const pkt = result.packets[idx];
    if (!pkt) return;
    const blob = new Blob([pkt.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = pkt.filename; a.click();
    URL.revokeObjectURL(url);
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
  const currentPacket = result.packets[Math.min(activePart, result.packets.length - 1)] || result.packets[0];
  const activeMeta = CATEGORY_META[category];

  return (
    <section dir={isHe ? "rtl" : "ltr"} className="card-hero" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(56,189,248,0.32)", background: "#0a0b0e", color: "#f8fafc", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(56,189,248,0.14)", border: "1px solid rgba(56,189,248,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}>
            <Terminal size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>{isHe ? "סטודיו חבילות הקשר חכם לצ׳אט (Context Packet Studio)" : "Smart AI Context Packet Studio"}</h2>
              <span className="badge-pill" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", fontSize: 11 }}>{isHe ? "עד 5,000+ שורות בחבילה" : "5,000+ Lines Ready"}</span>
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>{isHe ? "הפוך כל קוד, פלט טרמינל או מסמך לחבילה מובנית שגורמת לצ׳אט החכם להבין אותך ב-100% בלי לאבד הקשר" : "Structure up to 5,000+ lines of code, logs, or docs so any AI chat understands full context without hallucinations"}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setGuideOpen(!guideOpen)} className="btn-ghost" style={{ height: 36, padding: "0 12px", fontSize: 12, color: "#38bdf8", borderColor: "rgba(56,189,248,0.4)" }}>
            <HelpCircle size={14} /> {isHe ? (guideOpen ? "סגור מדריך שיטה" : "איך השיטה עובדת? (למתחילים)") : (guideOpen ? "Close Guide" : "How This Method Works")}
          </button>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: 3, borderRadius: 10, background: "#11131a", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Languages size={13} style={{ color: "#94a3b8", marginInline: 4 }} />
            {(["auto", "he", "en"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setLangMode(m)} className={langMode === m ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11, width: "auto" }}>
                {m === "auto" ? (isHe ? "אוטומטי" : "Auto") : m.toUpperCase()}
              </button>
            ))}
          </div>
          {!embeddedInMethod && <a href="/method" className="btn-ghost" style={{ height: 36, padding: "0 12px", fontSize: 12 }}>{isHe ? "חזרה לדף השיטה" : "Back to Method"}</a>}
          <button type="button" onClick={openFloatingWindow} className="btn-primary" style={{ height: 36, padding: "0 14px", fontSize: 12, width: "auto", background: "linear-gradient(135deg,#0284c7,#4f46e5)" }}>
            <PictureInPicture2 size={14} /> {isHe ? "חלון צף מעל כל מסך" : "Float On Top"}
          </button>
        </div>
      </div>
      {pipNotice && <div style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(56,189,248,0.14)", border: "1px solid rgba(56,189,248,0.35)", color: "#38bdf8", fontSize: 12.5, fontWeight: 700 }}>{pipNotice}</div>}
      {guideOpen && (
        <div style={{ padding: 20, borderRadius: 16, background: "rgba(15,23,42,0.92)", border: "1px solid rgba(56,189,248,0.35)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#38bdf8", marginBottom: 6 }}>{isHe ? "1. למה צ׳אטים חכמים טועים בלי מסגרת?" : "1. Why Raw Prompts Fail"}</div>
            <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{isHe ? "כשמדביקים קוד ארוך או לוג שגיאות בלי סדר, הצ׳אט מאבד ריכוז, מנחש פרטים או חותך את התשובה. אריזת ההקשר מונעת זאת לחלוטין." : "Pasting raw logs or long files without structure causes AI models to lose context or hallucinate."}</p>
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#34d399", marginBottom: 6 }}>{isHe ? "2. אבטחת מידע אוטומטית (Zero-Leak)" : "2. Automatic Secret Masking"}</div>
            <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{isHe ? "המנוע מזהה ומסתיר מפתחות API, סיסמאות וטוקנים לפני שהטקסט יוצא לצ׳אט חיצוני — כדי שלעולם לא תחשוף סודות." : "Sensitive API keys and tokens are automatically masked before you paste into any external AI chat."}</p>
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: "#0a0b0e" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fbbf24", marginBottom: 6 }}>{isHe ? "3. מחזור עבודה רציף (יציאה וחזרה)" : "3. Seamless Handoff & Return"}</div>
            <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{isHe ? "מעתיקים את החבילה -> מדביקים בצ׳אט החכם -> מבצעים את ההנחיה -> וחוזרים לכאן עם הפלט הבא בלי לאבד חוט מחשבה." : "Copy packet -> paste in AI chat -> execute -> return here with the next output."}</p>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
        <div style={{ padding: 18, borderRadius: 16, background: "#11131a", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 900, color: "#38bdf8" }}>{isHe ? "שלב 1 ו-2 · בחירת תבנית והזנת תוכן (עד 5,000+ שורות)" : "STEPS 1 & 2 · TEMPLATE & INPUT (UP TO 5,000+ LINES)"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{isHe ? "סוג התבנית וההנחיה" : "Packet Template"}</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value as PacketCategory); setActivePart(0); }} className="input-dark" style={{ height: 42, fontSize: 12.5, width: "100%" }}>
                {(Object.keys(CATEGORY_META) as PacketCategory[]).map((key) => (
                  <option key={key} value={key}>{isHe ? CATEGORY_META[key].labelHe : CATEGORY_META[key].labelEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#94a3b8", marginBottom: 4 }}>{isHe ? "שם הפרויקט / הקשר" : "Project / Context"}</label>
              <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="input-dark" style={{ height: 42, fontSize: 12.5, width: "100%" }} />
            </div>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", fontSize: 12, color: "#cbd5e1" }}>
            <strong style={{ color: "#38bdf8" }}>{isHe ? "מה התבנית הזו עושה: " : "Template Action: "}</strong>{isHe ? activeMeta.aiDirectiveHe : activeMeta.aiDirectiveEn}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button type="button" onClick={handlePasteClipboard} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#38bdf8" }}><ClipboardPaste size={13} /> {isHe ? "הדבק מהלוח" : "Paste"}</button>
              <label className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#34d399", borderColor: "rgba(52,211,153,0.4)", cursor: "pointer" }}>
                <input type="file" accept=".txt,.log,.md,.json,.ts,.tsx,.js,.csv" style={{ display: "none" }} onChange={handleFileUpload} />
                <FolderUp size={13} /> {isHe ? "ייבא קובץ מלא (5,000+ שורות)" : "Import File (5,000+ lines)"}
              </label>
              {rawInput && <button type="button" onClick={() => { setRawInput(""); setActivePart(0); setHandoffActive(false); }} className="btn-ghost" style={{ height: 34, padding: "0 10px", fontSize: 12, color: "#f87171" }}><Trash2 size={13} /> {isHe ? "נקה" : "Clear"}</button>}
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#cbd5e1", cursor: "pointer" }}>
              <input type="checkbox" checked={maskSecrets} onChange={(e) => setMaskSecrets(e.target.checked)} />
              <span>{isHe ? "הסתר מפתחות API" : "Mask API secrets"}</span>
            </label>
          </div>
          <textarea rows={13} value={rawInput} onChange={(e) => { setRawInput(e.target.value); setActivePart(0); }} className="input-dark" placeholder={isHe ? "הדבק כאן פלט ארוך מ-PowerShell, קוד מקור שלם, שגיאת בנייה או ייבא קובץ של 5,000 שורות..." : "Paste up to 5,000+ lines of PowerShell output, source code, or import a file..."} style={{ fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.55, minHeight: 270 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 14px", borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12 }}>
            <span style={{ color: "#94a3b8" }}>{isHe ? `שורות: ${lineCount.toLocaleString()} | תווים: ${result.totalChars.toLocaleString()} | טוקנים: ~${result.estimatedTokens.toLocaleString()}` : `Lines: ${lineCount.toLocaleString()} | Chars: ${result.totalChars.toLocaleString()} | Tokens: ~${result.estimatedTokens.toLocaleString()}`}</span>
            <strong style={{ color: "#34d399" }}>{result.packets.length > 1 ? (isHe ? `פוצל ל-${result.packets.length} חלקים` : `Split into ${result.packets.length} parts`) : (isHe ? "חבילה 1 שלמה ✓" : "1 Complete Packet ✓")}</strong>
          </div>
          {result.maskedSecretsCount > 0 && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.35)", color: "#fde68a", fontSize: 12 }}><ShieldAlert size={15} /> <span>{isHe ? `הוסתרו אוטומטית ${result.maskedSecretsCount} מפתחות רגישים.` : `Masked ${result.maskedSecretsCount} secret(s).`}</span></div>}
        </div>
        <div ref={outputRef} style={{ padding: 18, borderRadius: 16, background: "#11131a", border: "1px solid rgba(56,189,248,0.28)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14, scrollMarginTop: 84 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 900, color: "#34d399" }}>{isHe ? "שלב 3 · החבילה המוכנה לצ׳אט החכם" : "STEP 3 · READY AI CONTEXT PACKET"}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#38bdf8" }}><FileCode2 size={14} /> <span dir="ltr">{currentPacket?.filename}</span></span>
            </div>
            {result.packets.length > 1 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {result.packets.map((p, i) => (
                  <button key={p.partIndex} type="button" onClick={() => setActivePart(i)} className={activePart === i ? "btn-primary" : "btn-ghost"} style={{ height: 28, padding: "0 10px", fontSize: 11.5, width: "auto" }}>
                    {isHe ? `חלק ${p.partIndex}/${p.totalParts}` : `Part ${p.partIndex}/${p.totalParts}`}
                  </button>
                ))}
              </div>
            )}
            <pre dir={isHe ? "rtl" : "ltr"} style={{ height: 290, overflow: "auto", padding: 14, borderRadius: 12, background: "#05070a", border: "1px solid rgba(56,189,248,0.25)", color: "#e2e8f0", fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>{currentPacket?.content}</pre>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button type="button" onClick={() => handleCopyPacket(activePart)} className="btn-primary" style={{ height: 42, fontSize: 13 }}>
                {copiedIdx === activePart ? <Check size={15} /> : <Copy size={15} />}
                {copiedIdx === activePart ? (isHe ? "הועתק! עבור לצ׳אט ✓" : "Copied! Paste in Chat ✓") : (isHe ? "העתק חבילה לצ׳אט" : "Copy AI Packet")}
              </button>
              <button type="button" onClick={() => handleDownloadPacket(activePart)} className="btn-ghost" style={{ height: 42, fontSize: 13, color: "#38bdf8", borderColor: "rgba(56,189,248,0.4)" }}>
                <Download size={15} /> {isHe ? "הורד קובץ (.md)" : "Download (.md)"}
              </button>
            </div>
            {handoffActive && (
              <div style={{ padding: 14, borderRadius: 12, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.45)", display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#34d399" }}>{isHe ? "החבילה שמורה בלוח! מה עושים עכשיו?" : "Packet Copied! Next Steps:"}</div>
                <div style={{ fontSize: 12.5, color: "#ecfdf5", lineHeight: 1.55 }}>{isHe ? "1. פתח את הצ׳אט החכם שלך והדבק (Ctrl+V). 2. המתן לתשובת הצ׳אט ובצע את הפעולה. 3. חזור לכאן ולחץ 'נקה' כדי לארוז את הפלט הבא ברצף!" : "1. Paste (Ctrl+V) into your AI chat. 2. Execute the AI guidance. 3. Return here and click Clear to package your next output!"}</div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {smartRecs.map((rec) => (
              <div key={rec.id} style={{ padding: 12, borderRadius: 12, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div>
                  <span className="badge-pill" style={{ background: "rgba(56,189,248,0.16)", color: "#38bdf8", fontSize: 10.5, marginBottom: 4 }}><Sparkles size={11} /> {isHe ? rec.badgeHe : rec.badgeEn}</span>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: "#f8fafc" }}>{isHe ? rec.titleHe : rec.titleEn}</div>
                </div>
                <a href={rec.href} className="btn-primary" style={{ height: 34, padding: "0 12px", fontSize: 12, width: "auto", flexShrink: 0 }}><span>{isHe ? "עבור" : "Open"}</span> <ExternalLink size={12} /></a>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href="/affiliate" className="btn-ghost" style={{ flex: 1, height: 34, fontSize: 11.5 }}><Compass size={13} /> {isHe ? "מרכז שותפים (מסלול 1)" : "Affiliate Hub"}</a>
              <a href="/vault" className="btn-ghost" style={{ flex: 1, height: 34, fontSize: 11.5 }}><ShieldCheck size={13} /> {isHe ? "כספת סודות מוצפנת" : "Encrypted Vault"}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}