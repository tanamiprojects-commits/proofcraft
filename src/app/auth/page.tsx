"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";

export default function AuthPage() {
  const router = useRouter();
  const { isHe, dir, t } = useStudioLang();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw error;
        if (data.session) {
          router.push("/workspace");
          router.refresh();
        } else {
          setInfoMsg(t(
            "Verification email sent! Please check your inbox to activate your cloud builder account.",
            "נשלח אליך מייל אימות! בדוק את תיבת הדואר שלך כדי להפעיל את חשבון הענן."
          ));
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.push("/workspace");
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : t("Authentication failed. Please try again.", "שגיאת התחברות, נסה שוב."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} style={{ maxWidth: 460, margin: "24px auto", textAlign: isHe ? "right" : "left" }}>
      <div className="card-hero" style={{ padding: 24 }}>
        <span className="badge-pill" style={{ background: "rgba(56,189,248,0.14)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)", marginBottom: 10 }}>
          <ShieldCheck size={13} /> {t("Secured Cloud Account · ProofCraft", "חשבון ענן מאובטח · ProofCraft")}
        </span>
        <h1 style={{ fontSize: 21, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>
          {mode === "signup"
            ? t("Create AI Builder Account", "יצירת חשבון בונה AI")
            : t("Sign In to Studio", "כניסה לחשבון קיים")}
        </h1>
        <p style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 16 }}>
          {t(
            "Sync your verified milestones, credentials, and public portfolio across all devices.",
            "שמור את כל שלבי האימות, התגים ותיק העבודות שלך בענן מכל מכשיר."
          )}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => { setMode("signup"); setErrorMsg(""); }}
            className={mode === "signup" ? "btn-primary" : "btn-ghost"}
            style={{ height: 36, fontSize: 12 }}
          >
            {t("Create Account", "הרשמה חדשה")}
          </button>
          <button
            type="button"
            onClick={() => { setMode("login"); setErrorMsg(""); }}
            className={mode === "login" ? "btn-primary" : "btn-ghost"}
            style={{ height: 36, fontSize: 12 }}
          >
            {t("Sign In", "התחברות")}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-name" style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>
                {t("Full Name", "שם מלא")}
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("Displayed on your Verified Portfolio", "השם שיופיע בפרופיל ובתעודה")}
                className="input-dark"
                style={{ width: "100%", height: 42 }}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>
              {t("Email Address", "כתובת אימייל")}
            </label>
            <input
              id="auth-email"
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-dark"
              style={{ width: "100%", height: 42 }}
            />
          </div>

          <div>
            <label htmlFor="auth-pass" style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#cbd5e1", marginBottom: 6 }}>
              {t("Password (min 6 characters)", "סיסמה (לפחות 6 תווים)")}
            </label>
            <input
              id="auth-pass"
              type="password"
              dir="ltr"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="input-dark"
              style={{ width: "100%", height: 42 }}
            />
          </div>

          {errorMsg && (
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(248,113,113,0.14)", border: "1px solid rgba(248,113,113,0.35)", color: "#f87171", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={15} /> <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(52,211,153,0.14)", border: "1px solid rgba(52,211,153,0.35)", color: "#34d399", fontSize: 12 }}>
              {infoMsg}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 4 }}>
            {mode === "signup" ? <UserPlus size={16} /> : <LogIn size={16} />}
            <span>{loading ? t("Processing...", "מעבד...") : mode === "signup" ? t("Create Account & Enter Studio", "צור חשבון והתחל") : t("Sign In to Studio", "התחבר למערכת")}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
