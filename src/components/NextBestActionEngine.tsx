"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";

interface Props {
  userId: string | null;
}

interface Recommendation {
  badge: string;
  title: string;
  reason: string;
  cta: string;
  route: string;
}

export default function NextBestActionEngine({ userId }: Props) {
  const { isHe } = useStudioLang();
  const router = useRouter();
  const [rec, setRec] = useState<Recommendation | null>(null);

  const analyzeState = useCallback(async () => {
    if (!userId) return;
    const [pRes, lRes, fRes] = await Promise.all([
      supabase.from("profiles").select("full_name, headline, portfolio_pitch, completed_step_ids").eq("id", userId).single(),
      supabase.from("aff_links").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("feed_posts").select("id", { count: "exact", head: true }).eq("user_id", userId)
    ]);

    const prof = pRes.data;
    const linksCount = lRes.count || 0;
    const postsCount = fRes.count || 0;
    const stepsCount = Array.isArray(prof?.completed_step_ids) ? prof.completed_step_ids.length : 0;

    if (!prof?.full_name || !prof?.headline || !prof?.portfolio_pitch) {
      setRec({
        badge: isHe ? "׳¢׳“׳™׳₪׳•׳× 1 ֲ· ׳׳™׳×׳•׳’" : "PRIORITY 1 ֲ· BRANDING",
        title: isHe ? "׳”׳©׳׳ ׳׳× ׳›׳¨׳˜׳™׳¡ ׳”׳–׳”׳•׳× ׳•׳”׳׳™׳×׳•׳’ ׳”׳¦׳™׳‘׳•׳¨׳™ ׳©׳׳" : "Complete Your Public Creator Identity & Pitch",
        reason: isHe ? "׳₪׳¨׳•׳₪׳™׳׳™׳ ׳¢׳ ׳©׳ ׳׳׳, ׳›׳•׳×׳¨׳× ׳•׳₪׳™׳¥' ׳‘׳¨׳•׳¨ ׳׳§׳‘׳׳™׳ ׳₪׳™ 3 ׳™׳•׳×׳¨ ׳¦׳₪׳™׳•׳× ׳•׳׳׳•׳ ׳׳׳§׳•׳—׳•׳×." : "Profiles with a clear headline and pitch earn 3x higher trust and directory clicks.",
        cta: isHe ? "׳¢׳¨׳•׳ ׳׳™׳×׳•׳’ ׳‘׳¡׳˜׳•׳“׳™׳•" : "Complete Branding Now",
        route: "/workspace"
      });
      return;
    }
    if (linksCount === 0) {
      setRec({
        badge: isHe ? "עדיפות 2 · מוניטיזציה" : "PRIORITY 2 · MONETIZATION",
        title: isHe ? "צור את קישור השותפים החכם הראשון שלך" : "Launch Your First Tracked Smart Affiliate Link",
        reason: isHe ? "הפעל קישור מעקב מקוצר (/go/slug) עם סריקת HTTPS כדי להתחיל למדוד קליקים והמרות." : "Activate a clean tracked link (/go/slug) with HTTPS watchdog protection to capture clicks.",
        cta: isHe ? "צור קישור במרכז השותפים" : "Create Smart Link",
        route: "/affiliate"
      });
      return;
    }

    if (stepsCount === 0) {
      setRec({
        badge: isHe ? "עדיפות 3 · אימות" : "PRIORITY 3 · VERIFICATION",
        title: isHe ? "השלם שלב בנייה ראשון וצבור +25 נקודות עוצמה" : "Ship Your First Verified Step (+25 Proof Pts)",
        reason: isHe ? "אימות פרויקט חי מעלה את הדרגה שלך ומציג הוכחת ביצוע אמיתית בפורטפוליו." : "Verifying a live build levels up your rank and unlocks public proof-of-execution.",
        cta: isHe ? "פתח מסלול אימות" : "Open Verification Track",
        route: "/workspace"
      });
      return;
    }

    if (postsCount === 0) {
      setRec({
        badge: isHe ? "עדיפות 4 · חשיפה" : "PRIORITY 4 · EXPOSURE",
        title: isHe ? "פרסם השקה או דיל מאומת בפיד הציבורי" : "Publish Your First Milestone or Deal to the Live Feed",
        reason: isHe ? "חשיפה בקיר הפיד מביאה תנועה אורגנית מיידית ומאפשרת הקפצה עם Boost Credits." : "Publishing to the Feed Wall drives immediate organic traffic and unlocks Boost Credits.",
        cta: isHe ? "פרסם בפיד עכשיו" : "Post to Live Feed",
        route: "/feed"
      });
      return;
    }

    setRec({
      badge: isHe ? "מוכן לצמיחה מקסימלית" : "ALL CORE MILESTONES ACTIVE",
      title: isHe ? "הפץ את הנכסים שלך והזמן שותפים (+25 Credits)" : "Scale Reach & Invite Partners (+25 Boost Credits)",
      reason: isHe ? "כל אבני היסוד שלך פעילות! השתמש באשף ההשקה או בכרטיס ההפניות להרחבת החשיפה." : "All core pillars are active! Use the 1-Click Campaign Launcher or Referral Card to scale.",
      cta: isHe ? "פתח אינדקס יוצרים חי" : "Explore Live Creators",
      route: "/creators"
    });
  }, [userId, isHe]);

  useEffect(() => {
    analyzeState();
    const onSync = () => analyzeState();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [analyzeState]);

  if (!userId || !rec) return null;

  return (
    <div dir={isHe ? "rtl" : "ltr"} className="card-surface" style={{ padding: 14, marginBottom: 18, border: "1px solid rgba(251,191,36,0.35)", background: "linear-gradient(90deg, rgba(251,191,36,0.10), rgba(56,189,248,0.08))", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: "1 1 280px" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(251,191,36,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <Lightbulb size={18} color="#fbbf24" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
            <span className="badge-pill" style={{ fontSize: 10, background: "rgba(251,191,36,0.18)", color: "#fbbf24" }}>{rec.badge}</span>
            <span style={{ fontSize: 11, color: "#94a3b8", display: "inline-flex", alignItems: "center", gap: 4 }}><Sparkles size={11} color="#38bdf8" /> {isHe ? "המלצת צעד הבא חכמה" : "Smart Next-Best Action"}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#f8fafc" }}>{rec.title}</div>
          <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 2 }}>{rec.reason}</div>
        </div>
      </div>

      <button type="button" onClick={() => router.push(rec.route)} className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12, flexShrink: 0 }}>
        <CheckCircle2 size={13} />
        <span>{rec.cta}</span>
        {isHe ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
      </button>
    </div>
  );
}