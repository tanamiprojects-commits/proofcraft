import { supabase } from "./supabase";

export interface AffNetwork {
  id: string;
  slug: string;
  name_en: string;
  name_he: string;
  category: string;
  commission_range: string;
  cookie_window: string;
  approval_difficulty: string;
  threshold_en: string;
  threshold_he: string;
  strict_rules_en: string[];
  strict_rules_he: string[];
  disclose_required: boolean;
  allow_direct_redirect: boolean;
  signup_url: string;
  tracking_id_label_en: string;
  tracking_id_label_he: string;
  tracking_id_regex: string;
  onboarding_steps: { step: number; title_en: string; title_he: string; detail_en: string; detail_he: string }[];
  copy_snippets: Record<string, string>;
  is_active: boolean;
  sort_order: number;
}

export interface AffUserAccount {
  id: string;
  user_id: string;
  network_slug: string;
  tracking_id: string;
  coupon_code: string;
  is_verified: boolean;
  verified_at: string | null;
  qualifying_sales_count: number;
  account_opened_at: string;
  notes: string;
}

export interface AffLink {
  id: string;
  user_id: string;
  network_slug: string;
  folder_name: string;
  slug: string;
  product_title: string;
  product_summary: string;
  destination_url: string;
  image_url: string;
  price_display: string;
  saved_ad_copy: { facebook?: string; whatsapp?: string; tiktok?: string };
  health_status: "active" | "needs_update" | "out_of_stock";
  is_public_deal: boolean;
  boost_score: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface AffClick {
  id: string;
  link_id: string;
  owner_user_id: string;
  device_type: string;
  browser_name: string;
  country_code: string;
  referrer: string;
  clicked_at: string;
}

export interface AffPromptItem {
  id: string;
  category: string;
  tool_name: string;
  tool_url: string;
  title_en: string;
  title_he: string;
  prompt_template_en: string;
  prompt_template_he: string;
  output_type: string;
  is_pro_only: boolean;
  sort_order: number;
}
export interface AffKarmaEntry {
  id: string;
  user_id: string;
  action_type: string;
  credits_delta: number;
  description_en: string;
  description_he: string;
  created_at: string;
}

export function generateSmartSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  const rand = Math.random().toString(36).substring(2, 6);
  return `${base || "deal"}-${rand}`;
}

export function buildMultiChannelAdCopy(params: {
  title: string;
  price: string;
  benefit: string;
  smartUrl: string;
  isAmazon: boolean;
  isHe: boolean;
}): { facebook: string; whatsapp: string; tiktok: string } {
  const { title, price, benefit, smartUrl, isAmazon, isHe } = params;
  const disclosure = isAmazon
    ? isHe
      ? "\n\nגילוי נאות: כשותף אמזון אני מרוויח מרכישות מזכות ללא עלות נוספת עבורך."
      : "\n\nDisclosure: As an Amazon Associate I earn from qualifying purchases."
    : "";

  if (isHe) {
    return {
      facebook: `🔥 מציאת היום שנבדקה ואומתה: ${title}\n\n✅ למה כולם מזמינים את זה עכשיו:\n• ${benefit || "תמורה יוצאת דופן למחיר ואיכות בנייה גבוהה"}\n• ${price ? `מחיר מבצע עדכני: ${price}` : "זמין כעת במלאי עם משלוח מהיר"}\n• נבדק ואומת דרך ProofCraft Deals\n\n👇 לצפייה בפרטים המלאים ורכישה מאובטחת:\n${smartUrl}${disclosure}`,
      whatsapp: `⚡ *דיל מאומת:* ${title}${price ? ` (${price})` : ""}\n✨ ${benefit || "המלצה חמה עם דירוג גבוה"}\n🔗 לקישור הישיר: ${smartUrl}${isAmazon ? " (גילוי נאות: שותף אמזון)" : ""}`,
      tiktok: `[0-3 שניות - הוק ויזואלי]: תראו מה מצאתי ב-${price || "מחיר מטורף"} שחוסך זמן וכסף כל יום...\n[3-15 שניות - הדגמה]: ${title} — ${benefit || "פותר את הבעיה בשניות בלי להסתבך"}.\n[15-25 שניות - הוכחת ערך]: בדקתי עשרות אפשרויות וזו המנצחת ביחס עלות-תועלת.\n[25-30 שניות - הנעה לפעולה]: הקישור המאומת מחכה לכם בביו / בתגובה הראשונה! (${smartUrl})`,
    };
  }

  return {
    facebook: `🔥 Verified Deal Alert: ${title}\n\n✅ Why builders & smart shoppers love it:\n• ${benefit || "High-value performance and verified seller rating"}\n• ${price ? `Current Offer: ${price}` : "In stock now with fast shipping"}\n• Audited & verified via ProofCraft Deal Hub\n\n👇 Inspect full specs & claim deal here:\n${smartUrl}${disclosure}`,
    whatsapp: `⚡ *Verified Deal:* ${title}${price ? ` (${price})` : ""}\n✨ ${benefit || "Top-rated pick with verified value"}\n🔗 Direct link: ${smartUrl}${isAmazon ? " (As an Amazon Associate I earn from qualifying purchases)" : ""}`,
    tiktok: `[0-3s Visual Hook]: Stop overpaying—look at what I just found for ${price || "a fraction of the retail price"}...\n[3-15s Demo]: ${title} — ${benefit || "solves the daily bottleneck effortlessly"}.\n[15-25s Value Proof]: Tested against top alternatives and wins on build quality.\n[25-30s CTA]: Grab the verified link in bio / pinned comment! (${smartUrl})`,
  };
}

export async function fetchAffiliateHubState(userId: string | null) {
  const [netRes, promptRes] = await Promise.all([
    supabase.from("aff_networks").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
    supabase.from("aff_prompt_vault").select("*").order("sort_order", { ascending: true }),
  ]);

  if (!userId) {
    return {
      networks: (netRes.data || []) as AffNetwork[],
      prompts: (promptRes.data || []) as AffPromptItem[],
      accounts: [] as AffUserAccount[],
      links: [] as AffLink[],
      clicks: [] as AffClick[],
      karma: [] as AffKarmaEntry[],
      isAffiliatePro: false,
      boostCredits: 10,
      referralCode: "",
    };
  }

  const [accRes, linkRes, clickRes, karmaRes, profRes] = await Promise.all([
    supabase.from("aff_user_accounts").select("*").eq("user_id", userId),
    supabase.from("aff_links").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("aff_clicks").select("*").eq("owner_user_id", userId).order("clicked_at", { ascending: false }).limit(500),
    supabase.from("aff_karma_ledger").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(30),
    supabase.from("profiles").select("is_affiliate_pro, affiliate_boost_credits, affiliate_referral_code").eq("id", userId).single(),
  ]);

  return {
    networks: (netRes.data || []) as AffNetwork[],
    prompts: (promptRes.data || []) as AffPromptItem[],
    accounts: (accRes.data || []) as AffUserAccount[],
    links: (linkRes.data || []) as AffLink[],
    clicks: (clickRes.data || []) as AffClick[],
    karma: (karmaRes.data || []) as AffKarmaEntry[],
    isAffiliatePro: Boolean(profRes.data?.is_affiliate_pro),
    boostCredits: Number(profRes.data?.affiliate_boost_credits ?? 10),
    referralCode: String(profRes.data?.affiliate_referral_code || ""),
  };
}
