"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Wrench, Layers, Users, Briefcase, Shield, Accessibility, MessageCircle, Globe, Smartphone, AlertTriangle, Megaphone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import GlobalModal from "./GlobalModal";
import PocketFieldStudio from "./PocketFieldStudio";
import { FINTECH_LEGAL_DOCS, LegalDocumentItem } from "@/lib/legal-docs-data";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "guy@proofcraft.app";

interface SupportTicketRow {
  id: string;
  category: string;
  message: string;
  admin_reply: string;
  status: string;
  created_at: string;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"he" | "en">("en");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  const [warningMsg, setWarningMsg] = useState<string>("");
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [banReason, setBanReason] = useState<string>("");
  const [broadcastBanner, setBroadcastBanner] = useState<{ active: boolean; text: string; tone: string }>({ active: false, text: "", tone: "info" });

  const [a11yOpen, setA11yOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [pocketOpen, setPocketOpen] = useState(false);

  const [legalDocs, setLegalDocs] = useState<LegalDocumentItem[]>(FINTECH_LEGAL_DOCS);
  const [legalDoc, setLegalDoc] = useState<LegalDocumentItem | null>(null);

  const [supportOpen, setSupportOpen] = useState(false);
  const [supportCategory, setSupportCategory] = useState("תמיכה טכנית");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportText, setSupportText] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [myTickets, setMyTickets] = useState<SupportTicketRow[]>([]);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setUserEmail(data.user.email || null);
        setSupportEmail(data.user.email || "");
        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, warning_message, is_banned, ban_reason")
          .eq("id", data.user.id)
          .single();
        if (prof) {
          setUserName(prof.full_name || "");
          if (prof.warning_message) setWarningMsg(prof.warning_message);
          if (prof.is_banned) {
            setIsBanned(true);
            setBanReason(prof.ban_reason || "הפרת תנאי השימוש של הפלטפורמה");
          }
        }
        const { data: tData } = await supabase
          .from("support_tickets")
          .select("id, category, message, admin_reply, status, created_at")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false });
        if (tData) setMyTickets(tData);
      }
    });

    supabase.from("site_settings").select("key, value").then(({ data }) => {
      if (!data) return;
      const bRow = data.find((r) => r.key === "broadcast_banner");
      if (bRow?.value) setBroadcastBanner(bRow.value);
      const lRow = data.find((r) => r.key === "legal_docs");
      if (Array.isArray(lRow?.value) && lRow.value.length > 0) setLegalDocs(lRow.value);
    });
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const dismissWarning = async () => {
    setWarningMsg("");
    if (userId) {
      await supabase.from("profiles").update({ warning_message: "" }).eq("id", userId);
    }
  };

  const submitSupportTicket = async () => {
    const cleanMsg = supportText.trim().slice(0, 800);
    if (!cleanMsg) return;
    await supabase.from("support_tickets").insert({
      user_id: userId,
      sender_name: userName || userEmail || "אורח באתר",
      sender_email: supportEmail.trim().slice(0, 120),
      category: supportCategory,
      message: cleanMsg,
      status: "open",
    });
    setSupportSent(true);
    setSupportText("");
    if (userId) {
      const { data: tData } = await supabase
        .from("support_tickets")
        .select("id, category, message, admin_reply, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (tData) setMyTickets(tData);
    }
  };

  const navItems = [
    { href: "/", label: lang === "he" ? "מרכז פיקוד" : "Home", icon: Home },
    { href: "/method", label: lang === "he" ? "השיטה ופרומפטים" : "Method", icon: BookOpen },
    { href: "/workspace", label: lang === "he" ? "סטודיו הכשרה" : "Studio", icon: Layers },
    { href: "/toolkit", label: lang === "he" ? "ארגז כלים" : "Toolkit", icon: Wrench },
    { href: "/feed", label: lang === "he" ? "קהילה ושיווק" : "Community", icon: Users },
    { href: "/portfolio/live", label: lang === "he" ? "תיק עבודות" : "Portfolio", icon: Briefcase },
  ];

  const isAdmin = userEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  if (isBanned && !isAdmin) {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", background: "#0a0b0e", color: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div className="card-base" style={{ maxWidth: 460, borderColor: "rgba(248, 113, 113, 0.45)" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🚫</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f87171", marginBottom: 8 }}>הגישה לחשבונך הושעתה</h1>
          <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 14 }}>
            סיבת החסימה שנרשמה ע״י הנהלת המערכת: <strong>{banReason}</strong>
          </p>
          <button type="button" onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} className="btn-ghost">
            התנתק מהחשבון
          </button>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning style={{ fontSize: mounted && largeText ? "112%" : "100%", filter: mounted && highContrast ? "contrast(1.18)" : "none", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
        background: "rgba(10, 11, 14, 0.94)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.09)"
      }}>
        {/* Live Admin Broadcast Banner */}
        {broadcastBanner.active && broadcastBanner.text && (
          <div style={{
            background: broadcastBanner.tone === "warning" ? "rgba(251, 191, 36, 0.18)" : "rgba(56, 189, 248, 0.18)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "6px 16px", textAlign: "center", fontSize: 12, fontWeight: 700,
            color: broadcastBanner.tone === "warning" ? "#fbbf24" : "#38bdf8"
          }}>
            <Megaphone size={13} style={{ display: "inline", marginLeft: 6 }} />
            {broadcastBanner.text}
          </div>
        )}

        {/* Official Admin Warning Banner for User */}
        {warningMsg && (
          <div style={{
            background: "rgba(248, 113, 113, 0.22)", borderBottom: "1px solid rgba(248, 113, 113, 0.45)",
            padding: "8px 16px", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontSize: 12, color: "#fecaca"
          }}>
            <span><AlertTriangle size={14} style={{ display: "inline", marginLeft: 5 }} /> <strong>אזהרה מהנהלת המערכת:</strong> {warningMsg}</span>
            <button type="button" onClick={dismissWarning} style={{ background: "#f87171", color: "#0a0b0e", border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
              קראתי והבנתי
            </button>
          </div>
        )}

        {/* Row 1: Brand & Quick Actions */}
        <div style={{ maxWidth: 1060, margin: "0 auto", height: 60, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "#f8fafc" }}>
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#pcObsidian)" />
              <path d="M10 16.5L14 20.5L22.5 11.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              <defs><linearGradient id="pcObsidian" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#0284c7" /><stop offset="1" stopColor="#6366f1" /></linearGradient></defs>
            </svg>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, whiteSpace: "nowrap" }}><span style={{ fontWeight: 900, fontSize: 16, color: "#f8fafc" }}>ProofCraft</span><span style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>Studio</span></div>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button type="button" onClick={() => setPocketOpen(true)} className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.14)", color: "#34d399", fontSize: 11, cursor: "pointer", border: "1px solid rgba(52, 211, 153, 0.35)" }}>
              <Smartphone size={13} /> <span>{lang === "he" ? "סנכרון נייד ↔ מחשב" : "Field Sync"}</span>
            </button>

            <button type="button" onClick={() => setLang(lang === "he" ? "en" : "he")} aria-label="Switch Language" className="btn-ghost" style={{ height: 34, padding: "0 10px", fontSize: 11 }}>
              <Globe size={13} /> {lang === "he" ? "EN" : "עב"}
            </button>

            {isAdmin && (
              <Link href="/admin" className="badge-pill" style={{ background: "rgba(251, 191, 36, 0.18)", color: "#fbbf24", fontSize: 11, border: "1px solid rgba(251, 191, 36, 0.4)" }}>
                <Shield size={12} /> Admin
              </Link>
            )}

            <Link href="/auth" className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 11 }}>
              {userEmail ? userEmail.split("@")[0] : (lang === "he" ? "התחבר" : "Sign In")}
            </Link>
          </div>
        </div>

        {/* Row 2: Horizontal Desktop Navigation Tabs */}
        <nav className="desktop-subnav" aria-label="ניווט ראשי" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(18, 20, 26, 0.7)" }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", width: "100%", padding: "0 20px", display: "flex", alignItems: "center", gap: 6 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{
                  display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 14px",
                  fontSize: 13, fontWeight: active ? 800 : 600,
                  color: active ? "#38bdf8" : "#cbd5e1",
                  borderBottom: active ? "2px solid #38bdf8" : "2px solid transparent",
                }}>
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="obsidian-container" style={{ flex: 1, width: "100%" }}>{children}</main>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "24px 20px 96px", background: "#07080b", fontSize: 12, color: "#94a3b8" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>© 2026 ProofCraft Studio · הכשרה מעשית, בניית נכסים וקהילת יוצרי AI</div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 18px" }}>
            {legalDocs.map((doc) => {
              const shortLabels: Record<string, string> = {
                about: "אודות",
                pricing: "מחירון",
                terms: "תנאי שימוש",
                privacy: "פרטיות",
                refunds: "ביטולים",
                accessibility: "הצהרת נגישות",
              };
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setLegalDoc(doc)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12, padding: "4px 2px", whiteSpace: "nowrap" }}
                >
                  {shortLabels[doc.id] || doc.title}
                </button>
              );
            })}
            <button type="button" onClick={() => setA11yOpen(true)} style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
              <Accessibility size={13} style={{ display: "inline" }} /> נגישות
            </button>
            <button type="button" onClick={() => { setSupportOpen(true); setSupportSent(false); }} style={{ background: "none", border: "none", color: "#34d399", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
              <MessageCircle size={13} style={{ display: "inline" }} /> תמיכה שקטה {myTickets.some((t) => t.admin_reply) ? "●" : ""}
            </button>
          </div>
        </div>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="ניווט תחתון" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 64, zIndex: 40,
        background: "rgba(10, 11, 14, 0.96)", backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.09)",
        display: "grid", gridTemplateColumns: "repeat(6, 1fr)", alignItems: "center"
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 3, color: active ? "#38bdf8" : "#94a3b8", fontSize: 10, fontWeight: active ? 800 : 600
            }}>
              <Icon size={18} />
              <span>{item.label.split(" ")}</span>
            </Link>
          );
        })}
      </nav>

      <GlobalModal isOpen={pocketOpen} onClose={() => setPocketOpen(false)} title="📲 סנכרון דו-כיווני (נייד ↔ מחשב) ומחולל הצעות מחיר">
        <PocketFieldStudio />
      </GlobalModal>

      <GlobalModal isOpen={a11yOpen} onClose={() => setA11yOpen(false)} title="♿ התאמות נגישות">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button type="button" onClick={() => setLargeText(!largeText)} className="btn-ghost" style={{ justifyContent: "space-between" }}>
            <span>הגדלת טקסט באתר (112%)</span>
            <strong>{largeText ? "פעיל ✓" : "כבוי"}</strong>
          </button>
          <button type="button" onClick={() => setHighContrast(!highContrast)} className="btn-ghost" style={{ justifyContent: "space-between" }}>
            <span>ניגודיות גבוהה (High Contrast)</span>
            <strong>{highContrast ? "פעיל ✓" : "כבוי"}</strong>
          </button>
        </div>
      </GlobalModal>

      <GlobalModal isOpen={Boolean(legalDoc)} onClose={() => setLegalDoc(null)} title={legalDoc?.title || ""}>
        {legalDoc && (
          <div dir="rtl" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="badge-pill" style={{ alignSelf: "flex-start", background: "rgba(56, 189, 248, 0.14)", color: "#38bdf8", fontSize: 11 }}>
              {legalDoc.badge}
            </span>
            {legalDoc.sections.map((sec, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>{sec.heading}</div>
                <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.65 }}>{sec.text}</p>
              </div>
            ))}
          </div>
        )}
      </GlobalModal>

      <GlobalModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} title="💬 מרכז תמיכה שקטה ובקשות (דו-כיווני)">
        <div dir="rtl" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 12 }}>
          {supportSent ? (
            <div style={{ padding: 14, borderRadius: 12, background: "rgba(52, 211, 153, 0.14)", color: "#34d399", fontSize: 13, fontWeight: 700 }}>
              ✓ פנייתך נשמרה ונשלחה להנהלת המערכת. מענה האדמין יופיע כאן מיד כשיישלח.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <select dir="rtl" value={supportCategory} onChange={(e) => setSupportCategory(e.target.value)} className="input-field" style={{ textAlign: "right" }}>
                <option value="תמיכה טכנית">🛠️ תמיכה טכנית / שאלה על מסלול</option>
                <option value="בקשת ביטול / זיכוי">💳 בקשת ביטול עסקה / זיכוי</option>
                <option value="דיווח אבטחה / תוכן">🛡️ דיווח אבטחה או קישור חריג</option>
              </select>
              {!userEmail && (
                <input dir="ltr" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="your@email.com (לקבלת מענה)" className="input-field" style={{ textAlign: "left" }} />
              )}
              <textarea dir="rtl" rows={3} value={supportText} onChange={(e) => setSupportText(e.target.value)} placeholder="כתוב כאן את פנייתך..." className="input-field" style={{ textAlign: "right" }} />
              <button type="button" onClick={submitSupportTicket} className="btn-primary">
                שלח פנייה להנהלה
              </button>
            </div>
          )}

          {myTickets.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#38bdf8" }}>הפניות הקודמות שלך ומענה האדמין:</div>
              {myTickets.map((tk) => (
                <div key={tk.id} style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: "#cbd5e1", marginBottom: 4 }}>[{tk.category}] {tk.message}</div>
                  {tk.admin_reply ? (
                    <div style={{ padding: 8, borderRadius: 8, background: "rgba(52, 211, 153, 0.12)", color: "#34d399", fontWeight: 700 }}>
                      מענה אדמין: {tk.admin_reply}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: "#fbbf24" }}>⏳ ממתין למענה הנהלה</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </GlobalModal>
    </div>
  );
}
