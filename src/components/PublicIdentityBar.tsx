"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Briefcase, Store, Copy, CheckCircle2, ExternalLink, QrCode, X } from "lucide-react";

interface Props {
  userId: string | null;
  isHe: boolean;
}

export default function PublicIdentityBar({ userId, isHe }: Props) {
  const [copiedType, setCopiedType] = useState<"portfolio" | "store" | null>(null);
  const [qrModal, setQrModal] = useState<{ label: string; url: string } | null>(null);
  if (!userId) return null;

  const getFullUrl = (path: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://" + "studio.tanami360.com";
    return `${origin}${path}`;
  };

  const copyPath = (path: string, kind: "portfolio" | "store") => {
    navigator.clipboard.writeText(getFullUrl(path));
    setCopiedType(kind);
    setTimeout(() => setCopiedType(null), 2200);
  };

  return (
    <>
      <div
        dir={isHe ? "rtl" : "ltr"}
        className="card-surface"
        style={{
          padding: "12px 14px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          border: "1px solid rgba(56,189,248,0.28)",
        }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 800, color: "#e2e8f0" }}>
          {isHe ? "\u05D4\u05E0\u05DB\u05E1\u05D9\u05DD \u05D4\u05E6\u05D9\u05D1\u05D5\u05E8\u05D9\u05D9\u05DD \u05E9\u05DC\u05DA \u05D1\u05D0\u05D5\u05D5\u05D9\u05E8:" : "Your Live Public Assets:"}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Link href={`/portfolio/${userId}`} className="btn-ghost" style={{ height: 34, fontSize: 12 }}>
              <Briefcase size={13} />
              <span>{isHe ? "\u05E4\u05D5\u05E8\u05D8\u05E4\u05D5\u05DC\u05D9\u05D5 \u05DE\u05D0\u05D5\u05DE\u05EA" : "Verified Portfolio"}</span>
              <ExternalLink size={12} />
            </Link>
            <button type="button" onClick={() => copyPath(`/portfolio/${userId}`, "portfolio")} className="btn-ghost" style={{ height: 34, padding: "0 9px" }} title={isHe ? "\u05D4\u05E2\u05EA\u05E7 \u05E7\u05D9\u05E9\u05D5\u05E8" : "Copy Link"}>
              {copiedType === "portfolio" ? <CheckCircle2 size={13} color="#34d399" /> : <Copy size={13} />}
            </button>
            <button type="button" onClick={() => setQrModal({ label: isHe ? "\u05E4\u05D5\u05E8\u05D8\u05E4\u05D5\u05DC\u05D9\u05D5 \u05DE\u05D0\u05D5\u05DE\u05EA (QR)" : "Verified Portfolio QR", url: getFullUrl(`/portfolio/${userId}`) })} className="btn-ghost" style={{ height: 34, padding: "0 9px", color: "#38bdf8" }} title="QR Code">
              <QrCode size={13} />
            </button>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Link href={`/deals/${userId}`} className="btn-ghost" style={{ height: 34, fontSize: 12, color: "#34d399" }}>
              <Store size={13} />
              <span>{isHe ? "\u05D7\u05E0\u05D5\u05EA \u05D4\u05D3\u05D9\u05DC\u05D9\u05DD \u05E9\u05DC\u05D9" : "My Deal Storefront"}</span>
              <ExternalLink size={12} />
            </Link>
            <button type="button" onClick={() => copyPath(`/deals/${userId}`, "store")} className="btn-ghost" style={{ height: 34, padding: "0 9px" }} title={isHe ? "\u05D4\u05E2\u05EA\u05E7 \u05E7\u05D9\u05E9\u05D5\u05E8" : "Copy Link"}>
              {copiedType === "store" ? <CheckCircle2 size={13} color="#34d399" /> : <Copy size={13} />}
            </button>
            <button type="button" onClick={() => setQrModal({ label: isHe ? "\u05D7\u05E0\u05D5\u05EA \u05D4\u05D3\u05D9\u05DC\u05D9\u05DD \u05E9\u05DC\u05D9 (QR)" : "Deal Storefront QR", url: getFullUrl(`/deals/${userId}`) })} className="btn-ghost" style={{ height: 34, padding: "0 9px", color: "#34d399" }} title="QR Code">
              <QrCode size={13} />
            </button>
          </div>
        </div>
      </div>

      {qrModal && (
        <div
          dir={isHe ? "rtl" : "ltr"}
          onClick={() => setQrModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 130,
            background: "rgba(2,6,23,0.82)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} className="card-hero" style={{ width: "100%", maxWidth: 360, padding: 20, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <strong style={{ fontSize: 15, color: "#f8fafc" }}>{qrModal.label}</strong>
              <button type="button" onClick={() => setQrModal(null)} className="btn-ghost" style={{ height: 32, padding: "0 8px" }}>
                <X size={15} />
              </button>
            </div>
            <div style={{ padding: 14, borderRadius: 14, background: "#ffffff", display: "inline-block", marginBottom: 12 }}>
              <img
                src={`https://qrserver.com{encodeURIComponent(qrModal.url)}`}
                alt={qrModal.label}
                width={210}
                height={210}
                style={{ display: "block" }}
              />
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12, lineHeight: 1.5 }}>
              {isHe
                ? "\u05E1\u05E8\u05D5\u05E7 \u05E2\u05DD \u05DE\u05E6\u05DC\u05DE\u05EA \u05D4\u05D8\u05DC\u05E4\u05D5\u05DF \u05DC\u05E4\u05EA\u05D9\u05D7\u05D4 \u05DE\u05D9\u05D9\u05D3\u05D9\u05EA \u05D0\u05D5 \u05E9\u05DE\u05D5\u05E8 \u05DC\u05E9\u05D9\u05EA\u05D5\u05E3 \u05D1\u05E1\u05D8\u05D5\u05E8\u05D9 \u05D5\u05DB\u05E8\u05D8\u05D9\u05E1 \u05D1\u05D9\u05E7\u05D5\u05E8."
                : "Scan with your phone camera for instant mobile handoff or save for social & business cards."}
            </p>
            <button
              type="button"
              onClick={() => { navigator.clipboard.writeText(qrModal.url); setQrModal(null); }}
              className="btn-primary"
              style={{ height: 38, fontSize: 12.5 }}
            >
              <Copy size={13} />
              <span>{isHe ? "\u05D4\u05E2\u05EA\u05E7 \u05E7\u05D9\u05E9\u05D5\u05E8 \u05D9\u05E9\u05D9\u05E8" : "Copy Direct URL"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}