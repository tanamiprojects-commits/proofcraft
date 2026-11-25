"use client";

import React, { useState } from "react";
import { Check, Copy, Share2, Send, MessageCircle } from "lucide-react";

interface ViralShareBarProps {
  title: string;
  url?: string;
  isHe?: boolean;
  compact?: boolean;
}

export default function ViralShareBar({ title, url, isHe = false, compact = false }: ViralShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "https://vercel.app";
  };

  const handleCopy = async () => {
    const target = getShareUrl();
    try {
      await navigator.clipboard?.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {}
  };

  const handleNativeShare = async () => {
    const target = getShareUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: target });
        return;
      } catch {}
    }
    handleCopy();
  };
  const shareUrl = encodeURIComponent(getShareUrl());
  const shareText = encodeURIComponent(title);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={handleNativeShare}
        className="btn-primary"
        style={{ width: "auto", height: compact ? 32 : 36, padding: "0 12px", fontSize: 12 }}
      >
        <Share2 size={13} />
        <span>{isHe ? "שיתוף מהיר" : "Share"}</span>
      </button>

      <a
        href={`https://wa.me{shareText}%20${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost"
        style={{ height: compact ? 32 : 36, padding: "0 10px", fontSize: 12, color: "#34d399" }}
        title="WhatsApp"
      >
        <MessageCircle size={13} />
        {!compact && <span>WhatsApp</span>}
      </a>

      <a
        href={`https://t.me{shareUrl}&text=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost"
        style={{ height: compact ? 32 : 36, padding: "0 10px", fontSize: 12, color: "#38bdf8" }}
        title="Telegram"
      >
        <Send size={13} />
        {!compact && <span>Telegram</span>}
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className="btn-ghost"
        style={{ height: compact ? 32 : 36, padding: "0 10px", fontSize: 12 }}
      >
        {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
        <span>{copied ? (isHe ? "הועתק!" : "Copied!") : (isHe ? "העתק קישור" : "Copy Link")}</span>
      </button>
    </div>
  );
}
