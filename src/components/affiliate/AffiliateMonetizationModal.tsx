"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, Flame, Layers, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import GlobalModal from "@/components/GlobalModal";

interface AffiliateMonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  defaultEmail?: string;
  defaultName?: string;
  onNotify: (msg: string) => void;
}

export default function AffiliateMonetizationModal({
  isOpen, onClose, userId, defaultEmail = "", defaultName = "", onNotify
}: AffiliateMonetizationModalProps) {
  const { isHe, dir, t } = useStudioLang();
  const [selectedPkg, setSelectedPkg] = useState<"affiliate_pro" | "full_bundle" | "boost_pack">("affiliate_pro");
  const [email, setEmail] = useState(defaultEmail);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const packages = [
    {
      id: "affiliate_pro" as const,
      badge: t("MOST POPULAR · STANDALONE", "הנבחר ביותר · חבילה עצמאית"),
      title: t("Affiliate Pro OS (Lifetime Founder Lock)", "Affiliate Pro OS — גישת מייסדים מלאה"),
      priceUsd: 29, priceIls: 99,
      roi: t("ROI: Just 2 average partner commissions cover the entire investment.", "החזר השקעה: 2 עמלות ממוצעות בלבד מחזירות את מלוא העלות."),
      perks: [
        t("Unlimited Smart Links (/go/) & Custom External Networks", "קישורים חכמים ללא הגבלה + הוספת פלטפורמות שותפים חיצוניות"),
        t("Full Viral Video (Reels/TikTok) & Studio Visual Prompt Vault", "פתיחת כספת תסריטי וידאו ופרומפטים ליצירת תמונות פרסום"),
        t("Priority Verification Queue & 360° Peak-Hour Analytics", "אימות מועדף בפיד הדילים וניתוח שעות שיא מתקדם"),
      ],
    },
    {
      id: "full_bundle" as const,
      badge: t("BEST VALUE · SAVE $19 / ₪79", "המשתלם ביותר · חיסכון של ₪79"),
      title: t("All-Access Fintech OS Bundle (Affiliate Pro + Builder v2.0)", "חבילת הפינטק המלאה (Affiliate Pro + סטודיו בנייה v2.0)"),
      priceUsd: 59, priceIls: 199,
      roi: t("ROI: Build your own branded deal website + run unlimited affiliate campaigns.", "החזר השקעה: בנה אתר דילים ממותג משלך + הפעל קמפיינים ללא הגבלה."),
      perks: [
        t("Everything in Affiliate Pro OS (Unlimited Links & AI Ad Prompts)", "כל היכולות של Affiliate Pro OS ללא הגבלה"),
        t("Full-Stack AI Builder Track v2.0 (Cloud DB, Auth & Verified Portfolio)", "גישה מלאה למסלול בניית אתרים ואפליקציות AI (v2.0) ותיק עבודות מאומת"),
      ],
    },
    {
      id: "boost_pack" as const,
      badge: t("ORGANIC TRAFFIC ACCELERATOR", "מאיץ חשיפה אורגנית"),
      title: t("Community Feed Spotlight (+50 Boost Credits)", "חבילת קידום לקיר השיווק (+50 נקודות חשיפה)"),
      priceUsd: 12, priceIls: 45,
      roi: t("ROI: Pin your verified deals to the top of the public showcase feed.", "החזר השקעה: הצמדת הדילים המאומתים שלך לראש קיר השיווק והפידבק."),
      perks: [
        t("+50 Instant Boost Credits for Verified Deals & Bundles", "+50 נקודות חשיפה להקפצת דילים ואוספים לראש הפיד"),
        t("Featured Curator Badge on Public Deal Cards", "תג מפרסם מומלץ בכרטיסי הדילים הציבוריים"),
      ],
    },
  ];

  const activePkg = packages.find((p) => p.id === selectedPkg) || packages.at(0)!;

  const handleLockOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (email || defaultEmail).trim().toLowerCase();
    if (!cleanEmail.includes("@")) return onNotify(t("Please enter a valid email address.", "נא להזין אימייל תקין."));
    setSubmitting(true);
    await supabase.from("upgrade_intents").insert({
      user_id: userId || null,
      full_name: defaultName || cleanEmail.split("@"),
      email: cleanEmail,
      market_region: isHe ? "ISRAEL" : "GLOBAL",
      target_tier: selectedPkg === "full_bundle" ? 2 : 3,
      intent_type: "founder_reservation",
      quoted_usd: activePkg.priceUsd,
      quoted_ils: activePkg.priceIls,
      note: `Package: ${selectedPkg}`,
      status: "waiting",
    });
    setSubmitting(false);
    setDone(true);
    onNotify(t("Founder pricing locked with $0 charge today!", "מחיר המייסדים נשמר עבורך ללא חיוב היום!"));
  };

  return (
    <GlobalModal isOpen={isOpen} onClose={() => { setDone(false); onClose(); }} title={t("Upgrade Your Direct Income Engine", "שדרוג מנוע ההכנסה והשיווק שלך")}>
      <div dir={dir} style={{ textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 12 }}>
        {done ? (
          <div style={{ padding: 18, borderRadius: 12, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.4)", textAlign: "center" }}>
            <CheckCircle2 size={30} color="#34d399" style={{ margin: "0 auto 8px" }} />
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>{t("Founder Price Reserved ($0 Today)!", "מחיר המייסדים נשמר בהצלחה (₪0 היום)!")}</h3>
            <p style={{ fontSize: 12.5, color: "#cbd5e1", marginBottom: 12 }}>{t("Your selection is queued in our priority launch radar. No payment is collected today.", "הבחירה שלך נרשמה בתור העדיפות. אין שום חיוב כספי כרגע.")}</p>
            <button type="button" onClick={() => { setDone(false); onClose(); }} className="btn-primary" style={{ width: "auto", padding: "0 20px" }}>{t("Continue Working", "המשך עבודה")}</button>
          </div>
        ) : (
          <form onSubmit={handleLockOffer} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {packages.map((pkg) => {
              const active = selectedPkg === pkg.id;
              return (
                <div key={pkg.id} onClick={() => setSelectedPkg(pkg.id)} style={{ padding: 12, borderRadius: 12, cursor: "pointer", background: active ? "rgba(56,189,248,0.14)" : "#0a0b0e", border: `1px solid ${active ? "#38bdf8" : "rgba(255,255,255,0.08)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#34d399" }}>{pkg.badge}</span>
                    <span className="tabular-nums" style={{ fontSize: 16, fontWeight: 900, color: "#fbbf24" }}>{isHe ? `₪${pkg.priceIls}` : `$${pkg.priceUsd}`}</span>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 900, color: "#f8fafc", marginBottom: 3 }}>{pkg.title}</div>
                  <div style={{ fontSize: 11.5, color: "#38bdf8", marginBottom: 6 }}>{pkg.roi}</div>
                  <ul style={{ margin: 0, paddingInlineStart: 16, fontSize: 11.5, color: "#cbd5e1" }}>
                    {pkg.perks.map((pk, idx) => <li key={idx}>{pk}</li>)}
                  </ul>
                </div>
              );
            })}

            {!defaultEmail && (
              <input type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-dark" style={{ textAlign: "left" }} />
            )}

            <button type="submit" disabled={submitting} className="btn-primary" style={{ height: 44, background: "#fbbf24", color: "#0a0b0e", fontSize: 13.5 }}>
              <Sparkles size={15} /> {submitting ? t("Locking...", "שומר...") : t(`Lock Founder Rate (${isHe ? `₪${activePkg.priceIls}` : `$${activePkg.priceUsd}`} · $0 Today)`, `שריין מחיר מייסדים (${isHe ? `₪${activePkg.priceIls}` : `$${activePkg.priceUsd}`} · ₪0 היום)`)}
            </button>
            <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
              <ShieldCheck size={12} style={{ display: "inline" }} /> {t("Zero charge today · Transparent Upgrade-Delta credit applies", "ללא חיוב היום · זיכוי מלא בעת שדרוג")}
            </div>
          </form>
        )}
      </div>
    </GlobalModal>
  );
}
