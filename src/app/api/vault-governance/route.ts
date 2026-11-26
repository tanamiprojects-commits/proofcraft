import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(url, key);
}

export async function GET() {
  try {
    const db = getAdminClient();
    const { data: g } = await db.from("site_settings").select("value").eq("key", "vault_governance").maybeSingle();
    const { data: t } = await db.from("site_settings").select("value").eq("key", "vault_reset_tickets").maybeSingle();
    return NextResponse.json({
      governance: g?.value || { enabled: true, notice: "", requireAdminForReset: false },
      tickets: Array.isArray(t?.value) ? t.value : []
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getAdminClient();
    const key = body.key === "vault_reset_tickets" ? "vault_reset_tickets" : "vault_governance";
    const { data: exists } = await db.from("site_settings").select("key").eq("key", key).maybeSingle();
    const res = exists
      ? await db.from("site_settings").update({ value: body.value, updated_at: new Date().toISOString() }).eq("key", key)
      : await db.from("site_settings").insert({ key, value: body.value, updated_at: new Date().toISOString() });
    if (res.error) return NextResponse.json({ error: res.error.message }, { status: 400 });
    return NextResponse.json({ ok: true, value: body.value });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
