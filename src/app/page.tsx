"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Lock, Layers, Award, BookOpen, Wrench, Users } from "lucide-react";
import { getActiveUserProfile } from "@/lib/cloud-store";
import { BuilderProfile, DEFAULT_PROFILE } from "@/lib/proofcraft-store";
import { getStrategicTrackGuides } from "@/lib/plg-career-strategy";
import { useStudioLang } from "@/lib/i18n-engine";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";

export default function HomePage() {
  const { lang, isHe, dir, t } = useStudioLang();
  const [profile, setProfile] = useState<BuilderProfile>(DEFAULT_PROFILE);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [paidCredits, setPaidCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveUserProfile().then((res) => {
      setProfile(res.profile);
      setUnlockedLevel(res.purchasedTrackLevel || 1);
      setPaidCredits(res.totalPaidIls || 0);
      setLoading(false);
    });
  }, []);

  const completedCount = profile.completedStepIds.length;
  const tracks = getStrategicTrackGuides(lang);
  const ArrowIcon = isHe ? ArrowLeft : ArrowRight;

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      <StudioVisualArtwork variant="home" />

      <section className="card-hero" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span className="badge-pill" style={{ background: "rgba(56, 189, 248, 0.14)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)", fontSize: 11.5 }}>
            <Sparkles size={13} /> {t("GLOBAL AI PRODUCT ENGINEERING & PORTFOLIO OS", "מערכת הפעלה להנדסת מוצרי AI ותיק עבודות מאומת")}
          </span>
          {!loading && (
            <span className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.14)", color: "#34d399", fontSize: 11.5 }}>
              {t(`Active Tier: v${unlockedLevel}.0 · ${completedCount} Verified Proofs`, `דרגה פעילה: v${unlockedLevel}.0 · ${completedCount} הוכחות מאומתות`)}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: "#f8fafc", lineHeight: 1.2, marginBottom: 10 }}>
          {t(
            "Build Real AI Production Systems. Prove Every Skill Live.",
            "בנה מערכות AI אמיתיות בייצור. הוכח כל יכולת באוויר."
          )}
        </h1>
        <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.65, maxWidth: 740, marginBottom: 20 }}>
          {t(
            "Start free today. Ship your first live conversion engine, unlock your public Verified Portfolio, and scale across 4 progressive engineering tiers backed by cryptographic verification and Row-Level Security.",
            "התחל בחינם היום. השק מערכת המרה חיה ראשונה, פתח תיק עבודות ציבורי מאומת, והתקדם ב-4 מדרגות הנדסיות מגובות באימות ראיות ואבטחת RLS."
          )}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/workspace" className="btn-primary" style={{ width: "auto", padding: "0 24px" }}>
            <span>{t("Start Free: Build Track 1 (v1.0)", "התחל בחינם: בנה את מסלול 1 (v1.0)")}</span>
            <ArrowIcon size={16} />
          </Link>
          <Link href="/portfolio/live" className="btn-ghost" style={{ padding: "0 20px" }}>
            <Award size={16} />
            <span>{t("Inspect Live Verified Portfolio", "צפה בתיק עבודות מאומת")}</span>
          </Link>
        </div>
      </section>
      <section style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 900, color: "#f8fafc" }}>
              {t("4 Progressive Engineering Tracks (v1.0 → v4.0)", "4 מסלולי הנדסה מדורגים (v1.0 → v4.0)")}
            </h2>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>
              {t(
                "100% Upgrade-Delta Credit: Every previous payment is automatically deducted when upgrading.",
                "זיכוי שדרוג 100% (Upgrade-Delta): כל תשלום קודם מקוזז אוטומטית בעת מעבר לדרגה גבוהה יותר."
              )}
            </p>
          </div>
          <span className="badge-pill" style={{ background: "rgba(129, 140, 248, 0.14)", color: "#818cf8", fontSize: 11.5 }}>
            <ShieldCheck size={13} /> {t("Anti-Cheat Proof-of-Execution Verified", "אימות ראיות ביצוע Anti-Cheat")}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))", gap: 14 }}>
          {tracks.map((tr) => {
            const unlocked = unlockedLevel >= tr.level;
            const deltaIls = Math.max(0, tr.priceIls - paidCredits);
            const deltaUsd = Math.max(0, tr.priceUsd - Math.round(paidCredits / 3.65));
            const priceTag = tr.priceUsd === 0
              ? t("FREE", "חינם")
              : unlocked
                ? t("UNLOCKED", "פתוח")
                : isHe
                  ? `₪${deltaIls}`
                  : `$${deltaUsd}`;

            return (
              <div key={tr.level} className="card-surface" style={{
                padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between",
                border: tr.highlightFlagship ? "1px solid rgba(251, 191, 36, 0.45)" : unlocked ? "1px solid rgba(52, 211, 153, 0.35)" : undefined
              }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="badge-pill" style={{ fontSize: 10, background: tr.highlightFlagship ? "rgba(251,191,36,0.16)" : "rgba(56,189,248,0.14)", color: tr.highlightFlagship ? "#fbbf24" : "#38bdf8" }}>
                      {tr.badge}
                    </span>
                    <span className="tabular-nums" style={{ fontSize: 14, fontWeight: 900, color: unlocked ? "#34d399" : "#f8fafc" }}>
                      {priceTag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>{tr.name}</h3>
                  <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, marginBottom: 10 }}>{tr.tagline}</p>

                  <div style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", fontSize: 11.5, color: "#cbd5e1", lineHeight: 1.5, marginBottom: 14 }}>
                    <strong style={{ color: "#38bdf8" }}>{t("Deliverable:", "תוצר:")}</strong> {tr.concreteDeliverable}
                  </div>
                </div>

                <Link href="/workspace" className={unlocked ? "btn-primary" : "btn-ghost"} style={{ width: "100%", height: 38, fontSize: 12 }}>
                  {unlocked ? <CheckCircle2 size={14} /> : <Lock size={14} />}
                  <span>{unlocked ? t(`Open Track ${tr.level} Studio`, `פתח סטודיו מסלול ${tr.level}`) : t(`Inspect Track ${tr.level}`, `סקור מסלול ${tr.level}`)}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <Link href="/method" className="card-surface" style={{ padding: 18, display: "block" }}>
          <div style={{ color: "#38bdf8", fontWeight: 800, fontSize: 14, marginBottom: 6, display: "flex", alignItems: "center", gap: 7 }}>
            <BookOpen size={16} /> {t("8-Stage Prompt Method & Vault", "שיטת 8 השלבים וכספת פרומפטים")}
          </div>
          <p style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.55 }}>
            {t(
              "Copy production-tested prompts, enforce .env security protocols, and save reusable build recipes.",
              "העתק פרומפטים מוכחים לייצור, אכוף פרוטוקולי אבטחת .env, ושמור תבניות עבודה חוזרות."
            )}
          </p>
        </Link>

        <Link href="/toolkit" className="card-surface" style={{ padding: 18, display: "block" }}>
          <div style={{ color: "#34d399", fontWeight: 800, fontSize: 14, marginBottom: 6, display: "flex", alignItems: "center", gap: 7 }}>
            <Wrench size={16} /> {t("Curated AI & Cloud Stack", "ארגז כלי AI וענן מאומתים")}
          </div>
          <p style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.55 }}>
            {t(
              "Explore verified AI editors, databases, deployment hosts, and payment APIs vetted for builders.",
              "גלה עורכי AI, מסדי נתונים, שרתי פריסה וממשקי סליקה שנבדקו עבור בוני מערכות."
            )}
          </p>
        </Link>

        <Link href="/feed" className="card-surface" style={{ padding: 18, display: "block" }}>
          <div style={{ color: "#818cf8", fontWeight: 800, fontSize: 14, marginBottom: 6, display: "flex", alignItems: "center", gap: 7 }}>
            <Users size={16} /> {t("Live Builder Proof Feed", "פיד הוכחות חיות של הקהילה")}
          </div>
          <p style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.55 }}>
            {t(
              "Inspect real deployments shipped by fellow builders, track engagement metrics, and publish your work.",
              "צפה במערכות חיות שהושקו ע״י בונים, מדוד נתוני חשיפה והקלקות, ופרסם את התוצרים שלך."
            )}
          </p>
        </Link>
      </section>
    </div>
  );
}
