"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, BookOpen, Layers, Wrench, Users, Briefcase, Smartphone,
  Shield, Accessibility, MessageCircle, Globe, AlertTriangle, Megaphone
} from "lucide-react";
import { supabase, ADMIN_EMAIL } from "@/lib/supabase";
import { FINTECH_LEGAL_DOCS, LegalDocumentItem } from "@/lib/legal-docs-data";
import { detectNaturalVisitorLang, setStoredStudioLang } from "@/lib/i18n-engine";
import GlobalModal from "./GlobalModal";
import PocketFieldStudio from "./PocketFieldStudio";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"en" | "he">("en");
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [warningMsg, setWarningMsg] = useState("");

  const [broadcastBanner, setBroadcastBanner] = useState<{ active: boolean; text: string; tone: string }>({ active: false, text: "", tone: "info" });
  const [legalDocs, setLegalDocs] = useState<LegalDocumentItem[]>(FINTECH_LEGAL_DOCS);
  const [legalDoc, setLegalDoc] = useState<LegalDocumentItem | null>(null);

  const [pocketOpen, setPocketOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportCategory, setSupportCategory] = useState("Technical Support");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportText, setSupportText] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [myTickets, setMyTickets] = useState<{ id: string; category: string; message: string; admin_reply: string; status: string; created_at: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    const savedLang = detectNaturalVisitorLang();
    setLang(savedLang);
    setStoredStudioLang(savedLang);

    const loadSessionAndSite = async () => {
      const [{ data: uData }, { data: sData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("site_settings").select("*"),
      ]);

      if (sData) {
        const bRow = sData.find((r) => r.key === "broadcast_banner");
        if (bRow?.value) setBroadcastBanner(bRow.value);
        const lRow = sData.find((r) => r.key === "legal_docs");
        if (Array.isArray(lRow?.value) && lRow.value.length > 0) setLegalDocs(lRow.value);
      }

      const u = uData?.user;
      if (u) {
        setUserId(u.id);
        setUserEmail(u.email || null);
        setSupportEmail(u.email || "");
        const [{ data: prof }, { data: tData }] = await Promise.all([
          supabase.from("profiles").select("full_name, is_banned, ban_reason, warning_message").eq("id", u.id).single(),
          supabase.from("support_tickets").select("id, category, message, admin_reply, status, created_at").eq("user_id", u.id).order("created_at", { ascending: false }),
        ]);
        if (prof) {
          setUserName(prof.full_name || "");
          setIsBanned(Boolean(prof.is_banned));
          setBanReason(prof.ban_reason || "");
          setWarningMsg(prof.warning_message || "");
        }
        if (tData) setMyTickets(tData);
      }
    };
    loadSessionAndSite();
  }, []);
  const switchLanguage = (next: "en" | "he") => {
    setLang(next);
    setStoredStudioLang(next);
    localStorage.setItem("pc_lang", next);
    window.dispatchEvent(new CustomEvent("pc-lang-change", { detail: next }));
  };

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
      sender_name: userName || userEmail || (lang === "he" ? "אורח באתר" : "Guest Builder"),
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

  const isHe = lang === "he";
  const navItems = [
    { href: "/", label: isHe ? "ראשי" : "Home", icon: Home },
    { href: "/method", label: isHe ? "השיטה" : "Method", icon: BookOpen },
    { href: "/workspace", label: isHe ? "סטודיו" : "Studio", icon: Layers },
    { href: "/toolkit", label: isHe ? "כלים" : "Toolkit", icon: Wrench },
    { href: "/feed", label: isHe ? "קהילה" : "Feed", icon: Users },
    { href: "/portfolio/live", label: isHe ? "תיק עבודות" : "Portfolio", icon: Briefcase },
  ];

  const isAdmin = userEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  if (isBanned && !isAdmin) {
    return (
      <div dir={isHe ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#0a0b0e", color: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div className="card-surface" style={{ maxWidth: 460, padding: 24, border: "1px solid rgba(248, 113, 113, 0.45)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f87171", marginBottom: 8 }}>
            {isHe ? "הגישה לחשבונך הושעתה" : "Account Access Suspended"}
          </h1>
          <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 14 }}>
            {isHe ? "סיבת החסימה שנרשמה:" : "Suspension reason:"} <strong>{banReason}</strong>
          </p>
          <button type="button" onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} className="btn-ghost">
            {isHe ? "התנתק מהחשבון" : "Sign Out"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir={isHe ? "rtl" : "ltr"} suppressHydrationWarning style={{ fontSize: mounted && largeText ? "112%" : "100%", filter: mounted && highContrast ? "contrast(1.18)" : "none", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
        background: "rgba(10, 11, 14, 0.94)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.09)"
      }}>
        {broadcastBanner.active && broadcastBanner.text && (
          <div style={{
            background: broadcastBanner.tone === "warning" ? "rgba(251, 191, 36, 0.18)" : "rgba(56, 189, 248, 0.18)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "6px 16px", textAlign: "center", fontSize: 12, fontWeight: 700,
            color: broadcastBanner.tone === "warning" ? "#fbbf24" : "#38bdf8"
          }}>
            <Megaphone size={13} style={{ display: "inline", marginRight: 6 }} />
            {broadcastBanner.text}
          </div>
        )}

        {warningMsg && (
          <div style={{
            background: "rgba(248, 113, 113, 0.22)", borderBottom: "1px solid rgba(248, 113, 113, 0.45)",
            padding: "8px 16px", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontSize: 12, color: "#fecaca"
          }}>
            <span><AlertTriangle size={14} style={{ display: "inline", marginRight: 5 }} /> <strong>{isHe ? "אזהרה מהנהלת המערכת:" : "Official Admin Notice:"}</strong> {warningMsg}</span>
            <button type="button" onClick={dismissWarning} style={{ background: "#f87171", color: "#0a0b0e", border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
              {isHe ? "קראתי והבנתי" : "Acknowledge"}
            </button>
          </div>
        )}

        <div style={{ maxWidth: 1060, margin: "0 auto", height: 60, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "#f8fafc" }}>
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#pcObsidian)" />
              <path d="M10 16.5L14 20.5L22.5 11.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              <defs><linearGradient id="pcObsidian" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#0284c7" /><stop offset="1" stopColor="#6366f1" /></linearGradient></defs>
            </svg>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: 900, fontSize: 16, color: "#f8fafc" }}>ProofCraft</span>
              <span style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>Studio</span>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button type="button" onClick={() => setPocketOpen(true)} className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.14)", color: "#34d399", fontSize: 11, cursor: "pointer", border: "1px solid rgba(52, 211, 153, 0.35)" }}>
              <Smartphone size={13} /> <span>{isHe ? "סנכרון נייד" : "Field Sync"}</span>
            </button>

            <button type="button" onClick={() => switchLanguage(isHe ? "en" : "he")} aria-label="Switch Language" className="btn-ghost" style={{ height: 34, padding: "0 10px", fontSize: 11 }}>
              <Globe size={13} /> {isHe ? "EN" : "עב"}
            </button>

            {isAdmin && (
              <Link href="/admin" className="badge-pill" style={{ background: "rgba(251, 191, 36, 0.18)", color: "#fbbf24", fontSize: 11, border: "1px solid rgba(251, 191, 36, 0.4)" }}>
                <Shield size={12} /> Admin
              </Link>
            )}

            <Link href="/auth" className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 11 }}>
              {userEmail ? userEmail.split("@") : (isHe ? "התחבר" : "Sign In")}
            </Link>
          </div>
        </div>
        <nav className="desktop-subnav" aria-label="Main Navigation" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(18, 20, 26, 0.7)" }}>
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
          <div>© 2026 ProofCraft Studio · {isHe ? "הכשרה מעשית, בניית נכסים ותיק עבודות מאומת" : "Global AI Product Engineering & Verified Portfolio OS"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 18px" }}>
            {legalDocs.map((doc) => {
              const labels: Record<string, string> = isHe
                ? { about: "אודות", pricing: "מחירון", terms: "תנאי שימוש", privacy: "פרטיות", refunds: "ביטולים", accessibility: "נגישות" }
                : { about: "About", pricing: "Pricing", terms: "Terms", privacy: "Privacy", refunds: "Refunds", accessibility: "Accessibility" };
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setLegalDoc(doc)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12, padding: "4px 2px", whiteSpace: "nowrap" }}
                >
                  {labels[doc.id] || doc.title}
                </button>
              );
            })}
            <button type="button" onClick={() => setA11yOpen(true)} style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
              <Accessibility size={13} style={{ display: "inline" }} /> {isHe ? "נגישות" : "A11y"}
            </button>
            <button type="button" onClick={() => { setSupportOpen(true); setSupportSent(false); }} style={{ background: "none", border: "none", color: "#34d399", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
              <MessageCircle size={13} style={{ display: "inline" }} /> {isHe ? "תמיכה" : "Support"} {myTickets.some((t) => t.admin_reply) ? "●" : ""}
            </button>
          </div>
        </div>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation" style={{
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
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <GlobalModal isOpen={pocketOpen} onClose={() => setPocketOpen(false)} title={isHe ? "סנכרון נייד ↔ מחשב" : "Field Sync (Mobile ↔ Desktop)"}>
        <PocketFieldStudio />
      </GlobalModal>

      <GlobalModal isOpen={a11yOpen} onClose={() => setA11yOpen(false)} title={isHe ? "התאמות נגישות" : "Accessibility Settings"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button type="button" onClick={() => setLargeText(!largeText)} className="btn-ghost" style={{ justifyContent: "space-between" }}>
            <span>{isHe ? "הגדלת טקסט באתר (112%)" : "Large Text Scale (112%)"}</span>
            <strong>{largeText ? (isHe ? "פעיל" : "ON") : (isHe ? "כבוי" : "OFF")}</strong>
          </button>
          <button type="button" onClick={() => setHighContrast(!highContrast)} className="btn-ghost" style={{ justifyContent: "space-between" }}>
            <span>{isHe ? "ניגודיות גבוהה" : "High Contrast Mode"}</span>
            <strong>{highContrast ? (isHe ? "פעיל" : "ON") : (isHe ? "כבוי" : "OFF")}</strong>
          </button>
        </div>
      </GlobalModal>

      <GlobalModal isOpen={Boolean(legalDoc)} onClose={() => setLegalDoc(null)} title={legalDoc?.title || ""}>
        {legalDoc && (
          <div dir={isHe ? "rtl" : "ltr"} style={{ textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="badge-pill" style={{ alignSelf: "flex-start", background: "rgba(56, 189, 248, 0.14)", color: "#38bdf8", fontSize: 11 }}>{legalDoc.badge}</span>
            {legalDoc.sections.map((sec, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>{sec.heading}</div>
                <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.65 }}>{sec.text}</p>
              </div>
            ))}
          </div>
        )}
      </GlobalModal>

      <GlobalModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} title={isHe ? "מרכז תמיכה ופניות" : "Direct Support & Inquiries"}>
        <div dir={isHe ? "rtl" : "ltr"} style={{ textAlign: isHe ? "right" : "left", display: "flex", flexDirection: "column", gap: 12 }}>
          {supportSent ? (
            <div style={{ padding: 14, borderRadius: 12, background: "rgba(52, 211, 153, 0.14)", color: "#34d399", fontSize: 13, fontWeight: 700 }}>
              {isHe ? "פנייתך נשלחה ותיענה בהקדם." : "Your inquiry has been submitted. Admin replies appear right here."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <select value={supportCategory} onChange={(e) => setSupportCategory(e.target.value)} className="input-dark">
                <option value="Technical Support">{isHe ? "תמיכה טכנית / שאלה על מסלול" : "Technical Support / Track Inquiry"}</option>
                <option value="Billing & Refund">{isHe ? "בקשת ביטול / זיכוי" : "Billing & Refund Request"}</option>
                <option value="Security Report">{isHe ? "דיווח אבטחה או קישור חריג" : "Security or Abuse Report"}</option>
              </select>
              {!userEmail && (
                <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="your@email.com" className="input-dark" />
              )}
              <textarea rows={3} value={supportText} onChange={(e) => setSupportText(e.target.value)} placeholder={isHe ? "תאר את פנייתך..." : "Describe your question or issue..."} className="input-dark" />
              <button type="button" onClick={submitSupportTicket} className="btn-primary">{isHe ? "שלח פנייה" : "Submit Ticket"}</button>
            </div>
          )}
        </div>
      </GlobalModal>
    </div>
  );
}
