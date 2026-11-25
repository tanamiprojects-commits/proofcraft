"use client";
import React from "react";
import { BarChart3, TrendingUp, Award, MousePointerClick, Download } from "lucide-react";
import { downloadCsvReport } from "@/lib/csv-export";
import { AffClick, AffLink, AffNetwork } from "@/lib/affiliate-store";

interface Props {
  links: AffLink[];
  clicks: AffClick[];
  networks: AffNetwork[];
  isHe: boolean;
  onInspectLink: (link: AffLink) => void;
}

export default function AffiliateAnalyticsPanel({ links, clicks, networks, isHe, onInspectLink }: Props) {
  if (links.length === 0) return null;

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const recentClicks = clicks.filter((c) => c.clicked_at && now - new Date(c.clicked_at).getTime() <= sevenDaysMs).length;
  const totalClicks = Math.max(
    clicks.length,
    links.reduce((acc, l) => acc + Number(l.click_count || 0), 0)
  );
  const avgPerLink = (totalClicks / Math.max(1, links.length)).toFixed(1);

  const linkClickMap: Record<string, number> = {};
  links.forEach((l) => { linkClickMap[l.id] = Number(l.click_count || 0); });
  clicks.forEach((c) => {
    if (c.link_id && linkClickMap[c.link_id] !== undefined) {
      linkClickMap[c.link_id] = Math.max(linkClickMap[c.link_id], clicks.filter((x) => x.link_id === c.link_id).length);
    }
  });

  const rankedLinks = [...links]
    .map((l) => ({ link: l, count: linkClickMap[l.id] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const networkTotals: Record<string, number> = {};
  links.forEach((l) => {
    const c = linkClickMap[l.id] || 0;
    networkTotals[l.network_slug] = (networkTotals[l.network_slug] || 0) + c;
  });
  const networkRows = Object.entries(networkTotals).sort((a, b) => b[1] - a[1]);
  const maxClicks = Math.max(1, rankedLinks[0]?.count || 1);

  return (
    <div className="card-surface" style={{ padding: 18, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart3 size={17} color="#38bdf8" />
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc", margin: 0 }}>
            {isHe ? "\u05D0\u05E0\u05DC\u05D9\u05D8\u05D9\u05E7\u05EA \u05D4\u05DE\u05E8\u05D5\u05EA \u05D5\u05D3\u05D9\u05E8\u05D5\u05D2 \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05DE\u05D5\u05D1\u05D9\u05DC\u05D9\u05DD" : "Conversion Telemetry & Top-Link Leaderboard"}
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><button type="button" onClick={() => downloadCsvReport("proofcraft-links-report.csv", ["Title", "Network", "Folder", "Clicks", "Health", "Destination"], links.map((l) => [l.product_title, l.network_slug, l.folder_name, linkClickMap[l.id] || 0, l.health_status, l.destination_url]))} className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5 }}><Download size={12} /> <span>{isHe ? "\u05D9\u05D9\u05E6\u05D5\u05D0 CSV" : "Export CSV"}</span></button><span className="badge-pill" style={{ background: "rgba(56,189,248,0.14)", color: "#38bdf8", fontSize: 11 }}>{isHe ? "\u05D8\u05DC\u05DE\u05D8\u05E8\u05D9\u05D4 \u05D7\u05D9\u05D4" : "LIVE TELEMETRY"}</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
        <div style={{ padding: 12, borderRadius: 10, background: "rgba(15,23,42,0.7)", border: "1px solid rgba(148,163,184,0.16)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}><MousePointerClick size={12} /> {isHe ? "\u05E1\u05D4\"\u05DB \u05E7\u05DC\u05D9\u05E7\u05D9\u05DD" : "Total Clicks"}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#f8fafc", marginTop: 4 }}>{totalClicks}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: "rgba(15,23,42,0.7)", border: "1px solid rgba(148,163,184,0.16)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}><TrendingUp size={12} color="#34d399" /> {isHe ? "7 \u05D9\u05DE\u05D9\u05DD \u05D0\u05D7\u05E8\u05D5\u05E0\u05D9\u05DD" : "Last 7 Days"}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#34d399", marginTop: 4 }}>{recentClicks}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: "rgba(15,23,42,0.7)", border: "1px solid rgba(148,163,184,0.16)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}><Award size={12} color="#fbbf24" /> {isHe ? "\u05DE\u05DE\u05D5\u05E6\u05E2 \u05DC\u05E7\u05D9\u05E9\u05D5\u05E8" : "Avg / Link"}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fbbf24", marginTop: 4 }}>{avgPerLink}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>
            {isHe ? "\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05DE\u05D5\u05D1\u05D9\u05DC\u05D9\u05DD (Top 3)" : "Top Performing Smart Links"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rankedLinks.map(({ link, count }, idx) => (
              <button
                key={link.id}
                type="button"
                onClick={() => onInspectLink(link)}
                style={{ textAlign: isHe ? "right" : "left", padding: "8px 10px", borderRadius: 9, background: "rgba(30,41,59,0.55)", border: "1px solid rgba(148,163,184,0.16)", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>
                  <span>#{idx + 1} {link.product_title.slice(0, 34)}</span>
                  <span style={{ color: "#38bdf8" }}>{count} {isHe ? "\u05E7\u05DC\u05D9\u05E7\u05D9\u05DD" : "clicks"}</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: "rgba(15,23,42,0.9)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(8, Math.round((count / maxClicks) * 100))}%`, height: "100%", background: "linear-gradient(90deg, #38bdf8, #34d399)" }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>
            {isHe ? "\u05E4\u05D9\u05DC\u05D5\u05D7 \u05DC\u05E4\u05D9 \u05E8\u05E9\u05EA \u05E9\u05D5\u05EA\u05E4\u05D9\u05DD" : "Clicks by Partner Network"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {networkRows.map(([slug, count]) => {
              const net = networks.find((n) => n.slug === slug);
              const label = net ? (isHe ? net.name_he : net.name_en) : slug;
              const pct = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
              return (
                <div key={slug} style={{ padding: "8px 10px", borderRadius: 9, background: "rgba(30,41,59,0.55)", border: "1px solid rgba(148,163,184,0.16)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#e2e8f0", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{label}</span>
                    <span style={{ color: "#34d399", fontWeight: 700 }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: "rgba(15,23,42,0.9)", overflow: "hidden" }}>
                    <div style={{ width: `${Math.max(6, pct)}%`, height: "100%", background: "#34d399" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}