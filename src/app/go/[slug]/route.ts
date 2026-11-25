import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const origin = req.nextUrl.origin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const db = createClient(supabaseUrl, supabaseKey);

  const { data: link } = await db
    .from("aff_links")
    .select("id, user_id, network_slug, slug, destination_url, health_status, click_count")
    .eq("slug", slug)
    .single();

  if (!link || !link.destination_url) {
    return NextResponse.redirect(`${origin}/affiliate`, 302);
  }

  // Detect device, browser, country & referrer at Edge
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const deviceType = /mobile|android|iphone|ipad/.test(ua) ? "mobile" : "desktop";
  const browserName = ua.includes("edg") ? "Edge" : ua.includes("chrome") ? "Chrome" : ua.includes("safari") ? "Safari" : ua.includes("firefox") ? "Firefox" : "Other";
  const countryCode = req.headers.get("x-vercel-ip-country") || "XX";
  const referrer = req.headers.get("referer") || "direct";

  // Log click telemetry & increment counter
  await Promise.all([
    db.from("aff_clicks").insert({
      link_id: link.id,
      owner_user_id: link.user_id,
      device_type: deviceType,
      browser_name: browserName,
      country_code: countryCode,
      referrer: referrer.slice(0, 240),
    }),
    db.from("aff_links").update({ click_count: (link.click_count || 0) + 1 }).eq("id", link.id),
  ]);

  // Compliance check: networks forbidding blind cloaked redirects (e.g. Amazon Associates) route to Visible Product Card
  const { data: net } = await db
    .from("aff_networks")
    .select("allow_direct_redirect")
    .eq("slug", link.network_slug)
    .single();

  if (net && net.allow_direct_redirect === false) {
    return NextResponse.redirect(`${origin}/affiliate/deal/${encodeURIComponent(link.slug)}`, 302);
  }

  // Validate safe HTTPS destination before 302 redirect
  try {
    const target = new URL(link.destination_url);
    if (target.protocol !== "https:" && target.protocol !== "http:") {
      return NextResponse.redirect(`${origin}/affiliate`, 302);
    }
    return NextResponse.redirect(target.toString(), 302);
  } catch {
    return NextResponse.redirect(`${origin}/affiliate`, 302);
  }
}
