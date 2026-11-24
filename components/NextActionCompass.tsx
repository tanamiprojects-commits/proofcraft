"use client";

import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

interface CompassProps {
  stepBadge: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function NextActionCompass({ stepBadge, title, description, ctaLabel, ctaHref }: CompassProps) {
  return (
    <div
      dir="rtl"
      style={{
        padding: "14px 18px",
        borderRadius: 16,
        background: "linear-gradient(135deg, rgba(18,20,26,0.95), rgba(10,11,14,0.98))",
        border: "1px solid rgba(56, 189, 248, 0.25)",
        marginBottom: 18,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: 680 }}>
        <Compass size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8", marginBottom: 2 }}>{stepBadge}</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#f8fafc", marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{description}</div>
        </div>
      </div>
      <Link href={ctaHref} className="btn-ghost" style={{ height: 38, fontSize: 12, color: "#34d399", borderColor: "rgba(52, 211, 153, 0.35)" }}>
        <span>{ctaLabel}</span>
        <ArrowLeft size={14} />
      </Link>
    </div>
  );
}
