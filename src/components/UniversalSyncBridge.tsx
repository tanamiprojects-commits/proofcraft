"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RefreshCw, CheckCircle2, Home, Briefcase, Link2, Users, Flame, Shield, Smartphone } from "lucide-react";
import GlobalQuickJump from "@/components/GlobalQuickJump";

interface Props {
  isHe: boolean;
  isAdmin?: boolean;
}

export default function UniversalSyncBridge({ isHe, isAdmin = false }: Props) {
  const pathname = usePathname() || "/";
  const [syncedFlash, setSyncedFlash] = useState(false);

  useEffect(() => {
    const onSync = () => {
      setSyncedFlash(true);
      setTimeout(() => setSyncedFlash(false), 2600);
    };
    window.addEventListener("proofcraft:sync-now", onSync);
    return () => window.removeEventListener("proofcraft:sync-now", onSync);
  }, []);

  if (pathname === "/" || pathname === "/auth") return null;

  const triggerSync = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("proofcraft:sync-now"));
    }
  };

  const navPills = [
    { href: "/", label: isHe ? "\u05E8\u05D0\u05E9\u05D9" : "Home", icon: Home },
    { href: "/workspace", label: isHe ? "\u05E1\u05D8\u05D5\u05D3\u05D9\u05D5" : "Studio", icon: Briefcase },
    { href: "/affiliate", label: isHe ? "\u05E9\u05D5\u05EA\u05E4\u05D9\u05DD" : "Affiliate Hub", icon: Link2 },
    { href: "/creators", label: isHe ? "\u05D9\u05D5\u05E6\u05E8\u05D9\u05DD" : "Creators", icon: Users },
    { href: "/feed", label: isHe ? "\u05E4\u05D9\u05D3" : "Feed", icon: Flame },
    ...(isAdmin ? [{ href: "/admin", label: isHe ? "\u05E0\u05D9\u05D4\u05D5\u05DC" : "Admin", icon: Shield }] : []),
  ];

  return (
    <div
      dir={isHe ? "rtl" : "ltr"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
        padding: "8px 12px",
        marginBottom: 14,
        borderRadius: 12,
        background: "rgba(15,23,42,0.72)",
        border: "1px solid rgba(148,163,184,0.16)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {navPills.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: active ? 800 : 600,
                textDecoration: "none",
                background: active ? "rgba(56,189,248,0.18)" : "rgba(30,41,59,0.5)",
                color: active ? "#38bdf8" : "#cbd5e1",
                border: active ? "1px solid rgba(56,189,248,0.4)" : "1px solid transparent",
              }}
            >
              <Icon size={12} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={triggerSync}
        className="btn-ghost"
        style={{
          height: 30,
          padding: "0 10px",
          fontSize: 11.5,
          color: syncedFlash ? "#34d399" : "#94a3b8",
          borderColor: syncedFlash ? "rgba(52,211,153,0.45)" : undefined,
        }}
      >
        {syncedFlash ? <CheckCircle2 size={13} color="#34d399" /> : <RefreshCw size={12} />}
        <span>
          {syncedFlash
            ? (isHe ? "\u05E1\u05D5\u05E0\u05DB\u05E8\u05DF \u05DC\u05E2\u05E0\u05DF" : "Cloud Synced")
            : (isHe ? "\u05E1\u05E0\u05DB\u05E8\u05D5\u05DF \u05DE\u05D4\u05D9\u05E8" : "Quick Sync")}
        </span>
      </button>
    </div>
  );
}