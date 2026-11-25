"use client";
import React, { useEffect, useState } from "react";
import { Compass, Copy, CheckCircle2, ExternalLink, FolderKanban, Globe, Lock, Megaphone, Plus, Share2, Sparkles, Trash2 } from "lucide-react";
import { useStudioLang } from "@/lib/i18n-engine";
import { INITIAL_PROMO_CHANNELS, INITIAL_WEB_ASSETS, ExternalPromoChannel, ManagedWebAsset, ChannelStatus, UsageFreq, VisibilityMode } from "@/lib/organic-command-data";

export default function OrganicAssetCommandOS() {
  const { isHe } = useStudioLang();
  const [subTab, setSubTab] = useState<"channels" | "catalog" | "campaign">("channels");
  const [channels, setChannels] = useState<ExternalPromoChannel[]>(INITIAL_PROMO_CHANNELS);
  const [assets, setAssets] = useState<ManagedWebAsset[]>(INITIAL_WEB_ASSETS);
  const [freqFilter, setFreqFilter] = useState<"all" | UsageFreq>("all");
  const [visFilter, setVisFilter] = useState<"all" | VisibilityMode>("all");
  const [selectedAssetId, setSelectedAssetId] = useState<string>("asset-smartform");
  const [channelAngle, setChannelAngle] = useState<"linkedin" | "whatsapp" | "telegram" | "x">("linkedin");
  const [copiedKey, setCopiedKey] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCat, setNewCat] = useState<ManagedWebAsset["category"]>("Platform");
  const [newVis, setNewVis] = useState<VisibilityMode>("public");

  useEffect(() => {
    try {
      const savedCh = localStorage.getItem("pc_organic_channels_v1");
      if (savedCh) setChannels(JSON.parse(savedCh));
      const savedAs = localStorage.getItem("pc_managed_assets_v1");
      if (savedAs) setAssets(JSON.parse(savedAs));
    } catch {}
  }, []);

  const saveChannels = (next: ExternalPromoChannel[]) => { setChannels(next); localStorage.setItem("pc_organic_channels_v1", JSON.stringify(next)); };
  const saveAssets = (next: ManagedWebAsset[]) => { setAssets(next); localStorage.setItem("pc_managed_assets_v1", JSON.stringify(next)); };
  const copyStr = (txt: string, key: string) => { navigator.clipboard?.writeText(txt); setCopiedKey(key); setTimeout(() => setCopiedKey(""), 2200); };

  const updateChannel = (id: string, patch: Partial<ExternalPromoChannel>) => saveChannels(channels.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const addAsset = () => {
    if (!newName.trim() || !newUrl.trim()) return;
    const cleanUrl = newUrl.trim().startsWith("http") ? newUrl.trim() : `https://${newUrl.trim()}`;
    const item: ManagedWebAsset = { id: `asset-${Date.now()}`, name: newName.trim(), category: newCat, url: cleanUrl, visibility: newVis, frequency: "daily", ctaHe: "פתיחת נכס", ctaEn: "Open Asset", summaryHe: "נכס מנוהל במערכת השליטה המרכזית.", summaryEn: "Managed web asset in central command OS." };
    saveAssets([item, ...assets]);
    setNewName(""); setNewUrl("");
  };
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const publicShowcaseList = assets.filter((a) => a.visibility === "public").map((a) => `• ${a.name} — ${a.url}`).join("\n");

  const buildOrganicPost = () => {
    if (!activeAsset) return "";
    if (channelAngle === "linkedin") {
      return isHe
        ? `במקום להבטיח הבטחות — בנינו כלי שעובד באוויר ופתוח לשימוש חופשי:\n\n${activeAsset.name}\n${activeAsset.summaryHe}\n\nמוזמנים להתנסות בחינם ולשתף חוות דעת:\n${activeAsset.url}\n\n#Tanami360 #AI #פיתוחתוכנה #יזמות #כליםחינמיים`
        : `Instead of slide decks, we shipped a live tool open for free public use:\n\n${activeAsset.name}\n${activeAsset.summaryEn}\n\nTry it live here:\n${activeAsset.url}\n\n#AI #SaaS #BuildInPublic #Tanami360`;
    }
    if (channelAngle === "whatsapp") {
      return isHe
        ? `היי! רציתי לשתף כלי חינמי ושימושי שבנינו ב-Tanami360 Studio:\n*${activeAsset.name}* — ${activeAsset.summaryHe}\nפתוח לשימוש מיידי ללא הרשמה:\n${activeAsset.url}`
        : `Hey! Sharing a free live tool we built at Tanami360 Studio:\n*${activeAsset.name}* — ${activeAsset.summaryEn}\nTry it directly here:\n${activeAsset.url}`;
    }
    if (channelAngle === "telegram") {
      return isHe
        ? `🚀 חדש ב-Tanami360 Studio:\n${activeAsset.name}\n\n${activeAsset.summaryHe}\n👉 כניסה ישירה: ${activeAsset.url}`
        : `🚀 Live at Tanami360 Studio:\n${activeAsset.name}\n\n${activeAsset.summaryEn}\n👉 Direct link: ${activeAsset.url}`;
    }
    return `Just shipped: ${activeAsset.name} — ${activeAsset.summaryEn}\n\nLive & free to try: ${activeAsset.url} #BuildInPublic #AI`;
  };

  const generatedPost = buildOrganicPost();
  const filteredAssets = assets.filter((a) => (freqFilter === "all" || a.frequency === freqFilter) && (visFilter === "all" || a.visibility === visFilter));
  const activeChannelsCount = channels.filter((c) => c.status !== "todo").length;

  return (
    <section dir={isHe ? "rtl" : "ltr"} className="card-hero" style={{ padding: 20, marginBottom: 18, borderColor: "rgba(52, 211, 153, 0.35)", textAlign: isHe ? "right" : "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.16)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.35)", fontSize: 11 }}>
            <Sparkles size={12} /> {isHe ? "מנוע שיווק אורגני וקטלוג נכסים מרכזי" : "ORGANIC GROWTH & ASSET COMMAND OS"}
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginTop: 6 }}>{isHe ? "שליטה מרכזית בערוצי קידום, נכסים ברשת והפצה אורגנית" : "Central Control for Promo Channels, Web Assets & Organic Distribution"}</h2>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setSubTab("channels")} className={subTab === "channels" ? "btn-primary" : "btn-ghost"} style={{ height: 34, padding: "0 12px", fontSize: 12, width: "auto" }}><Compass size={13} /> {isHe ? `ערוצי הרשמה וקידום (${activeChannelsCount}/${channels.length})` : `Channels (${activeChannelsCount}/${channels.length})`}</button>
          <button type="button" onClick={() => setSubTab("catalog")} className={subTab === "catalog" ? "btn-primary" : "btn-ghost"} style={{ height: 34, padding: "0 12px", fontSize: 12, width: "auto" }}><FolderKanban size={13} /> {isHe ? `קטלוג נכסים (${assets.length})` : `Asset Catalog (${assets.length})`}</button>
          <button type="button" onClick={() => setSubTab("campaign")} className={subTab === "campaign" ? "btn-primary" : "btn-ghost"} style={{ height: 34, padding: "0 12px", fontSize: 12, width: "auto" }}><Megaphone size={13} /> {isHe ? "מחולל פוסטים אורגניים" : "Organic Post Engine"}</button>
        </div>
      </div>

      {subTab === "channels" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 12, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", fontSize: 12, color: "#cbd5e1" }}>
            {isHe ? "מדריך ביצוע מסודר: פתח כל ערוץ בלחיצה, העתק את הביו/מפת האתר המוכנה, ושמור כאן את כתובת הערוץ הפעיל למעקב שוטף." : "Guided execution: open each channel signup link, copy the pre-written bio/sitemap, and save your live channel URL below."}
          </div>
          {channels.map((ch) => (
            <div key={ch.id} style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: 14.5, color: "#f8fafc" }}>{ch.platform}</strong>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{isHe ? ch.purposeHe : ch.purposeEn}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <select value={ch.status} onChange={(e) => updateChannel(ch.id, { status: e.target.value as ChannelStatus })} className="input-dark" style={{ height: 32, fontSize: 11.5, padding: "0 8px" }}>
                    <option value="todo">{isHe ? "1. טרם נפתח" : "1. To Do"}</option>
                    <option value="setup">{isHe ? "2. נפתח והוגדר" : "2. Configured"}</option>
                    <option value="active">{isHe ? "3. פעיל ומקדם" : "3. Active Growth"}</option>
                  </select>
                  <a href={ch.signupUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ height: 32, padding: "0 12px", fontSize: 11.5, width: "auto" }}><ExternalLink size={12} /> {isHe ? "פתח ערוץ להרשמה" : "Open Signup"}</a>
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: "#cbd5e1", marginBottom: 8 }}>{ch.stepsHe.map((s, i) => (<div key={i}>• {s}</div>))}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <button type="button" onClick={() => copyStr(isHe ? ch.copyBioHe : ch.copyBioEn, ch.id)} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11.5, color: "#38bdf8" }}>
                  {copiedKey === ch.id ? <CheckCircle2 size={12} /> : <Copy size={12} />} {copiedKey === ch.id ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק ביו / מפת אתר מוכנה" : "Copy Bio / Sitemap")}
                </button>
                <input value={ch.liveChannelUrl} onChange={(e) => updateChannel(ch.id, { liveChannelUrl: e.target.value })} placeholder={isHe ? "הדבק כאן את קישור הערוץ שלך לאחר הפתיחה..." : "Paste your live channel URL here..."} className="input-dark" style={{ flex: 1, minWidth: 220, height: 32, fontSize: 11.5 }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {subTab === "catalog" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["all", "daily", "weekly", "archive"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFreqFilter(f)} className={freqFilter === f ? "btn-primary" : "btn-ghost"} style={{ height: 30, padding: "0 10px", fontSize: 11, width: "auto" }}>{f === "all" ? (isHe ? "כל התדירויות" : "All Freq") : f === "daily" ? (isHe ? "שימוש תדיר" : "Daily") : f === "weekly" ? (isHe ? "תקופתי" : "Weekly") : (isHe ? "ארכיון" : "Archive")}</button>
              ))}
              {(["all", "public", "private"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setVisFilter(v)} className={visFilter === v ? "btn-primary" : "btn-ghost"} style={{ height: 30, padding: "0 10px", fontSize: 11, width: "auto" }}>{v === "all" ? (isHe ? "ציבורי + פרטי" : "All Visibility") : v === "public" ? (isHe ? "ציבורי לשיתוף" : "Public Only") : (isHe ? "פרטי למנהל" : "Private Only")}</button>
              ))}
            </div>
            <button type="button" onClick={() => copyStr(publicShowcaseList, "pub-list")} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 11.5, color: "#34d399" }}>
              <Share2 size={12} /> {copiedKey === "pub-list" ? (isHe ? "רשימה ציבורית הועתקה!" : "Public List Copied!") : (isHe ? "העתק קטלוג ציבורי לשיתוף לקוחות" : "Copy Public Showcase List")}
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8, padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={isHe ? "שם הנכס / הפלטפורמה" : "Asset Name"} className="input-dark" style={{ height: 34, fontSize: 12 }} />
            <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="input-dark" style={{ height: 34, fontSize: 12 }} />
            <select value={newCat} onChange={(e) => setNewCat(e.target.value as ManagedWebAsset["category"])} className="input-dark" style={{ height: 34, fontSize: 12 }}><option value="Platform">Platform</option><option value="Free Tool">Free Tool</option><option value="Business Card">Business Card</option><option value="Admin & Ops">Admin & Ops</option></select>
            <select value={newVis} onChange={(e) => setNewVis(e.target.value as VisibilityMode)} className="input-dark" style={{ height: 34, fontSize: 12 }}><option value="public">{isHe ? "ציבורי לשיתוף" : "Public"}</option><option value="private">{isHe ? "פרטי למנהל" : "Private"}</option></select>
            <button type="button" onClick={addAsset} className="btn-primary" style={{ height: 34, fontSize: 12, width: "auto" }}><Plus size={13} /> {isHe ? "הוסף נכס" : "Add Asset"}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
            {filteredAssets.map((a) => (
              <div key={a.id} style={{ padding: 14, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                    <span className="badge-pill" style={{ fontSize: 10, background: a.visibility === "public" ? "rgba(52,211,153,0.14)" : "rgba(251,191,36,0.14)", color: a.visibility === "public" ? "#34d399" : "#fbbf24" }}>{a.visibility === "public" ? <Globe size={10} /> : <Lock size={10} />} {a.visibility.toUpperCase()} · {a.category}</span>
                    <button type="button" onClick={() => saveAssets(assets.filter((x) => x.id !== a.id))} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><Trash2 size={13} /></button>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc", marginTop: 6 }}>{a.name}</div>
                  <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>{isHe ? a.summaryHe : a.summaryEn}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11, color: "#38bdf8" }}><ExternalLink size={11} /> {isHe ? a.ctaHe : a.ctaEn}</a>
                  <button type="button" onClick={() => { setSelectedAssetId(a.id); setSubTab("campaign"); }} className="btn-ghost" style={{ height: 28, padding: "0 9px", fontSize: 11, color: "#34d399" }}>{isHe ? "צור פוסט קידום" : "Promote"}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === "campaign" && activeAsset && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select value={selectedAssetId} onChange={(e) => setSelectedAssetId(e.target.value)} className="input-dark" style={{ height: 36, fontSize: 12.5 }}>{assets.filter((a) => a.visibility === "public").map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}</select>
            {(["linkedin", "whatsapp", "telegram", "x"] as const).map((net) => (
              <button key={net} type="button" onClick={() => setChannelAngle(net)} className={channelAngle === net ? "btn-primary" : "btn-ghost"} style={{ height: 36, padding: "0 12px", fontSize: 12, width: "auto" }}>{net.toUpperCase()}</button>
            ))}
          </div>
          <pre dir={isHe ? "rtl" : "ltr"} style={{ padding: 14, borderRadius: 12, background: "#05070a", border: "1px solid rgba(56,189,248,0.25)", color: "#e2e8f0", fontSize: 12.5, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{generatedPost}</pre>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => copyStr(generatedPost, "post-copy")} className="btn-primary" style={{ height: 36, padding: "0 14px", fontSize: 12, width: "auto" }}><Copy size={13} /> {copiedKey === "post-copy" ? (isHe ? "הפוסט הועתק ללוח!" : "Post Copied!") : (isHe ? "העתק פוסט מוכן להדבקה" : "Copy Ready Post")}</button>
            <a href={`https://whatsapp.com{encodeURIComponent(generatedPost)}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 36, padding: "0 12px", fontSize: 12, color: "#34d399" }}>WhatsApp</a>
            <a href={`https://t.me{encodeURIComponent(activeAsset.url)}&text=${encodeURIComponent(generatedPost)}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 36, padding: "0 12px", fontSize: 12, color: "#38bdf8" }}>Telegram</a>
            <a href={`https://linkedin.com{encodeURIComponent(activeAsset.url)}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 36, padding: "0 12px", fontSize: 12 }}>LinkedIn</a>
          </div>
        </div>
      )}
    </section>
  );
}