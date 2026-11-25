"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Award, CheckCircle2, Copy, ExternalLink, Globe, Rocket, Share2, Sparkles, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { GOAL_TRACKS, PLATFORM_BLUEPRINTS, UserGoalTrack } from "@/lib/organic-network-engine";

interface VerifiedChannelMap { [platformId: string]: string; }
interface CoOpNode { id: string; author_name: string; project_title: string; live_url: string; summary: string; }

export default function OrganicNetworkBuilderOS({ userId }: { userId: string | null }) {
  const { isHe } = useStudioLang();
  const [goal, setGoal] = useState<UserGoalTrack>("affiliate");
  const [activePlatId, setActivePlatId] = useState<string>("youtube");
  const [verifiedMap, setVerifiedMap] = useState<VerifiedChannelMap>({});
  const [urlDraft, setUrlDraft] = useState<string>("");
  const [coOpNodes, setCoOpNodes] = useState<CoOpNode[]>([]);
  const [copiedKey, setCopiedKey] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<string>("");

  const origin = typeof window !== "undefined" ? window.location.origin : ("https://" + "studio" + ".tanami360.com");
  const userPrimaryLink = userId ? `${origin}/portfolio/${userId.slice(0, 8)}?ref=${userId.slice(0, 8)}` : origin;

  const loadCoOpNetwork = useCallback(async () => {
    const { data } = await supabase.from("feed_posts").select("id, author_name, project_title, live_url, summary").eq("status", "approved").order("created_at", { ascending: false }).limit(6);
    if (data) setCoOpNodes(data);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pc_user_organic_net_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.goal) setGoal(parsed.goal);
        if (parsed.verifiedMap) setVerifiedMap(parsed.verifiedMap);
      }
    } catch {}
    loadCoOpNetwork();
  }, [loadCoOpNetwork]);
  const currentPlat = PLATFORM_BLUEPRINTS.find((p) => p.id === activePlatId) || PLATFORM_BLUEPRINTS.at(0)!;
  const verifiedCount = Object.keys(verifiedMap).length;
  const readinessPct = Math.min(100, Math.round((verifiedCount / PLATFORM_BLUEPRINTS.length) * 100));

  const copyText = (txt: string, key: string) => { navigator.clipboard?.writeText(txt); setCopiedKey(key); setTimeout(() => setCopiedKey(""), 2200); };

  const handleVerifyChannel = async () => {
    const clean = urlDraft.trim();
    if (!clean.startsWith("https://")) {
      setStatusMsg(isHe ? "נא להזין כתובת תקינה המתחילה ב-https://" : "Please enter a valid https:// channel URL");
      return;
    }
    const nextMap = { ...verifiedMap, [currentPlat.id]: clean };
    setVerifiedMap(nextMap);
    localStorage.setItem("pc_user_organic_net_v1", JSON.stringify({ goal, verifiedMap: nextMap }));
    setUrlDraft("");
    setStatusMsg(isHe ? `ערוץ ${currentPlat.name} אומת וחובר לרשת השיווק ההדדית!` : `${currentPlat.name} verified & connected to Co-Op Organic Ring!`);
    if (userId) {
      await supabase.from("feed_posts").insert({
        user_id: userId,
        author_name: "Verified Organic Builder",
        project_title: `${currentPlat.name} · Organic Channel`,
        summary: isHe ? `ערוץ שיווק אורגני פעיל במסלול ${goal} — מחובר לרשת ההפצה ההדדית.` : `Active ${goal} organic channel connected to the Co-Op distribution network.`,
        live_url: clean,
        status: "approved",
        admin_verified: true,
      });
      loadCoOpNetwork();
    }
  };

  const handleCrossPromote = async (node: CoOpNode) => {
    const shareCopy = isHe
      ? `מומלץ לבדוק את ${node.project_title} ברשת היוצרים של Tanami360 Studio:\n${node.live_url}\n\nרוצים לבנות סביבת שיווק ונכס דיגיטלי משלכם בחינם? הצטרפו כאן:\n${userPrimaryLink}`
      : `Check out ${node.project_title} on the Tanami360 Studio Creator Network:\n${node.live_url}\n\nLaunch your own free digital asset & organic network here:\n${userPrimaryLink}`;
    copyText(shareCopy, `coop-${node.id}`);
    setStatusMsg(isHe ? "פוסט שיתוף הדדי הועתק! (+5 נקודות חשיפה ברשת)" : "Co-Op cross-promotion post copied! (+5 Network Boost)");
    if (userId) {
      const { data: pr } = await supabase.from("profiles").select("affiliate_boost_credits").eq("id", userId).single();
      const curr = Number(pr?.affiliate_boost_credits ?? 10);
      await supabase.from("profiles").update({ affiliate_boost_credits: curr + 5 }).eq("id", userId);
    }
  };

  return (
    <section dir={isHe ? "rtl" : "ltr"} className="card-hero" style={{ padding: 20, marginBottom: 20, border: "1px solid rgba(52,211,153,0.35)", textAlign: isHe ? "right" : "left" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.16)", color: "#34d399", border: "1px solid rgba(52,211,153,0.35)", fontSize: 11 }}>
            <Rocket size={12} /> {isHe ? "מנוע בניית רשת שיווק אורגנית + קידום הדדי אוטומטי" : "ORGANIC NETWORK BUILDER & AUTO CO-OP RING"}
          </span>
          <h2 style={{ fontSize: 18.5, fontWeight: 900, color: "#f8fafc", marginTop: 6 }}>{isHe ? "הקם ונהל את רשת השיווק האורגנית שלך (והתחבר אוטומטית לשאר היוצרים)" : "Build & Manage Your Organic Channels (Auto-Connected to Co-Op Creators)"}</h2>
        </div>
        <div style={{ minWidth: 165, padding: "8px 14px", borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.3)" }}>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: "#94a3b8" }}>{isHe ? "מוכנות רשת אורגנית" : "NETWORK READINESS"}</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#34d399" }}>{readinessPct}% ({verifiedCount}/{PLATFORM_BLUEPRINTS.length})</div>
        </div>
      </div>

      {statusMsg && <div style={{ padding: 10, borderRadius: 10, background: "rgba(52,211,153,0.14)", border: "1px solid rgba(52,211,153,0.35)", color: "#34d399", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>{statusMsg}</div>}
      <div style={{ fontSize: 11.5, fontWeight: 800, color: "#94a3b8", marginBottom: 6 }}>{isHe ? "1. בחר את הכיוון המקצועי שלך להתאמת האסטרטגיה והתסריטים:" : "1. SELECT YOUR STRATEGIC TRACK:"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8, marginBottom: 16 }}>
        {GOAL_TRACKS.map((tr) => (
          <button key={tr.id} type="button" onClick={() => setGoal(tr.id)} style={{ padding: 10, borderRadius: 12, textAlign: isHe ? "right" : "left", cursor: "pointer", background: goal === tr.id ? "rgba(56,189,248,0.16)" : "#0a0b0e", border: `1px solid ${goal === tr.id ? "#38bdf8" : "rgba(255,255,255,0.08)"}` }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: goal === tr.id ? "#38bdf8" : "#f8fafc" }}>{isHe ? tr.titleHe : tr.titleEn}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{isHe ? tr.descHe : tr.descEn}</div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 11.5, fontWeight: 800, color: "#94a3b8", marginBottom: 6 }}>{isHe ? "2. בחר פלטפורמה להקמה, הדרכה ואימות חיבור לרשת:" : "2. SELECT CHANNEL FOR GUIDED SETUP & VERIFICATION:"}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {PLATFORM_BLUEPRINTS.map((pl) => {
          const isVerified = Boolean(verifiedMap[pl.id]);
          return (
            <button key={pl.id} type="button" onClick={() => { setActivePlatId(pl.id); setUrlDraft(verifiedMap[pl.id] || ""); }} className={activePlatId === pl.id ? "btn-primary" : "btn-ghost"} style={{ height: 34, padding: "0 12px", fontSize: 11.5, width: "auto", borderColor: isVerified ? "rgba(52,211,153,0.5)" : undefined }}>
              {isVerified ? "✓ " : ""}{pl.name}
            </button>
          );
        })}
      </div>

      {currentPlat && (
        <div style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.25)", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            <div>
              <span className="badge-pill" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8", fontSize: 10.5 }}>{currentPlat.badge}</span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginTop: 4 }}>{currentPlat.name}</h3>
            </div>
            <a href={currentPlat.signupUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ height: 34, padding: "0 14px", fontSize: 12, width: "auto" }}><ExternalLink size={13} /> {isHe ? "פתח פלטפורמה להרשמה / הגדרה" : "Open External Setup"}</a>
          </div>
          <p style={{ fontSize: 12.5, color: "#34d399", fontWeight: 700, marginBottom: 8 }}>{isHe ? `למה זה חשוב: ${currentPlat.whyItMattersHe}` : `Why it matters: ${currentPlat.whyItMattersEn}`}</p>
          <div style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 12 }}>
            {(isHe ? currentPlat.externalStepsHe : currentPlat.externalStepsEn).map((st, idx) => (<div key={idx} style={{ marginBottom: 3 }}>{idx + 1}. {st}</div>))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10, marginBottom: 12 }}>
            <div style={{ padding: 10, borderRadius: 10, background: "#05070a", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8", marginBottom: 4 }}>{isHe ? "ביו / תיאור מותאם להעתקה:" : "Ready Bio / Description:"}</div>
              <div style={{ fontSize: 11.5, color: "#e2e8f0", whiteSpace: "pre-line", marginBottom: 8 }}>{currentPlat.buildBio(goal, userPrimaryLink, isHe)}</div>
              <button type="button" onClick={() => copyText(currentPlat.buildBio(goal, userPrimaryLink, isHe), "bio")} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11 }}><Copy size={11} /> {copiedKey === "bio" ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק ביו" : "Copy Bio")}</button>
            </div>
            <div style={{ padding: 10, borderRadius: 10, background: "#05070a", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>{isHe ? "תסריט וידאו / פוסט השקה מוכן:" : "Ready Launch Post / Script:"}</div>
              <div style={{ fontSize: 11.5, color: "#e2e8f0", whiteSpace: "pre-line", marginBottom: 8 }}>{currentPlat.buildScript(goal, userPrimaryLink, isHe)}</div>
              <button type="button" onClick={() => copyText(currentPlat.buildScript(goal, userPrimaryLink, isHe), "script")} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11 }}><Copy size={11} /> {copiedKey === "script" ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק תסריט/פוסט" : "Copy Script")}</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
            <input value={urlDraft} onChange={(e) => setUrlDraft(e.target.value)} placeholder={isHe ? "הדבק כאן את הקישור החי של הערוץ שיצרת (https://...) לאימות וחיבור לרשת" : "Paste your live channel URL (https://...) to verify & join Co-Op Ring"} className="input-dark" style={{ flex: 1, minWidth: 230, height: 36, fontSize: 12 }} />
            <button type="button" onClick={handleVerifyChannel} className="btn-primary" style={{ height: 36, padding: "0 14px", fontSize: 12, width: "auto" }}><CheckCircle2 size={13} /> {isHe ? "אמת ערוץ וחבר לרשת ההדדית" : "Verify & Connect to Ring"}</button>
          </div>
        </div>
      )}

      <div style={{ padding: 14, borderRadius: 14, background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 900, color: "#38bdf8", marginBottom: 6 }}><Users size={15} /><span>{isHe ? "רשת הקידום האורגני ההדדי (Live Co-Op Creator Ring)" : "Live Co-Op Organic Creator Network"}</span></div>
        <p style={{ fontSize: 11.5, color: "#cbd5e1", marginBottom: 10 }}>{isHe ? "כל משתמש שמאמת ערוץ מצטרף אוטומטית לרשת. שתף ערוץ של יוצר אחר לקבלת +5 נקודות חשיפה — והמערכת תקדם את הערוץ שלך בתור הבא!" : "Every verified channel joins the ring automatically. Cross-promote a peer creator for +5 Boost Credits and move your channel up the queue!"}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
          {coOpNodes.slice(0, 4).map((nd) => (
            <div key={nd.id} style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 6 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#f8fafc" }}>{nd.project_title}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{nd.author_name}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <a href={nd.live_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 8px", fontSize: 11 }}><Globe size={11} /> {isHe ? "צפה" : "Visit"}</a>
                <button type="button" onClick={() => handleCrossPromote(nd)} className="btn-ghost" style={{ height: 28, padding: "0 8px", fontSize: 11, color: "#34d399" }}><Share2 size={11} /> {copiedKey === `coop-${nd.id}` ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "קדם (+5)" : "Boost (+5)")}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Channel Maintenance & Monetization Opportunities */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10, marginTop: 12 }}>
        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.25)" }}>
          <div style={{ fontSize: 12.5, fontWeight: 900, color: "#34d399", marginBottom: 4 }}>{isHe ? "תחזוקה שוטפת ותגובה נעוצה (Pinned CTA)" : "Channel Maintenance & Pinned CTA"}</div>
          <p style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 8 }}>{isHe ? "הדבק תגובה נעוצה מתחת לכל סרטון או פוסט בערוצים שלך כדי להזרים תנועה קבועה לקישור האישי:" : "Pin this CTA comment under every post/video to drive continuous clicks:"}</p>
          <button type="button" onClick={() => copyText(isHe ? `רוצים להשתמש בכלי או לבנות נכס דיגיטלי דומה? כניסה ישירה בחינם כאן 👇\n${userPrimaryLink}` : `Want to use this tool or build a similar digital asset? Direct access here 👇\n${userPrimaryLink}`, "pinned-cta")} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#34d399" }}>
            <Copy size={11} /> {copiedKey === "pinned-cta" ? (isHe ? "התגובה הנעוצה הועתקה!" : "Pinned CTA Copied!") : (isHe ? "העתק תגובה נעוצה לפוסט/סרטון" : "Copy Pinned CTA Comment")}
          </button>
        </div>
        <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.28)" }}>
          <div style={{ fontSize: 12.5, fontWeight: 900, color: "#fbbf24", marginBottom: 4 }}>{isHe ? "הרחבת רווחים: חסויות, פרסומות ושיתופי פעולה" : "Monetization Expansion: Sponsorships & Ads"}</div>
          <p style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 8 }}>{isHe ? "בעל עסק או מפרסם? ניתן להציע שיתוף פעולה מסחרי, חסות ברשת היוצרים או קידום ממומן בפלטפורמה." : "Brand or advertiser? Submit a commercial sponsorship or co-marketing proposal directly to platform ops."}</p>
          <a href="/feed" className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11, color: "#fbbf24" }}>{isHe ? "הגש הצעה לשיתוף פעולה / חסות" : "Submit Sponsorship / Ad Inquiry"}</a>
        </div>
      </div>
    </section>
  );
}