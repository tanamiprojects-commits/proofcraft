"use client";

import React, { useEffect, useState } from 'react';
import { ContextStudioConfig, DEFAULT_STUDIO_CONFIG } from '@/lib/context-packet-engine';
import { CheckCircle2, Save, Sliders, Sparkles, Terminal } from 'lucide-react';

export default function ContextStudioAdminCard({ isHe = true }: { isHe?: boolean }) {
  const [config, setConfig] = useState<ContextStudioConfig>(DEFAULT_STUDIO_CONFIG);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetch('/api/context-studio-config')
      .then((r) => r.json())
      .then((d) => { if (d?.ok && d?.config) setConfig(d.config); })
      .catch(() => {});
  }, []);

  const saveConfig = async (next: ContextStudioConfig) => {
    setConfig(next);
    setSaving(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/context-studio-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: next }),
      });
      const data = await res.json();
      setStatusMsg(
        data?.ok
          ? (isHe ? (data.persistedToDb ? 'נשמר וסונכרן בענן (Supabase)' : 'עודכן בשרת הפעיל') : 'Saved & Synced')
          : (isHe ? 'שגיאה בשמירה' : 'Save failed')
      );
    } catch {
      setStatusMsg(isHe ? 'שגיאת תקשורת' : 'Network error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(''), 3500);
    }
  };

  const toggleRec = (id: string) => {
    const updated = config.recommendations.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    saveConfig({ ...config, recommendations: updated });
  };

  return (
    <div dir={isHe ? 'rtl' : 'ltr'} className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 text-slate-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">{isHe ? 'ניהול Context Packet Studio ושיווק אורגני חכם' : 'Context Packet Studio & Smart Ecosystem Governance'}</h3>
            <p className="text-xs text-slate-400">{isHe ? 'שליטה מלאה בדף השיטה ובכלי העצמאי (/context-studio) ללא עריכת קוד' : 'Full runtime control over /method and /context-studio'}</p>
          </div>
        </div>
        {statusMsg && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> {statusMsg}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <button type="button" onClick={() => saveConfig({ ...config, enabled: !config.enabled })}
          className={`rounded-xl border p-3 text-start transition ${config.enabled ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
          <div className="font-bold">{isHe ? 'סטטוס סטודיו' : 'Studio Status'}</div>
          <div>{config.enabled ? (isHe ? 'פעיל באתר' : 'Enabled') : (isHe ? 'מושבת' : 'Disabled')}</div>
        </button>

        <button type="button" onClick={() => saveConfig({ ...config, enableSmartEcosystemLinks: !config.enableSmartEcosystemLinks })}
          className={`rounded-xl border p-3 text-start transition ${config.enableSmartEcosystemLinks ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
          <div className="font-bold flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> {isHe ? 'המלצות נכסים חכמות' : 'Smart Asset Prompts'}</div>
          <div>{config.enableSmartEcosystemLinks ? (isHe ? 'מופעל לפי הקשר' : 'Context-Triggered ON') : (isHe ? 'כבוי' : 'OFF')}</div>
        </button>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-1">
          <label className="font-bold text-slate-200 flex items-center gap-1"><Sliders className="h-3.5 w-3.5" /> {isHe ? 'סף פיצול תווים לצ׳אט' : 'Auto-Split Char Limit'}</label>
          <div className="flex items-center gap-2">
            <input type="number" min={4000} max={60000} step={1000} value={config.defaultChunkLimit}
              onChange={(e) => setConfig({ ...config, defaultChunkLimit: Number(e.target.value) || 12000 })}
              className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white" />
            <button type="button" disabled={saving} onClick={() => saveConfig(config)}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
              <Save className="h-3 w-3" /> {isHe ? 'שמור' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-300">{isHe ? 'חוקי סנכרון אורגני בין נכסי האקוסיסטם (מופעלים אוטומטית לפי תוכן הפלט):' : 'Organic Ecosystem Sync Rules (Auto-triggered by output context):'}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {config.recommendations.map((rec) => (
            <button key={rec.id} type="button" onClick={() => toggleRec(rec.id)}
              className={`rounded-xl border p-3 text-start transition ${rec.enabled ? 'border-indigo-500/40 bg-indigo-950/30' : 'border-slate-800 bg-slate-900/50 opacity-60'}`}>
              <div className="flex items-center justify-between text-[11px] font-bold text-indigo-300 mb-1">
                <span>{rec.href}</span>
                <span>{rec.enabled ? 'ON' : 'OFF'}</span>
              </div>
              <div className="text-xs font-bold text-white line-clamp-1">{isHe ? rec.titleHe : rec.titleEn}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}