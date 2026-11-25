"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Award, ShieldCheck, Store, Briefcase, Search, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import ViralShareBar from "@/components/ViralShareBar";

interface PublicCreator {
  id: string;
  full_name: string | null;
  headline: string | null;
  purchased_track_level: number | null;
  admin_verified: boolean | null;
  is_affiliate_pro: boolean | null;
  peer_karma: number | null;
}

export default function CreatorsDirectoryPage() {
  const { isHe, dir, t } = useStudioLang();
  const [creators, setCreators] = useState<PublicCreator[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "pro">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { const loadCreators = () =>
    supabase
      .from("profiles")
      .select("id, full_name, headline, purchased_track_level, admin_verified, is_affiliate_pro, peer_karma")
      .or("is_banned.is.null,is_banned.eq.false")
      .order("admin_verified", { ascending: false })
      .order("purchased_track_level", { ascending: false })
      .limit(48)
      .then(({ data }) => {
        setCreators((data as PublicCreator[]) || []);
        setLoading(false); }); loadCreators(); window.addEventListener("proofcraft:sync-now", loadCreators); return () => window.removeEventListener("proofcraft:sync-now", loadCreators);
  }, []);

  const filtered = creators.filter((c) => {
    if (filter === "verified" && !c.admin_verified) return false;
    if (filter === "pro" && !c.is_affiliate_pro) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (c.full_name || "").toLowerCase().includes(q) || (c.headline || "").toLowerCase().includes(q);
  });

  return (
    <div dir={dir} style={{ textAlign: isHe ? "right" : "left" }}>
      <div className="card-hero" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <span className="badge-pill" style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", fontSize: 11 }}>
            <Sparkles size={13} /> {t("VERIFIED CREATORS & STOREFRONTS DIRECTORY", "\u05D0\u05D9\u05E0\u05D3\u05E7\u05E1 \u05D9\u05D5\u05E6\u05E8\u05D9\u05DD \u05D5\u05D7\u05E0\u05D5\u05D9\u05D5\u05EA \u05DE\u05D0\u05D5\u05DE\u05EA\u05D5\u05EA")}
          </span>
          <ViralShareBar title="ProofCraft Verified AI Builders & Deal Curators Directory" isHe={isHe} compact />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f8fafc", marginBottom: 6 }}>
          {t("Discover Verified AI Builders & Deal Curators", "\u05D2\u05DC\u05D4 \u05D1\u05D5\u05E0\u05D9 AI \u05DE\u05D0\u05D5\u05DE\u05EA\u05D9\u05DD \u05D5\u05D7\u05E0\u05D5\u05D9\u05D5\u05EA \u05D3\u05D9\u05DC\u05D9\u05DD")}
        </h1>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 14 }}>
          {t("Inspect live Proof-of-Execution portfolios, official credentials, and curated partner storefronts.", "\u05E1\u05E7\u05D5\u05E8 \u05EA\u05D9\u05E7\u05D9 \u05E2\u05D1\u05D5\u05D3\u05D5\u05EA \u05DE\u05D0\u05D5\u05DE\u05EA\u05D9\u05DD, \u05EA\u05E2\u05D5\u05D3\u05D5\u05EA \u05D4\u05E1\u05DE\u05DB\u05D4 \u05E8\u05E9\u05DE\u05D9\u05D5\u05EA \u05D5\u05D7\u05E0\u05D5\u05D9\u05D5\u05EA \u05E9\u05D5\u05EA\u05E4\u05D9\u05DD.")}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 12, top: 12 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search creator by name or specialty...", "\u05D7\u05E4\u05E9 \u05D9\u05D5\u05E6\u05E8 \u05DC\u05E4\u05D9 \u05E9\u05DD \u05D0\u05D5 \u05D4\u05EA\u05DE\u05D7\u05D5\u05EA...")}
              className="input-dark"
              style={{ width: "100%", paddingLeft: 34, fontSize: 13 }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setFilter("all")} className={filter === "all" ? "btn-primary" : "btn-ghost"} style={{ height: 36, fontSize: 12 }}>
              {t("All Creators", "\u05DB\u05DC \u05D4\u05D9\u05D5\u05E6\u05E8\u05D9\u05DD")}
            </button>
            <button type="button" onClick={() => setFilter("verified")} className={filter === "verified" ? "btn-primary" : "btn-ghost"} style={{ height: 36, fontSize: 12 }}>
              {t("Admin Verified", "\u05DE\u05D0\u05D5\u05DE\u05EA\u05D9 \u05D0\u05D3\u05DE\u05D9\u05DF")}
            </button>
            <button type="button" onClick={() => setFilter("pro")} className={filter === "pro" ? "btn-primary" : "btn-ghost"} style={{ height: 36, fontSize: 12 }}>
              {t("Affiliate Pro", "\u05E9\u05D5\u05EA\u05E4\u05D9 Pro")}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>{t("Loading Verified Directory...", "\u05D8\u05D5\u05E2\u05DF \u05D0\u05D9\u05E0\u05D3\u05E7\u05E1 \u05D9\u05D5\u05E6\u05E8\u05D9\u05DD...")}</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map((c) => (
            <div key={c.id} className="card-surface" style={{ padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                  <strong style={{ fontSize: 15, color: "#f8fafc" }}>{c.full_name || "Verified ProofCraft Builder"}</strong>
                  <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(56,189,248,0.14)", color: "#38bdf8" }}>
                    v{c.purchased_track_level || 1}.0
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: "#cbd5e1", lineHeight: 1.5, marginBottom: 10 }}>
                  {c.headline || "AI Product Engineer & Verified Deal Curator"}
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {c.admin_verified && (
                    <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(52,211,153,0.14)", color: "#34d399" }}>
                      <Award size={11} /> {t("Certified", "\u05DE\u05D5\u05E1\u05DE\u05DA")}
                    </span>
                  )}
                  {c.is_affiliate_pro && (
                    <span className="badge-pill" style={{ fontSize: 10.5, background: "rgba(251,191,36,0.14)", color: "#fbbf24" }}>
                      <ShieldCheck size={11} /> PRO
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <Link href={`/portfolio/${c.id}`} className="btn-ghost" style={{ height: 34, fontSize: 11.5 }}>
                  <Briefcase size={13} /> <span>{t("Portfolio", "\u05E4\u05D5\u05E8\u05D8\u05E4\u05D5\u05DC\u05D9\u05D5")}</span>
                </Link>
                <Link href={`/deals/${c.id}`} className="btn-primary" style={{ height: 34, fontSize: 11.5 }}>
                  <Store size={13} /> <span>{t("Deal Store", "\u05D7\u05E0\u05D5\u05EA \u05D3\u05D9\u05DC\u05D9\u05DD")}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}