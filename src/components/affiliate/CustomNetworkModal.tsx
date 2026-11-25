"use client";

import React, { useState } from "react";
import { PlusCircle, ShieldCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { sanitizePlainText } from "@/lib/security-utils";
import GlobalModal from "@/components/GlobalModal";

interface CustomNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onCreated: () => Promise<void>;
  onNotify: (msg: string) => void;
}

export default function CustomNetworkModal({ isOpen, onClose, userId, onCreated, onNotify }: CustomNetworkModalProps) {
  const { isHe, dir, t } = useStudioLang();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Global E-Commerce");
  const [commission, setCommission] = useState("5% – 15%");
  const [cookieDays, setCookieDays] = useState("30 Days");
  const [signupUrl, setSignupUrl] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!userId) return setErr(t("Please sign in first to add a custom partner platform.", "נא להתחבר כדי להוסיף פלטפורמת שותפים."));
    const cleanName = sanitizePlainText(name, 60);
    if (cleanName.length < 2) return setErr(t("Enter a valid platform name.", "הזן שם פלטפורמה תקין."));
    try {
      const parsed = new URL(signupUrl.trim());
      if (parsed.protocol !== "https:") throw new Error("HTTPS required");
    } catch {
      return setErr(t("Security Guard: Only verified HTTPS portal URLs are permitted.", "הגנת אבטחה: מותרות רק כתובות HTTPS מאובטחות של הפלטפורמה."));
    }

    setSaving(true);
    try {
      const slug = `custom-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 20)}-${Math.random().toString(36).slice(2, 6)}`;
      const { error: netErr } = await supabase.from("aff_networks").insert({
        slug,
        name_en: cleanName,
        name_he: cleanName,
        category: sanitizePlainText(category, 40),
        commission_range: sanitizePlainText(commission, 40),
        cookie_window: sanitizePlainText(cookieDays, 30),
        approval_difficulty: "Custom Platform",
        threshold_en: "User-added external partner platform (submitted for global admin review).",
        threshold_he: "פלטפורמת שותפים חיצונית שהוספה ע״י המשתמש (ממתינה לאישור גלובלי של האדמין).",
        strict_rules_en: ["Follow the external platform's official terms and mandatory FTC/consumer disclosure laws."],
        strict_rules_he: ["יש לפעול בהתאם לתקנון הפלטפורמה ולהציג גילוי נאות כחוק."],
        disclose_required: true,
        allow_direct_redirect: true,
        signup_url: signupUrl.trim(),
        is_custom: true,
        submitted_by: userId,
        approval_status: "pending_admin",
        is_active: true,
        sort_order: 50,
      });
      if (netErr) throw netErr;

      if (trackingId.trim()) {
        await supabase.from("aff_user_accounts").insert({
          user_id: userId,
          network_slug: slug,
          tracking_id: sanitizePlainText(trackingId, 60),
          is_verified: true,
          verified_at: new Date().toISOString(),
        });
      }

      await onCreated();
      onNotify(t("Custom platform added to your workspace & queued for Admin verification!", "הפלטפורמה נוספה לסביבת העבודה שלך ונשלחה לבדיקת אדמין!"));
      setName(""); setSignupUrl(""); setTrackingId("");
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : t("Could not save custom network.", "שגיאה בשמירת הפלטפורמה."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlobalModal isOpen={isOpen} onClose={onClose} title={t("Add Custom Affiliate Platform", "הוספת פלטפורמת שותפים חיצונית")}>
      <form onSubmit={handleCreateCustom} dir={dir} style={{ textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.55 }}>
          {t(
            "Add any external partner program (e.g., Booking, Fiverr, Hostinger, KSP, Ivory) to track links in your workspace. It becomes available to you immediately and enters Admin security review for global listing.",
            "הוסף כל תוכנית שותפים חיצונית (כגון Booking, Fiverr, KSP, איבורי) למעקב חכם בסביבת העבודה שלך. הפלטפורמה זמינה עבורך מיד ונשלחת לאישור אדמין להצגה גלובלית."
          )}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Platform Name (e.g. Fiverr Affiliates)", "שם הפלטפורמה")} className="input-dark" />
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder={t("Category (SaaS / Travel / Retail)", "קטגוריה")} className="input-dark" />
          <input type="text" value={commission} onChange={(e) => setCommission(e.target.value)} placeholder={t("Commission (e.g. 10% – 30%)", "טווח עמלה")} className="input-dark" />
          <input type="text" value={cookieDays} onChange={(e) => setCookieDays(e.target.value)} placeholder={t("Cookie Window (e.g. 30 Days)", "חלון עוגייה")} className="input-dark" />
        </div>

        <input type="url" dir="ltr" required value={signupUrl} onChange={(e) => setSignupUrl(e.target.value)} placeholder="https://example.com" className="input-dark" style={{ textAlign: "left" }} />
        <input type="text" dir="ltr" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder={t("Your Partner / Tracking ID (Optional)", "מזהה השותף שלך (אופציונלי)")} className="input-dark" style={{ textAlign: "left" }} />

        {err && <div style={{ color: "#fca5a5", fontSize: 12 }}><AlertCircle size={13} style={{ display: "inline" }} /> {err}</div>}

        <button type="submit" disabled={saving} className="btn-primary" style={{ height: 44 }}>
          <PlusCircle size={15} /> {saving ? t("Saving...", "שומר...") : t("Add Platform to Workspace", "הוסף פלטפורמה לסביבת העבודה")}
        </button>
        <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
          <ShieldCheck size={12} style={{ display: "inline" }} /> {t("Protected by HTTPS & Admin Pre-Publication Security Screening", "מוגן ע״י אימות HTTPS ובקרת אבטחה של הנהלת המערכת")}
        </div>
      </form>
    </GlobalModal>
  );
}
