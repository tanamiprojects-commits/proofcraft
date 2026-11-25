"use client";
import { useStudioLang } from "@/lib/i18n-engine";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ThumbsUp, Send, PlusCircle, Award, Sparkles, Megaphone, Eye,
  MousePointerClick, Newspaper, CheckCircle2, Image as ImageIcon,
  Video, BarChart3, ExternalLink, Zap, DollarSign, ShieldCheck
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getActiveUserProfile, TrackProjectEntry } from "@/lib/cloud-store";
import { sanitizeExternalUrl, sanitizePlainText } from "@/lib/security-utils";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";

interface CloudFeedPost {
  id: string;
  user_id: string | null;
  author_name: string;
  project_title: string;
  summary: string;
  tools: string;
  live_url: string;
  post_goal?: string;
  score: number;
  admin_verified: boolean;
  is_pinned: boolean;
  likes: number;
  views_count?: number;
  clicks_count?: number;
  status?: string;
  is_guest?: boolean;
  comments: { id: string; author_name: string; review_tag?: string; body: string; status?: string; is_guest?: boolean }[];
}

interface SelectableProject {
  key: string;
  label: string;
  title: string;
  summary: string;
  tools: string;
  url: string;
}

const POST_GOALS = [
  "Community Architecture Review",
  "Organic Showcase for B2B Clients",
  "Seeking Collaborators & Early Users",
];

const REVIEW_TAGS = [
  "Architecture Praise",
  "UX / Conversion Tip",
  "Security & Performance",
  "Partnership Inquiry",
];

const QUICK_COMMENT_TEMPLATES = [
  "Clean structure and sharp value proposition — easy to understand immediately.",
  "Great stack selection and fast execution. Impressive live deployment!",
  "UX tip: Consider adding a high-contrast primary CTA above the fold.",
  "Solid engineering proof. Would love to explore a collaboration on a similar build.",
];

function extractMediaFromTools(toolsStr: string): { cleanTools: string; mediaType: "image" | "video" | null; mediaUrl: string } {
  const parts = (toolsStr || "").split("|").map((s) => s.trim());
  let mediaType: "image" | "video" | null = null;
  let mediaUrl = "";
  const kept: string[] = [];
  for (const p of parts) {
    if (p.startsWith("MEDIA_IMG:")) {
      mediaType = "image";
      mediaUrl = p.replace("MEDIA_IMG:", "").trim();
    } else if (p.startsWith("MEDIA_VID:")) {
      mediaType = "video";
      mediaUrl = p.replace("MEDIA_VID:", "").trim();
    } else if (p) {
      kept.push(p);
    }
  }
  return { cleanTools: kept.join(" · ") || "ProofCraft Verified Stack", mediaType, mediaUrl };
}

export default function FeedbackWallPage() {
  const { isHe, dir, t } = useStudioLang();
  const [posts, setPosts] = useState<CloudFeedPost[]>([]);
  const [filter, setFilter] = useState<"all" | "mine" | "verified">("all");
  const [selectedTags, setSelectedTags] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [guestCommentName, setGuestCommentName] = useState<string>("");

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [peerKarma, setPeerKarma] = useState<number>(0);
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [userProjects, setUserProjects] = useState<SelectableProject[]>([]);

  const [composeOpen, setComposeOpen] = useState<boolean>(false);
  const [selectedProjKey, setSelectedProjKey] = useState<string>("custom");
  const [guestAuthorName, setGuestAuthorName] = useState<string>("");
  const [newGoal, setNewGoal] = useState<string>(POST_GOALS[0]);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newSummary, setNewSummary] = useState<string>("");
  const [newTools, setNewTools] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");
  const [mediaKind, setMediaKind] = useState<"none" | "image" | "video">("none");
  const [mediaHttpsUrl, setMediaHttpsUrl] = useState<string>("");

  const [promoTarget, setPromoTarget] = useState<CloudFeedPost | null>(null);
  const [promoBudget, setPromoBudget] = useState<string>("$49 · 7-Day Featured Pin");
  const [promoNotes, setPromoNotes] = useState<string>("");
  const [toast, setToast] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const showMsg = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3800); };

  const loadFeed = async () => {
    const uRes = await getActiveUserProfile();
    setUserId(uRes.userId);
    setUserEmail(uRes.email || "");
    setUserName(uRes.profile.fullName || uRes.email?.split("@")[0] || "");
    setIsAdminVerified(uRes.profile.adminVerified);
    setUserScore(Math.min(100, (uRes.profile.completedStepIds?.length || 0) * 12));

    const discovered: SelectableProject[] = [];
    if (uRes.profile.projectTitle) {
      discovered.push({
        key: "primary",
        label: `Primary Portfolio Build: ${uRes.profile.projectTitle}`,
        title: uRes.profile.projectTitle,
        summary: uRes.profile.projectProblemSolved || uRes.profile.portfolioPitch || "Production system built and verified in ProofCraft Studio.",
        tools: uRes.profile.primaryTools || "Next.js · TypeScript · Supabase",
        url: uRes.profile.projectLiveUrl || "",
      });
    }
    if (uRes.trackProjects) {
      Object.entries(uRes.trackProjects).forEach(([lvl, entry]: [string, TrackProjectEntry]) => {
        if (entry?.title) {
          discovered.push({
            key: `track_${lvl}`,
            label: `Track ${lvl} Verified Deliverable: ${entry.title}`,
            title: entry.title,
            summary: entry.summary || `Verified Track ${lvl} production deployment on ProofCraft.`,
            tools: uRes.profile.primaryTools || `ProofCraft Track ${lvl} Stack`,
            url: entry.url || "",
          });
        }
      });
    }
    setUserProjects(discovered);
    if (discovered.length > 0 && !newTitle) {
      const first = discovered[0];
      setSelectedProjKey(first.key);
      setNewTitle(first.title);
      setNewSummary(first.summary);
      setNewTools(first.tools);
      setNewUrl(first.url);
    }

    if (uRes.userId) {
      const { data: prof } = await supabase.from("profiles").select("peer_karma").eq("id", uRes.userId).single();
      setPeerKarma(prof?.peer_karma || 0);
    }

    const [pRes, cRes] = await Promise.all([
      supabase.from("feed_posts").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("feed_comments").select("*").order("created_at", { ascending: true }),
    ]);

    const approvedComments = (cRes.data || []).filter((c) => !c.status || c.status === "approved");
    const visiblePosts: CloudFeedPost[] = (pRes.data || [])
      .filter((p) => !p.status || p.status === "approved" || (uRes.userId && p.user_id === uRes.userId))
      .map((p) => ({
        ...p,
        comments: approvedComments.filter((c) => c.post_id === p.id),
      }));

    setPosts(visiblePosts);
    setLoading(false);
  };

  useEffect(() => { loadFeed(); }, []);

  const handleSelectVerifiedProject = (key: string) => {
    setSelectedProjKey(key);
    if (key === "custom") {
      setNewTitle(""); setNewSummary(""); setNewTools(""); setNewUrl("");
      return;
    }
    const found = userProjects.find((p) => p.key === key);
    if (found) {
      setNewTitle(found.title);
      setNewSummary(found.summary);
      setNewTools(found.tools);
      setNewUrl(found.url);
      showMsg(`Auto-filled verified details for "${found.title}"`);
    }
  };

  const trackMetric = async (postId: string, metric: "views" | "clicks") => {
    setPosts((prev) => prev.map((p) => p.id === postId ? {
      ...p,
      views_count: metric === "views" ? (p.views_count || 0) + 1 : p.views_count,
      clicks_count: metric === "clicks" ? (p.clicks_count || 0) + 1 : p.clicks_count,
    } : p));
    await supabase.rpc("increment_post_metric", { p_id: postId, metric_name: metric });
  };

  const handlePublishPost = async () => {
    const cleanTitle = sanitizePlainText(newTitle, 120);
    const cleanSummary = sanitizePlainText(newSummary, 500);
    const cleanToolsBase = sanitizePlainText(newTools, 120) || "Certified ProofCraft Stack";
    if (!cleanTitle || !cleanSummary) return showMsg("Please provide a project title and concise summary.");

    let validatedUrl = "";
    if (newUrl.trim()) {
      const urlCheck = sanitizeExternalUrl(newUrl);
      if (!urlCheck.valid) return showMsg(urlCheck.error || "Live URL must be a valid https:// link.");
      validatedUrl = urlCheck.cleanUrl;
    }

    let mediaToken = "";
    if (mediaKind !== "none" && mediaHttpsUrl.trim()) {
      const mediaCheck = sanitizeExternalUrl(mediaHttpsUrl);
      if (!mediaCheck.valid) return showMsg("Media asset must use a verified https:// URL.");
      mediaToken = mediaKind === "image" ? ` | MEDIA_IMG:${mediaCheck.cleanUrl}` : ` | MEDIA_VID:${mediaCheck.cleanUrl}`;
    }

    const packedTools = `${cleanToolsBase}${mediaToken}`;
    if (!userId) {
      const lastGuestTs = Number(localStorage.getItem("pc_guest_post_ts") || "0");
      if (Date.now() - lastGuestTs < 60000) return showMsg("Rate limit: please wait 60 seconds between guest submissions.");
      const gName = sanitizePlainText(guestAuthorName, 60);
      if (!gName) return showMsg("Please enter your full name as a guest builder.");

      await supabase.from("feed_posts").insert({
        user_id: null,
        author_name: `${gName} (Guest)`,
        project_title: cleanTitle,
        summary: cleanSummary,
        tools: packedTools,
        live_url: validatedUrl,
        post_goal: newGoal,
        score: 0,
        admin_verified: false,
        status: "pending_admin",
        is_guest: true,
        likes: 0,
      });

      localStorage.setItem("pc_guest_post_ts", String(Date.now()));
      setComposeOpen(false);
      showMsg("Submitted to Admin Moderation Queue! It will go live immediately upon approval.");
      return;
    }

    await supabase.from("feed_posts").upsert({
      user_id: userId,
      author_name: sanitizePlainText(userName || "ProofCraft Builder", 80),
      project_title: cleanTitle,
      summary: cleanSummary,
      tools: packedTools,
      live_url: validatedUrl,
      post_goal: newGoal,
      score: userScore,
      admin_verified: isAdminVerified,
      status: isAdminVerified ? "approved" : "pending_admin",
      is_guest: false,
      likes: 1,
    }, { onConflict: "user_id" });

    const nextKarma = peerKarma + 10;
    setPeerKarma(nextKarma);
    await supabase.from("profiles").update({ peer_karma: nextKarma }).eq("id", userId);

    setComposeOpen(false);
    showMsg(isAdminVerified ? "Published live +10 Community Karma!" : "Submitted for free Admin Review (+10 Karma)!");
    loadFeed();
  };

  const handleRequestPromotionQuote = async () => {
    if (!promoTarget) return;
    const cleanNotes = sanitizePlainText(promoNotes, 400) || "Requesting commercial pinned placement and featured distribution.";
    await supabase.from("support_tickets").insert({
      user_id: userId,
      sender_name: sanitizePlainText(userName || promoTarget.author_name || "Builder", 80),
      sender_email: userEmail || "builder@proofcraft.app",
      category: "COMMERCIAL_PROMO_QUOTE",
      message: `[COMMERCIAL PROMOTION QUOTE] Post ID: ${promoTarget.id} | Project: "${promoTarget.project_title}" | Package: ${promoBudget} | Notes: ${cleanNotes}`,
      status: "open",
    });
    setPromoTarget(null);
    setPromoNotes("");
    showMsg("Commercial promotion quote request sent to Admin Command Center!");
  };

  const handleLike = async (post: CloudFeedPost) => {
    const nextLikes = post.likes + 1;
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, likes: nextLikes } : p)));
    await supabase.from("feed_posts").update({ likes: nextLikes }).eq("id", post.id);
  };

  const handleAddComment = async (postId: string) => {
    const raw = inputs[postId] || "";
    const cleanBody = sanitizePlainText(raw, 360);
    if (!cleanBody) return showMsg("Please enter a constructive comment or pick a quick template.");
    const tag = selectedTags[postId] || REVIEW_TAGS[0];

    if (!userId) {
      const gName = sanitizePlainText(guestCommentName, 50);
      if (!gName) return showMsg("Please enter your name above to comment as a guest.");
      await supabase.from("feed_comments").insert({
        post_id: postId,
        user_id: null,
        author_name: `${gName} (Guest)`,
        review_tag: tag,
        body: cleanBody,
        status: "pending_admin",
        is_guest: true,
      });
      setInputs((prev) => ({ ...prev, [postId]: "" }));
      showMsg("Guest review submitted for quick admin approval.");
      return;
    }

    await supabase.from("feed_comments").insert({
      post_id: postId,
      user_id: userId,
      author_name: sanitizePlainText(userName || "Builder", 70),
      review_tag: tag,
      body: cleanBody,
      status: "approved",
      is_guest: false,
    });
    setInputs((prev) => ({ ...prev, [postId]: "" }));
    showMsg("Review posted!");
    loadFeed();
  };
  const visibleList = posts.filter((p) => {
    if (filter === "mine") return userId && p.user_id === userId;
    if (filter === "verified") return p.admin_verified;
    return true;
  });

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      <StudioVisualArtwork variant="feed" />

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 90, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
          {toast}
        </div>
      )}

      <section className="card-hero" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span className="badge-pill" style={{ background: "rgba(56,189,248,0.14)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)", fontSize: 11, marginBottom: 8 }}>
              <Sparkles size={13} /> ZERO-TYPING SMART PUBLISHER & GA TELEMETRY WALL
            </span>
                  <div className="card-surface" style={{ padding: 14, marginBottom: 16, border: "1px solid rgba(52,211,153,0.35)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 10.5, marginBottom: 4 }}>
            {t("ORGANIC TRAFFIC & GIVE-TO-GET ENGINE", "מנוע תנועה אורגנית וכלכלת קרמה")}
          </span>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#f8fafc" }}>
            {t("Verified Deals & Organic Affiliate Spotlight", "חלון הראווה לדילים מאומתים ושיווק אורגני")}
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            {t("Publish approved smart links directly from your Affiliate Hub or verify community deals to earn +5 Boost Credits.", "פרסם קישורים מאושרים ישירות מתיק הקישורים שלך או אמת דילים של חברי קהילה לקבלת +5 נקודות חשיפה.")}
          </p>
        </div>
        <a href="/affiliate" className="btn-primary" style={{ width: "auto", height: 36, padding: "0 14px", fontSize: 12, background: "#34d399", color: "#0a0b0e" }}>
          {t("Manage & Publish Smart Links", "נהל ופרסם קישורים שיתופיים")}
        </a>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc" }}>{t("Verified Builder Proof Feed", "פיד הוכחות חיות של קהילת הבונים")}</h1>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>
              Publish your verified ProofCraft deliverables in one click, track real-time GA engagement metrics, or request commercial promotion.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setComposeOpen((v) => !v)} className="btn-primary" style={{ width: "auto", padding: "0 18px" }}>
              <PlusCircle size={15} /> {composeOpen ? "Close Publisher" : "Publish Verified Build"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
          {(["all", "verified", "mine"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={filter === tab ? "btn-primary" : "btn-ghost"}
              style={{ width: "auto", padding: "6px 14px", fontSize: 12 }}
            >
              {tab === "all" ? `All Builds (${posts.length})` : tab === "verified" ? "Admin Verified" : "My Submissions"}
            </button>
          ))}
          {userId && (
            <span className="badge-pill" style={{ marginLeft: "auto", background: "rgba(251,191,36,0.14)", color: "#fbbf24", fontSize: 11 }}>
              <Award size={13} /> Community Karma: {peerKarma} pts
            </span>
          )}
        </div>
      </section>

      {composeOpen && (
        <section className="card-surface" style={{ padding: 20, marginBottom: 22, border: "1px solid rgba(56,189,248,0.35)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>Zero-Typing Smart Publisher</h2>
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>
            Select one of your verified portfolio projects below to auto-populate every field, or enter a custom HTTPS deployment. Free admin review included.
          </p>

          {userProjects.length > 0 && (
            <div style={{ marginBottom: 14, padding: 12, borderRadius: 12, background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.25)" }}>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#34d399", marginBottom: 6 }}>
                1-Click Auto-Fill From Your Verified Portfolio Projects:
              </label>
              <select
                value={selectedProjKey}
                onChange={(e) => handleSelectVerifiedProject(e.target.value)}
                className="input-dark"
                style={{ width: "100%" }}
              >
                {userProjects.map((proj) => (
                  <option key={proj.key} value={proj.key}>{proj.label}</option>
                ))}
                <option value="custom">+ Enter Custom Project Manually</option>
              </select>
            </div>
          )}

          {!userId && (
            <div style={{ marginBottom: 10 }}>
              <input value={guestAuthorName} onChange={(e) => setGuestAuthorName(e.target.value)} placeholder="Your Full Name (Guest Builder)" className="input-dark" style={{ width: "100%" }} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 10 }}>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Project Title (e.g., AI Lead Engine v1.0)" className="input-dark" />
            <select value={newGoal} onChange={(e) => setNewGoal(e.target.value)} className="input-dark">
              {POST_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <textarea value={newSummary} onChange={(e) => setNewSummary(e.target.value)} rows={3} placeholder="Concise architectural & business value summary..." className="input-dark" style={{ width: "100%", marginBottom: 10 }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
            <input value={newTools} onChange={(e) => setNewTools(e.target.value)} placeholder="Verified Stack (e.g., Next.js, Supabase, Stripe)" className="input-dark" />
            <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Live HTTPS URL (https://...)" className="input-dark" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 10, marginBottom: 14 }}>
            <select value={mediaKind} onChange={(e) => setMediaKind(e.target.value as "none" | "image" | "video")} className="input-dark">
              <option value="none">No Visual Media</option>
              <option value="image">Verified HTTPS Image</option>
              <option value="video">Verified HTTPS Video</option>
            </select>
            <input
              disabled={mediaKind === "none"}
              value={mediaHttpsUrl}
              onChange={(e) => setMediaHttpsUrl(e.target.value)}
              placeholder={mediaKind === "none" ? "Select Image or Video to attach HTTPS media..." : "Paste verified https:// image or video URL"}
              className="input-dark"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              Standard community listing is <strong style={{ color: "#34d399" }}>100% Free</strong> after admin verification.
            </span>
            <button onClick={handlePublishPost} className="btn-primary" style={{ width: "auto", padding: "0 22px" }}>
              <Send size={14} /> Submit Build to Feed
            </button>
          </div>
        </section>
      )}
      {loading ? (
        <div className="card-surface" style={{ padding: 28, textAlign: "center", color: "#94a3b8" }}>Loading Verified Builder Feed...</div>
      ) : visibleList.length === 0 ? (
        <div className="card-surface" style={{ padding: 28, textAlign: "center", color: "#94a3b8" }}>No builds found for this filter yet. Be the first to publish!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {visibleList.map((post) => {
            const { cleanTools, mediaType, mediaUrl } = extractMediaFromTools(post.tools);
            const views = Math.max(1, post.views_count || 0);
            const impressions = views * 3 + (post.likes || 0) * 4;
            const clicks = post.clicks_count || 0;
            const ctr = ((clicks / Math.max(1, impressions)) * 100).toFixed(1);
            const leads = post.comments.length;

            return (
              <article key={post.id} className="card-surface" style={{ padding: 20, border: post.is_pinned ? "1px solid rgba(251,191,36,0.45)" : undefined }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <strong style={{ fontSize: 15, color: "#f8fafc" }}>{post.author_name}</strong>
                      {post.admin_verified && (
                        <span className="badge-pill" style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 10.5 }}>
                          <ShieldCheck size={12} /> Verified Builder
                        </span>
                      )}
                      {post.is_pinned && (
                        <span className="badge-pill" style={{ background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontSize: 10.5 }}>
                          Featured Campaign
                        </span>
                      )}
                      {post.status === "pending_admin" && (
                        <span className="badge-pill" style={{ background: "rgba(248,113,113,0.16)", color: "#f87171", fontSize: 10.5 }}>
                          Pending Admin Verification
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 900, color: "#38bdf8" }}>{post.project_title}</h2>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => setPromoTarget(post)} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 11.5, borderColor: "rgba(251,191,36,0.35)", color: "#fbbf24" }}>
                      <Megaphone size={13} /> Request Promo Quote
                    </button>
                    {post.live_url && (
                      <a href={post.live_url} target="_blank" rel="noopener noreferrer" onClick={() => trackMetric(post.id, "clicks")} className="btn-primary" style={{ width: "auto", padding: "6px 14px", fontSize: 12 }}>
                        <ExternalLink size={13} /> Inspect Live App
                      </a>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.65, marginBottom: 12 }}>{post.summary}</p>

                {mediaType === "image" && mediaUrl && (
                  <div style={{ marginBottom: 12, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <img src={mediaUrl} alt={post.project_title} style={{ width: "100%", maxHeight: 340, objectFit: "cover", display: "block" }} />
                  </div>
                )}

                {mediaType === "video" && mediaUrl && (
                  <div style={{ marginBottom: 12, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <video src={mediaUrl} controls style={{ width: "100%", maxHeight: 340, display: "block", background: "#000" }} />
                  </div>
                )}

                <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 12 }}>
                  <strong style={{ color: "#e2e8f0" }}>Verified Stack:</strong> {cleanTools}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 8, padding: 10, borderRadius: 12, background: "#090d14", border: "1px solid rgba(56,189,248,0.18)", marginBottom: 14 }}>
                  <div><div style={{ fontSize: 10, color: "#64748b" }}>IMPRESSIONS</div><div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc" }}>{impressions}</div></div>
                  <div><div style={{ fontSize: 10, color: "#64748b" }}>VIEWS</div><div style={{ fontSize: 13, fontWeight: 800, color: "#38bdf8" }}>{views}</div></div>
                  <div><div style={{ fontSize: 10, color: "#64748b" }}>CLICKS</div><div style={{ fontSize: 13, fontWeight: 800, color: "#34d399" }}>{clicks}</div></div>
                  <div><div style={{ fontSize: 10, color: "#64748b" }}>GA CTR %</div><div style={{ fontSize: 13, fontWeight: 800, color: "#fbbf24" }}>{ctr}%</div></div>
                  <div><div style={{ fontSize: 10, color: "#64748b" }}>LEADS</div><div style={{ fontSize: 13, fontWeight: 800, color: "#c084fc" }}>{leads}</div></div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <button onClick={() => handleLike(post)} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>
                    <ThumbsUp size={13} /> Endorse ({post.likes})
                  </button>
                  <button onClick={() => trackMetric(post.id, "views")} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>
                    <Eye size={13} /> Record Deep Inspection
                  </button>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {QUICK_COMMENT_TEMPLATES.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInputs((prev) => ({ ...prev, [post.id]: tpl }))}
                        style={{ fontSize: 11, padding: "4px 9px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", cursor: "pointer" }}
                      >
                        + {tpl.slice(0, 42)}...
                      </button>
                    ))}
                  </div>

                  {!userId && (
                    <input
                      value={guestCommentName}
                      onChange={(e) => setGuestCommentName(e.target.value)}
                      placeholder="Your Name (to post as Guest)"
                      className="input-dark"
                      style={{ width: "100%", marginBottom: 8, fontSize: 12 }}
                    />
                  )}

                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={inputs[post.id] || ""}
                      onChange={(e) => setInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Write constructive feedback or inquiry..."
                      className="input-dark"
                      style={{ flex: 1, fontSize: 12.5 }}
                    />
                    <button onClick={() => handleAddComment(post.id)} className="btn-primary" style={{ width: "auto", padding: "0 14px", fontSize: 12 }}>
                      <Send size={13} /> Post
                    </button>
                  </div>

                  {post.comments.length > 0 && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                      {post.comments.map((c) => (
                        <div key={c.id} style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", fontSize: 12 }}>
                          <strong style={{ color: "#e2e8f0" }}>{c.author_name}:</strong> <span style={{ color: "#cbd5e1" }}>{c.body}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {promoTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 95, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div className="card-surface" style={{ maxWidth: 460, width: "100%", padding: 22, border: "1px solid rgba(251,191,36,0.45)" }}>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: "#fbbf24", marginBottom: 6 }}>Request Commercial Promotion Quote</h3>
            <p style={{ fontSize: 12.5, color: "#cbd5e1", marginBottom: 12 }}>
              Standard feed publication is free. Upgrade <strong>"{promoTarget.project_title}"</strong> to pinned featured placement across ProofCraft Studio.
            </p>
            <select value={promoBudget} onChange={(e) => setPromoBudget(e.target.value)} className="input-dark" style={{ width: "100%", marginBottom: 10 }}>
              <option value="$49 · 7-Day Featured Pin">$49 · 7-Day Featured Pin + GA Boost</option>
              <option value="$99 · 14-Day Flagship Banner">$99 · 14-Day Flagship Banner + Newsletter</option>
              <option value="Custom Enterprise Sponsorship">Custom Enterprise Sponsorship Quote</option>
            </select>
            <textarea
              value={promoNotes}
              onChange={(e) => setPromoNotes(e.target.value)}
              rows={3}
              placeholder="Target audience, campaign dates, or billing details..."
              className="input-dark"
              style={{ width: "100%", marginBottom: 14 }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setPromoTarget(null)} className="btn-ghost" style={{ padding: "8px 14px" }}>Cancel</button>
              <button onClick={handleRequestPromotionQuote} className="btn-primary" style={{ width: "auto", padding: "8px 18px" }}>
                <DollarSign size={14} /> Send Quote Request to Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
