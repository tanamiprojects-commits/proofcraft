"use client";
import React, { useCallback, useEffect, useState } from "react";
import { UserCheck, Save, CheckCircle2, Eye, Sparkles, Globe, Wrench } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";

interface Props {
  userId: string | null;
}

export default function PublicBrandingEditor({ userId }: Props) {
  const { isHe } = useStudioLang();
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [primaryTools, setPrimaryTools] = useState("");
  const [portfolioPitch, setPortfolioPitch] = useState("");
  const [shareOnFeed, setShareOnFeed] = useState(true);
  const [adminVerified, setAdminVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const loadBranding = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, headline, primary_tools, portfolio_pitch, share_on_feed, admin_verified")
      .eq("id", userId)
      .single();

    if (data) {
      setFullName(data.full_name || "");
      setHeadline(data.headline || "");
      setPrimaryTools(data.primary_tools || "");
      setPortfolioPitch(data.portfolio_pitch || "");
      setShareOnFeed(data.share_on_feed !== false);
      setAdminVerified(Boolean(data.admin_verified));
    }
  }, [userId]);

  useEffect(() => {
    loadBranding();
    const onSync = () => loadBranding();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, [loadBranding]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          headline: headline.trim(),
          primary_tools: primaryTools.trim(),
          portfolio_pitch: portfolioPitch.trim(),
          share_on_feed: shareOnFeed
        })
        .eq("id", userId);

      if (!error) {
        setSavedOk(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("proofcraft:sync-now"));
        }
        setTimeout(() => setSavedOk(false), 2400);
      }
    } finally {
      setSaving(false);
    }
  };
  if (!userId) return null;

  const displayTitle = fullName.trim() || (isHe ? "יוצר מאומת ב-ProofCraft" : "Verified ProofCraft Builder");
  const displayHeadline = headline.trim() || (isHe ? "מהנדס מוצרי AI ושותף צמיחה" : "AI Product Engineer & Growth Partner");
  const displayPitch = portfolioPitch.trim() || (isHe ? "בונה מערכות ייצור חיות ומייצר ערך מדיד עם אימות מלא." : "Shipping live production systems with verified proof-of-execution.");
  const toolsList = primaryTools.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
  const portfolioHref = `/portfolio/${userId.slice(0, 8)}`;

  return (
    <div dir={isHe ? "rtl" : "ltr"} className="card-surface" style={{ padding: 18, marginBottom: 18, border: "1px solid rgba(52,211,153,0.3)", background: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(6,78,59,0.14))" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <UserCheck size={18} color="#34d399" />
          <div>
            <h2 style={{ fontSize: 15.5, fontWeight: 900, color: "#f8fafc", margin: 0 }}>
              {isHe ? "עורך פרופיל ומיתוג ציבורי בזמן אמת" : "Real-Time Public Profile & Branding Studio"}
            </h2>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
              {isHe ? "עדכן את כרטיס הזהות שלך באינדקס היוצרים ובפורטפוליו החי עם תצוגה מקדימה מיידית" : "Customize how your creator card appears across the Creators Directory & Live Portfolio"}
            </p>
          </div>
        </div>
        <a href={portfolioHref} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 32, padding: "0 12px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
          <Eye size={13} />
          <span>{isHe ? "צפה בפורטפוליו החי" : "View Live Portfolio"}</span>
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16, alignItems: "start" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#cbd5e1", marginBottom: 4 }}>
              {isHe ? "שם תצוגה / מותג יוצר" : "Display Name / Creator Brand"}
            </label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={isHe ? "לדוגמה: עמי תנעמי · Tanami360" : "e.g., Alex Rivera · AI Studio"} className="input-dark" style={{ width: "100%", height: 36, fontSize: 12.5 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#cbd5e1", marginBottom: 4 }}>
              {isHe ? "כותרת מקצועית (Headline)" : "Professional Headline"}
            </label>
            <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder={isHe ? "מפתח אפליקציות AI ואוטומציות פינטק" : "Full-Stack AI Builder & Affiliate Architect"} className="input-dark" style={{ width: "100%", height: 36, fontSize: 12.5 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#cbd5e1", marginBottom: 4 }}>
              {isHe ? "מחסנית כלים מובילה (מופרד בפסיקים)" : "Primary Tech & AI Stack (comma-separated)"}
            </label>
            <input type="text" value={primaryTools} onChange={(e) => setPrimaryTools(e.target.value)} placeholder="Next.js, Supabase, Cursor, Vercel, Claude" className="input-dark" style={{ width: "100%", height: 36, fontSize: 12.5 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#cbd5e1", marginBottom: 4 }}>
              {isHe ? "פיץ' קצר לפורטפוליו וללקוחות" : "Short Portfolio Bio & Value Pitch"}
            </label>
            <textarea rows={2} value={portfolioPitch} onChange={(e) => setPortfolioPitch(e.target.value)} placeholder={isHe ? "תאר במשפט או שניים את הערך והפרויקטים שלך..." : "Describe your builds and core expertise in 1-2 sentences..."} className="input-dark" style={{ width: "100%", padding: 8, fontSize: 12.5, resize: "vertical" }} />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#cbd5e1", cursor: "pointer" }}>
            <input type="checkbox" checked={shareOnFeed} onChange={(e) => setShareOnFeed(e.target.checked)} />
            <span>{isHe ? "הצג את הפרופיל שלי באינדקס היוצרים הציבורי (/creators)" : "List my profile publicly in the Creators Directory (/creators)"}</span>
          </label>

          <button type="submit" disabled={saving} className="btn-primary" style={{ height: 36, fontSize: 12.5, width: "auto", alignSelf: "flex-start", padding: "0 16px" }}>
            {savedOk ? <CheckCircle2 size={14} /> : <Save size={14} />}
            <span>{saving ? (isHe ? "שומר בענן..." : "Saving...") : savedOk ? (isHe ? "המיתוג עודכן וסונכרן!" : "Branding Saved & Synced!") : (isHe ? "שמור ועדכן פרופיל ציבורי" : "Save & Publish Branding")}</span>
          </button>
        </form>

        <div style={{ padding: 14, borderRadius: 12, background: "rgba(2,6,23,0.72)", border: "1px solid rgba(56,189,248,0.28)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, color: "#38bdf8" }}>
              <Sparkles size={13} />
              {isHe ? "תצוגה מקדימה חיה (כרטיס יוצר)" : "LIVE CREATOR CARD PREVIEW"}
            </span>
            <span className="badge-pill" style={{ fontSize: 10, background: adminVerified ? "rgba(52,211,153,0.16)" : "rgba(148,163,184,0.14)", color: adminVerified ? "#34d399" : "#94a3b8" }}>
              {adminVerified ? (isHe ? "מאומת רשמית" : "VERIFIED") : (isHe ? "פרופיל פעיל" : "ACTIVE")}
            </span>
          </div>

          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc" }}>{displayTitle}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#34d399", marginTop: 2 }}>{displayHeadline}</div>
          </div>

          <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55, margin: 0 }}>{displayPitch}</p>

          {toolsList.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {toolsList.map((tool, i) => (
                <span key={i} className="badge-pill" style={{ fontSize: 10.5, background: "rgba(56,189,248,0.12)", color: "#7dd3fc", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Wrench size={10} />
                  {tool}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8", paddingTop: 8, borderTop: "1px solid rgba(148,163,184,0.15)" }}>
            <Globe size={12} color="#38bdf8" />
            <span>{shareOnFeed ? (isHe ? "גלוי באינדקס היוצרים הציבורי" : "Visible in Public Creators Directory") : (isHe ? "מצב פרטי (מוסתר מהאינדקס)" : "Private Mode (Hidden from Directory)")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}