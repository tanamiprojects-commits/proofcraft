import { supabase } from "@/lib/supabase";

const REF_KEY = "proofcraft_ref_code";
const CLAIMED_KEY = "proofcraft_ref_claimed";

export function captureReferralFromUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    const urlRef = (params.get("ref") || "").trim().toUpperCase();
    if (urlRef && urlRef.length >= 4 && urlRef.length <= 32) {
      window.localStorage.setItem(REF_KEY, urlRef);
      return urlRef;
    }
    return window.localStorage.getItem(REF_KEY) || "";
  } catch {
    return "";
  }
}

export async function claimReferralBonusForNewUser(newUserId: string): Promise<boolean> {
  if (typeof window === "undefined" || !newUserId) return false;
  try {
    if (window.localStorage.getItem(CLAIMED_KEY) === "1") return false;
    const refCode = (window.localStorage.getItem(REF_KEY) || "").trim().toUpperCase();
    if (!refCode) return false;

    const { data: inviter } = await supabase
      .from("profiles")
      .select("id, affiliate_boost_credits, affiliate_referral_code")
      .eq("affiliate_referral_code", refCode)
      .maybeSingle();

    if (inviter && inviter.id === newUserId) return false;

    const { data: joiner } = await supabase
      .from("profiles")
      .select("id, affiliate_boost_credits")
      .eq("id", newUserId)
      .maybeSingle();

    const joinerCurr = Number(joiner?.affiliate_boost_credits ?? 10);
    await Promise.all([
      supabase.from("profiles").update({ affiliate_boost_credits: joinerCurr + 25 }).eq("id", newUserId),
      supabase.from("aff_karma_ledger").insert({
        user_id: newUserId,
        action_type: "referral_welcome_bonus",
        credits_delta: 25,
        description_en: `Welcome Referral Bonus (+25 Boost Credits via ${refCode})`,
        description_he: `\u05D1\u05D5\u05E0\u05D5\u05E1 \u05D4\u05E6\u05D8\u05E8\u05E4\u05D5\u05EA \u05DE\u05D4\u05D6\u05DE\u05E0\u05EA \u05D7\u05D1\u05E8 (+25 \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D7\u05E9\u05D9\u05E4\u05D4 \u05E2\u05D1\u05D5\u05E8 ${refCode})`,
      }),
    ]);

    if (inviter?.id) {
      const inviterCurr = Number(inviter.affiliate_boost_credits ?? 10);
      await Promise.all([
        supabase.from("profiles").update({ affiliate_boost_credits: inviterCurr + 25 }).eq("id", inviter.id),
        supabase.from("aff_karma_ledger").insert({
          user_id: inviter.id,
          action_type: "referral_creator_reward",
          credits_delta: 25,
          description_en: `Friend Joined via Your Invite Code (${refCode}) +25 Boost Credits`,
          description_he: `\u05D7\u05D1\u05E8 \u05D4\u05E6\u05D8\u05E8\u05E3 \u05D3\u05E8\u05DA \u05E7\u05D5\u05D3 \u05D4\u05D4\u05D6\u05DE\u05E0\u05D4 \u05E9\u05DC\u05DA (${refCode}) +25 \u05E0\u05E7\u05D5\u05D3\u05D5\u05EA \u05D7\u05E9\u05D9\u05E4\u05D4`,
        }),
      ]);
    }

    window.localStorage.setItem(CLAIMED_KEY, "1");
    window.localStorage.removeItem(REF_KEY);
    return true;
  } catch {
    return false;
  }
}