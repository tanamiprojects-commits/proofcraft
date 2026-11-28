"use client";
import React, { useEffect, useState } from "react";
import {
  Shield, Users, AlertTriangle, Ban, CheckCircle2, Award, MessageSquare,
  DollarSign, Megaphone, Trash2, Pin, Send, Sparkles, Search, Globe, Activity
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import EcosystemCommandCenter from "@/components/EcosystemCommandCenter";
import AdminModerationQueue from "@/components/AdminModerationQueue";
import AdminDemandRadar from "@/components/AdminDemandRadar";
import AdminAffiliateManager from "@/components/affiliate/AdminAffiliateManager";
import AdminModerationAudit from "@/components/AdminModerationAudit";
import AdminEcosystemPulse from "@/components/AdminEcosystemPulse";
import AdminDiagnosticsSuite from "@/components/AdminDiagnosticsSuite";
import AdminGuideDrawer from "@/components/AdminGuideDrawer";
import { downloadCsvReport } from "@/lib/csv-export";
import VerifiedProofsPanel from "@/components/VerifiedProofsPanel";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "tanami.projects@gmail.com";

interface AdminUserRow {
  id: string;
  full_name: string;
  headline: string;
  purchased_track_level: number;
  total_paid_ils: number;
  admin_verified: boolean;
  is_featured?: boolean;
  is_banned?: boolean;
  ban_reason?: string;
  warning_message?: string;
  peer_karma?: number;
  completed_step_ids?: string[];
  updated_at?: string;
}

interface AdminPostRow {
  id: string;
  author_name: string;
  project_title: string;
  summary: string;
  live_url: string;
  is_pinned: boolean;
  admin_verified: boolean;
  status: string;
}

interface SupportRow {
  id: string;
  sender_name: string;
  sender_email: string;
  category: string;
  message: string;
  admin_reply: string;
  status: string;
  created_at: string;
}

interface TrackRow {
  level: number;
  name: string;
  subtitle: string;
  price_ils: number;
}
const GLOBAL_REPLY_TEMPLATES = [
  { label: "Portfolio Verified", text: "Your live deployment and architectural proof have been verified. Your Certified Builder badge is now active on your public portfolio!" },
  { label: "HTTPS Link Required", text: "Please attach a valid live HTTPS deployment URL (e.g., https://vercel.app) so we can complete your verification." },
  { label: "Upgrade-Delta Info", text: "All previous payments are 100% credited automatically when upgrading to a higher tier (v2.0–v4.0). You only pay the difference." },
  { label: "Campaign Approved", text: "Your commercial promotion campaign has been approved and pinned to the top of the Builder Proof Feed." },
];

const GLOBAL_WARNING_TEMPLATES = [
  { label: "Invalid / Non-HTTPS Link", text: "Security Notice: Please replace non-HTTPS or placeholder links with a verified live deployment URL." },
  { label: "Incomplete Proof Artifact", text: "Verification Notice: Please submit actual terminal/SQL/code execution output rather than placeholder text." },
  { label: "Community Conduct", text: "Policy Reminder: Keep all feed submissions and peer reviews constructive, accurate, and aligned with ProofCraft & Tanami360 standards." },
];

export default function AdminCommandCenterPage() {
  const { isHe, dir, t } = useStudioLang();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"queue" | "ecosystem" | "users" | "support" | "feed" | "tracks" | "broadcast">("queue");
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userSegment, setUserSegment] = useState<"all" | "verified" | "unverified" | "paid" | "banned">("all");
  const [posts, setPosts] = useState<AdminPostRow[]>([]);
  const [tickets, setTickets] = useState<SupportRow[]>([]);
  const [leads, setLeads] = useState<{ id: string; user_email?: string; target_tier?: string; status?: string }[]>([]);
  const [tracks, setTracks] = useState<TrackRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<{ id: string; action_title: string; target_info: string; created_at: string }[]>([]);
  const [broadcast, setBroadcast] = useState<{ active: boolean; text: string; tone: string }>({ active: false, text: "", tone: "info" });
  const [warnTarget, setWarnTarget] = useState<AdminUserRow | null>(null);
  const [warnText, setWarnText] = useState("");
  const [banTarget, setBanTarget] = useState<AdminUserRow | null>(null);
  const [banText, setBanText] = useState("");
  const [replyTarget, setReplyTarget] = useState<SupportRow | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState("");
  const showMsg = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3400); };

  const callAdminServer = async (action: string, payload: Record<string, unknown>) => {
    const { data: sessData } = await supabase.auth.getSession();
    const token = sessData?.session?.access_token || "";
    const res = await fetch("/api/admin-governance", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, payload }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      showMsg(t(`Security Error: ${json.error || res.statusText}`, `שגיאת אבטחה: ${json.error || res.statusText}`));
      return false;
    }
    return true;
  };
  const logAdminAction = async (action_title: string, target_info: string) => {
    await supabase.from("admin_audit_logs").insert({ action_title, target_info });
    const { data } = await supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(20);
    if (data) setAuditLogs(data);
  };

  const loadAllAdminData = async () => {
    const { data: uData } = await supabase.auth.getUser();
    const email = uData.user?.email || "";
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) { setAuthorized(false); return; }
    setAuthorized(true);
    const [profRes, postRes, tktRes, trkRes, setRes, logRes] = await Promise.all([
      supabase.from("profiles").select("*").order("updated_at", { ascending: false }),
      supabase.from("feed_posts").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("support_tickets").select("*").order("created_at", { ascending: false }),
      supabase.from("career_tracks").select("*").order("level"),
      supabase.from("site_settings").select("*"),
      supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    if (profRes.data) setUsers(profRes.data);
    if (postRes.data) setPosts(postRes.data);
    if (tktRes.data) setTickets(tktRes.data);
    supabase.from("upgrade_intents").select("id,user_email,target_tier,status").order("created_at", { ascending: false }).limit(25).then(({ data }) => { if (data) setLeads(data); });
    if (trkRes.data && trkRes.data.length > 0) setTracks(trkRes.data);
    if (logRes.data) setAuditLogs(logRes.data);
    if (setRes.data) { const bRow = setRes.data.find((r) => r.key === "broadcast_banner"); if (bRow?.value) setBroadcast(bRow.value); }
  };

  useEffect(() => {
    loadAllAdminData();
    const onSync = () => loadAllAdminData();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, []);
  const toggleVerifyUser = async (u: AdminUserRow) => {
    const next = !u.admin_verified;
    const ok = await callAdminServer("toggle_verify_user", { userId: u.id, next, label: u.full_name || u.id });
    if (!ok) return;
    showMsg(next ? t(`Verified ${u.full_name || "Builder"}!`, `היוצר ${u.full_name || "Builder"} אומת בהצלחה!`) : t("Verification badge removed.", "תג האימות הוסר."));
    loadAllAdminData();
  };

  const updateUserTrackLevel = async (u: AdminUserRow, newLevel: number) => {
    const ok = await callAdminServer("update_track_level", { userId: u.id, level: newLevel, label: u.full_name || u.id });
    if (!ok) return;
    showMsg(t(`Updated ${u.full_name || "Builder"} to Track ${newLevel}.`, `דרגת המשתמש עודכנה למסלול ${newLevel}.`));
    loadAllAdminData();
  };

  const sendWarningToUser = async () => {
    if (!warnTarget || !warnText.trim()) return;
    const ok = await callAdminServer("warn_user", { userId: warnTarget.id, text: warnText.trim(), label: warnTarget.full_name || warnTarget.id });
    if (!ok) return;
    showMsg(t(`Notice dispatched to ${warnTarget.full_name}.`, `הודעת התראה נשלחה אל ${warnTarget.full_name}.`));
    setWarnTarget(null); setWarnText("");
    loadAllAdminData();
  };

  const confirmBanUser = async () => {
    if (!banTarget) return;
    const reason = banText.trim() || "Violation of ProofCraft & Tanami360 Terms & Security Policy";
    const ok = await callAdminServer("ban_user", { userId: banTarget.id, reason, label: banTarget.full_name || banTarget.id });
    if (!ok) return;
    showMsg(t(`Account ${banTarget.full_name} suspended.`, `החשבון ${banTarget.full_name} הושעה.`));
    setBanTarget(null); setBanText("");
    loadAllAdminData();
  };

  const unbanUser = async (u: AdminUserRow) => {
    const ok = await callAdminServer("unban_user", { userId: u.id, label: u.full_name || u.id });
    if (!ok) return;
    showMsg(t(`Suspension lifted for ${u.full_name}.`, `ההשעיה הוסרה עבור ${u.full_name}.`));
    loadAllAdminData();
  };

  const approveCommercialCampaign = async (ticket: SupportRow) => {
    const match = ticket.message.match(/Post ID:\s*([a-zA-Z0-9-]+)/);
    const postId = match ? match : null;
    if (postId) {
      await supabase.from("feed_posts").update({ is_pinned: true, status: "approved", admin_verified: true }).eq("id", postId);
    }
    await supabase.from("support_tickets").update({
      admin_reply: "Commercial promotion campaign approved! Your project is now verified and pinned at the top of the Builder Proof Feed.",
      status: "resolved",
    }).eq("id", ticket.id);
    await logAdminAction("Approved & Pinned Commercial Campaign", `${ticket.sender_name} (${postId || "Ticket " + ticket.id})`);
    showMsg(t("Commercial campaign approved & pinned!", "הקמפיין המסחרי אושר וננעץ בראש הקיר!"));
    loadAllAdminData();
  };

  const sendSupportReply = async () => {
    if (!replyTarget || !replyText.trim()) return;
    const ok = await callAdminServer("reply_ticket", { ticketId: replyTarget.id, reply: replyText.trim(), senderName: replyTarget.sender_name });
    if (!ok) return;
    showMsg(t("Reply sent & synced!", "התשובה נשלחה וסונכרנה!"));
    setReplyTarget(null); setReplyText("");
    loadAllAdminData();
  };

  const togglePinPost = async (p: AdminPostRow) => {
    const ok = await callAdminServer("toggle_pin_post", { postId: p.id, nextPin: !p.is_pinned, title: p.project_title });
    if (!ok) return;
    loadAllAdminData();
  };

  const deletePost = async (id: string, title: string) => {
    const ok = await callAdminServer("delete_post", { postId: id, title });
    if (!ok) return;
    showMsg(t("Post deleted.", "הפרסום נמחק."));
    loadAllAdminData();
  };

  const saveTrackRow = async (tr: TrackRow) => {
    const ok = await callAdminServer("save_track", { level: tr.level, name: tr.name, subtitle: tr.subtitle, priceIls: Number(tr.price_ils) });
    if (!ok) return;
    showMsg(t(`Saved Track ${tr.level}!`, `מסלול ${tr.level} נשמר בהצלחה!`));
  };

  const saveBroadcastSettings = async () => {
    const ok = await callAdminServer("save_broadcast", { broadcast });
    if (!ok) return;
    showMsg(t("Broadcast banner updated!", "באנר השידור החי עודכן!"));
  };
  if (authorized === null) return <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>{t("Verifying Admin Credentials...", "מאמת הרשאות ניהול...")}</div>;

  if (!authorized) {
    return (
      <div dir={dir} className="card-surface" style={{ maxWidth: 460, margin: "40px auto", padding: 26, textAlign: "center", border: "1px solid rgba(248,113,113,0.4)" }}>
        <h1 style={{ fontSize: 18, fontWeight: 900, color: "#f87171", marginBottom: 6 }}>{t("Restricted Admin Command Center", "מרכז שליטה ובקרה — גישה למורשים בלבד")}</h1>
        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{t("Sign in with", "התחבר עם החשבון המורשה")} <strong>{ADMIN_EMAIL}</strong> {t("to access platform governance.", "כדי לנהל את הפלטפורמה.")}</p>
      </div>
    );
  }

  const openTicketsCount = tickets.filter((tk) => tk.status === "open").length;
  const promoQuotesCount = tickets.filter((tk) => tk.status === "open" && tk.category === "COMMERCIAL_PROMO_QUOTE").length;
  const verifiedBuildersCount = users.filter((u) => u.admin_verified).length;
  const paidTierBuildersCount = users.filter((u) => (u.purchased_track_level || 1) >= 2).length;

  const filteredUsers = users.filter((u) => {
    const q = userSearch.trim().toLowerCase();
    const matchQ = !q || (u.full_name || "").toLowerCase().includes(q) || (u.headline || "").toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    if (!matchQ) return false;
    if (userSegment === "verified") return Boolean(u.admin_verified);
    if (userSegment === "unverified") return !u.admin_verified;
    if (userSegment === "paid") return (u.purchased_track_level || 1) >= 2;
    if (userSegment === "banned") return Boolean(u.is_banned);
    return true;
  });

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 95, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      <div className="card-hero" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc", display: "flex", alignItems: "center", gap: 8 }}>
              <Globe size={20} color="#38bdf8" /> {t("Global Operations & Builder Governance Center", "מרכז השליטה, האימות והבקרה — ProofCraft & Tanami360")}
            </h1>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>{t("User CRM, 1-click response templates, proof auditing & commercial campaigns", "ניהול יוצרים, אימות תיקי עבודות, פניות תמיכה וקמפיינים מאומתים")}</p>
          </div>
          <span className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.15)", color: "#34d399", fontSize: 11 }}>
            Admin: {ADMIN_EMAIL}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{t("Total Builders", "סה״כ משתמשים")}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc" }}>{users.length}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.25)" }}>
            <div style={{ fontSize: 11, color: "#34d399" }}>{t("Verified Builders", "יוצרים מאומתים")}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#34d399" }}>{verifiedBuildersCount}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.25)" }}>
            <div style={{ fontSize: 11, color: "#38bdf8" }}>{t("Paid Tiers (T2–T4)", "מסלולים מתקדמים")}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#38bdf8" }}>{paidTierBuildersCount}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.28)" }}>
            <div style={{ fontSize: 11, color: "#fbbf24" }}>{t("Promo Quotes / Tickets", "קמפיינים / פניות")}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24" }}>{promoQuotesCount} / {openTicketsCount}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {([
          ["queue", t("Moderation & Proofs", "תור אימות והוכחות")],
          ["ecosystem", t("Ecosystem & Affiliates", "דופק מערכת ושותפים")],
          ["users", t(`Builders CRM (${users.length})`, `ניהול יוצרים (${users.length})`)],
          ["support", t(`Support & Promo (${openTicketsCount})`, `תמיכה וקמפיינים (${openTicketsCount})`)],
          ["feed", t("Feed Management", "ניהול קיר הקהילה")],
          ["tracks", t("Tracks & Pricing", "מסלולים ותמחור")],
          ["broadcast", t("Broadcast & Audit", "באנר חי ויומן פעולות")],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} className={activeTab === key ? "btn-primary" : "btn-ghost"} style={{ width: "auto", padding: "7px 14px", fontSize: 12 }}>
            {label}
          </button>
        ))}
      </div>
      {activeTab === "queue" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AdminGuideDrawer onNavigateTab={(tab) => setActiveTab(tab)} onNotify={showMsg} />
          <AdminModerationQueue />
          <VerifiedProofsPanel isAdminView />
        </div>
      )}

      {activeTab === "ecosystem" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <EcosystemCommandCenter />
          <AdminEcosystemPulse />
          <AdminDemandRadar onGrantTier={async (uid, tier) => { await supabase.from("profiles").update({ purchased_track_level: tier }).eq("id", uid); showMsg(`Unlocked v${tier}.0 for user!`); }} />
          <AdminAffiliateManager onNotify={showMsg} />
          <AdminModerationAudit onNotify={showMsg} />
        </div>
      )}

      {activeTab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card-surface" style={{ padding: 14, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 12, top: 12 }} />
              <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder={t("Search builder by name, headline, or ID...", "חפש משתמש לפי שם, כותרת או מזהה...")} className="input-dark" style={{ width: "100%", paddingLeft: 34, fontSize: 12.5 }} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["all", "verified", "unverified", "paid", "banned"] as const).map((seg) => (
                <button key={seg} onClick={() => setUserSegment(seg)} className={userSegment === seg ? "btn-primary" : "btn-ghost"} style={{ width: "auto", padding: "5px 11px", fontSize: 11.5 }}>{seg.toUpperCase()}</button>
              ))}
            </div>
          </div>
          {filteredUsers.map((u) => {
            const stepsCount = Array.isArray(u.completed_step_ids) ? u.completed_step_ids.length : 0;
            return (
              <div key={u.id} className="card-surface" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <strong style={{ color: "#f8fafc", fontSize: 14 }}>{u.full_name || u.id}</strong>
                    <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>Tier {u.purchased_track_level || 1}</span>
                    <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(251,191,36,0.14)", color: "#fbbf24" }}>{stepsCount} Proofs · {u.peer_karma || 0} Karma</span>
                    {u.admin_verified && <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(52,211,153,0.14)", color: "#34d399" }}>Verified</span>}
                    {u.is_banned && <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(248,113,113,0.18)", color: "#f87171" }}>SUSPENDED</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{u.headline || "Independent AI Systems Builder"}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button onClick={() => toggleVerifyUser(u)} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5 }}>{u.admin_verified ? "Revoke Verify" : "Verify Builder"}</button>
                  <button onClick={async () => { const { data: pr } = await supabase.from("profiles").select("affiliate_boost_credits").eq("id", u.id).single(); const curr = Number(pr?.affiliate_boost_credits ?? 10); await Promise.all([supabase.from("profiles").update({ affiliate_boost_credits: curr + 25 }).eq("id", u.id), supabase.from("aff_karma_ledger").insert({ user_id: u.id, action_type: "admin_grant", credits_delta: 25, description_en: "Admin Boost Credit Award (+25)", description_he: "מענק נקודות חשיפה מהאדמין (+25)" })]); showMsg("Granted +25 Boost Credits!"); }} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5, color: "#34d399" }}>+25 Credits</button>
                  <a href={`/portfolio/${u.id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5 }}>Portfolio</a>
                  {[1, 2, 3, 4].map((lvl) => (<button key={lvl} onClick={() => updateUserTrackLevel(u, lvl)} className="btn-ghost" style={{ padding: "5px 9px", fontSize: 11 }}>T{lvl}</button>))}
                  <button onClick={() => { setWarnTarget(u); setWarnText(u.warning_message || ""); }} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5, color: "#fbbf24" }}>Warn</button>
                  {u.is_banned ? (<button onClick={() => unbanUser(u)} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5, color: "#34d399" }}>Unban</button>) : (<button onClick={() => setBanTarget(u)} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5, color: "#f87171" }}>Ban</button>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {activeTab === "support" && leads.length > 0 && (<div className="card-surface" style={{ padding: 14, marginBottom: 12, border: "1px solid rgba(52,211,153,0.35)" }}><strong style={{ color: "#34d399", fontSize: 13 }}>Upgrade Leads ({leads.length})</strong>{leads.slice(0, 6).map((ld) => (<div key={ld.id} style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>{ld.user_email || "User"} - {ld.target_tier || "Pro"} ({ld.status || "pending"})</div>))}</div>)}
      {activeTab === "support" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tickets.length === 0 ? (<div className="card-surface" style={{ padding: 20, color: "#94a3b8" }}>{t("No support tickets or promotion quote requests yet.", "אין פניות תמיכה או בקשות קמפיין פתוחות כרגע.")}</div>) : tickets.map((tk) => {
            const isPromo = tk.category === "COMMERCIAL_PROMO_QUOTE";
            return (
              <div key={tk.id} className="card-surface" style={{ padding: 16, border: isPromo ? "1px solid rgba(251,191,36,0.4)" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong style={{ color: "#f8fafc", fontSize: 14 }}>{tk.sender_name}</strong>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>({tk.sender_email})</span>
                    <span className="badge-pill" style={{ fontSize: 10.5, background: isPromo ? "rgba(251,191,36,0.16)" : "rgba(56,189,248,0.14)", color: isPromo ? "#fbbf24" : "#38bdf8" }}>{isPromo ? "COMMERCIAL PROMO QUOTE" : tk.category}</span>
                  </div>
                  <span style={{ fontSize: 11, color: tk.status === "open" ? "#fbbf24" : "#34d399", fontWeight: 700 }}>{tk.status.toUpperCase()}</span>
                </div>
                <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.55, marginBottom: 10 }}>{tk.message}</p>
                {tk.admin_reply && (<div style={{ padding: 10, borderRadius: 10, background: "rgba(52,211,153,0.08)", fontSize: 12, color: "#34d399", marginBottom: 10 }}><strong>Admin Reply:</strong> {tk.admin_reply}</div>)}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {isPromo && tk.status === "open" && (<button onClick={() => approveCommercialCampaign(tk)} className="btn-primary" style={{ width: "auto", padding: "6px 14px", fontSize: 12 }}><Sparkles size={13} /> {t("Approve & Pin Commercial Campaign", "אשר ונעץ קמפיין מסחרי")}</button>)}
                  <button onClick={() => { setReplyTarget(tk); setReplyText(tk.admin_reply || ""); }} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}><Send size={13} /> {t("Reply with Template", "השב עם תבנית")}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "feed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {posts.map((p) => (
            <div key={p.id} className="card-surface" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <strong style={{ color: "#38bdf8", fontSize: 14 }}>{p.project_title}</strong> <span style={{ fontSize: 12, color: "#94a3b8" }}>by {p.author_name} ({p.status})</span>
                <p style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>{p.summary}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => togglePinPost(p)} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}><Pin size={13} /> {p.is_pinned ? "Unpin" : "Approve & Pin"}</button>
                <button onClick={() => deletePost(p.id, p.project_title)} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12, color: "#f87171" }}><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === "tracks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tracks.map((tr, idx) => (
            <div key={tr.level} className="card-surface" style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, alignItems: "center" }}>
              <input value={tr.name} onChange={(e) => setTracks((prev) => prev.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} className="input-dark" />
              <input value={tr.subtitle} onChange={(e) => setTracks((prev) => prev.map((x, i) => i === idx ? { ...x, subtitle: e.target.value } : x))} className="input-dark" />
              <input type="number" value={tr.price_ils} onChange={(e) => setTracks((prev) => prev.map((x, i) => i === idx ? { ...x, price_ils: Number(e.target.value) } : x))} className="input-dark" />
              <button onClick={() => saveTrackRow(tr)} className="btn-primary" style={{ width: "auto", padding: "8px 14px" }}>Save</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "broadcast" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AdminDiagnosticsSuite />
          <div className="card-surface" style={{ padding: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", marginBottom: 10 }}>{t("Global Live Broadcast Banner", "באנר הודעות חי בכל הפלטפורמה")}</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <input type="checkbox" checked={broadcast.active} onChange={(e) => setBroadcast({ ...broadcast, active: e.target.checked })} />
              <span style={{ fontSize: 13, color: "#cbd5e1" }}>{t("Show live banner across all active sessions", "הצג באנר שידור חי לכל המשתמשים")}</span>
            </div>
            <input value={broadcast.text} onChange={(e) => setBroadcast({ ...broadcast, text: e.target.value })} placeholder="Global announcement message..." className="input-dark" style={{ width: "100%", marginBottom: 10 }} />
            <button onClick={saveBroadcastSettings} className="btn-primary" style={{ width: "auto", padding: "8px 18px" }}>{t("Publish Broadcast", "פרסם באנר חי")}</button>
          </div>
          <div className="card-surface" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", margin: 0 }}>{t("Admin Audit Log", "יומן ביקורת פעולות ניהול")}</h2>
              <button type="button" onClick={() => downloadCsvReport("proofcraft-admin-audit.csv", ["ID", "Action", "Target", "Created At"], auditLogs.map((a) => [a.id, a.action_title, a.target_info, a.created_at]))} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>Export Audit CSV</button>
            </div>
            {auditLogs.map((log) => (<div key={log.id} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "#cbd5e1" }}><strong>{log.action_title}</strong> — {log.target_info}</div>))}
          </div>
        </div>
      )}

      {replyTarget && (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 95, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}><div className="card-surface" style={{ maxWidth: 480, width: "100%", padding: 20 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>Reply to {replyTarget.sender_name}</h3><div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>{GLOBAL_REPLY_TEMPLATES.map((tpl) => (<button key={tpl.label} type="button" onClick={() => setReplyText(tpl.text)} style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38bdf8", cursor: "pointer" }}>+ {tpl.label}</button>))}</div><textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} className="input-dark" style={{ width: "100%", marginBottom: 12 }} /><div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><button onClick={() => setReplyTarget(null)} className="btn-ghost">Cancel</button><button onClick={sendSupportReply} className="btn-primary" style={{ width: "auto" }}>Send Reply</button></div></div></div>)}
      {warnTarget && (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 95, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}><div className="card-surface" style={{ maxWidth: 460, width: "100%", padding: 20 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: "#fbbf24", marginBottom: 8 }}>Issue Warning to {warnTarget.full_name}</h3><div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>{GLOBAL_WARNING_TEMPLATES.map((tpl) => (<button key={tpl.label} type="button" onClick={() => setWarnText(tpl.text)} style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", cursor: "pointer" }}>+ {tpl.label}</button>))}</div><input value={warnText} onChange={(e) => setWarnText(e.target.value)} className="input-dark" style={{ width: "100%", marginBottom: 12 }} /><div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><button onClick={() => setWarnTarget(null)} className="btn-ghost">Cancel</button><button onClick={sendWarningToUser} className="btn-primary" style={{ width: "auto" }}>Send Warning</button></div></div></div>)}
      {banTarget && (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 95, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}><div className="card-surface" style={{ maxWidth: 420, width: "100%", padding: 20 }}><h3 style={{ fontSize: 16, fontWeight: 800, color: "#f87171", marginBottom: 8 }}>Suspend {banTarget.full_name}</h3><input value={banText} onChange={(e) => setBanText(e.target.value)} placeholder="Suspension reason..." className="input-dark" style={{ width: "100%", marginBottom: 12 }} /><div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><button onClick={() => setBanTarget(null)} className="btn-ghost">Cancel</button><button onClick={confirmBanUser} className="btn-primary" style={{ width: "auto", background: "#ef4444" }}>Confirm Ban</button></div></div></div>)}
    </div>
  );
}