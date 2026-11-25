"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ShieldCheck, ExternalLink, Sparkles, Plus, ThumbsUp, Layers, Tag, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { sanitizePlainText } from "@/lib/security-utils";

interface FeedPostRow {
  id: string;
  author_name: string;
  track_level: number;
  project_title: string;
  live_url: string;
  summary: string;
  post_type?: string;
  lang_code?: string;
  price_badge?: string;
  boost_credits?: number;
  created_at: string;
}

export default function ExpandedMarketingFeedPage() {
  const { isHe, dir, t } = useStudioLang();
  const [posts, setPosts] = useState<FeedPostRow[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [postType, setPostType] = useState<"build_proof" | "verified_deal" | "deal_bundle">("verified_deal");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [priceBadge, setPriceBadge] = useState("");
  const [summary, setSummary] = useState("");
  const [toast, setToast] = useState("");

  const notify = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3200); };

  const loadPosts = async () => {
    const { data } = await supabase.from("feed_posts").select("*").eq("is_approved", true).order("boost_credits", { ascending: false }).order("created_at", { ascending: false }).limit(50);
    if (data) setPosts(data as FeedPostRow[]);
  };

  useEffect(() => {
    loadPosts();
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      if (!u) return;
      setUserId(u.id);
      const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", u.id).single();
      setUserName(prof?.full_name || (u.email ? u.email.split("@") : "Builder"));
    });
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return notify(t("Sign in to publish to the marketing & proof wall.", "התחבר כדי לפרסם לקיר השיווק והפידבק."));
    if (!url.trim().startsWith("https://")) return notify(t("Only HTTPS URLs are permitted.", "מותרות רק כתובות HTTPS מאובטחות."));
    await supabase.from("feed_posts").insert({
      author_name: userName, track_level: 2, project_title: sanitizePlainText(title, 110),
      live_url: url.trim(), summary: sanitizePlainText(summary, 280), post_type: postType,
      lang_code: isHe ? "he" : "en", price_badge: sanitizePlainText(priceBadge, 40), boost_credits: 5, is_approved: true,
    });
    setTitle(""); setUrl(""); setPriceBadge(""); setSummary(""); setComposerOpen(false);
    await loadPosts();
    notify(t("Published to the Organic Marketing & Proof Wall!", "הפרסום עלה לקיר השיווק והפידבק האורגני!"));
  };

  const handleBoostVote = async (post: FeedPostRow) => {
    await supabase.from("feed_posts").update({ boost_credits: (post.boost_credits || 0) + 2 }).eq("id", post.id);
    await loadPosts();
    notify(t("Community verification recorded (+2 Boost Score)!", "האימות הקהילתי נרשם (+2 נקודות חשיפה)!"));
  };
  const langFiltered = posts.filter((p) => !p.lang_code || p.lang_code === (isHe ? "he" : "en"));
  const displayedPosts = (langFiltered.length > 0 ? langFiltered : posts).filter((p) => filterType === "all" || (p.post_type || "build_proof") === filterType);

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      {toast && <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 95, background: "#0f172a", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>{toast}</div>}

      <div className="card-hero" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 11 }}>
            <Flame size={13} /> {t("ORGANIC MARKETING & PROOF-OF-EXECUTION WALL", "קיר השיווק האורגני והוכחות הביצוע")}
          </span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/affiliate" className="btn-ghost" style={{ height: 36, fontSize: 12, color: "#38bdf8" }}>{t("Manage Smart Links", "ניהול קישורים חכמים")}</Link>
            <button type="button" onClick={() => setComposerOpen(!composerOpen)} className="btn-primary" style={{ width: "auto", height: 36, padding: "0 16px", fontSize: 12 }}>
              <Plus size={14} /> {t("Publish Deal or Live Build", "פרסם דיל או מערכת חיה")}
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
          {t("Verified AI Deployments, Partner Deals & Curated Bundles", "מערכות AI חיות, דילים מאומתים ואוספי כלים נבחרים")}
        </h1>
        <p style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 14 }}>
          {t("Every post is HTTPS-verified. Community members earn Boost Credits by verifying active deals and live deployments.", "כל פרסום מאומת ב-HTTPS. חברי הקהילה צוברים נקודות חשיפה על אימות דילים ומערכות חיות.")}
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "all", label: t("All Showcase Posts", "כל הפרסומים") },
            { id: "verified_deal", label: t("Verified Partner Deals", "דילים מאומתים (שותפים)") },
            { id: "build_proof", label: t("Live AI Systems", "מערכות AI חיות") },
            { id: "deal_bundle", label: t("Curated Bundles", "אוספים וחבילות כלים") },
          ].map((tab) => (
            <button key={tab.id} type="button" onClick={() => setFilterType(tab.id)} className={filterType === tab.id ? "btn-primary" : "btn-ghost"} style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12 }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {composerOpen && (
        <form onSubmit={handlePublish} className="card-surface" style={{ padding: 18, marginBottom: 18, display: "flex", flexDirection: "column", gap: 10, border: "1px solid rgba(56,189,248,0.4)" }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#f8fafc" }}>{t("Publish to Organic Marketing Wall", "פרסום חדש לקיר השיווק והקהילה")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
            <select value={postType} onChange={(e) => setPostType(e.target.value as "build_proof" | "verified_deal" | "deal_bundle")} className="input-dark" style={{ fontSize: 13 }}>
              <option value="verified_deal">{t("Verified Partner Deal", "דיל שותפים מאומת")}</option>
              <option value="build_proof">{t("Live AI System Proof", "הוכחת בניית מערכת AI")}</option>
              <option value="deal_bundle">{t("Curated Tool / Deal Bundle", "חבילת כלים / דילים משותפת")}</option>
            </select>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("Headline / Product Name", "כותרת הפרסום / שם המוצר")} className="input-dark" style={{ fontSize: 13 }} />
            <input type="text" value={priceBadge} onChange={(e) => setPriceBadge(e.target.value)} placeholder={t("Price or Tier Tag (e.g. $49 / 30% Off)", "תג מחיר או דרגה (לדוגמה ₪149 / 30% הנחה)")} className="input-dark" style={{ fontSize: 13 }} />
            <input type="url" dir="ltr" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="input-dark" style={{ fontSize: 13, textAlign: "left" }} />
          </div>
          <textarea rows={2} required value={summary} onChange={(e) => setSummary(e.target.value)} placeholder={t("Key value, benefits & disclosure...", "תיאור הערך המרכזי, היתרונות וגילוי נאות...")} className="input-dark" style={{ fontSize: 13 }} />
          <button type="submit" className="btn-primary" style={{ width: "auto", alignSelf: "flex-start", padding: "0 20px", height: 40, fontSize: 13 }}>
            <Sparkles size={14} /> {t("Publish Now", "פרסם עכשיו")}
          </button>
        </form>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {displayedPosts.map((p) => {
          const pType = p.post_type || "build_proof";
          const TypeIcon = pType === "verified_deal" ? Tag : pType === "deal_bundle" ? Package : Layers;
          return (
            <div key={p.id} className="card-surface" style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  <span className="badge-pill" style={{ fontSize: 10.5, background: pType === "verified_deal" ? "rgba(52,211,153,0.16)" : "rgba(56,189,248,0.16)", color: pType === "verified_deal" ? "#34d399" : "#38bdf8" }}>
                    <TypeIcon size={12} /> {pType === "verified_deal" ? t("VERIFIED DEAL", "דיל מאומת") : pType === "deal_bundle" ? t("CURATED BUNDLE", "חבילה נבחרת") : t("LIVE AI SYSTEM", "מערכת AI חיה")}
                  </span>
                  {p.price_badge && <span className="badge-pill" style={{ fontSize: 11, background: "rgba(251,191,36,0.16)", color: "#fbbf24", fontWeight: 800 }}>{p.price_badge}</span>}
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 900, color: "#f8fafc", lineHeight: 1.35, marginBottom: 8 }}>{p.project_title}</h2>
                <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 10 }}>{p.summary}</p>
                <div style={{ fontSize: 11.5, color: "#94a3b8" }}>
                  <ShieldCheck size={12} color="#34d399" style={{ display: "inline", marginInlineEnd: 4 }} />
                  {p.author_name} · <strong style={{ color: "#fbbf24" }}>{p.boost_credits || 0} Boost</strong>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ flex: 1, height: 38, fontSize: 12 }}>
                  <span>{t("Inspect & Open", "צפה ופתח")}</span> <ExternalLink size={13} />
                </a>
                <button type="button" onClick={() => handleBoostVote(p)} className="btn-ghost" style={{ height: 38, padding: "0 12px", fontSize: 12, color: "#34d399" }}>
                  <ThumbsUp size={13} /> {t("Verify (+2)", "אמת")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
