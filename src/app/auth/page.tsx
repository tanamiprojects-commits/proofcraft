"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
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
          setInfoMsg("נשלח אליך מייל אימות (או שתוכל להתחבר מיד אם אימות המייל כבוי ב-Supabase).");
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
      setErrorMsg(err instanceof Error ? err.message : "שגיאת התחברות, נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 12 }}>
      <div className="card-hero">
        <span className="badge-pill" style={{ background: "rgba(151,117,250,0.16)", color: "#9775fa", marginBottom: 10 }}>
          <ShieldCheck size={13} /> חשבון ענן מאובטח • ProofCraft
        </span>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
          {mode === "signup" ? "יצירת חשבון בונה AI" : "כניסה לחשבון קיים"}
        </h1>
        <p style={{ fontSize: 12, color: "#e2e8f0", marginBottom: 16 }}>
          שמור את כל שלבי האימות, התגים ותיק העבודות שלך בענן מכל מכשיר.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => { setMode("signup"); setErrorMsg(""); }}
            style={{
              height: 36, borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: mode === "signup" ? "#9775fa" : "#0d1017",
              color: mode === "signup" ? "#fff" : "#94a3b8",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            הרשמה חדשה
          </button>
          <button
            type="button"
            onClick={() => { setMode("login"); setErrorMsg(""); }}
            style={{
              height: 36, borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: mode === "login" ? "#9775fa" : "#0d1017",
              color: mode === "login" ? "#fff" : "#94a3b8",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            התחברות
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-name" style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>שם מלא</label>
              <input id="auth-name" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="השם שיופיע בפרופיל ובתעודה" className="input-field" style={{ height: 42 }} />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>אימייל</label>
            <input id="auth-email" type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" className="input-field" style={{ height: 42 }} />
          </div>

          <div>
            <label htmlFor="auth-pass" style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>סיסמה (לפחות 6 תווים)</label>
            <input id="auth-pass" type="password" dir="ltr" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••" className="input-field" style={{ height: 42 }} />
          </div>

          {errorMsg && (
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(255,107,107,0.14)", border: "1px solid rgba(255,107,107,0.35)", color: "#ff6b6b", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={15} /> <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div style={{ padding: 10, borderRadius: 10, background: "rgba(81,207,102,0.14)", border: "1px solid rgba(81,207,102,0.35)", color: "#51cf66", fontSize: 12 }}>
              {infoMsg}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 4 }}>
            {mode === "signup" ? <UserPlus size={16} /> : <LogIn size={16} />}
            <span>{loading ? "מעבד..." : mode === "signup" ? "צור חשבון והתחל" : "התחבר למערכת"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
