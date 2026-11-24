import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

    if (!secret) {
      return NextResponse.json({ ok: false, mode: "waitlist_only", message: "Live payment webhook not activated yet." }, { status: 200 });
    }

    const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    if (!signature || hmac !== signature) {
      return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload?.meta?.event_name;
    const customData = payload?.meta?.custom_data || {};
    const userId = customData.user_id;
    const targetTier = Number(customData.target_tier || 2);
    const paidIls = Number(customData.paid_ils || 0);

    if (eventName === "order_created" && userId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      await adminClient.from("profiles").update({
        purchased_track_level: targetTier,
        total_paid_ils: paidIls,
      }).eq("id", userId);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
