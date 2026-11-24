"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogIn, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
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
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        router.replace("/workspace");
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setOauthLoading(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://vercel.app";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${origin}/workspace` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setOauthLoading(false);
      setErrorMsg(err instanceof Error ? err.message : t("Google sign-in is not enabled yet in Supabase Providers.", "התחברות Google טרם הופעלה בהגדרות Supabase."));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);

    try {
      const cleanEmail = email.trim();
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw error;

        if (data.session) {
          router.push("/workspace");
          router.refresh();
          return;
        }

        const { data: signInData } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (signInData?.session) {
          router.push("/workspace");
          router.refresh();
          return;
        }

        setInfoMsg(t(
          "Account created! Check your email inbox and click the confirmation link to activate your session.",
          "החשבון נוצר! כנס לתיבת המייל שלך ולחץ על קישור האימות כדי להפעיל את החיבור."
        ));
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
        if (data.session) {
          router.push("/workspace");
          router.refresh();
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : t("Authentication failed. Please check your email and password.", "שגיאת התחברות, בדוק את האימייל והסיסמה."));
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
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc", marginBottom: 4 }}>
          {mode === "signup"
            ? t("Create AI Builder Account", "יצירת חשבון בונה AI")
            : t("Sign In to Studio", "כניסה לסטודיו")}
        </h1>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
          {t(
            "Sync your verified milestones, credentials, and public portfolio across all devices.",
            "שמור את כל שלבי האימות, התגים ותיק העבודות שלך בענן מכל מכשיר."
          )}
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={oauthLoading}
          style={{
            width: "100%", height: 46, borderRadius: 12, background: "#ffffff", color: "#0f172a",
            border: "1px solid rgba(255,255,255,0.2)", fontWeight: 800, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14,
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)"
          }}
        >
          <span style={{ fontWeight: 900, fontSize: 16, color: "#4285F4" }}>G</span>
          <span>{oauthLoading ? t("Connecting to Google...", "מתחבר ל-Google...") : t("Continue with Google (1-Click)", "המשך עם Google (לחיצה אחת)")}</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, color: "#64748b", fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span>{t("OR WITH EMAIL", "או באמצעות אימייל")}</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => { setMode("signup"); setErrorMsg(""); setInfoMsg(""); }}
            className={mode === "signup" ? "btn-primary" : "btn-ghost"}
            style={{ height: 38, fontSize: 13 }}
          >
            {t("Create Account", "הרשמה חדשה")}
          </button>
          <button
            type="button"
            onClick={() => { setMode("login"); setErrorMsg(""); setInfoMsg(""); }}
            className={mode === "login" ? "btn-primary" : "btn-ghost"}
            style={{ height: 38, fontSize: 13 }}
          >
            {t("Sign In", "התחברות")}
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-name" style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>
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
                style={{ width: "100%", height: 46 }}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>
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
              style={{ width: "100%", height: 46, textAlign: "left" }}
            />
          </div>

          <div>
            <label htmlFor="auth-pass" style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>
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
              style={{ width: "100%", height: 46, textAlign: "left" }}
            />
          </div>

          {errorMsg && (
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(248,113,113,0.14)", border: "1px solid rgba(248,113,113,0.4)", color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={16} /> <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(52,211,153,0.14)", border: "1px solid rgba(52,211,153,0.4)", color: "#6ee7b7", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} /> <span>{infoMsg}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 4, height: 48, fontSize: 14 }}>
            {mode === "signup" ? <UserPlus size={16} /> : <LogIn size={16} />}
            <span>{loading ? t("Connecting...", "מתחבר...") : mode === "signup" ? t("Create Account & Enter Studio", "צור חשבון והיכנס לסטודיו") : t("Sign In to Studio", "התחבר לסטודיו")}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
