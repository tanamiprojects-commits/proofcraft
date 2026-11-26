"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, ArrowLeft, ShieldCheck, Layers, Sparkles, Compass, Link2,
  BookOpen, Wrench, Users, CheckCircle2, Flame, Award
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { getStrategicTrackGuides } from "@/lib/plg-career-strategy";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";

export default function HomePage() {
  const router = useRouter();
  const { isHe, dir, t } = useStudioLang();
  const tracks = getStrategicTrackGuides(isHe ? "he" : "en");
  const ArrowIcon = isHe ? ArrowLeft : ArrowRight;

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [tierLevel, setTierLevel] = useState<number>(1);
  const [isAffPro, setIsAffPro] = useState<boolean>(false);
  const [affLinksCount, setAffLinksCount] = useState<number>(0);
  const [boostCredits, setBoostCredits] = useState<number>(10);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user;
      if (!u) return;
      setUserId(u.id);
      const [{ data: prof }, { count }] = await Promise.all([
        supabase.from("profiles").select("full_name, purchased_track_level, is_affiliate_pro, affiliate_boost_credits").eq("id", u.id).single(),
        supabase.from("aff_links").select("*", { count: "exact", head: true }).eq("user_id", u.id),
      ]);
      setUserName(prof?.full_name || u.user_metadata?.full_name || (u.email ? u.email.split("@")[0] : "Builder"));
      setTierLevel(prof?.purchased_track_level || 1);
      setIsAffPro(Boolean(prof?.is_affiliate_pro));
      setBoostCredits(Number(prof?.affiliate_boost_credits ?? 10));
      setAffLinksCount(count || 0);
    });
  }, []);

  const choosePathway = async (mode: "affiliate_only" | "builder_only" | "full_os", targetHref: string) => {
    localStorage.setItem("pc_focus_mode", mode);
    window.dispatchEvent(new CustomEvent("pc-focus-change", { detail: mode }));
    if (userId) {
      await supabase.from("profiles").update({ focus_mode: mode }).eq("id", userId);
    }
    router.push(targetHref);
  };

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      {/* Visual Fintech OS Banner (Matches Certified Credential Design System) */}
      <div style={{ marginBottom: 18 }}>
        <StudioVisualArtwork variant="home" />
      </div>

      {userId && (
        <div className="card-surface" style={{ padding: 14, marginBottom: 14, border: "1px solid rgba(52,211,153,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12.5, color: "#e2e8f0" }}>
            <strong style={{ color: "#34d399" }}>{isHe ? "Recommended Next Action:" : "Smart Next Best Action:"}</strong>{" "}
            <span>{affLinksCount === 0 ? (isHe ? "Create your first smart affiliate link in 60 seconds" : "Launch your first smart affiliate link in 60 seconds") : !isAffPro && affLinksCount >= 2 ? (isHe ? "Publish a verified deal to the community feed for organic clicks" : "Publish a verified deal to the community feed for organic reach") : (isHe ? "Lock your next live AI deployment in Production Studio" : "Ship your next verified AI deployment in Production Studio")}</span>
          </div>
          <Link href={affLinksCount === 0 ? "/affiliate" : !isAffPro && affLinksCount >= 2 ? "/feed" : "/workspace"} className="btn-primary" style={{ width: "auto", height: 32, fontSize: 11.5 }}>{isHe ? "Execute Now" : "Execute Now"}</Link>
        </div>
      )}
      {/* Logged-In Personalized Cockpit */}
      {userId && (
        <div className="card-surface" style={{ padding: 16, marginBottom: 18, border: "1px solid rgba(56,189,248,0.4)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#f8fafc", marginBottom: 3 }}>
              <CheckCircle2 size={15} color="#34d399" style={{ display: "inline", marginInlineEnd: 6 }} />
              {t(`Welcome back, ${userName}`, `ברוך הבא, ${userName}`)}
            </div>
            <div style={{ fontSize: 12, color: "#cbd5e1" }}>
              {t(
                `Affiliate Hub: ${affLinksCount} Smart Links (${isAffPro ? "Pro" : "Starter"}) · ${boostCredits} Boost Credits | Builder Studio: Tier v${tierLevel}.0`,
                `מרכז שותפים: ${affLinksCount} קישורים חכמים (${isAffPro ? "Pro" : "חינם"}) · ${boostCredits} נק׳ חשיפה | סטודיו AI: דרגה v${tierLevel}.0`
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/affiliate" className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12, background: "#34d399", color: "#0a0b0e" }}>
              <Link2 size={13} /> {t("Open Affiliate Hub", "כניסה למרכז השותפים")}
            </Link>
            <Link href="/workspace" className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12 }}>
              <Layers size={13} /> {t("Open Builder Studio", "כניסה לסטודיו AI")}
            </Link>
          </div>
        </div>
      )}
      {/* Interactive Dual-Pathway Selector (Tailors Navigation & Workspace Automatically) */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc" }}>
            {t("Choose Your Primary Workspace Focus", "בחר את סביבת העבודה והמטרה שלך")}
          </h2>
          <button type="button" onClick={() => choosePathway("full_os", "/affiliate")} className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 11.5, color: "#38bdf8" }}>
            {t("Enable Both Pathways (Full OS)", "הפעל את שני המסלולים יחד (מצב מלא)")}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {/* Pathway B: Direct Affiliate & Deal Income (No Coding/Portfolio Needed) */}
          <div className="card-hero" style={{ padding: 20, border: "1px solid rgba(52,211,153,0.45)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
            <div>
              <span className="badge-pill" style={{ background: "rgba(52,211,153,0.16)", color: "#34d399", fontSize: 10.5, marginBottom: 8 }}>
                <Sparkles size={12} /> {t("PATHWAY 1 · ZERO CODING OR PORTFOLIO REQUIRED", "מסלול 1 · הכנסה מיידית ללא צורך בקוד או תיק עבודות")}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
                {t("Affiliate & Smart Deal Income Hub", "מרכז שיווק שותפים וקישורים חכמים 360°")}
              </h3>
              <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 10 }}>
                {t(
                  "Compare global & Israeli networks (AliExpress, Amazon, Temu, eBay, WeSell), verify IDs safely with anti-ban rules, and generate Facebook, WhatsApp & Reels ads in 1 click.",
                  "השווה בין רשתות שותפים מהעולם ומישראל, אמת מזהי מעקב עם הגנה מפני חסימות, והפק מודעות מוכנות לפייסבוק, וואטסאפ ורילס בלחיצה אחת."
                )}
              </p>
            </div>
            <button type="button" onClick={() => choosePathway("affiliate_only", "/affiliate")} className="btn-primary" style={{ background: "#34d399", color: "#0a0b0e", height: 44, fontSize: 13.5 }}>
              <Compass size={15} />
              <span>{t("Launch Affiliate Focus Workspace (Free)", "הפעל סביבת שותפים ממוקדת (חינם)")}</span>
              <ArrowIcon size={15} />
            </button>
          </div>

          {/* Pathway A: AI Engineering & Verified Portfolio */}
          <div className="card-hero" style={{ padding: 20, border: "1px solid rgba(56,189,248,0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
            <div>
              <span className="badge-pill" style={{ background: "rgba(56,189,248,0.16)", color: "#38bdf8", fontSize: 10.5, marginBottom: 8 }}>
                <ShieldCheck size={12} /> {t("PATHWAY 2 · VERIFIED AI ENGINEERING & PORTFOLIO", "מסלול 2 · בניית מערכות AI ותיק עבודות מאומת")}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
                {t("AI Product Studio & Verified Portfolio (v1.0–v4.0)", "אולפן הנדסת AI ותיק עבודות מאומת (v1.0–v4.0)")}
              </h3>
              <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 10 }}>
                {t(
                  "Ship real production apps step-by-step, pass Anti-Cheat Proof-of-Execution checks, and unlock a public Verified Portfolio that wins clients and tech roles.",
                  "בנה מערכות ייצור אמיתיות שלב-אחר-שלב, עבור אימות Anti-Cheat טכני, ופתח תיק עבודות ציבורי מאומת שמושך לקוחות ומעסיקים."
                )}
              </p>
            </div>
            <button type="button" onClick={() => choosePathway("builder_only", "/workspace")} className="btn-primary" style={{ height: 44, fontSize: 13.5 }}>
              <Layers size={15} />
              <span>{t("Launch Builder Studio Workspace (Free)", "הפעל סביבת בנייה ופורטפוליו (חינם)")}</span>
              <ArrowIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Progressive Engineering Tiers Overview */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc" }}>
            {t("4 Progressive Engineering Tracks (100% Upgrade-Delta Credit)", "4 מסלולי הנדסה מדורגים (זיכוי מלא 100% בשדרוג)")}
          </h2>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 11 }}>
            <ShieldCheck size={13} /> {t("Anti-Cheat Proof-of-Execution", "אימות Anti-Cheat אמיתי")}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
          {tracks.map((tr) => (
            <div key={tr.level} className="card-surface" style={{ padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: "#38bdf8" }}>{tr.badge}</span>
                  <span className="tabular-nums" style={{ fontSize: 15, fontWeight: 900, color: tr.priceUsd === 0 ? "#34d399" : "#f8fafc" }}>
                    {tr.priceUsd === 0 ? t("FREE", "חינם") : isHe ? `₪${tr.priceIls}` : `$${tr.priceUsd}`}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>{tr.name}</h3>
                <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{tr.tagline}</p>
              </div>
              <Link href="/workspace" className={tr.level === 1 ? "btn-primary" : "btn-ghost"} style={{ height: 36, fontSize: 12 }}>
                {tr.level === 1 ? t("Start Free (v1.0)", "התחל בחינם (v1.0)") : t(`Inspect v${tr.level}.0`, `פרטי מסלול v${tr.level}.0`)}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem Pillars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 18 }}>
        <Link href="/feed" className="card-surface" style={{ padding: 16, display: "block" }}>
          <Flame size={18} color="#fbbf24" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc", marginBottom: 3 }}>{t("Live Proof & Verified Deals Feed", "קיר הקהילה והדילים המאומתים")}</div>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>{t("Share verified deployments or approved affiliate deals to earn organic traffic & Boost Credits.", "שתף פרויקטים מאומתים או דילים מאושרים ליצירת תנועה אורגנית ונקודות חשיפה.")}</p>
        </Link>
        <Link href="/toolkit" className="card-surface" style={{ padding: 16, display: "block" }}>
          <Wrench size={18} color="#34d399" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc", marginBottom: 3 }}>{t("Curated AI, Cloud & Ad Stack", "ארגז כלי AI, ענן ושיווק מאומתים")}</div>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>{t("Vetted AI editors, Supabase cloud hosts, and visual ad generators.", "כלי AI, ענן ויצירת קריאייטיב שנבדקו ואומתו לעבודה מקצועית.")}</p>
        </Link>
        <Link href="/vault" className="card-surface" style={{ padding: 16, display: "block" }}>
          <ShieldCheck size={18} color="#fbbf24" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc", marginBottom: 3 }}>{t("Zero-Knowledge Context & Crypto Vault", "כספת סודות, קריפטו והקשר מוצפנת")}</div>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>{t("Client-side AES-256 vault for passwords, API keys & 12/24-word crypto seeds with full context.", "שמירה מוצפנת בדפדפן (AES-256) לסיסמאות, מפתחות פרויקטים ו-12/24 מילים של קריפטו עם הקשר מלא.")}</p>
        </Link>
        <Link href="/method" className="card-surface" style={{ padding: 16, display: "block" }}>
          <BookOpen size={18} color="#38bdf8" style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f8fafc", marginBottom: 3 }}>{t("8-Stage Prompt Engineering Vault", "שיטת 8 השלבים וכספת הפרומפטים")}</div>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>{t("Production-tested prompt chains and .env security protocols.", "שרשראות פרומפטים מוכנות לייצור ופרוטוקולי אבטחת מפתחות.")}</p>
        </Link>
      </div>

      {/* Transparent Legal & Compliance Notice */}
      <div style={{ padding: 12, borderRadius: 12, background: "rgba(15,23,42,0.65)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 11.5, color: "#94a3b8", lineHeight: 1.55 }}>
        <Award size={13} style={{ display: "inline", marginInlineEnd: 5, color: "#38bdf8" }} />
        {t(
          "Compliance & Transparency Notice: ProofCraft provides software infrastructure for portfolio verification and affiliate link management. We do not guarantee earnings or third-party network approval. Users must comply with FTC, Amazon Associates, and local consumer disclosure laws.",
          "הבהרה משפטית ושקיפות: הפלטפורמה מספקת תשתית טכנולוגית לאימות תיקי עבודות ולניהול קישורי שותפים, ואינה מהווה התחייבות לרווחים או לאישור ברשתות צד ג׳. באחריות המשתמש להציג גילוי נאות ולפעול בהתאם לחוק הגנת הצרכן וחוק הספאם (סעיף 30א)."
        )}
      </div>
    </div>
  );
}
