import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";



export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawTitle = searchParams.get("title") || "ProofCraft Fintech OS";
  const rawSub = searchParams.get("subtitle") || "Verified AI Product Engineering, Smart Affiliate Hub & Execution Proof";
  const rawBadge = searchParams.get("badge") || "VERIFIED FINTECH & AI OS";

  const title = rawTitle.slice(0, 72);
  const subtitle = rawSub.slice(0, 120);
  const badge = rawBadge.slice(0, 36).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "linear-gradient(135deg, #06080d 0%, #0f172a 55%, #09131f 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
          border: "2px solid rgba(56, 189, 248, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              borderRadius: 999,
              background: "rgba(52, 211, 153, 0.14)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              color: "#34d399",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 1.2,
            }}
          >
            {badge}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8" }}>
            proofcraft-seven.vercel.app
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.15, color: "#ffffff" }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: "#cbd5e1", lineHeight: 1.4 }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 22,
            fontSize: 20,
            color: "#94a3b8",
          }}
        >
          <span>ProofCraft Fintech OS · Verified Execution & Partner Hub</span>
          <span style={{ color: "#34d399", fontWeight: 700 }}>HTTPS · RLS Verified</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
