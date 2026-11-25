"use client";
import React, { useEffect, useState } from "react";
import { Activity, Link2, MousePointerClick, Flame, Gift, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { downloadCsvReport } from "@/lib/csv-export";

export default function AdminEcosystemPulse() {
  const { isHe, dir } = useStudioLang();
  const [stats, setStats] = useState({ links: 0, clicks: 0, posts: 0, referrals: 0 });
  const [exporting, setExporting] = useState(false);

  const loadPulse = async () => {
    const [{ count: lCount }, { count: cCount }, { count: pCount }, { count: rCount }] = await Promise.all([
      supabase.from("aff_links").select("*", { count: "exact", head: true }),
      supabase.from("aff_clicks").select("*", { count: "exact", head: true }),
      supabase.from("feed_posts").select("*", { count: "exact", head: true }),
      supabase.from("aff_karma_ledger").select("*", { count: "exact", head: true }).eq("action_type", "referral_welcome_bonus"),
    ]);
    setStats({ links: lCount || 0, clicks: cCount || 0, posts: pCount || 0, referrals: rCount || 0 });
  };

  useEffect(() => {
    loadPulse();
    const onSync = () => loadPulse();
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, []);

  const handleExportBuilders = async () => {
    setExporting(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, headline, purchased_track_level, admin_verified, is_affiliate_pro, affiliate_boost_credits, peer_karma")
        .order("purchased_track_level", { ascending: false });
      const rows = (data || []).map((u) => [
        u.id,
        u.full_name || "Builder",
        u.headline || "",
        u.purchased_track_level || 1,
        Boolean(u.admin_verified),
        Boolean(u.is_affiliate_pro),
        u.affiliate_boost_credits ?? 10,
        u.peer_karma ?? 0,
      ]);
      downloadCsvReport("proofcraft-builders-crm.csv", ["User ID", "Full Name", "Headline", "Tier", "Admin Verified", "Affiliate Pro", "Boost Credits", "Peer Karma"], rows);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div dir={dir} className="card-surface" style={{ padding: 14, marginBottom: 16, textAlign: isHe ? "right" : "left", border: "1px solid rgba(56,189,248,0.28)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Activity size={15} color="#38bdf8" />
          <strong style={{ fontSize: 13, color: "#f8fafc" }}>
            {isHe ? "\u05D8\u05DC\u05DE\u05D8\u05E8\u05D9\u05D9\u05EA \u05D0\u05E7\u05D5\u05E1\u05D9\u05E1\u05D8\u05DD \u05D5\u05E6\u05DE\u05D9\u05D7\u05D4 \u05D1\u05D6\u05DE\u05DF \u05D0\u05DE\u05EA" : "Global Ecosystem & Growth Telemetry"}
          </strong>
        </div>
        <button type="button" onClick={handleExportBuilders} disabled={exporting} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}>
          <Download size={12} />
          <span>{exporting ? (isHe ? "\u05DE\u05D9\u05D9\u05E6\u05D0..." : "Exporting...") : (isHe ? "\u05D9\u05D9\u05E6\u05D5\u05D0 CRM CSV" : "Export Builders CSV")}</span>
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 8 }}>
        <div style={{ padding: "8px 10px", borderRadius: 9, background: "rgba(15,23,42,0.75)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}><Link2 size={11} /> {isHe ? "\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05D7\u05DB\u05DE\u05D9\u05DD" : "Smart Links"}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc" }}>{stats.links}</div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 9, background: "rgba(15,23,42,0.75)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}><MousePointerClick size={11} /> {isHe ? "\u05E7\u05DC\u05D9\u05E7\u05D9\u05DD \u05DE\u05E0\u05D5\u05D8\u05E8\u05D9\u05DD" : "Tracked Clicks"}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#38bdf8" }}>{stats.clicks}</div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 9, background: "rgba(15,23,42,0.75)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}><Flame size={11} /> {isHe ? "\u05E4\u05E8\u05E1\u05D5\u05DE\u05D9\u05DD \u05D1\u05E4\u05D9\u05D3" : "Feed Wall Items"}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fbbf24" }}>{stats.posts}</div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: 9, background: "rgba(15,23,42,0.75)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}><Gift size={11} /> {isHe ? "\u05D4\u05E4\u05E0\u05D9\u05D5\u05EA \u05D5\u05D9\u05E8\u05D0\u05DC\u05D9\u05D5\u05EA" : "Viral Referrals"}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#34d399" }}>{stats.referrals}</div>
        </div>
      </div>
    </div>
  );
}