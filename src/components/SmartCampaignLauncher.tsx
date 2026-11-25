"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Rocket, Copy, CheckCircle2, Share2, Sparkles, RefreshCw, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";

interface Props { userId: string | null; context?: "workspace" | "affiliate"; }
interface TargetOption { id: string; label: string; path: string; tag: string; }

export default function SmartCampaignLauncher({ userId, context = "workspace" }: Props) {
  const { isHe } = useStudioLang();
  const [options, setOptions] = useState<TargetOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>("portfolio");
  const [tone, setTone] = useState<"launch" | "value" | "urgent">("launch");
  const [copied, setCopied] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  const loadTargets = useCallback(async () => {
    setSyncing(true);
    try {
      const baseList: TargetOption[] = [
        { id: "portfolio", label: isHe ? "הפורטפוליו הציבורי המאומת שלי" : "My Verified Public Portfolio", path: userId ? `/portfolio/${userId.slice(0, 8)}` : "/creators", tag: "PORTFOLIO" },
        { id: "store", label: isHe ? "חנות הדילים החכמה שלי" : "My Smart Deal Storefront", path: userId ? `/deals/${userId.slice(0, 8)}` : "/feed", tag: "DEAL STORE" }
      ];
      if (userId) {
        const { data: linksData } = await supabase.from("aff_links").select("id, slug, title").eq("user_id", userId).order("created_at", { ascending: false }).limit(5);
        if (linksData && linksData.length > 0) {
          linksData.forEach((item: { id: string; slug: string; title: string }) => {
            baseList.push({ id: item.id, label: item.title || item.slug, path: `/go/${item.slug}`, tag: "SMART LINK" });
          });
        }
      }
      setOptions(baseList);
      setSelectedId((prev) => (baseList.some((o) => o.id === prev) ? prev : (baseList.at(0)?.id || "portfolio")));
    } finally { setSyncing(false); }
  }, [userId, isHe]);
  useEffect(() => {
    loadTargets();
    const onSync = () => loadTargets();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [loadTargets]);

  const activeTarget = options.find((o) => o.id === selectedId) || options.at(0) || { id: "portfolio", label: isHe ? "הפורטפוליו הציבורי המאומת שלי" : "My Verified Public Portfolio", path: "/creators", tag: "PORTFOLIO" };
  const origin = typeof window !== "undefined" ? window.location.origin : "https://" + "proofcraft-seven" + ".vercel.app";
  const fullUrl = `${origin}${activeTarget.path}`;
  const ogPreviewUrl = `${origin}/api/og?title=${encodeURIComponent(activeTarget.label)}`;

  const buildCopy = () => {
    if (isHe) {
      if (tone === "urgent") return `הזדמנות מוגבלת: בדקו עכשיו את ${activeTarget.label} — זמין בלחיצה אחת בקישור המאומת:\n${fullUrl}`;
      if (tone === "value") return `חוסכים זמן וכסף: ריכזתי עבורכם גישה ישירה אל ${activeTarget.label} עם אימות מלא:\n${fullUrl}`;
      return `השקה חדשה באוויר! מוזמנים להיכנס ולראות את ${activeTarget.label} בפעולה:\n${fullUrl}`;
    }
    if (tone === "urgent") return `Limited-time drop: Check out ${activeTarget.label} now via our verified direct link:\n${fullUrl}`;
    if (tone === "value") return `Save time & unlock verified value: Direct access to ${activeTarget.label}:\n${fullUrl}`;
    return `Just shipped! Explore ${activeTarget.label} live in production:\n${fullUrl}`;
  };

  const campaignText = buildCopy();
  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(campaignText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };
  const openShare = (platform: "wa" | "tg" | "li" | "x") => {
    const encodedText = encodeURIComponent(campaignText);
    const encodedUrl = encodeURIComponent(fullUrl);
    const map = { wa: `https://whatsapp.com{encodedText}`, tg: `https://t.me{encodedUrl}&text=${encodedText}`, li: `https://linkedin.com{encodedUrl}`, x: `https://twitter.com{encodedText}` };
    window.open(map[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <div dir={isHe ? "rtl" : "ltr"} className="card-surface" style={{ padding: 18, marginBottom: 18, border: "1px solid rgba(56,189,248,0.32)", background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(14,116,144,0.14))" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Rocket size={18} color="#38bdf8" />
          <div>
            <h2 style={{ fontSize: 15.5, fontWeight: 900, color: "#f8fafc", margin: 0 }}>{isHe ? (context === "affiliate" ? "אשף הפצה וקמפיינים חכמים לדילים" : "אשף השקה ושיווק חכם ב-1-קליק") : (context === "affiliate" ? "1-Click Smart Deal Campaign Launcher" : "1-Click Smart Launch & Marketing Wizard")}</h2>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{isHe ? "בחר נכס חי, התאם סגנון מסר והפץ מיידית עם תצוגת OG עשירה" : "Select a live asset, pick your campaign angle, and distribute with rich OG previews"}</p>
          </div>
        </div>
        <button type="button" onClick={loadTargets} disabled={syncing} className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 11.5 }}><RefreshCw size={12} /><span>{syncing ? (isHe ? "מסנכרן..." : "Syncing...") : (isHe ? "רענן נכסים" : "Refresh Assets")}</span></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>{isHe ? "1. בחר יעד להשקה או שיתוף" : "1. Select Target Asset or Deal"}</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="input-dark" style={{ width: "100%", height: 38, fontSize: 12.5 }}>{options.map((opt) => (<option key={opt.id} value={opt.id}>{`[${opt.tag}] ${opt.label}`}</option>))}</select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>{isHe ? "2. סגנון מסר שיווקי" : "2. Campaign Messaging Angle"}</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{(["launch", "value", "urgent"] as const).map((k) => (<button key={k} type="button" onClick={() => setTone(k)} className={tone === k ? "btn-primary" : "btn-ghost"} style={{ height: 38, padding: "0 12px", fontSize: 12, width: "auto" }}>{k === "launch" ? (isHe ? "השקה חדשה" : "New Launch") : k === "value" ? (isHe ? "ערך וחיסכון" : "Value & Proof") : (isHe ? "הזדמנות מוגבלת" : "Limited Drop")}</button>))}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, alignItems: "stretch", marginBottom: 14 }}>
        <div style={{ padding: 12, borderRadius: 10, background: "rgba(2,6,23,0.65)", border: "1px solid rgba(148,163,184,0.22)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8" }}>{isHe ? "נוסח מוכן להפצה מיידית:" : "Ready-to-Publish Social Copy:"}</div>
          <div style={{ fontSize: 12.5, color: "#e2e8f0", whiteSpace: "pre-line", lineHeight: 1.55 }}>{campaignText}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
            <button type="button" onClick={handleCopy} className="btn-primary" style={{ height: 32, padding: "0 12px", fontSize: 12, width: "auto" }}>{copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}<span>{copied ? (isHe ? "הועתק ללוח!" : "Copied!") : (isHe ? "העתק נוסח וקישור" : "Copy Post & Link")}</span></button>
            <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none" }}><ExternalLink size={12} /><span>{isHe ? "פתח יעד" : "Open Target"}</span></a>
          </div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: "rgba(2,6,23,0.65)", border: "1px solid rgba(148,163,184,0.22)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "#34d399" }}><Sparkles size={13} /><span>{isHe ? "כרטיס תצוגה מקדימה (OG Social Card):" : "Live OG Social Preview Card:"}</span></div>
          <img src={ogPreviewUrl} alt={activeTarget.label} style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(56,189,248,0.25)" }} />
          <div style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fullUrl}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, paddingTop: 10, borderTop: "1px solid rgba(148,163,184,0.16)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#cbd5e1" }}><Share2 size={14} color="#38bdf8" />{isHe ? "הפצה ישירה בלחיצה אחת:" : "1-Click Direct Distribution:"}</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => openShare("wa")} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12, borderColor: "rgba(52,211,153,0.4)", color: "#34d399" }}>WhatsApp</button>
          <button type="button" onClick={() => openShare("tg")} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12, borderColor: "rgba(56,189,248,0.4)", color: "#38bdf8" }}>Telegram</button>
          <button type="button" onClick={() => openShare("li")} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12 }}>LinkedIn</button>
          <button type="button" onClick={() => openShare("x")} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12 }}>X / Post</button>
        </div>
      </div>
    </div>
  );
}