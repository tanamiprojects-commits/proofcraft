import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "tanami.projects@gmail.com").toLowerCase();

function getServerClients(token: string) {
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const dbClient = SUPABASE_SERVICE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    : authClient;
  return { authClient, dbClient };
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return NextResponse.json({ error: "Missing authorization token." }, { status: 401 });
    }

    const { authClient, dbClient } = getServerClients(token);
    const { data: userRes, error: userErr } = await authClient.auth.getUser();
    const callerEmail = (userRes?.user?.email || "").toLowerCase();

    if (userErr || !callerEmail || callerEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const action = String(body?.action || "");
    const payload = body?.payload || {};
    const audit = async (title: string, target: string) => {
      await dbClient.from("admin_audit_logs").insert({ action_title: title, target_info: target });
    };
    switch (action) {
      case "toggle_verify_user": {
        const next = Boolean(payload.next);
        await dbClient.from("profiles").update({ admin_verified: next }).eq("id", payload.userId);
        await dbClient.from("feed_posts").update({ admin_verified: next }).eq("user_id", payload.userId);
        await audit(next ? "Verified Builder Credential" : "Revoked Builder Verification", String(payload.label || payload.userId));
        break;
      }
      case "update_track_level": {
        const lvl = Number(payload.level || 1);
        await dbClient.from("profiles").update({ purchased_track_level: lvl, current_track_level: lvl }).eq("id", payload.userId);
        await audit(`Updated Tier to Track ${lvl}`, String(payload.label || payload.userId));
        break;
      }
      case "grant_boost_credits": {
        const { data: pr } = await dbClient.from("profiles").select("affiliate_boost_credits").eq("id", payload.userId).single();
        const curr = Number(pr?.affiliate_boost_credits ?? 10);
        const delta = Number(payload.delta || 25);
        await dbClient.from("profiles").update({ affiliate_boost_credits: curr + delta }).eq("id", payload.userId);
        await dbClient.from("aff_karma_ledger").insert({ user_id: payload.userId, action_type: "admin_grant", credits_delta: delta, description_en: `Admin Boost Credit Award (+${delta})`, description_he: `מענק נקודות חשיפה מהאדמין (+${delta})` });
        await audit(`Granted +${delta} Boost Credits`, String(payload.userId));
        break;
      }
      case "warn_user": {
        await dbClient.from("profiles").update({ warning_message: String(payload.text || "") }).eq("id", payload.userId);
        await audit("Issued Official Policy Notice", `${payload.label}: ${payload.text}`);
        break;
      }
      case "ban_user": {
        await dbClient.from("profiles").update({ is_banned: true, ban_reason: String(payload.reason || "") }).eq("id", payload.userId);
        await audit("Suspended User Account", `${payload.label} (${payload.reason})`);
        break;
      }
      case "unban_user": {
        await dbClient.from("profiles").update({ is_banned: false, ban_reason: "" }).eq("id", payload.userId);
        await audit("Lifted User Suspension", String(payload.label || payload.userId));
        break;
      }
      case "approve_campaign": {
        if (payload.postId) await dbClient.from("feed_posts").update({ is_pinned: true, status: "approved", admin_verified: true }).eq("id", payload.postId);
        await dbClient.from("support_tickets").update({ admin_reply: "Commercial promotion campaign approved! Your project is now verified and pinned at the top of the Builder Proof Feed.", status: "resolved" }).eq("id", payload.ticketId);
        await audit("Approved & Pinned Commercial Campaign", `${payload.senderName} (${payload.postId || payload.ticketId})`);
        break;
      }
      case "reply_ticket": {
        await dbClient.from("support_tickets").update({ admin_reply: String(payload.reply || ""), status: "resolved" }).eq("id", payload.ticketId);
        await audit("Replied to Ticket", `${payload.senderName}: ${payload.reply}`);
        break;
      }
      case "toggle_pin_post": {
        const nextPin = Boolean(payload.nextPin);
        await dbClient.from("feed_posts").update({ is_pinned: nextPin, status: "approved" }).eq("id", payload.postId);
        await audit(nextPin ? "Pinned Feed Post" : "Unpinned Feed Post", String(payload.title || payload.postId));
        break;
      }
      case "delete_post": {
        await dbClient.from("feed_posts").delete().eq("id", payload.postId);
        await audit("Deleted Feed Post", String(payload.title || payload.postId));
        break;
      }
      case "save_track": {
        await dbClient.from("career_tracks").update({ name: String(payload.name || ""), subtitle: String(payload.subtitle || ""), price_ils: Number(payload.priceIls || 0) }).eq("level", Number(payload.level || 1));
        await audit(`Updated Track ${payload.level} Pricing`, `${payload.name} (₪${payload.priceIls})`);
        break;
      }
      case "save_broadcast": {
        await dbClient.from("site_settings").upsert({ key: "broadcast_banner", value: payload.broadcast, updated_at: new Date().toISOString() });
        await audit("Updated Live Broadcast Banner", payload.broadcast?.active ? String(payload.broadcast?.text || "") : "Disabled");
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown admin governance action." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server governance error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}