"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, Sparkles, ShieldCheck, BookOpen, Wrench, Users } from "lucide-react";
import { getActiveUserProfile } from "@/lib/cloud-store";
import StudioVisualArtwork from "@/components/StudioVisualArtwork";

const GLOBAL_TRACKS = [
  {
    level: 1,
    badge: "FREE FOREVER · LAUNCHPAD",
    name: "Junior AI Builder (v1.0)",
    tagline: "Ship your first live conversion engine + public verified portfolio",
    priceUsd: 0,
    who: "Self-taught builders and creators ready to ship a real production web asset and launch a live portfolio at zero cost.",
    deliverable: "High-converting landing engine + instant lead workflow + public Verified Portfolio with Project #1 unlocked.",
    impact: "Gives you a live production URL to share with clients, recruiters, and founders immediately.",
    free: true,
  },
  {
    level: 2,
    badge: "CLOUD SAAS TIER · v2.0",
    name: "Full-Stack AI Builder",
    tagline: "Cloud PostgreSQL databases, Auth & Row-Level Security (RLS)",
    priceUsd: 49,
    who: "Builders transitioning from static pages to persistent multi-user SaaS applications and client portals.",
    deliverable: "Project #2 in Portfolio: Full-stack cloud SaaS backed by Supabase PostgreSQL and strict RLS policies.",
    impact: "Proves real backend data isolation and security engineering to hiring managers and B2B clients.",
    free: false,
  },
  {
    level: 3,
    badge: "AUTOMATION & PAYMENTS · v3.0",
    name: "Systems & Web3 Architect",
    tagline: "Cryptographic Webhooks, Payment Verification & Bot APIs",
    priceUsd: 89,
    who: "Consultants and freelancers building automated billing engines, real-time alerts, and API pipelines.",
    deliverable: "Project #3 in Portfolio: HMAC-verified payment route handlers, automated notifications, and edge protection.",
    impact: "Positions you as an end-to-end systems architect capable of handling revenue-critical infrastructure.",
    free: false,
  },
  {
    level: 4,
    badge: "FLAGSHIP CREDENTIAL · 4 LIVE PROJECTS",
    name: "Senior AI Systems Architect (v4.0)",
    tagline: "Complete 4-Project Verified Portfolio + Enterprise Multi-Tenant AI Copilot",
    priceUsd: 149,
    who: "Builders aiming for senior AI engineering roles, agency leadership, or enterprise software delivery.",
    deliverable: "Full 4/4 Production Portfolio (v1.0 + v2.0 + v3.0 + v4.0), Multi-Tenant RBAC, Audit Logs & Certified Credential.",
    impact: "The highest proof-of-execution credential on ProofCraft — showcasing full-spectrum engineering mastery.",
    free: false,
    flagship: true,
  },
];

export default function HomePage() {
  const [purchasedLevel, setPurchasedLevel] = useState<number>(1);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    getActiveUserProfile().then((res) => {
      setPurchasedLevel(res.purchasedTrackLevel || 1);
      setUserName(res.profile.fullName || "");
    });
  }, []);

  return (
    <div dir="ltr" style={{ textAlign: "left" }}>
      <StudioVisualArtwork variant="home" />

      <section className="card-hero" style={{ padding: 26, marginBottom: 24 }}>
        <span className="badge-pill" style={{ background: "rgba(52, 211, 153, 0.15)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.35)", fontSize: 11, marginBottom: 12 }}>
          <Sparkles size={13} /> THE NEW PROOF-OF-EXECUTION STANDARD FOR AI BUILDERS
        </span>

        <h1 style={{ fontSize: 25, fontWeight: 900, color: "#f8fafc", lineHeight: 1.3, marginBottom: 10 }}>
          Clients and recruiters no longer ask what course you watched — they inspect what live systems you have shipped.
        </h1>
        <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 18 }}>
          Self-taught developers face one core hurdle: proving real engineering capability without a traditional degree. ProofCraft solves this with 4 progressive production tiers. Start completely free with Track 1, deploy your first live system, and unlock your public Verified Portfolio.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 20 }}>
          <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#38bdf8", marginBottom: 4 }}>Live Proof Over Resumes</div>
            <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>Every milestone locks a verified HTTPS deployment and architectural rationale into your public portfolio.</p>
          </div>
          <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#34d399", marginBottom: 4 }}>Start Free With Real Output</div>
            <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>Track 1 is 100% free — build your first conversion system and publish your live builder credential today.</p>
          </div>
          <div style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fbbf24", marginBottom: 4 }}>Zero-Duplicate Upgrade Pricing</div>
            <p style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55 }}>Upgrade to advanced tiers or the Flagship 4-Project Track anytime by paying only the difference.</p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/workspace" className="btn-primary" style={{ width: "auto", padding: "0 24px" }}>
            <span>{userName ? `Continue in Studio (${userName})` : "Start Free: Build Track 1 & Portfolio"}</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/portfolio/live" className="btn-ghost" style={{ padding: "0 18px" }}>
            <ShieldCheck size={15} /> View Verified Portfolio
          </Link>
        </div>
      </section>
      <section style={{ marginBottom: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 900, color: "#f8fafc" }}>Progressive Engineering Tiers (v1.0 – v4.0)</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
              Every tier unlocks a live verified project in your public portfolio. Upgrade anytime by paying only the price difference.
            </p>
          </div>
          <span className="badge-pill" style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)", fontSize: 11 }}>
            Current Active Tier: Level {purchasedLevel}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {GLOBAL_TRACKS.map((track) => {
            const unlocked = purchasedLevel >= track.level;
            return (
              <div
                key={track.level}
                className="card-surface"
                style={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: track.flagship ? "1px solid rgba(251, 191, 36, 0.45)" : unlocked ? "1px solid rgba(52, 211, 153, 0.35)" : "1px solid rgba(255,255,255,0.08)",
                  background: track.flagship ? "linear-gradient(180deg, rgba(251,191,36,0.06), rgba(15,18,25,0.95))" : undefined,
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span className="badge-pill" style={{ fontSize: 10, background: track.flagship ? "rgba(251, 191, 36, 0.16)" : "rgba(255,255,255,0.06)", color: track.flagship ? "#fbbf24" : "#cbd5e1" }}>
                      {track.badge}
                    </span>
                    <span style={{ fontSize: 17, fontWeight: 900, color: track.free ? "#34d399" : "#f8fafc" }}>
                      {track.free ? "FREE" : `$${track.priceUsd}`}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f8fafc", marginBottom: 4 }}>{track.name}</h3>
                  <p style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12 }}>{track.tagline}</p>

                  <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.55, marginBottom: 8 }}>
                    <strong style={{ color: "#e2e8f0" }}>Deliverable:</strong> {track.deliverable}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.55, marginBottom: 16 }}>
                    <strong style={{ color: "#e2e8f0" }}>Career Impact:</strong> {track.impact}
                  </div>
                </div>

                <Link
                  href="/workspace"
                  className={unlocked ? "btn-primary" : "btn-ghost"}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {unlocked ? <CheckCircle2 size={15} /> : <Lock size={15} />}
                  <span>{unlocked ? `Open Track ${track.level} in Studio` : `Preview Track ${track.level} Blueprint`}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        <Link href="/method" className="card-surface" style={{ padding: 18, textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#38bdf8", fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
            <BookOpen size={16} /> 8-Stage Prompt Method & Vault
          </div>
          <p style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>
            Copy production-tested prompts, enforce .env security protocols, and save reusable build recipes.
          </p>
        </Link>

        <Link href="/toolkit" className="card-surface" style={{ padding: 18, textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#34d399", fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
            <Wrench size={16} /> Curated AI & Cloud Stack
          </div>
          <p style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>
            Explore verified AI editors, databases, deployment hosts, and payment APIs vetted for builders.
          </p>
        </Link>

        <Link href="/feed" className="card-surface" style={{ padding: 18, textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fbbf24", fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
            <Users size={16} /> Live Builder Proof Feed
          </div>
          <p style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>
            Inspect real deployments shipped by fellow builders, track engagement metrics, and publish your work.
          </p>
        </Link>
      </section>
    </div>
  );
}
