"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  CATEGORY_META, ContextStudioConfig, DEFAULT_STUDIO_CONFIG, PacketCategory,
  SupportedLang, buildContextPackets, detectLanguageFromText, matchSmartRecommendations,
} from '@/lib/context-packet-engine';
import {
  Check, ClipboardPaste, Copy, Download, ExternalLink, FileCode2,
  Languages, PictureInPicture2, ShieldAlert, Sparkles, Terminal, Trash2,
} from 'lucide-react';

interface Props {
  embeddedInMethod?: boolean;
  defaultStageLabel?: string;
  externalLang?: SupportedLang;
}

export default function ProofCraftContextStudio({ embeddedInMethod = false, defaultStageLabel = '', externalLang }: Props) {
  const [config, setConfig] = useState<ContextStudioConfig>(DEFAULT_STUDIO_CONFIG);
  const [rawInput, setRawInput] = useState('');
  const [category, setCategory] = useState<PacketCategory>('terminal_output');
  const [langMode, setLangMode] = useState<'auto' | SupportedLang>('auto');
  const [projectTitle, setProjectTitle] = useState('ProofCraft & Tanami360');
  const [stageLabel, setStageLabel] = useState(defaultStageLabel);
  const [maskSecrets, setMaskSecrets] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activePart, setActivePart] = useState(0);
  const [pipNotice, setPipNotice] = useState('');

  useEffect(() => {
    fetch('/api/context-studio-config')
      .then((r) => r.json())
      .then((d) => { if (d?.ok && d?.config) setConfig(d.config); })
      .catch(() => {});
  }, []);

  const effectiveLang: SupportedLang = useMemo(() => {
    if (langMode !== 'auto') return langMode;
    if (externalLang && !rawInput.trim()) return externalLang;
    if (!config.autoDetectLanguage) return 'he';
    return detectLanguageFromText(rawInput, 'he');
  }, [langMode, rawInput, config.autoDetectLanguage, externalLang]);

  const isHe = effectiveLang === 'he';

  const result = useMemo(() => buildContextPackets({
    rawInput, category, lang: effectiveLang, projectTitle, stageLabel,
    chunkLimit: config.defaultChunkLimit || 12000, maskSecrets,
  }), [rawInput, category, effectiveLang, projectTitle, stageLabel, config.defaultChunkLimit, maskSecrets]);

  const smartRecs = useMemo(() => {
    if (!config.enableSmartEcosystemLinks || !rawInput.trim()) return [];
    return matchSmartRecommendations(rawInput, config.recommendations).slice(0, 1);
  }, [rawInput, config]);
  const handlePasteClipboard = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      if (txt) { setRawInput(txt); setActivePart(0); }
    } catch {}
  };

  const handleCopyPacket = async (idx: number) => {
    const pkt = result.packets[idx];
    if (!pkt) return;
    await navigator.clipboard.writeText(pkt.content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const handleDownloadPacket = (idx: number) => {
    const pkt = result.packets[idx];
    if (!pkt) return;
    const blob = new Blob([pkt.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pkt.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openFloatingWindow = async () => {
    try {
      const w = window as unknown as { documentPictureInPicture?: { requestWindow: (o: { width: number; height: number }) => Promise<Window> } };
      if (w.documentPictureInPicture) {
        const pipWin = await w.documentPictureInPicture.requestWindow({ width: 520, height: 680 });
        pipWin.location.href = '/context-studio?floating=1';
        setPipNotice(isHe ? 'נפתח חלון צף מעל כל המסכים' : 'Floating window opened on top');
      } else {
        window.open('/context-studio?floating=1', 'ProofCraftContextPIP', 'width=540,height=720,top=80,left=80');
        setPipNotice(isHe ? 'נפתח חלון עבודה מהיר' : 'Quick workspace popup opened');
      }
      setTimeout(() => setPipNotice(''), 3500);
    } catch {
      window.open('/context-studio?floating=1', '_blank');
    }
  };

  if (!config.enabled) return null;
  const currentPacket = result.packets[Math.min(activePart, result.packets.length - 1)] || result.packets[0];
  return (
    <section dir={isHe ? 'rtl' : 'ltr'} className="w-full rounded-2xl border border-slate-800 bg-slate-950/95 text-slate-100 shadow-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {isHe ? 'סטודיו חבילות הקשר חכם לצ׳אט (Context Packet Studio)' : 'Smart AI Context Packet Studio'}
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300 border border-emerald-500/30">
                {isHe ? 'מוכן לכל AI' : 'Universal AI Ready'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {isHe ? 'הדבק כל פלט ארוך וקבל תבנית מקוטלגת ומוכנה להדבקה או הורדת קובץ' : 'Paste any long output and generate a structured, AI-ready packet or file'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 p-1 text-xs">
            <Languages className="mx-1.5 h-3.5 w-3.5 text-slate-400" />
            {(['auto', 'he', 'en'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setLangMode(m)}
                className={`rounded-lg px-2.5 py-1 font-medium transition ${langMode === m ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                {m === 'auto' ? (isHe ? 'זיהוי אוטומטי' : 'Auto') : m.toUpperCase()}
              </button>
            ))}
          </div>
          <button type="button" onClick={openFloatingWindow}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow transition">
            <PictureInPicture2 className="h-4 w-4" />
            {isHe ? 'חלון צף מעל כל מסך' : 'Float On Top'}
          </button>
        </div>
      </div>
      {pipNotice && <div className="bg-indigo-600/20 border-b border-indigo-500/30 px-5 py-2 text-xs text-indigo-200">{pipNotice}</div>}      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5">
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">{isHe ? 'סוג התבנית וכותרת הקובץ' : 'Template & File Header'}</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value as PacketCategory); setActivePart(0); }}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none">
                {(Object.keys(CATEGORY_META) as PacketCategory[]).map((key) => (
                  <option key={key} value={key}>{isHe ? CATEGORY_META[key].labelHe : CATEGORY_META[key].labelEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">{isHe ? 'שם הפרויקט / הקשר' : 'Project / Context Name'}</label>
              <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button type="button" onClick={handlePasteClipboard}
                className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-medium text-emerald-300 transition">
                <ClipboardPaste className="h-3.5 w-3.5" />
                {isHe ? 'הדבק מהלוח' : 'Paste Clipboard'}
              </button>
              {rawInput && (
                <button type="button" onClick={() => { setRawInput(''); setActivePart(0); }}
                  className="flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-300 transition">
                  <Trash2 className="h-3.5 w-3.5" />
                  {isHe ? 'נקה' : 'Clear'}
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input type="checkbox" checked={maskSecrets} onChange={(e) => setMaskSecrets(e.target.checked)} className="rounded border-slate-600 accent-emerald-500" />
              <span>{isHe ? 'הסתר מפתחות API אוטומטית' : 'Auto-mask API secrets'}</span>
            </label>
          </div>
          <textarea rows={11} value={rawInput} onChange={(e) => { setRawInput(e.target.value); setActivePart(0); }}
            placeholder={isHe ? 'הדבק כאן כל פלט ארוך מ-PowerShell, שגיאת בנייה, קוד מקור או מסמך הקשר...' : 'Paste any long PowerShell output, build error, source code, or context...'}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-3.5 font-mono text-xs leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 outline-none" />
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs text-slate-300">
            <span>{isHe ? `תווים: ${result.totalChars.toLocaleString()} | טוקנים: ~${result.estimatedTokens.toLocaleString()}` : `Chars: ${result.totalChars.toLocaleString()} | Tokens: ~${result.estimatedTokens.toLocaleString()}`}</span>
            <span className="font-semibold text-emerald-400">
              {result.packets.length > 1 ? (isHe ? `פוצל ל-${result.packets.length} חלקים` : `Split into ${result.packets.length} parts`) : (isHe ? 'חלק 1 שלם' : '1 Complete Packet')}
            </span>
          </div>
          {result.maskedSecretsCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-200">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
              <span>{isHe ? `הוסתרו ${result.maskedSecretsCount} מפתחות רגישים מהפלט.` : `Masked ${result.maskedSecretsCount} sensitive secret(s).`}</span>
            </div>
          )}
        </div>        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <FileCode2 className="h-4 w-4 text-emerald-400" />
                <span>{currentPacket?.filename}</span>
              </div>
              {result.packets.length > 1 && (
                <div className="flex flex-wrap gap-1">
                  {result.packets.map((p, i) => (
                    <button key={p.partIndex} type="button" onClick={() => setActivePart(i)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${activePart === i ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                      {isHe ? `חלק ${p.partIndex}/${p.totalParts}` : `Part ${p.partIndex}/${p.totalParts}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <pre dir={isHe ? 'rtl' : 'ltr'} className="h-72 overflow-auto rounded-xl border border-slate-800 bg-black/70 p-3.5 text-xs leading-relaxed text-emerald-100 whitespace-pre-wrap">
              {currentPacket?.content}
            </pre>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button type="button" onClick={() => handleCopyPacket(activePart)}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition">
                {copiedIdx === activePart ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedIdx === activePart ? (isHe ? 'הועתק! הדבק בצ׳אט' : 'Copied! Paste in Chat') : (isHe ? 'העתק חבילה לצ׳אט' : 'Copy AI Packet')}
              </button>
              <button type="button" onClick={() => handleDownloadPacket(activePart)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-white transition">
                <Download className="h-4 w-4 text-indigo-400" />
                {isHe ? `הורד קובץ (${currentPacket?.filename})` : `Download (${currentPacket?.filename})`}
              </button>
            </div>
          </div>
          {smartRecs.map((rec) => (
            <div key={rec.id} className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 to-slate-900 p-3.5 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                  <Sparkles className="h-3 w-3" /> {isHe ? rec.badgeHe : rec.badgeEn}
                </span>
                <p className="text-xs font-bold text-white">{isHe ? rec.titleHe : rec.titleEn}</p>
                <p className="text-[11px] text-slate-300">{isHe ? rec.descHe : rec.descEn}</p>
              </div>
              <a href={rec.href} target={rec.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="shrink-0 flex items-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition">
                <span>{isHe ? 'פתח' : 'Open'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}