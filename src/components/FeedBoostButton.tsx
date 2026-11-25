"use client";
import React, { useState } from "react";
import { Flame } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  postId: string;
  postTitle: string;
  currentBoost: number;
  userId: string | null;
  isHe: boolean;
  onBoosted: () => Promise<void>;
  onNotify: (msg: string) => void;
}

export default function FeedBoostButton({ postId, postTitle, currentBoost, userId, isHe, onBoosted, onNotify }: Props) {
  const [busy, setBusy] = useState(false);

  const redeemBoost = async () => {
    if (!userId) {
      onNotify(isHe ? "\u05D4\u05EA\u05D7\u05D1\u05E8 \u05DB\u05D3\u05D9 \u05DC\u05E7\u05D3\u05DD \u05E4\u05E1\u05D8\u05D9\u05DD \u05E2\u05DD \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D7\u05E9\u05D9\u05E4\u05D4." : "Sign in to redeem Boost Credits.");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const { data: prof } = await supabase.from("profiles").select("affiliate_boost_credits").eq("id", userId).single();
      const avail = Number(prof?.affiliate_boost_credits ?? 0);
      if (avail < 10) {
        onNotify(isHe ? "\u05E0\u05D3\u05E8\u05E9\u05D5\u05EA 10 \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D7\u05E9\u05D9\u05E4\u05D4 (\u05D4\u05D6\u05DE\u05DF \u05D7\u05D1\u05E8 \u05DC\u05E7\u05D1\u05DC\u05EA +25)." : "Need 10 Boost Credits (refer a friend for +25).");
        return;
      }
      await Promise.all([
        supabase.from("profiles").update({ affiliate_boost_credits: avail - 10 }).eq("id", userId),
        supabase.from("feed_posts").update({ boost_credits: (currentBoost || 0) + 10 }).eq("id", postId),
        supabase.from("aff_karma_ledger").insert({
          user_id: userId,
          action_type: "feed_post_boost",
          credits_delta: -10,
          description_en: `Boosted feed post (+10): ${postTitle.slice(0, 42)}`,
          description_he: `\u05E7\u05D9\u05D3\u05D5\u05DD \u05E4\u05D5\u05E1\u05D8 \u05D1\u05E4\u05D9\u05D3 (+10): ${postTitle.slice(0, 42)}`,
        }),
      ]);
      await onBoosted();
      onNotify(isHe ? "\u05D4\u05E4\u05D5\u05E1\u05D8 \u05E7\u05D5\u05D3\u05DD \u05DC\u05E8\u05D0\u05E9 \u05D4\u05E4\u05D9\u05D3 (+10 Boost)!" : "Post boosted to top of feed (+10 Boost)!");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={redeemBoost} disabled={busy} className="btn-ghost" style={{ height: 38, padding: "0 11px", fontSize: 12, color: "#fbbf24" }}>
      <Flame size={13} /> <span>{isHe ? "\u05E7\u05D3\u05DD (+10)" : "Boost (+10)"}</span>
    </button>
  );
}