"use client";

import React, { useEffect, useState } from "react";
import {
  Shield, Users, AlertTriangle, Ban, CheckCircle2, Award, MessageSquare,
  DollarSign, Megaphone, FileText, Trash2, Pin, History, Send, Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FINTECH_LEGAL_DOCS, LegalDocumentItem } from "@/lib/legal-docs-data";
import AdminModerationQueue from "@/components/AdminModerationQueue";
import VerifiedProofsPanel from "@/components/VerifiedProofsPanel";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "guy@proofcraft.app";

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

interface AdminCommentRow {
  id: string;
  post_id: string;
  author_name: string;
  body: string;
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

export default function AdminCommandCenterPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"queue" | "users" | "support" | "feed" | "tracks" | "broadcast">("queue");

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [posts, setPosts] = useState<AdminPostRow[]>([]);
  const [comments, setComments] = useState<AdminCommentRow[]>([]);
  const [tickets, setTickets] = useState<SupportRow[]>([]);
  const [tracks, setTracks] = useState<TrackRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<{ id: string; action_title: string; target_info: string; created_at: string }[]>([]);

  const [broadcast, setBroadcast] = useState<{ active: boolean; text: string; tone: string }>({ active: false, text: "", tone: "info" });
  const [legalDocs, setLegalDocs] = useState<LegalDocumentItem[]>(FINTECH_LEGAL_DOCS);
  const [editingDocIdx, setEditingDocIdx] = useState<number>(0);

  const [warnTarget, setWarnTarget] = useState<AdminUserRow | null>(null);
  const [warnText, setWarnText] = useState("");
  const [banTarget, setBanTarget] = useState<AdminUserRow | null>(null);
  const [banText, setBanText] = useState("");
  const [replyTarget, setReplyTarget] = useState<SupportRow | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editPost, setEditPost] = useState<AdminPostRow | null>(null);
  const [toast, setToast] = useState("");
  const showMsg = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3400); };

  const logAdminAction = async (action_title: string, target_info: string) => {
    await supabase.from("admin_audit_logs").insert({ action_title, target_info });
    const { data } = await supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(20);
    if (data) setAuditLogs(data);
  };

  const loadAllAdminData = async () => {
    const { data: uData } = await supabase.auth.getUser();
    const email = uData.user?.email || "";
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);

    const [profRes, postRes, cmtRes, tktRes, trkRes, setRes, logRes] = await Promise.all([
      supabase.from("profiles").select("*").order("updated_at", { ascending: false }),
      supabase.from("feed_posts").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("feed_comments").select("*").order("created_at", { ascending: false }),
      supabase.from("support_tickets").select("*").order("created_at", { ascending: false }),
      supabase.from("career_tracks").select("*").order("level"),
      supabase.from("site_settings").select("*"),
      supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(20),
    ]);

    if (profRes.data) setUsers(profRes.data);
    if (postRes.data) setPosts(postRes.data);
    if (cmtRes.data) setComments(cmtRes.data);
    if (tktRes.data) setTickets(tktRes.data);
    if (trkRes.data && trkRes.data.length > 0) setTracks(trkRes.data);
    if (logRes.data) setAuditLogs(logRes.data);

    if (setRes.data) {
      const bRow = setRes.data.find((r) => r.key === "broadcast_banner");
      if (bRow?.value) setBroadcast(bRow.value);
      const lRow = setRes.data.find((r) => r.key === "legal_docs");
      if (Array.isArray(lRow?.value) && lRow.value.length > 0) setLegalDocs(lRow.value);
    }
  };

  useEffect(() => { loadAllAdminData(); }, []);

  const toggleVerifyUser = async (u: AdminUserRow) => {
    const next = !u.admin_verified;
    await supabase.from("profiles").update({ admin_verified: next }).eq("id", u.id);
    await supabase.from("feed_posts").update({ admin_verified: next }).eq("user_id", u.id);
    await logAdminAction(next ? "Verified Builder Credential" : "Revoked Builder Verification", u.full_name || u.id);
    showMsg(next ? `Verified ${u.full_name} as Certified Builder!` : "Verification badge removed.");
    loadAllAdminData();
  };

  const updateUserTrackLevel = async (u: AdminUserRow, newLevel: number) => {
    await supabase.from("profiles").update({ purchased_track_level: newLevel, current_track_level: newLevel }).eq("id", u.id);
    await logAdminAction(`Updated Track Tier to Level ${newLevel}`, u.full_name || u.id);
    showMsg(`Updated ${u.full_name} to Track Level ${newLevel}.`);
    loadAllAdminData();
  };

  const sendWarningToUser = async () => {
    if (!warnTarget || !warnText.trim()) return;
    await supabase.from("profiles").update({ warning_message: warnText.trim() }).eq("id", warnTarget.id);
    await logAdminAction("Sent Official Policy Warning", `${warnTarget.full_name}: ${warnText.trim()}`);
    showMsg(`Official warning issued to ${warnTarget.full_name}.`);
    setWarnTarget(null); setWarnText("");
    loadAllAdminData();
  };

  const confirmBanUser = async () => {
    if (!banTarget) return;
    const reason = banText.trim() || "Violation of ProofCraft Studio Terms & Security Policy";
    await supabase.from("profiles").update({ is_banned: true, ban_reason: reason }).eq("id", banTarget.id);
    await logAdminAction("Banned User Account (RLS)", `${banTarget.full_name} (${reason})`);
    showMsg(`Account ${banTarget.full_name} has been suspended.`);
    setBanTarget(null); setBanText("");
    loadAllAdminData();
  };

  const unbanUser = async (u: AdminUserRow) => {
    await supabase.from("profiles").update({ is_banned: false, ban_reason: "" }).eq("id", u.id);
    await logAdminAction("Lifted User Suspension", u.full_name || u.id);
    showMsg(`Suspension lifted for ${u.full_name}.`);
    loadAllAdminData();
  };

  const approveCommercialCampaign = async (t: SupportRow) => {
    const match = t.message.match(/Post ID:\s*([a-zA-Z0-9-]+)/);
    const postId = match ? match : null;
    if (postId) {
      await supabase.from("feed_posts").update({ is_pinned: true, status: "approved", admin_verified: true }).eq("id", postId);
    }
    await supabase.from("support_tickets").update({
      admin_reply: "Commercial promotion quote approved! Your campaign post is now verified and pinned at the top of the Builder Proof Feed.",
      status: "resolved",
    }).eq("id", t.id);
    await logAdminAction("Approved & Pinned Commercial Campaign", `${t.sender_name} (${postId || "Ticket " + t.id})`);
    showMsg("Commercial campaign approved & pinned to top of Feed!");
    loadAllAdminData();
  };

  const sendSupportReply = async () => {
    if (!replyTarget || !replyText.trim()) return;
    await supabase.from("support_tickets").update({ admin_reply: replyText.trim(), status: "resolved" }).eq("id", replyTarget.id);
    await logAdminAction("Replied to Support Ticket", `${replyTarget.sender_name}: ${replyText.trim()}`);
    showMsg("Reply sent and synced to user studio!");
    setReplyTarget(null); setReplyText("");
    loadAllAdminData();
  };

  const togglePinPost = async (p: AdminPostRow) => {
    await supabase.from("feed_posts").update({ is_pinned: !p.is_pinned, status: "approved" }).eq("id", p.id);
    await logAdminAction(!p.is_pinned ? "Pinned Feed Post" : "Unpinned Feed Post", p.project_title);
    loadAllAdminData();
  };

  const deletePost = async (id: string, title: string) => {
    await supabase.from("feed_posts").delete().eq("id", id);
    await logAdminAction("Deleted Feed Post", title);
    showMsg("Post deleted.");
    loadAllAdminData();
  };

  const saveTrackRow = async (tr: TrackRow) => {
    await supabase.from("career_tracks").update({ name: tr.name, subtitle: tr.subtitle, price_ils: Number(tr.price_ils) }).eq("level", tr.level);
    await logAdminAction(`Updated Track ${tr.level} Pricing`, `${tr.name} ($${tr.price_ils})`);
    showMsg(`Saved Track ${tr.level} settings!`);
  };

  const saveBroadcastSettings = async () => {
    await supabase.from("site_settings").upsert({ key: "broadcast_banner", value: broadcast, updated_at: new Date().toISOString() });
    await logAdminAction("Updated Live Broadcast Banner", broadcast.active ? broadcast.text : "Disabled");
    showMsg("Live broadcast banner updated across all active sessions!");
  };
  if (authorized === null) return <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>Verifying Admin Authorization...</div>;

  if (!authorized) {
    return (
      <div dir="ltr" className="card-surface" style={{ maxWidth: 460, margin: "40px auto", padding: 26, textAlign: "center", border: "1px solid rgba(248,113,113,0.4)" }}>
        <h1 style={{ fontSize: 18, fontWeight: 900, color: "#f87171", marginBottom: 6 }}>Restricted Admin Command Center</h1>
        <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>
          Sign in with the designated administrator account (<strong>{ADMIN_EMAIL}</strong>) to access platform controls.
        </p>
      </div>
    );
  }

  const openTicketsCount = tickets.filter((t) => t.status === "open").length;
  const promoQuotesCount = tickets.filter((t) => t.status === "open" && t.category === "COMMERCIAL_PROMO_QUOTE").length;

  return (
    <div dir="ltr" style={{ textAlign: "left" }}>
      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 95, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
          {toast}
        </div>
      )}

      <div className="card-hero" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc", display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={20} color="#fbbf24" /> Admin Command & Enforcement Center
            </h1>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>Zero-code mobile & desktop governance · Real-time Supabase RLS sync</p>
          </div>
          <span className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.15)", color: "#34d399", fontSize: 11 }}>
            Active Admin: {ADMIN_EMAIL}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Total Builders</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc" }}>{users.length}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Open Tickets</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#38bdf8" }}>{openTicketsCount}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(251,191,36,0.28)" }}>
            <div style={{ fontSize: 11, color: "#fbbf24" }}>Promo Quote Requests</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24" }}>{promoQuotesCount}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Feed Posts</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#34d399" }}>{posts.length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {([
          ["queue", "Moderation & Proofs"],
          ["support", `Support & Promo Quotes (${openTicketsCount})`],
          ["users", "Builders & Enforcement"],
          ["feed", "Feed Management"],
          ["tracks", "Tracks & Pricing"],
          ["broadcast", "Broadcast & Audit Log"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={activeTab === key ? "btn-primary" : "btn-ghost"}
            style={{ width: "auto", padding: "7px 14px", fontSize: 12 }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "queue" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AdminModerationQueue />
          <VerifiedProofsPanel isAdminView />
        </div>
      )}
      {activeTab === "support" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tickets.length === 0 ? (
            <div className="card-surface" style={{ padding: 20, color: "#94a3b8" }}>No support tickets or promotion quote requests yet.</div>
          ) : tickets.map((t) => {
            const isPromo = t.category === "COMMERCIAL_PROMO_QUOTE";
            return (
              <div key={t.id} className="card-surface" style={{ padding: 16, border: isPromo ? "1px solid rgba(251,191,36,0.4)" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong style={{ color: "#f8fafc", fontSize: 14 }}>{t.sender_name}</strong>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>({t.sender_email})</span>
                    <span className="badge-pill" style={{ fontSize: 10.5, background: isPromo ? "rgba(251,191,36,0.16)" : "rgba(56,189,248,0.14)", color: isPromo ? "#fbbf24" : "#38bdf8" }}>
                      {isPromo ? "COMMERCIAL PROMO QUOTE" : t.category}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: t.status === "open" ? "#fbbf24" : "#34d399", fontWeight: 700 }}>{t.status.toUpperCase()}</span>
                </div>
                <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.55, marginBottom: 10 }}>{t.message}</p>
                {t.admin_reply && (
                  <div style={{ padding: 10, borderRadius: 10, background: "rgba(52,211,153,0.08)", fontSize: 12, color: "#34d399", marginBottom: 10 }}>
                    <strong>Admin Reply:</strong> {t.admin_reply}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {isPromo && t.status === "open" && (
                    <button onClick={() => approveCommercialCampaign(t)} className="btn-primary" style={{ width: "auto", padding: "6px 14px", fontSize: 12 }}>
                      <Sparkles size={13} /> Approve & Pin Commercial Campaign
                    </button>
                  )}
                  <button onClick={() => { setReplyTarget(t); setReplyText(t.admin_reply || ""); }} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>
                    <Send size={13} /> Send Custom Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {users.map((u) => (
            <div key={u.id} className="card-surface" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <strong style={{ color: "#f8fafc", fontSize: 14 }}>{u.full_name || u.id}</strong>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Tier Level {u.purchased_track_level || 1} · {u.admin_verified ? "Verified" : "Unverified"} {u.is_banned ? "· BANNED" : ""}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => toggleVerifyUser(u)} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5 }}>{u.admin_verified ? "Revoke Verify" : "Verify Builder"}</button>
                {[1, 2, 3, 4].map((lvl) => (
                  <button key={lvl} onClick={() => updateUserTrackLevel(u, lvl)} className="btn-ghost" style={{ padding: "5px 9px", fontSize: 11 }}>T{lvl}</button>
                ))}
                <button onClick={() => { setWarnTarget(u); setWarnText(u.warning_message || ""); }} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5, color: "#fbbf24" }}>Warn</button>
                {u.is_banned ? (
                  <button onClick={() => unbanUser(u)} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5, color: "#34d399" }}>Unban</button>
                ) : (
                  <button onClick={() => setBanTarget(u)} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 11.5, color: "#f87171" }}>Ban</button>
                )}
              </div>
            </div>
          ))}
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
            <div key={tr.level} className="card-surface" style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr 110px auto", gap: 10, alignItems: "center" }}>
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
          <div className="card-surface" style={{ padding: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", marginBottom: 10 }}>Global Live Broadcast Banner</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <input type="checkbox" checked={broadcast.active} onChange={(e) => setBroadcast({ ...broadcast, active: e.target.checked })} />
              <span style={{ fontSize: 13, color: "#cbd5e1" }}>Show banner across all active sessions</span>
            </div>
            <input value={broadcast.text} onChange={(e) => setBroadcast({ ...broadcast, text: e.target.value })} placeholder="Announcement message..." className="input-dark" style={{ width: "100%", marginBottom: 10 }} />
            <button onClick={saveBroadcastSettings} className="btn-primary" style={{ width: "auto", padding: "8px 18px" }}>Publish Broadcast</button>
          </div>

          <div className="card-surface" style={{ padding: 18 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", marginBottom: 10 }}>Admin Audit Log</h2>
            {auditLogs.map((log) => (
              <div key={log.id} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "#cbd5e1" }}>
                <strong>{log.action_title}</strong> — {log.target_info}
              </div>
            ))}
          </div>
        </div>
      )}

      {replyTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 95, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div className="card-surface" style={{ maxWidth: 440, width: "100%", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>Reply to {replyTarget.sender_name}</h3>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} className="input-dark" style={{ width: "100%", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setReplyTarget(null)} className="btn-ghost">Cancel</button>
              <button onClick={sendSupportReply} className="btn-primary" style={{ width: "auto" }}>Send Reply</button>
            </div>
          </div>
        </div>
      )}

      {warnTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 95, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div className="card-surface" style={{ maxWidth: 420, width: "100%", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fbbf24", marginBottom: 8 }}>Issue Warning to {warnTarget.full_name}</h3>
            <input value={warnText} onChange={(e) => setWarnText(e.target.value)} className="input-dark" style={{ width: "100%", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setWarnTarget(null)} className="btn-ghost">Cancel</button>
              <button onClick={sendWarningToUser} className="btn-primary" style={{ width: "auto" }}>Send Warning</button>
            </div>
          </div>
        </div>
      )}

      {banTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 95, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div className="card-surface" style={{ maxWidth: 420, width: "100%", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f87171", marginBottom: 8 }}>Suspend {banTarget.full_name}</h3>
            <input value={banText} onChange={(e) => setBanText(e.target.value)} placeholder="Suspension reason..." className="input-dark" style={{ width: "100%", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setBanTarget(null)} className="btn-ghost">Cancel</button>
              <button onClick={confirmBanUser} className="btn-primary" style={{ width: "auto", background: "#ef4444" }}>Confirm Ban</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
