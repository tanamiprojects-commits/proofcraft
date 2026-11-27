"use client";

import React, { useState } from "react";
import {
  Landmark, TrendingUp, ExternalLink, Sparkles, CheckCircle2,
  Send, Store, Wrench, ArrowUpRight, AlertCircle, BarChart3
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AffClick, AffLink, AffNetwork, AffUserAccount } from "@/lib/affiliate-store";

export default function AffiliateDigitalBankOS({
  userId,
  links,
  clicks,
  networks,
  accounts,
  originUrl,
  isHe,
  onReload,
  onInspectLink,
  onNotify,
}: {
  userId: string | null;
  links: AffLink[];
  clicks: AffClick[];
  networks: AffNetwork[];
  accounts: AffUserAccount[];
  originUrl: string;
  isHe: boolean;
  onReload: () => void;
  onInspectLink: (lnk: AffLink) => void;
  onNotify: (msg: string) => void;
}) {
  const [bankTab, setBankTab] = useState<"ledger" | "organic_hub" | "payouts">("ledger");
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const totalClicks = links.reduce((acc, l) => acc + Number(l.click_count || 0), 0);
  const estConversions = Math.round(totalClicks * 0.035 * 10) / 10;
  const estPortfolioValueIls = Math.round(estConversions * 115 * 0.08);
  const publicCount = links.filter((l) => l.is_public_deal).length;

  const submitDealToPublicFeed = async (lnk: AffLink) => {
    if (!userId) return onNotify(isHe ? "נא להתחבר תחילה." : "Please sign in first.");
    setSubmittingId(lnk.id);
    const { error } = await supabase
      .from("aff_links")
      .update({ is_public_deal: true, moderation_status: "pending" })
      .eq("id", lnk.id);
    setSubmittingId(null);
    if (error) return onNotify(error.message);
    onReload();
    onNotify(isHe ? "הדיל נשלח לאישור אדמין ויופיע בפיד האורגני של הפלטפורמה!" : "Deal submitted for Admin approval to appear in the public feed!");
  };
  return (
    <div className="card-hero" style={{ padding: 24, borderRadius: 20, border: "1px solid rgba(52,211,153,0.35)", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.16)", color: "#34d399", fontSize: 11.5, fontWeight: 800, marginBottom: 6 }}>
            <Landmark size={14} /> {isHe ? "הבנק הדיגיטלי ותיק הנכסים החי (DIGITAL BANK OS)" : "AFFILIATE DIGITAL BANK & PORTFOLIO LEDGER"}
          </span>
          <h2 style={{ fontSize: 19, fontWeight: 900, color: "#f8fafc", margin: 0 }}>
            {isHe ? "מעקב ביצועים לכל קישור, שווי תיק משוער וצמיחה אורגנית" : "Per-Link Ledger, Estimated Portfolio Value & Organic Reach"}
          </h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 12 }}>
        <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "קליקים מאומתים בתיק" : "Verified Portfolio Clicks"}</div>
          <div className="tabular-nums" style={{ fontSize: 22, fontWeight: 900, color: "#38bdf8" }}>{totalClicks}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "המרות משוערות (3.5%)" : "Est. Conversions (3.5%)"}</div>
          <div className="tabular-nums" style={{ fontSize: 22, fontWeight: 900, color: "#fbbf24" }}>{estConversions}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.35)" }}>
          <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "פוטנציאל הכנסה משוער" : "Est. Commission Value"}</div>
          <div className="tabular-nums" style={{ fontSize: 22, fontWeight: 900, color: "#34d399" }}>₪{estPortfolioValueIls.toLocaleString()}</div>
        </div>
        <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(129,140,248,0.35)" }}>
          <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{isHe ? "דילים פעילים באורגני" : "Live Organic Deals"}</div>
          <div className="tabular-nums" style={{ fontSize: 22, fontWeight: 900, color: "#a5b4fc" }}>{publicCount} / {links.length}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8 }}>
        <button type="button" onClick={() => setBankTab("ledger")} className={bankTab === "ledger" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>
          <BarChart3 size={14} /> {isHe ? "1. יומן ביצועים לכל קישור" : "1. Per-Link Ledger"}
        </button>
        <button type="button" onClick={() => setBankTab("organic_hub")} className={bankTab === "organic_hub" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>
          <TrendingUp size={14} /> {isHe ? "2. שיווק אורגני בפלטפורמה" : "2. Platform Organic Growth"}
        </button>
        <button type="button" onClick={() => setBankTab("payouts")} className={bankTab === "payouts" ? "btn-primary" : "btn-ghost"} style={{ height: 42, fontSize: 13 }}>
          <Landmark size={14} /> {isHe ? "3. משיכת כספים ובנקים" : "3. Network Payouts"}
        </button>
      </div>

      {bankTab === "ledger" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {links.length === 0 ? (
            <div style={{ padding: 20, borderRadius: 14, background: "#0a0b0e", fontSize: 13, color: "#94a3b8", textAlign: "center" }}>
              {isHe ? "עדיין אין קישורים בתיק. צור את הקישור הראשון שלך למעלה כדי לראות מעקב פיננסי חי." : "No links yet. Create your first smart link above to activate live ledger tracking."}
            </div>
          ) : (
            links.map((lk) => {
              const linkClicks = clicks.filter((c) => c.link_id === lk.id);
              const waClicks = linkClicks.filter((c) => (c.referrer || "").includes("wa")).length;
              const fbClicks = linkClicks.filter((c) => (c.referrer || "").includes("fb")).length;
              const nextActionHe = lk.click_count === 0 ? "המלצה: הקישור טרם הופץ — לחץ 'ניהול 360°' והעתק מודעה לוואטסאפ." : lk.click_count < 15 ? "המלצה: יש תנועה ראשונית! שתף גם בסטורי ובפייסבוק להכפלת הקליקים." : "מצוין: קישור מנצח! הגש אותו לפיד הציבורי לצמיחה אורגנית נוספת.";
              const nextActionEn = lk.click_count === 0 ? "Tip: Not shared yet—open 360° Studio and post to WhatsApp." : lk.click_count < 15 ? "Tip: Early traction! Share on Facebook & Stories to scale clicks." : "Winning link! Submit to the public feed for extra organic reach.";
              return (
                <div key={lk.id} style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 540 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <strong style={{ fontSize: 14.5, color: "#f8fafc" }}>{lk.product_title}</strong>
                      <span className="badge-pill" style={{ fontSize: 10, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>{lk.network_slug}</span>
                      {lk.is_public_deal && <span className="badge-pill" style={{ fontSize: 10, background: "rgba(52,211,153,0.16)", color: "#34d399" }}>✓ {isHe ? "בפיד האורגני" : "Organic Live"}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{isHe ? `סה״כ: ${lk.click_count} קליקים (וואטסאפ: ${waClicks} · פייסבוק: ${fbClicks})` : `Total: ${lk.click_count} clicks (WA: ${waClicks} · FB: ${fbClicks})`}</div>
                    <div style={{ fontSize: 12, color: "#34d399", fontWeight: 700 }}>{isHe ? nextActionHe : nextActionEn}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {!lk.is_public_deal && (
                      <button type="button" disabled={submittingId === lk.id} onClick={() => submitDealToPublicFeed(lk)} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, borderColor: "rgba(129,140,248,0.45)", color: "#a5b4fc" }}>
                        <Send size={12} /> {isHe ? "פרסם בפיד האורגני" : "Submit to Feed"}
                      </button>
                    )}
                    <button type="button" onClick={() => onInspectLink(lk)} className="btn-primary" style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12 }}>{isHe ? "ניהול 360°" : "360° Studio"}</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      {bankTab === "organic_hub" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <div style={{ padding: 18, borderRadius: 16, background: "#0a0b0e", border: "1px solid rgba(52,211,153,0.3)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#34d399", marginBottom: 6 }}><Store size={15} style={{ display: "inline", marginInlineEnd: 6 }} />{isHe ? "חנות הדילים האישית שלך (/deals)" : "Your Personal Deal Storefront"}</div>
              <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{isHe ? "עמוד מותג אישי שמרכז את כל הדילים שלך במקום אחד. מושלם לקישור בביו באינסטגרם, טיקטוק ווואטסאפ." : "Hosted storefront showcasing all your verified links—ideal for your social media bio."}</p>
            </div>
            {userId && <a href={`/deals/${userId}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ height: 38, fontSize: 12.5 }}><ArrowUpRight size={14} /> {isHe ? "פתח את חנות הדילים שלך" : "Open Storefront"}</a>}
          </div>

          <div style={{ padding: 18, borderRadius: 16, background: "#0a0b0e", border: "1px solid rgba(129,140,248,0.3)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#a5b4fc", marginBottom: 6 }}><Sparkles size={15} style={{ display: "inline", marginInlineEnd: 6 }} />{isHe ? "פיד הדילים הקהילתי (/feed)" : "Community Discovery Feed (/feed)"}</div>
              <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{isHe ? "דילים שאושרו ע״י האדמין מוצגים בפיד הציבורי של הפלטפורמה ומקבלים חשיפה אורגנית מגולשים חדשים." : "Admin-approved deals appear in the main discovery feed for free organic buyer traffic."}</p>
            </div>
            <a href="/feed" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 38, fontSize: 12.5 }}><ArrowUpRight size={14} /> {isHe ? "צפה בפיד הציבורי" : "Explore Public Feed"}</a>
          </div>

          <div style={{ padding: 18, borderRadius: 16, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.3)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#38bdf8", marginBottom: 6 }}><Wrench size={15} style={{ display: "inline", marginInlineEnd: 6 }} />{isHe ? "ארגז כלי ה-AI והשותפים (/toolkit)" : "Builder & AI Toolkit (/toolkit)"}</div>
              <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{isHe ? "הפנה יוצרים ומפתחים לכלי AI מובילים והרווח עמלות מתמשכות (Recurring Commissions) על מנויים." : "Refer creators to top AI tools and earn recurring monthly SaaS commissions."}</p>
            </div>
            <a href="/toolkit" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 38, fontSize: 12.5 }}><ArrowUpRight size={14} /> {isHe ? "עבור לארגז הכלים" : "Open AI Toolkit"}</a>
          </div>
        </div>
      )}

      {bankTab === "payouts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 12, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", fontSize: 12.5, color: "#fef3c7", lineHeight: 1.6 }}>
            <AlertCircle size={14} color="#fbbf24" style={{ display: "inline", marginInlineEnd: 6 }} />
            {isHe ? "שקיפות מלאה: הכסף שלך לעולם לא נתקע אצל מתווך. העמלות נצברות ישירות בחשבון השותפים הרשמי שלך ברשת (עליאקספרס / אמזון / איביי) ונמשכות משם ישירות לחשבון הבנק או PayPal שלך." : "Full Transparency: Commissions accrue directly in your official partner account (AliExpress / Amazon / eBay) and withdraw straight to your Bank or PayPal."}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {networks.map((net) => {
              const acc = accounts.find((a) => a.network_slug === net.slug);
              return (
                <div key={net.id} style={{ padding: 16, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <strong style={{ fontSize: 14, color: "#f8fafc" }}>{isHe ? net.name_he : net.name_en}</strong>
                      {acc?.is_verified ? <CheckCircle2 size={15} color="#34d399" /> : <span style={{ fontSize: 11, color: "#64748b" }}>{isHe ? "לא מאומת" : "Unverified"}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{isHe ? `מזהה פעיל: ${acc?.tracking_id || "טרם הוזן"}` : `Active ID: ${acc?.tracking_id || "Not set"}`}</div>
                  </div>
                  <a href={net.signup_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 34, fontSize: 12 }}>
                    <ExternalLink size={12} /> {isHe ? "פתח לוח תשלומים ברשת" : "Open Network Payout Dashboard"}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}