"use client";
import PersistentFloatingToolsDock from './PersistentFloatingToolsDock';
import { resolveVipGrantForUser, VipGrantRecord } from "@/lib/vip-access-engine";
import ZeroKnowledgeVaultOS from "./ZeroKnowledgeVaultOS";


import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Crown, ShieldCheck, Home, BookOpen, Layers, Wrench, Users, Briefcase, Globe, Shield, Smartphone,
  Accessibility, MessageCircle, AlertTriangle, Megaphone, LogOut, CheckCircle2, Menu, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FINTECH_LEGAL_DOCS, LegalDocumentItem } from "@/lib/legal-docs-data";
import { detectNaturalVisitorLang, setStoredStudioLang } from "@/lib/i18n-engine";
import GlobalModal from "./GlobalModal";
import PocketFieldStudio from "./PocketFieldStudio";
import UniversalSyncBridge from "@/components/UniversalSyncBridge";
import UserSupportInboxCard from "@/components/UserSupportInboxCard";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "guy@proofcraft.app";
export type FocusMode = "full_os" | "affiliate_only" | "builder_only";

export default function AppShell({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined' && window.location.search.includes('floating=1')) { return <div style={{ background: '#0a0b0e', minHeight: '100vh', padding: 8 }}>{children}</div>; }
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"en" | "he">("he");
  const [quickVaultOpen, setQuickVaultOpen] = useState(false);
  const [vipBadge, setVipBadge] = useState<VipGrantRecord | null>(null);
  const [focusMode, setFocusMode] = useState<FocusMode>("full_os");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userTier, setUserTier] = useState<number>(1);
  const [isAffPro, setIsAffPro] = useState<boolean>(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [broadcastBanner, setBroadcastBanner] = useState<{ active: boolean; text: string; tone: string }>({ active: false, text: "", tone: "info" });
  const [legalDocs, setLegalDocs] = useState<LegalDocumentItem[]>(FINTECH_LEGAL_DOCS);
  const [pocketOpen, setPocketOpen] = useState(false); useEffect(() => { const openPocket = () => setPocketOpen(true); window.addEventListener("proofcraft:open-pocket", openPocket); return () => window.removeEventListener("proofcraft:open-pocket", openPocket); }, []);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [fontScale, setFontScale] = useState<"100%" | "112%" | "125%">("100%");
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [readableSpacing, setReadableSpacing] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDocumentItem | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportCategory, setSupportCategory] = useState("Technical Support");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportText, setSupportText] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [myTickets, setMyTickets] = useState<{ id: string; category: string; message: string; admin_reply: string; status: string; created_at: string }[]>([]);

  const hydrateUserProfile = async (uid: string | null, email: string | null, metaName?: string) => {
    setUserId(uid);
    setUserEmail(email);
    if (!uid) {
      setUserName(""); setUserTier(1); setIsAffPro(false); setIsBanned(false); setWarningMsg("");
      return;
    }
    setSupportEmail(email || "");
    const [{ data: prof }, { data: tData }] = await Promise.all([
      supabase.from("profiles").select("full_name, purchased_track_level, is_affiliate_pro, focus_mode, is_banned, ban_reason, warning_message").eq("id", uid).single(),
      supabase.from("support_tickets").select("id, category, message, admin_reply, status, created_at").eq("user_id", uid).order("created_at", { ascending: false }),
    ]);
    setUserName(prof?.full_name || metaName || (email ? email.split("@") : "Builder"));
    setUserTier(prof?.purchased_track_level || 1);
    setIsAffPro(Boolean(prof?.is_affiliate_pro));
    if (prof?.focus_mode) {
      setFocusMode(prof.focus_mode as FocusMode);
      localStorage.setItem("pc_focus_mode", prof.focus_mode);
    }
    setIsBanned(Boolean(prof?.is_banned));
    setBanReason(prof?.ban_reason || "");
    setWarningMsg(prof?.warning_message || "");
    if (tData) setMyTickets(tData);
  };

  useEffect(() => {
    setMounted(true);
    const savedLang = detectNaturalVisitorLang();
    setLang(savedLang);
    setStoredStudioLang(savedLang);

    const savedFocus = localStorage.getItem("pc_focus_mode") as FocusMode | null;
    if (savedFocus === "affiliate_only" || savedFocus === "builder_only" || savedFocus === "full_os") {
      setFocusMode(savedFocus);
    }

    const onFocusEvt = (e: Event) => {
      const next = (e as CustomEvent<FocusMode>).detail;
      if (next) setFocusMode(next);
    };
    window.addEventListener("pc-focus-change", onFocusEvt);

    supabase.from("site_settings").select("*").then(({ data: sData }) => {
      if (sData) {
        const bRow = sData.find((r) => r.key === "broadcast_banner");
        if (bRow?.value) setBroadcastBanner(bRow.value);
        const lRow = sData.find((r) => r.key === "legal_docs");
        if (Array.isArray(lRow?.value) && lRow.value.length > 0) setLegalDocs(lRow.value);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      hydrateUserProfile(u?.id || null, u?.email || null, u?.user_metadata?.full_name);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      hydrateUserProfile(u?.id || null, u?.email || null, u?.user_metadata?.full_name);
    });

    return () => {
      window.removeEventListener("pc-focus-change", onFocusEvt);
      authListener.subscription.unsubscribe();
    };
  }, []);
  const switchLanguage = (next: "en" | "he") => { setLang(next); setStoredStudioLang(next); localStorage.setItem("pc_lang", next); };

  const updateFocusMode = async (mode: "full_os" | "affiliate_only" | "builder_only") => {
    setFocusMode(mode);
    localStorage.setItem("pc_focus_mode", mode);
    window.dispatchEvent(new CustomEvent("pc-focus-change", { detail: mode }));
    if (userId) await supabase.from("profiles").update({ focus_mode: mode }).eq("id", userId);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserId(null); setUserEmail(null); setUserName("");
    router.push("/"); router.refresh();
  };

  const dismissWarning = async () => {
    setWarningMsg("");
    if (userId) await supabase.from("profiles").update({ warning_message: "" }).eq("id", userId);
  };

  const submitSupportTicket = async () => {
    const cleanMsg = supportText.trim().slice(0, 800);
    if (!cleanMsg) return;
    await supabase.from("support_tickets").insert({
      user_id: userId, sender_name: userName || userEmail || (lang === "he" ? "אורח" : "Guest"),
      sender_email: supportEmail.trim().slice(0, 120), category: supportCategory, message: cleanMsg, status: "open"
    });
    setSupportSent(true); setSupportText(""); if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("proofcraft:sync-now"));
  };

  const isHe = lang === "he";
  const allNavItems = [
    { href: "/", label: isHe ? "ראשי" : "Home", icon: Home, group: "all" },
    { href: "/affiliate", label: isHe ? "מרכז שותפים" : "Affiliate Hub", icon: Megaphone, group: "aff" },
    { href: "/workspace", label: isHe ? "סטודיו AI" : "Studio", icon: Layers, group: "bld" },
    { href: "/feed", label: isHe ? "קהילה ודילים" : "Feed", icon: Users, group: "all" },
    { href: "/toolkit", label: isHe ? "ארגז כלים" : "Toolkit", icon: Wrench, group: "all" },
    { href: "/vault", label: isHe ? "כספת מוצפנת" : "Vault", icon: ShieldCheck, group: "all" },
    { href: "/method", label: isHe ? "השיטה" : "Method", icon: BookOpen, group: "bld" },
    { href: "/context-studio", label: isHe ? "סטודיו הקשר" : "Context Studio", icon: Layers, group: "all" },
    { href: "/portfolio/live", label: isHe ? "תיק עבודות" : "Portfolio", icon: Briefcase, group: "bld" },
    { href: "/creators", label: isHe ? "\u05D9\u05D5\u05E6\u05E8\u05D9\u05DD" : "Creators", icon: Users, group: "all" },
  ];

  const visibleNav = allNavItems.filter((item) => {
    if (focusMode === "affiliate_only") return item.group === "all" || item.group === "aff";
    if (focusMode === "builder_only") return item.group === "all" || item.group === "bld";
    return true;
  });

  const mobilePrimaryNav = visibleNav.slice(0, 4);
  const isAdmin = userEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (isBanned && !isAdmin) {
    return (
      <div dir={isHe ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#0a0b0e", color: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div className="card-surface" style={{ maxWidth: 460, padding: 24, border: "1px solid rgba(248,113,113,0.45)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f87171", marginBottom: 8 }}>{isHe ? "הגישה הושעתה" : "Account Suspended"}</h1>
          <p style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 14 }}>{banReason}</p>
          <button type="button" onClick={handleSignOut} className="btn-ghost">{isHe ? "התנתק" : "Sign Out"}</button>
        </div>
      </div>
    );
  }

  return (
    <div dir={isHe ? "rtl" : "ltr"} className={`${mounted && highlightLinks ? "a11y-highlight-links" : ""} ${mounted && reduceMotion ? "a11y-reduce-motion" : ""}`} suppressHydrationWarning style={{ fontSize: mounted ? fontScale : "100%", filter: mounted && highContrast ? "contrast(1.18)" : "none", lineHeight: mounted && readableSpacing ? 1.85 : undefined, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, background: "rgba(10,11,14,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.09)" }}>
        {broadcastBanner.active && broadcastBanner.text && (
          <div style={{ background: "rgba(56,189,248,0.18)", padding: "6px 16px", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#38bdf8" }}>{broadcastBanner.text}</div>
        )}
        {warningMsg && (
          <div style={{ background: "rgba(248,113,113,0.22)", padding: "8px 16px", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontSize: 12, color: "#fecaca" }}>
            <span><AlertTriangle size={14} style={{ display: "inline", marginRight: 5 }} /> {warningMsg}</span>
            <button type="button" onClick={dismissWarning} style={{ background: "#f87171", color: "#0a0b0e", border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>{isHe ? "הבנתי" : "Acknowledge"}</button>
          </div>
        )}
        <div style={{ maxWidth: 1120, margin: "0 auto", height: 60, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#f8fafc" }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="9" fill="url(#pcObsidian)" /><path d="M10 16.5L14 20.5L22.5 11.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /><defs><linearGradient id="pcObsidian" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#0284c7" /><stop offset="1" stopColor="#6366f1" /></linearGradient></defs></svg>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5, whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: 900, fontSize: 16 }}>ProofCraft</span>
              <span style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>{focusMode === "affiliate_only" ? "Affiliate OS" : "Studio OS"}</span>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select aria-label="Workspace Focus Mode" value={focusMode} onChange={(e) => updateFocusMode(e.target.value as "full_os" | "affiliate_only" | "builder_only")} className="desktop-subnav" style={{ height: 32, padding: "0 8px", fontSize: 11, borderRadius: 8, background: "#12151e", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.35)", fontWeight: 700 }}>
              <option value="full_os">{isHe ? "מצב מלא: בנייה + שותפים" : "Full OS: Builder + Affiliate"}</option>
              <option value="affiliate_only">{isHe ? "מיקוד: הכנסה משותפים בלבד" : "Focus: Affiliate Hub Only"}</option>
              <option value="builder_only">{isHe ? "מיקוד: בניית תיק עבודות בלבד" : "Focus: Builder Studio Only"}</option>
            </select>
            <Link href="/legal" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 12, fontWeight: 700 }}>{isHe ? "תנאים, פרטיות וגילוי נאות" : "Legal & Privacy"}</Link>
            <button type="button" onClick={() => setA11yOpen(true)} title={isHe ? "נגישות" : "Accessibility"} className="btn-ghost" style={{ height: 32, padding: "0 8px", fontSize: 11, color: "#38bdf8" }}><Accessibility size={14} /></button>
            <button type="button" onClick={() => switchLanguage(isHe ? "en" : "he")} className="btn-ghost" style={{ height: 32, padding: "0 9px", fontSize: 11 }}><Globe size={13} /> {isHe ? "EN" : "עב"}</button>
            {isAdmin && <Link href="/admin" className="badge-pill" style={{ background: "rgba(251,191,36,0.18)", color: "#fbbf24", fontSize: 11, border: "1px solid rgba(251,191,36,0.4)" }}><Shield size={12} /> Admin</Link>}
            {userId ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Link href={focusMode === "affiliate_only" ? "/affiliate" : "/workspace"} className="badge-pill" style={{ background: "rgba(56,189,248,0.16)", color: "#f8fafc", fontSize: 11, border: "1px solid rgba(56,189,248,0.4)" }}>
                  <CheckCircle2 size={12} color="#34d399" />
                  <span>{isHe ? `ברוך הבא, ${userName}` : `Hi, ${userName}`}</span>
                </Link>
                <button type="button" onClick={handleSignOut} title={isHe ? "התנתק" : "Sign Out"} className="btn-ghost" style={{ height: 32, padding: "0 8px", fontSize: 11, color: "#f87171" }}><LogOut size={13} /></button>
              </div>
            ) : (
              <Link href="/auth" className="btn-primary" style={{ width: "auto", height: 34, padding: "0 12px", fontSize: 12 }}>{isHe ? "התחבר" : "Sign In"}</Link>
            )}
          </div>
        </div>
        <nav className="desktop-subnav" aria-label="Main Navigation" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(18,20,26,0.75)" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%", padding: "0 16px", display: "flex", alignItems: "center", gap: 6, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 14px", fontSize: 13, fontWeight: active ? 800 : 600, color: active ? "#38bdf8" : "#cbd5e1", borderBottom: active ? "2px solid #38bdf8" : "2px solid transparent", whiteSpace: "nowrap" }}>
                  <Icon size={15} /><span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {vipBadge && <div style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.18), rgba(52,211,153,0.16))", borderBottom: "1px solid rgba(251,191,36,0.35)", padding: "6px 16px", textAlign: "center", fontSize: 12, fontWeight: 800, color: "#fef3c7" }}><Crown size={13} style={{ display: "inline", marginInlineEnd: 6, color: "#fbbf24" }} />{isHe ? `גישת VIP / שגריר פעילה (v${vipBadge.grantedLevel}.0 מלא בחינם) · ${vipBadge.label}` : `VIP Ambassador Pass Active (Full v${vipBadge.grantedLevel}.0 Free Access) · ${vipBadge.label}`}</div>}
      <main className="obsidian-container" style={{ flex: 1, width: "100%" }}><UniversalSyncBridge isHe={isHe} isAdmin={isAdmin} />{children}</main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "24px 20px 96px", background: "#07080b", fontSize: 12, color: "#94a3b8" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>© 2026 ProofCraft Studio OS · {isHe ? "פלטפורמת AI, פורטפוליו מאומת והכנסה משותפים" : "Verified AI Engineering & Direct Affiliate Income OS"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
            {legalDocs.map((doc) => (
              <button key={doc.id} type="button" onClick={() => setLegalDoc(doc)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12 }}>{isHe ? (doc.title.includes("About") ? "אודות ProofCraft Studio" : doc.title.includes("Pricing") ? "מחירון שקוף" : doc.title.includes("Terms") ? "תנאי שימוש" : doc.title.includes("Privacy") ? "מדיניות פרטיות ואבטחה" : doc.title.includes("Refund") ? "מדיניות ביטולים והחזרים" : doc.title.includes("Accessibility") ? "הצהרת נגישות" : doc.title) : doc.title}</button>
            ))}
            <Link href="/legal" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 12, fontWeight: 700 }}>{isHe ? "תנאים, פרטיות וגילוי נאות" : "Legal & Privacy"}</Link>
            <button type="button" onClick={() => setA11yOpen(true)} style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: 12, fontWeight: 700 }}><Accessibility size={13} style={{ display: "inline" }} /> {isHe ? "נגישות" : "A11y"}</button>
            <button type="button" onClick={() => { setSupportOpen(true); setSupportSent(false); }} style={{ background: "none", border: "none", color: "#34d399", cursor: "pointer", fontSize: 12, fontWeight: 700 }}><MessageCircle size={13} style={{ display: "inline" }} /> {isHe ? "תמיכה" : "Support"}</button>
          </div>
        </div>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation" style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 66, zIndex: 40, background: "rgba(10,11,14,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.1)", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", alignItems: "center" }}>
        {mobilePrimaryNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, color: active ? "#38bdf8" : "#94a3b8", fontSize: 10, fontWeight: active ? 800 : 600, minHeight: 48 }}>
              <Icon size={18} /><span>{item.label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={() => setMoreDrawerOpen(true)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, color: "#34d399", fontSize: 10, fontWeight: 800, minHeight: 48, cursor: "pointer" }}>
          <Menu size={18} /><span>{isHe ? "עוד" : "More"}</span>
        </button>
      </nav>
      <GlobalModal isOpen={moreDrawerOpen} onClose={() => setMoreDrawerOpen(false)} title={isHe ? "תפריט מלא והתאמת סביבת עבודה" : "Full Navigation & Workspace Focus"}>
        <div dir={isHe ? "rtl" : "ltr"} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8" }}>{isHe ? "בחר סביבת עבודה:" : "WORKSPACE FOCUS:"}</div>
          {[
            { id: "full_os", label: isHe ? "מצב משולב: בנייה + שותפים" : "Full OS: Builder + Affiliate" },
            { id: "affiliate_only", label: isHe ? "מיקוד: הכנסה משותפים בלבד" : "Affiliate Focus Only" },
            { id: "builder_only", label: isHe ? "מיקוד: בניית תיק עבודות" : "Builder Focus Only" },
          ].map((m) => (
            <button key={m.id} type="button" onClick={() => { updateFocusMode(m.id as "full_os" | "affiliate_only" | "builder_only"); setMoreDrawerOpen(false); }} className={focusMode === m.id ? "btn-primary" : "btn-ghost"} style={{ justifyContent: "flex-start", fontSize: 12 }}>{m.label}</button>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {allNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMoreDrawerOpen(false)} className="btn-ghost" style={{ justifyContent: "flex-start", fontSize: 12 }}>
                  <Icon size={14} /> <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => { setMoreDrawerOpen(false); setPocketOpen(true); if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("proofcraft:sync-now")); supabase.auth.getUser().then(({ data }) => hydrateUserProfile(data.user?.id || null, data.user?.email || null)); router.refresh(); }} className="btn-ghost" style={{ flex: 1, fontSize: 12 }}><Smartphone size={13} /> {isHe ? "סנכרון" : "Sync"}</button>
            <button type="button" onClick={() => { setMoreDrawerOpen(false); setA11yOpen(true); }} className="btn-ghost" style={{ flex: 1, fontSize: 12 }}><Accessibility size={13} /> {isHe ? "נגישות" : "A11y"}</button>
          </div>
        </div>
      </GlobalModal>

      <GlobalModal isOpen={pocketOpen} onClose={() => setPocketOpen(false)} title={isHe ? "סנכרון נייד ↔ מחשב" : "Field Sync"}><PocketFieldStudio /></GlobalModal>

      <GlobalModal isOpen={a11yOpen} onClose={() => setA11yOpen(false)} title={isHe ? "מרכז נגישות מתקדם" : "Studio Accessibility Center"}>
        <div dir={isHe ? "rtl" : "ltr"} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {(["100%", "112%", "125%"] as const).map((sc) => (
              <button key={sc} type="button" onClick={() => setFontScale(sc)} className={fontScale === sc ? "btn-primary" : "btn-ghost"} style={{ height: 36, fontSize: 12 }}>{sc}</button>
            ))}
          </div>
          <button type="button" onClick={() => setHighContrast(!highContrast)} className="btn-ghost" style={{ justifyContent: "space-between" }}><span>{isHe ? "ניגודיות גבוהה" : "High Contrast"}</span><strong>{highContrast ? "ON" : "OFF"}</strong></button>
          <button type="button" onClick={() => setHighlightLinks(!highlightLinks)} className="btn-ghost" style={{ justifyContent: "space-between" }}><span>{isHe ? "הדגשת קישורים" : "Highlight Links"}</span><strong>{highlightLinks ? "ON" : "OFF"}</strong></button>
          <button type="button" onClick={() => setReduceMotion(!reduceMotion)} className="btn-ghost" style={{ justifyContent: "space-between" }}><span>{isHe ? "עצירת אנימציות" : "Reduce Motion"}</span><strong>{reduceMotion ? "ON" : "OFF"}</strong></button>
          <button type="button" onClick={() => setReadableSpacing(!readableSpacing)} className="btn-ghost" style={{ justifyContent: "space-between" }}><span>{isHe ? "ריווח קריאות" : "Readable Spacing"}</span><strong>{readableSpacing ? "ON" : "OFF"}</strong></button>
          <button type="button" onClick={() => { setFontScale("100%"); setHighContrast(false); setHighlightLinks(false); setReduceMotion(false); setReadableSpacing(false); }} className="btn-ghost" style={{ color: "#38bdf8", fontSize: 12 }}><RotateCcw size={13} /> {isHe ? "איפוס" : "Reset"}</button>
        </div>
      </GlobalModal>

      <GlobalModal isOpen={Boolean(legalDoc)} onClose={() => setLegalDoc(null)} title={legalDoc?.title || ""}>
        {legalDoc && (
          <div dir={isHe ? "rtl" : "ltr"} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {legalDoc.sections.map((sec, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 12, background: "#0a0b0e" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>{sec.heading}</div>
                <p style={{ fontSize: 13, color: "#cbd5e1" }}>{sec.text}</p>
              </div>
            ))}
          </div>
        )}
      </GlobalModal>

      <GlobalModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} title={isHe ? "מרכז תמיכה" : "Direct Support"}>
        <div dir={isHe ? "rtl" : "ltr"} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {supportSent ? <div style={{ color: "#34d399", fontWeight: 700 }}>{isHe ? "פנייתך נשלחה!" : "Ticket submitted!"}</div> : (
            <>
              <select value={supportCategory} onChange={(e) => setSupportCategory(e.target.value)} className="input-dark"><option value="Technical Support">Technical Support</option><option value="Billing">Billing</option></select>
              {!userEmail && <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="you@example.com" className="input-dark" />}
              <textarea rows={3} value={supportText} onChange={(e) => setSupportText(e.target.value)} placeholder="..." className="input-dark" />
              <button type="button" onClick={submitSupportTicket} className="btn-primary">{isHe ? "שלח" : "Send"}</button>
            </>
          )}
          <UserSupportInboxCard userId={userId} isHe={isHe} />
        </div>
      </GlobalModal>
      {typeof window !== 'undefined' && !window.location.search.includes('floating=1') && <PersistentFloatingToolsDock isHe={isHe} />}
    </div>
  );
}
